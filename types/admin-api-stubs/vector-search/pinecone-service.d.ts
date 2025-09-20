export interface PineconeStats {
  totalVectors: number;
  dimension: number;
  namespaces?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface PineconeService {
  initializeIndex(): Promise<void>;
  getIndexStats(): Promise<PineconeStats>;
}

export const pineconeService: PineconeService;
