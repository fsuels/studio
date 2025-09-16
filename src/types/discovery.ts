// src/types/discovery.ts
// Type definitions for document discovery and search results

export interface DiscoveryResult {
  id: string;
  title: string;
  confidence: number;
  reason: 'keyword' | 'synonym' | 'semantic' | 'hybrid';
  description?: string;
  category?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export interface DiscoverySearchMetrics {
  firestoreReads: number;
  queryProcessingTime: number;
  lastQueryTimestamp: number;
  totalResults: number;
  filteredResults: number;
}

export interface DiscoverySearchTokens {
  originalTokens: string[];
  expandedTokens: string[];
  parsedQuery?: {
    positive: string[];
    negatives: string[];
    phrases: string[];
  };
}

export type DiscoverySearchReason = DiscoveryResult['reason'];

export interface DiscoverySearchConfig {
  maxResults: number;
  includeSemanticSearch: boolean;
  enableNegativeFiltering: boolean;
  enablePhraseMatching: boolean;
  confidenceThreshold: number;
}

export default DiscoveryResult;
