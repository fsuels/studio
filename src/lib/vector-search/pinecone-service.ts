// src/lib/vector-search/pinecone-service.ts
import { Pinecone } from '@pinecone-database/pinecone';
import type {
  FetchResponse,
  QueryResponse,
  RecordMetadataValue,
} from '@pinecone-database/pinecone';
import embeddingService from './embedding-service';

interface PineconeMetadata extends Record<string, RecordMetadataValue> {
  docId: string;
  title: string;
  category: string;
  complexity: string;
  jurisdiction?: string;
  governingLaw?: string;
  createdAt: string;
  lastModified: string;
  tags: string[];
  parties?: string[];
  amounts?: string[];
  dates?: string[];
  content?: string;
}

interface VectorRecord {
  id: string;
  values: number[];
  metadata: PineconeMetadata;
}

export interface SearchFilters {
  category?: string[];
  complexity?: string[];
  jurisdiction?: string[];
  governingLaw?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  tags?: string[];
  parties?: string[];
}

export interface SearchResult {
  id: string;
  score: number;
  metadata: PineconeMetadata;
  explanation?: string;
}

interface SearchResponse {
  results: SearchResult[];
  totalResults: number;
  facets: {
    categories: { [key: string]: number };
    complexities: { [key: string]: number };
    jurisdictions: { [key: string]: number };
    governingLaws: { [key: string]: number };
    tags: { [key: string]: number };
  };
  suggestions?: string[];
}

export class PineconeService {
  private pinecone: Pinecone | null = null;
  private indexName: string;
  private namespace: string;
  private initialized = false;

  constructor() {
    this.indexName =
      process.env.PINECONE_INDEX_NAME || 'legal-docs-semantic-search';
    this.namespace = process.env.PINECONE_NAMESPACE || 'documents';
  }

  private async initialize() {
    if (this.initialized) return;

    const apiKey = process.env.PINECONE_API_KEY;
    if (!apiKey) {
      throw new Error('PINECONE_API_KEY environment variable is required');
    }

    this.pinecone = new Pinecone({
      apiKey,
    });
    this.initialized = true;
  }

  /**
   * Initialize Pinecone index if it doesn't exist
   */
  async initializeIndex(): Promise<void> {
    try {
      await this.initialize();
      if (!this.pinecone) {
        throw new Error('Pinecone client not initialized');
      }
      const indexList = await this.pinecone.listIndexes();
      const indexExists = indexList.indexes?.some(
        (index) => index.name === this.indexName,
      );

      if (!indexExists) {
        await this.pinecone.createIndex({
          name: this.indexName,
          dimension: 768, // Vertex AI text-embedding-gecko dimension
          metric: 'cosine',
          spec: {
            serverless: {
              cloud: 'aws',
              region: 'us-east-1',
            },
          },
        });

        console.log(`Created Pinecone index: ${this.indexName}`);

        // Wait for index to be ready
        await this.waitForIndexReady();
      }
    } catch (error) {
      console.error('Error initializing Pinecone index:', error);
      throw error;
    }
  }

