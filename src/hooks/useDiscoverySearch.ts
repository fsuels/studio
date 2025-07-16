// src/hooks/useDiscoverySearch.ts
// Lightweight query pre-processor for document discovery

import { useState, useCallback, useEffect } from 'react';
import { collection, query, where, getDocs, limit, type QuerySnapshot, type DocumentData } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { sanitize, tokenize, expand, recordMetric } from '../services/searchUtils';
import { RANK_WEIGHTS } from '../config/search';
import { vectorSearch, type VectorSearchResult } from '../services/vectorSearch';
import { parseQuery, matchesParsedQuery, type ParsedQuery } from '../utils/parseQuery';
import { useExperimentSync, preloadExperiments } from '../config/experiments';
import type { MarketplaceTemplate } from '../types/marketplace';
import type { DiscoveryResult } from '../types/discovery';

// Prometheus metrics for search monitoring
let promClient: any;
let searchLatencyHistogram: any;
let searchHitRateCounter: any;
let searchQueryCounter: any;
let searchResultsHistogram: any;

// Initialize Prometheus metrics if available
if (typeof window === 'undefined') {
  try {
    promClient = require('prom-client');
    
    searchLatencyHistogram = new promClient.Histogram({
      name: 'search_query_duration_seconds',
      help: 'Duration of search queries in seconds',
      labelNames: ['search_type', 'status'],
      buckets: [0.1, 0.25, 0.5, 1, 2.5, 5, 10]
    });
    
    searchHitRateCounter = new promClient.Counter({
      name: 'search_hit_rate_total',
      help: 'Total number of searches with hits vs no results',
      labelNames: ['has_results']
    });
    
    searchQueryCounter = new promClient.Counter({
      name: 'search_queries_total',
      help: 'Total number of search queries',
      labelNames: ['search_type', 'experiment_enabled']
    });
    
    searchResultsHistogram = new promClient.Histogram({
      name: 'search_results_count',
      help: 'Number of results returned per search',
      labelNames: ['search_type'],
      buckets: [0, 1, 5, 10, 20, 50, 100]
    });
  } catch (error) {
    // prom-client not available, metrics disabled
    console.debug('[Discovery Search] Prometheus metrics not available');
  }
}

// Simple ranking function for marketplace templates
function rankMarketplaceTemplates(templates: MarketplaceTemplate[], query: string): (MarketplaceTemplate & { score: number })[] {
  const queryTokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  
  return templates.map(template => {
    let score = 0;
    const keywords = template.keywords || [];
    const name = (template.name || '').toLowerCase();
    const description = (template.description || '').toLowerCase();
    
    // Score based on exact matches in keywords
    queryTokens.forEach(token => {
      if (keywords.some(k => k.toLowerCase().includes(token))) {
        score += 2;
      }
      if (name.includes(token)) {
        score += 3;
      }
      if (description.includes(token)) {
        score += 1;
      }
    });
    
    return { ...template, score };
  }).sort((a, b) => b.score - a.score);
}

interface SearchMetrics {
  firestoreReads: number;
  queryProcessingTime: number;
  lastQueryTimestamp: number;
}

interface SearchTokens {
  originalTokens: string[];
  expandedTokens: string[];
  parsedQuery?: ParsedQuery;
}

// DiscoveryResult interface now imported from types/discovery.ts
interface ExtendedDiscoveryResult extends DiscoveryResult {
  template?: MarketplaceTemplate;
}

interface UseDiscoverySearchReturn {
  tokens: SearchTokens;
  metrics: SearchMetrics;
  results: ExtendedDiscoveryResult[];
  loading: boolean;
  error: string | null;
  processQuery: (rawQuery: string) => SearchTokens;
  searchFirestore: (rawQuery: string) => Promise<void>;
  hybridSearch: (rawQuery: string, queryEmbedding?: Float32Array) => Promise<void>;
  resetMetrics: () => void;
}

/**
 * Custom hook for processing search queries with token expansion
 * Provides lightweight query pre-processing for document discovery
 */
