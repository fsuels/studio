// src/lib/vector-search/embedding-service.ts
import { v1 as aiplatform } from '@google-cloud/aiplatform';

interface EmbeddingResponse {
  embeddings: number[][];
  tokens: number;
}

interface DocumentEmbedding {
  id: string;
  content: string;
  metadata: {
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
  };
  embedding: number[];
}

export class EmbeddingService {
  private client: aiplatform.PredictionServiceClient | null = null;
  private project: string;
  private location: string;
  private initialized = false;

  constructor() {
    this.project = process.env.GOOGLE_CLOUD_PROJECT || '';
    this.location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';
  }

  private async initialize() {
    if (this.initialized) return;

    if (!this.project) {
      throw new Error('GOOGLE_CLOUD_PROJECT environment variable is required');
    }

    // Initialize Vertex AI Prediction client; set apiEndpoint for region
    this.client = new aiplatform.PredictionServiceClient({
      apiEndpoint: `${this.location}-aiplatform.googleapis.com`,
    });
    this.initialized = true;
  }

  /**
   * Generate embeddings for text content using Vertex AI
   */
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      await this.initialize();
      const request = {
        instances: [
          {
            content: text.slice(0, 8000), // Limit to prevent token overflow
          },
        ],
      };

      if (!this.client) {
        throw new Error('Embedding service client not initialized');
      }
      const [response] = await this.client.predict({
        endpoint: `projects/${this.project}/locations/${this.location}/publishers/google/models/textembedding-gecko@003`,
        instances: [{ content: text.slice(0, 8000) }],
      });

      if (response.predictions && response.predictions.length > 0) {
        const prediction = response.predictions[0] as { embeddings?: { values?: number[] } } | undefined;
        return prediction?.embeddings?.values ?? [];
      }

      throw new Error('No embeddings returned from Vertex AI');
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw new Error(
        `Failed to generate embedding: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Generate embeddings for multiple texts in batch
   */
  async generateBatchEmbeddings(texts: string[]): Promise<EmbeddingResponse> {
    try {
      await this.initialize();

      const instances = texts.map((text) => ({
        content: text.slice(0, 8000),
      }));

      const request = {
        instances,
      };

      if (!this.client) {
        throw new Error('Embedding service client not initialized');
      }
      const [response] = await this.client.predict({
        endpoint: `projects/${this.project}/locations/${this.location}/publishers/google/models/textembedding-gecko@003`,
        instances,
      });

      if (response.predictions && response.predictions.length > 0) {
        const embeddings = response.predictions.map((pred: unknown) => {
          const p = pred as { embeddings?: { values?: number[] } };
          return p.embeddings?.values ?? [];
        });

        return {
          embeddings,
          tokens: texts.reduce(
            (sum, text) => sum + this.estimateTokens(text),
            0,
          ),
        };
      }

      throw new Error('No embeddings returned from Vertex AI');
    } catch (error) {
      console.error('Error generating batch embeddings:', error);
      throw new Error(
        `Failed to generate batch embeddings: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Process document content and generate embeddings with metadata
   */
  async processDocument(
    docId: string,
    content: string,
    metadata: Omit<DocumentEmbedding['metadata'], 'docId'>,
  ): Promise<DocumentEmbedding> {
    try {
      // Extract key content for embedding
      const processedContent = this.preprocessContent(content);

      // Generate embedding
      const embedding = await this.generateEmbedding(processedContent);

      // Extract entities from content
      const extractedEntities = this.extractEntities(content);

      return {
        id: `${docId}_${Date.now()}`,
        content: processedContent,
        metadata: {
          ...metadata,
          docId,
          ...extractedEntities,
        },
        embedding,
      };
    } catch (error) {
      console.error(`Error processing document ${docId}:`, error);
      throw error;
    }
  }

  /**
   * Preprocess content for better embedding quality
   */
  private preprocessContent(content: string): string {
    // Remove excessive whitespace
    const processed = content.replace(/\s+/g, ' ').trim();

    // Extract key sections (title, definitions, main clauses)
    const sections = [];

    // Extract title/header
    const titleMatch = content.match(/^#\s*(.*?)$/m);
    if (titleMatch) {
      sections.push(`Title: ${titleMatch[1]}`);
    }

    // Extract definitions section
    const definitionsMatch = content.match(
      /(?:definitions?|defined terms?)[:\s]*(.*?)(?=\n\n|\n#|$)/is,
    );
    if (definitionsMatch) {
      sections.push(`Definitions: ${definitionsMatch[1].slice(0, 500)}`);
    }

    // Extract main content (first 2000 chars)
    const mainContent = processed.slice(0, 2000);
    sections.push(mainContent);

    return sections.join(' ');
  }

  /**
   * Extract entities from document content
   */
  private extractEntities(content: string): {
    parties?: string[];
    amounts?: string[];
    dates?: string[];
  } {
    const entities: {
      parties?: string[];
      amounts?: string[];
      dates?: string[];
    } = {};

    // Extract monetary amounts
    const amountRegex =
      /\$[\d,]+(?:\.\d{2})?|\d+(?:,\d{3})*(?:\.\d{2})?\s*dollars?/gi;
    const amounts = content.match(amountRegex);
    if (amounts && amounts.length > 0) {
      entities.amounts = [...new Set(amounts.slice(0, 10))];
    }

    // Extract dates
    const dateRegex =
      /\b(?:\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2}|(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4})\b/gi;
    const dates = content.match(dateRegex);
    if (dates && dates.length > 0) {
      entities.dates = [...new Set(dates.slice(0, 10))];
    }

    // Extract potential party names (capitalized words/phrases)
    const partyRegex =
      /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+(?:LLC|Inc|Corp|Corporation|Company|Co\.|Ltd|Limited)\b/g;
    const parties = content.match(partyRegex);
    if (parties && parties.length > 0) {
      entities.parties = [...new Set(parties.slice(0, 10))];
    }

    return entities;
  }

  /**
   * Estimate token count for pricing/rate limiting
   */
  private estimateTokens(text: string): number {
    // Rough estimation: ~4 characters per token
    return Math.ceil(text.length / 4);
  }

  /**
   * Calculate cosine similarity between two embeddings
   */
  static cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error('Embedding dimensions must match');
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);

    if (normA === 0 || normB === 0) {
      return 0;
    }

    return dotProduct / (normA * normB);
  }
}

let _embeddingService: EmbeddingService | null = null;

export function getEmbeddingService(): EmbeddingService {
  if (!_embeddingService) {
    _embeddingService = new EmbeddingService();
  }
  return _embeddingService;
}

// For backward compatibility
export const embeddingService = getEmbeddingService();
