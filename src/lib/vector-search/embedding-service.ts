// src/lib/vector-search/embedding-service.ts
import { VertexAI } from '@google-cloud/aiplatform';

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
  private vertexAI: VertexAI;
  private project: string;
  private location: string;

  constructor() {
    this.project = process.env.GOOGLE_CLOUD_PROJECT || '';
    this.location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';
    
    if (!this.project) {
      throw new Error('GOOGLE_CLOUD_PROJECT environment variable is required');
    }

    this.vertexAI = new VertexAI({
      project: this.project,
      location: this.location,
    });
  }

  /**
   * Generate embeddings for text content using Vertex AI
   */
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const request = {
        instances: [
          {
            content: text.slice(0, 8000), // Limit to prevent token overflow
          },
        ],
      };

      const [response] = await this.vertexAI.prediction.predict({
        endpoint: `projects/${this.project}/locations/${this.location}/publishers/google/models/textembedding-gecko@003`,
        instances: [request],
      });

      if (response.predictions && response.predictions.length > 0) {
        const prediction = response.predictions[0] as any;
        return prediction.embeddings?.values || [];
      }

      throw new Error('No embeddings returned from Vertex AI');
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw new Error(`Failed to generate embedding: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate embeddings for multiple texts in batch
   */
  async generateBatchEmbeddings(texts: string[]): Promise<EmbeddingResponse> {
    try {
      const instances = texts.map(text => ({
        content: text.slice(0, 8000),
      }));

      const request = {
        instances,
      };

      const [response] = await this.vertexAI.prediction.predict({
        endpoint: `projects/${this.project}/locations/${this.location}/publishers/google/models/textembedding-gecko@003`,
        instances: request.instances,
      });

      if (response.predictions && response.predictions.length > 0) {
        const embeddings = response.predictions.map((pred: any) => 
          pred.embeddings?.values || []
        );
        
        return {
          embeddings,
          tokens: texts.reduce((sum, text) => sum + this.estimateTokens(text), 0),
        };
      }

      throw new Error('No embeddings returned from Vertex AI');
    } catch (error) {
      console.error('Error generating batch embeddings:', error);
      throw new Error(`Failed to generate batch embeddings: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Process document content and generate embeddings with metadata
   */
  async processDocument(
    docId: string,
    content: string,
    metadata: Omit<DocumentEmbedding['metadata'], 'docId'>
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
    let processed = content.replace(/\s+/g, ' ').trim();
    
    // Extract key sections (title, definitions, main clauses)
    const sections = [];
    
    // Extract title/header
    const titleMatch = content.match(/^#\s*(.*?)$/m);
    if (titleMatch) {
      sections.push(`Title: ${titleMatch[1]}`);
    }
    
    // Extract definitions section
    const definitionsMatch = content.match(/(?:definitions?|defined terms?)[:\s]*(.*?)(?=\n\n|\n#|$)/si);
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
    const amountRegex = /\$[\d,]+(?:\.\d{2})?|\d+(?:,\d{3})*(?:\.\d{2})?\s*dollars?/gi;
    const amounts = content.match(amountRegex);
    if (amounts && amounts.length > 0) {
      entities.amounts = [...new Set(amounts.slice(0, 10))];
    }

    // Extract dates
    const dateRegex = /\b(?:\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2}|(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4})\b/gi;
    const dates = content.match(dateRegex);
    if (dates && dates.length > 0) {
      entities.dates = [...new Set(dates.slice(0, 10))];
    }

    // Extract potential party names (capitalized words/phrases)
    const partyRegex = /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+(?:LLC|Inc|Corp|Corporation|Company|Co\.|Ltd|Limited)\b/g;
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

export const embeddingService = new EmbeddingService();