export function useDiscoverySearch(): UseDiscoverySearchReturn {
  const [tokens, setTokens] = useState<SearchTokens>({
    originalTokens: [],
    expandedTokens: [],
  });
  
  const [metrics, setMetrics] = useState<SearchMetrics>({
    firestoreReads: 0,
    queryProcessingTime: 0,
    lastQueryTimestamp: 0,
  });

  const [results, setResults] = useState<ExtendedDiscoveryResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Process raw search query into tokens
   * @param rawQuery - Raw search input from user
   * @returns Processed tokens (original and expanded)
   */
  const processQuery = useCallback((rawQuery: string): SearchTokens => {
    const startTime = performance.now();
    
    // Step 1: Sanitize the raw query using shared utility
    const clean = sanitize(rawQuery);
    
    // Step 2: Parse query for negatives and phrases
    const parsedQuery = parseQuery(clean);
    
    // Step 3: Tokenize the clean query using shared utility
    const originalTokens = tokenize(clean);
    
    // Step 4: Expand tokens with synonyms using shared utility
    const expandedTokens = expand(originalTokens);
    
    const endTime = performance.now();
    const processingTime = endTime - startTime;
    
    // Record metrics using shared utility
    recordMetric('query_processing_duration_ms', processingTime);
    recordMetric('query_processing_operations_total', 1);
    
    const result: SearchTokens = {
      originalTokens,
      expandedTokens,
      parsedQuery,
    };
    
    // Update state
    setTokens(result);
    
    // Update metrics
    setMetrics(prev => ({
      ...prev,
      queryProcessingTime: processingTime,
      lastQueryTimestamp: Date.now(),
    }));
    
    // Log processing info for debugging
    console.log('[Discovery Search] Query processed:', {
      rawQuery,
      clean,
      parsedQuery,
      originalTokens,
      expandedTokens,
      processingTime: `${processingTime.toFixed(2)}ms`,
    });
    
    return result;
  }, []);

  /**
   * Search Firestore using array-contains-any with expanded tokens
   * @param rawQuery - Raw search input from user
   */
  const searchFirestore = useCallback(async (rawQuery: string): Promise<void> => {
    const startTime = Date.now();
    setLoading(true);
    setError(null);
    
    try {
      // Track query counter
      if (searchQueryCounter) {
        searchQueryCounter.inc({ search_type: 'keyword', experiment_enabled: 'false' });
      }
      
      // Process the query to get expanded tokens
      const { expandedTokens } = processQuery(rawQuery);
      
      // Limit to 10 tokens for array-contains-any (Firestore limit)
      const searchTokens = expandedTokens.slice(0, 10);
      
      if (searchTokens.length === 0) {
        setResults([]);
        setLoading(false);
        return;
      }
      
      // Query Firestore marketplace-templates collection
      const templatesRef = collection(db, 'marketplace-templates');
      const q = query(
        templatesRef,
        where('keywords', 'array-contains-any', searchTokens),
        limit(50) // Limit results to reasonable number
      );
      
      // Add timeout to prevent hanging on permission errors
      const queryPromise = getDocs(q);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Query timeout - likely permission issue')), 5000)
      );
      
      const querySnapshot: QuerySnapshot<DocumentData> = await Promise.race([queryPromise, timeoutPromise]);
      
      // Log Firestore reads for cost monitoring
      logFirestoreRead(querySnapshot.size);
      
      // Convert query snapshot to typed results
      const searchResults: MarketplaceTemplate[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as MarketplaceTemplate;
        searchResults.push({
          ...data,
          id: doc.id, // Ensure document ID is included
        });
      });
      
      // Rank the keyword results using simple ranking function
      const rankedResults = rankMarketplaceTemplates(searchResults, rawQuery);
      
      // Convert to ExtendedDiscoveryResult format
      const discoveryResults: ExtendedDiscoveryResult[] = rankedResults.map(result => ({
        id: result.id,
        title: result.name || 'Untitled Document',
        confidence: result.score,
        reason: 'keyword' as const,
        template: result,
      }));
      
      // Merge results into state
      setResults(discoveryResults);
      
      console.log('[Discovery Search] Firestore search completed:', {
        query: rawQuery,
        searchTokens,
        resultsCount: discoveryResults.length,
        firestoreReads: querySnapshot.size,
      });
      
      // Track metrics
      const duration = (Date.now() - startTime) / 1000;
      if (searchLatencyHistogram) {
        searchLatencyHistogram.observe({ search_type: 'keyword', status: 'success' }, duration);
      }
      if (searchHitRateCounter) {
        searchHitRateCounter.inc({ has_results: discoveryResults.length > 0 ? 'true' : 'false' });
      }
      if (searchResultsHistogram) {
        searchResultsHistogram.observe({ search_type: 'keyword' }, discoveryResults.length);
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.warn('[Discovery Search] Firestore search failed (this is expected if no data exists):', err);
      
      // Don't set error state for permission errors - this is expected
      if (!errorMessage.includes('permission') && !errorMessage.includes('insufficient')) {
        setError(errorMessage);
      }
      
      // Clear results on error
      setResults([]);
      
      // Track error metrics
      const duration = (Date.now() - startTime) / 1000;
      if (searchLatencyHistogram) {
        searchLatencyHistogram.observe({ search_type: 'keyword', status: 'error' }, duration);
      }
    } finally {
      setLoading(false);
    }
  }, [processQuery]);

  /**
   * Log Firestore read operations for cost monitoring
   * This would be called by the actual search implementation
   */
  const logFirestoreRead = useCallback((readCount: number = 1) => {
    setMetrics(prev => ({
      ...prev,
      firestoreReads: prev.firestoreReads + readCount,
    }));
    
    console.log('[Discovery Search] Firestore reads:', readCount);
  }, []);

  /**
   * Reset search metrics and results
   */
  const resetMetrics = useCallback(() => {
    setMetrics({
      firestoreReads: 0,
      queryProcessingTime: 0,
      lastQueryTimestamp: 0,
    });
    setResults([]);
    setError(null);
  }, []);

  // Expose logFirestoreRead for external use
  useEffect(() => {
    // Make logFirestoreRead available globally for search services
    (window as any).__logFirestoreRead = logFirestoreRead;
    
    return () => {
      delete (window as any).__logFirestoreRead;
    };
  }, [logFirestoreRead]);

  // Preload experiments on hook initialization
  useEffect(() => {
    preloadExperiments(['hybridSearch', 'semanticReranking', 'negativeFiltering']).catch(error => {
      console.warn('[Discovery Search] Failed to preload experiments:', error);
    });
  }, []);

  /**
   * Hybrid search combining keyword and vector search
   * @param rawQuery - Raw search input from user
   * @param queryEmbedding - Optional pre-computed query embedding
   */
  // Check experiment status outside of callback
  const isHybridEnabled = useExperimentSync('hybridSearch');

  const hybridSearch = useCallback(async (rawQuery: string, queryEmbedding?: Float32Array): Promise<void> => {
    const startTime = Date.now();
    setLoading(true);
    setError(null);
    
    try {
      // Track query counter
      if (searchQueryCounter) {
        searchQueryCounter.inc({ 
          search_type: 'hybrid', 
          experiment_enabled: isHybridEnabled ? 'true' : 'false' 
        });
      }
      
      console.log('[Discovery Search] Hybrid search experiment status:', {
        enabled: isHybridEnabled,
        query: rawQuery,
      });
      
      if (!isHybridEnabled) {
        // Fall back to keyword-only search
        await searchFirestore(rawQuery);
        return;
      }
      
      // Process the query to get expanded tokens
      const { expandedTokens } = processQuery(rawQuery);
      
      // Limit to 10 tokens for array-contains-any (Firestore limit)
      const searchTokens = expandedTokens.slice(0, 10);
      
      // Prepare promises for parallel execution
      const promises: Promise<any>[] = [];
      
      // 1. Keyword search promise
      let keywordSearchPromise: Promise<MarketplaceTemplate[]> = Promise.resolve([]);
      if (searchTokens.length > 0) {
        const templatesRef = collection(db, 'marketplace-templates');
        const q = query(
          templatesRef,
          where('keywords', 'array-contains-any', searchTokens),
          limit(50)
        );
        
        keywordSearchPromise = getDocs(q).then((querySnapshot) => {
          logFirestoreRead(querySnapshot.size);
          const keywordResults: MarketplaceTemplate[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data() as MarketplaceTemplate;
            keywordResults.push({
              ...data,
              id: doc.id,
            });
          });
          return keywordResults;
        });
      }
      promises.push(keywordSearchPromise);
      
      // 2. Vector search promise (if embedding provided)
      let vectorSearchPromise: Promise<VectorSearchResult[]> = Promise.resolve([]);
      if (queryEmbedding) {
        vectorSearchPromise = vectorSearch(queryEmbedding, 20); // Get top 20 semantic matches
      }
      promises.push(vectorSearchPromise);
      
      // Execute searches in parallel
      const [keywordResults, vectorResults] = await Promise.all(promises);
      
      // Rank keyword results
      const rankedKeywordResults = rankMarketplaceTemplates(keywordResults, rawQuery);
      
      // Create maps for deduplication and scoring
      const keywordMap = new Map<string, { template: MarketplaceTemplate; score: number }>();
      const vectorMap = new Map<string, { score: number }>();
      
      // Process keyword results with filtering
      const { parsedQuery } = tokens;
      
      rankedKeywordResults.forEach(result => {
        // Apply negative and phrase filtering if parsed query exists
        let shouldInclude = true;
        if (parsedQuery) {
          const keywords = result.keywords || [];
          shouldInclude = matchesParsedQuery(keywords, parsedQuery);
        }
        
        if (shouldInclude) {
          keywordMap.set(result.id, {
            template: result,
            score: result.score,
          });
        }
      });
      
      // Process vector results
      vectorResults.forEach((result: VectorSearchResult) => {
        vectorMap.set(result.id, {
          score: result.score,
        });
      });
      
      // Get all unique document IDs
      const allIds = new Set([...Array.from(keywordMap.keys()), ...Array.from(vectorMap.keys())]);
      
      // Compute hybrid results
      const hybridResults: ExtendedDiscoveryResult[] = [];
      
      for (const id of Array.from(allIds)) {
        const keywordData = keywordMap.get(id);
        const vectorData = vectorMap.get(id);
        
        const keywordScore = keywordData?.score || 0;
        const semanticScore = vectorData?.score || 0;
        
        // Calculate weighted score
        const weightedScore = 
          (semanticScore * RANK_WEIGHTS.semantic) + 
          (keywordScore * RANK_WEIGHTS.keyword);
        
        // Determine reason with synonym detection
        let reason: DiscoveryResult['reason'];
        if (keywordData && vectorData) {
          reason = 'hybrid';
        } else if (keywordData) {
          // Check if this was a synonym match vs direct keyword match
          const hasDirectMatch = tokens.originalTokens.some((token: string) => 
            keywordData.template.keywords?.some((keyword: string) => 
              keyword.toLowerCase().includes(token.toLowerCase())
            )
          );
          reason = hasDirectMatch ? 'keyword' : 'synonym';
        } else {
          reason = 'semantic';
        }
        
        // For semantic-only results, we need to fetch the template
        // In a real implementation, you'd have a template lookup service
        const template = keywordData?.template;
        if (!template && vectorData) {
          // Skip semantic-only results for now since we don't have template lookup
          continue;
        }
        
        if (template) {
          hybridResults.push({
            id,
            title: template.name || 'Untitled Document',
            confidence: weightedScore,
            reason,
            template,
          });
        }
      }
      
      // Sort by confidence score (descending)
      hybridResults.sort((a, b) => b.confidence - a.confidence);
      
      // Update state
      setResults(hybridResults);
      
      console.log('[Discovery Search] Hybrid search completed:', {
        query: rawQuery,
        parsedQuery: tokens.parsedQuery,
        keywordCount: keywordResults.length,
        vectorCount: vectorResults.length,
        hybridCount: hybridResults.length,
        filtered: {
          negatives: tokens.parsedQuery?.negatives || [],
          phrases: tokens.parsedQuery?.phrases || [],
        },
        topResults: hybridResults.slice(0, 5).map(r => ({ 
          id: r.id, 
          confidence: r.confidence, 
          reason: r.reason 
        })),
      });
      
      // Track metrics
      const duration = (Date.now() - startTime) / 1000;
      if (searchLatencyHistogram) {
        searchLatencyHistogram.observe({ search_type: 'hybrid', status: 'success' }, duration);
      }
      if (searchHitRateCounter) {
        searchHitRateCounter.inc({ has_results: hybridResults.length > 0 ? 'true' : 'false' });
      }
      if (searchResultsHistogram) {
        searchResultsHistogram.observe({ search_type: 'hybrid' }, hybridResults.length);
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.warn('[Discovery Search] Hybrid search failed (falling back to keyword-only):', err);
      
      // Don't set error state for permission errors - this is expected
      if (!errorMessage.includes('permission') && !errorMessage.includes('insufficient')) {
        setError(errorMessage);
      }
      
      // Clear results on error
      setResults([]);
      
      // Track error metrics
      const duration = (Date.now() - startTime) / 1000;
      if (searchLatencyHistogram) {
        searchLatencyHistogram.observe({ search_type: 'hybrid', status: 'error' }, duration);
      }
    } finally {
      setLoading(false);
    }
  }, [processQuery, searchFirestore, tokens, logFirestoreRead, isHybridEnabled]);

  return {
    tokens,
    metrics,
    results,
    loading,
    error,
    processQuery,
    searchFirestore,
    hybridSearch,
    resetMetrics,
  };
}

/**
 * Utility function to log Firestore reads from anywhere in the app
 * Used by search services to track database operations
 */
export function logFirestoreReads(count: number = 1): void {
  const logger = (window as any).__logFirestoreRead;
  if (typeof logger === 'function') {
    logger(count);
  } else {
    console.warn('[Discovery Search] Firestore read logger not available');
  }
}