  /**
   * Wait for index to be ready
   */
  private async waitForIndexReady(): Promise<void> {
    const maxAttempts = 30;
    let attempts = 0;

    while (attempts < maxAttempts) {
      try {
        const indexStats = await this.getIndex().describeIndexStats();
        if (indexStats.totalVectorCount !== undefined) {
          console.log('Pinecone index is ready');
          return;
        }
      } catch (_error) {
        // Index not ready yet
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
      attempts++;
    }

    throw new Error('Timeout waiting for Pinecone index to be ready');
  }

  /**
   * Get index instance
   */
  private getIndex() {
    if (!this.pinecone) {
      throw new Error('Pinecone client not initialized');
    }

    return this.pinecone.index(this.indexName);
  }

  /**
   * Index a single document
   */
  async indexDocument(
    docId: string,
    content: string,
    metadata: Omit<PineconeMetadata, 'docId' | 'content'>,
  ): Promise<void> {
    try {
      await this.initialize();

      const embedding = await embeddingService.generateEmbedding(content);

      const record: VectorRecord = {
        id: docId,
        values: embedding,
        metadata: {
          ...metadata,
          docId,
          content: content.slice(0, 1000), // Store truncated content for display
        },
      };

      const index = this.getIndex();
      await index.namespace(this.namespace).upsert([record]);

      console.log(`Indexed document: ${docId}`);
    } catch (error) {
      console.error(`Error indexing document ${docId}:`, error);
      throw error;
    }
  }

  /**
   * Index multiple documents in batch
   */
  async indexDocuments(
    documents: Array<{
      docId: string;
      content: string;
      metadata: Omit<PineconeMetadata, 'docId' | 'content'>;
    }>,
  ): Promise<void> {
    try {
      await this.initialize();

      const batchSize = 100; // Pinecone's batch limit
      const batches: typeof documents[] = [];

      for (let i = 0; i < documents.length; i += batchSize) {
        batches.push(documents.slice(i, i + batchSize));
      }

      for (const batch of batches) {
        const contents = batch.map((doc) => doc.content);
        const embeddingResponse =
          await embeddingService.generateBatchEmbeddings(contents);

        const records: VectorRecord[] = batch.map((doc, index) => ({
          id: doc.docId,
          values: embeddingResponse.embeddings[index],
          metadata: {
            ...doc.metadata,
            docId: doc.docId,
            content: doc.content.slice(0, 1000),
          },
        }));

        const index = this.getIndex();
        await index.namespace(this.namespace).upsert(records);

        console.log(`Indexed batch of ${records.length} documents`);

        // Rate limiting
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      console.log(`Successfully indexed ${documents.length} documents`);
    } catch (error) {
      console.error('Error indexing documents batch:', error);
      throw error;
    }
  }

  /**
   * Semantic search with advanced filtering and faceting
   */
  async semanticSearch(
    query: string,
    filters?: SearchFilters,
    options?: {
      topK?: number;
      minScore?: number;
      includeMetadata?: boolean;
      includeFacets?: boolean;
    },
  ): Promise<SearchResponse> {
    try {
      const {
        topK = 20,
        minScore = 0.7,
        includeMetadata = true,
        includeFacets = true,
      } = options || {};

      await this.initialize();

      // Generate query embedding
      const queryEmbedding = await embeddingService.generateEmbedding(query);

      // Build Pinecone filter
      const pineconeFilter = this.buildPineconeFilter(filters);

      // Perform vector search
      const index = this.getIndex();
      const namespace = index.namespace(this.namespace);
      const searchResponse = (await namespace.query({
        vector: queryEmbedding,
        topK: Math.min(topK * 2, 100), // Fetch more for better faceting
        filter: pineconeFilter,
        includeMetadata,
      })) as QueryResponse<PineconeMetadata>;

      const matches = searchResponse.matches ?? [];
      const filteredResults: SearchResult[] = matches
        .filter((match) => match.score !== undefined && match.score >= minScore)
        .map((match) => ({
          id: match.id,
          score: match.score ?? 0,
          metadata: match.metadata,
          explanation: this.generateExplanation(query, match.metadata, match.score ?? 0),
        }));

      // Limit to requested topK
      const results = filteredResults.slice(0, topK);

      // Generate facets
      const facets = includeFacets
        ? this.generateFacets(filteredResults)
        : {
            categories: {},
            complexities: {},
            jurisdictions: {},
            governingLaws: {},
            tags: {},
          };

      // Generate search suggestions
      const suggestions = await this.generateSearchSuggestions(query, results);

      return {
        results,
        totalResults: filteredResults.length,
        facets,
        suggestions,
      };
    } catch (error) {
      console.error('Error performing semantic search:', error);
      throw error;
    }
  }

  /**
   * Build Pinecone filter from search filters
   */
  private buildPineconeFilter(
    filters?: SearchFilters,
  ): Record<string, unknown> | undefined {
    if (!filters) return undefined;

    const pineconeFilter: Record<string, unknown> = {};

    if (filters.category && filters.category.length > 0) {
      pineconeFilter.category = { $in: filters.category };
    }

    if (filters.complexity && filters.complexity.length > 0) {
      pineconeFilter.complexity = { $in: filters.complexity };
    }

    if (filters.jurisdiction && filters.jurisdiction.length > 0) {
      pineconeFilter.jurisdiction = { $in: filters.jurisdiction };
    }

    if (filters.governingLaw && filters.governingLaw.length > 0) {
      pineconeFilter.governingLaw = { $in: filters.governingLaw };
    }

    if (filters.dateRange) {
      pineconeFilter.createdAt = {
        $gte: filters.dateRange.start,
        $lte: filters.dateRange.end,
      };
    }

    if (filters.tags && filters.tags.length > 0) {
      pineconeFilter.tags = { $in: filters.tags };
    }

    return Object.keys(pineconeFilter).length > 0 ? pineconeFilter : undefined;
  }

  /**
   * Generate facets from search results
   */
  private generateFacets(results: SearchResult[]): SearchResponse['facets'] {
    const facets = {
      categories: {} as { [key: string]: number },
      complexities: {} as { [key: string]: number },
      jurisdictions: {} as { [key: string]: number },
      governingLaws: {} as { [key: string]: number },
      tags: {} as { [key: string]: number },
    };

    results.forEach((result) => {
      const { metadata } = result;

      // Count categories
      if (metadata.category) {
        facets.categories[metadata.category] =
          (facets.categories[metadata.category] || 0) + 1;
      }

      // Count complexities
      if (metadata.complexity) {
        facets.complexities[metadata.complexity] =
          (facets.complexities[metadata.complexity] || 0) + 1;
      }

      // Count jurisdictions
      if (metadata.jurisdiction) {
        facets.jurisdictions[metadata.jurisdiction] =
          (facets.jurisdictions[metadata.jurisdiction] || 0) + 1;
      }

      // Count governing laws
      if (metadata.governingLaw) {
        facets.governingLaws[metadata.governingLaw] =
          (facets.governingLaws[metadata.governingLaw] || 0) + 1;
      }

      // Count tags
      if (metadata.tags) {
        metadata.tags.forEach((tag) => {
          facets.tags[tag] = (facets.tags[tag] || 0) + 1;
        });
      }
    });

    return facets;
  }

  /**
   * Generate explanation for why a result was returned
   */
  private generateExplanation(
    query: string,
    metadata: PineconeMetadata,
    score: number,
  ): string {
    const reasons = [];

    if (score > 0.9) {
      reasons.push('Highly relevant semantic match');
    } else if (score > 0.8) {
      reasons.push('Strong semantic similarity');
    } else {
      reasons.push('Semantic relevance detected');
    }

    // Check for keyword matches
    const queryLower = query.toLowerCase();
    const titleLower = metadata.title.toLowerCase();
    const contentLower = metadata.content?.toLowerCase() || '';

    if (titleLower.includes(queryLower)) {
      reasons.push('title contains query terms');
    }

    if (metadata.tags?.some((tag) => tag.toLowerCase().includes(queryLower))) {
      reasons.push('relevant tags found');
    }

    if (
      metadata.parties?.some((party) =>
        party.toLowerCase().includes(queryLower),
      )
    ) {
      reasons.push('party name match');
    }

    if (contentLower.includes(queryLower)) {
      reasons.push('content relevance');
    }

    return reasons.join(', ');
  }

  /**
   * Generate search suggestions based on query and results
   */
  private async generateSearchSuggestions(
    query: string,
    results: SearchResult[],
  ): Promise<string[]> {
    const suggestions: Set<string> = new Set();

    // Add category-based suggestions
    const topCategories = Object.entries(
      results.reduce(
        (acc, result) => {
          const category = result.metadata.category;
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        },
        {} as { [key: string]: number },
      ),
    )
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category);

    topCategories.forEach((category) => {
      suggestions.add(`${query} ${category}`);
    });

    // Add jurisdiction-based suggestions
    const jurisdictions = [
      ...new Set(results.map((r) => r.metadata.jurisdiction).filter(Boolean)),
    ];
    jurisdictions.slice(0, 2).forEach((jurisdiction) => {
      suggestions.add(`${query} in ${jurisdiction}`);
    });

    // Add complexity-based suggestions
    if (results.some((r) => r.metadata.complexity === 'easy')) {
      suggestions.add(`simple ${query}`);
    }
    if (results.some((r) => r.metadata.complexity === 'advanced')) {
      suggestions.add(`advanced ${query}`);
    }

    return Array.from(suggestions).slice(0, 5);
  }

  /**
   * Delete document from index
   */
  async deleteDocument(docId: string): Promise<void> {
    try {
      await this.initialize();

      const index = this.getIndex();
      await index.namespace(this.namespace).deleteOne(docId);
      console.log(`Deleted document: ${docId}`);
    } catch (error) {
      console.error(`Error deleting document ${docId}:`, error);
      throw error;
    }
  }

  /**
   * Get index statistics
   */
  async getIndexStats(): Promise<unknown> {
    try {
      await this.initialize();

      const index = this.getIndex();
      return await index.describeIndexStats();
    } catch (error) {
      console.error('Error getting index stats:', error);
      throw error;
    }
  }

  /**
   * Find similar documents
   */
  async findSimilarDocuments(
    docId: string,
    topK: number = 10,
    minScore: number = 0.8,
  ): Promise<SearchResult[]> {
    try {
      // First, fetch the document to get its embedding
      await this.initialize();

      const index = this.getIndex();
      const namespace = index.namespace(this.namespace);
      const fetchResponse = (await namespace.fetch([docId])) as FetchResponse<PineconeMetadata>;

      const docRecord = fetchResponse.records[docId];
      if (!docRecord?.values) {
        throw new Error(`Document ${docId} not found in index`);
      }

      // Search for similar documents
      const searchResponse = (await namespace.query({
        vector: docRecord.values,
        topK: topK + 1, // +1 to exclude the source document
        includeMetadata: true,
      })) as QueryResponse<PineconeMetadata>;

      const matches = searchResponse.matches ?? [];
      const results = matches
        .filter((match) => match.id !== docId && match.score !== undefined && match.score >= minScore)
        .map((match) => ({
          id: match.id,
          score: match.score ?? 0,
          metadata: match.metadata,
        }));

      return results.slice(0, topK);
    } catch (error) {
      console.error(`Error finding similar documents for ${docId}:`, error);
      throw error;
    }
  }
}

export const pineconeService = new PineconeService();

export default pineconeService;
