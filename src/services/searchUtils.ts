// src/services/searchUtils.ts
// Shared search utilities for text processing and normalization

import { SYN_MAP, STOP_WORDS } from '../config/search';

// Prometheus metrics for search monitoring
let promClient: any;
const searchMetricsRegistry: Map<string, any> = new Map();

// Initialize Prometheus metrics if available (server-side only)
if (typeof window === 'undefined') {
  try {
    promClient = require('prom-client');
    
    // Initialize common search metrics
    const searchLatencyHistogram = new promClient.Histogram({
      name: 'search_operation_duration_seconds',
      help: 'Duration of search operations in seconds',
      labelNames: ['operation', 'status'],
      buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5]
    });
    
    const searchOperationCounter = new promClient.Counter({
      name: 'search_operations_total',
      help: 'Total number of search operations',
      labelNames: ['operation', 'status']
    });
    
    const searchTokensHistogram = new promClient.Histogram({
      name: 'search_tokens_count',
      help: 'Number of tokens processed per operation',
      labelNames: ['operation'],
      buckets: [0, 1, 2, 5, 10, 20, 50, 100]
    });
    
    // Store metrics in registry
    searchMetricsRegistry.set('latency', searchLatencyHistogram);
    searchMetricsRegistry.set('counter', searchOperationCounter);
    searchMetricsRegistry.set('tokens', searchTokensHistogram);
    
  } catch (error) {
    // prom-client not available, metrics disabled
    console.debug('[Search Utils] Prometheus metrics not available');
  }
}

/**
 * Normalize and sanitize input text for search processing
 * - Converts to lowercase
 * - Normalizes Unicode characters (removes diacritics)
 * - Removes HTML tags and special characters
 * - Collapses whitespace
 * 
 * @param raw - Raw input string to sanitize
 * @returns Cleaned and normalized string
 */
export function sanitize(raw: string): string {
  if (!raw || typeof raw !== 'string') {
    recordMetric('sanitize_empty_input', 1);
    return '';
  }
  
  const startTime = performance.now();
  let clean = raw;
  
  // Convert to lowercase
  clean = clean.toLowerCase();
  
  // Normalize Unicode characters (remove diacritics)
  clean = clean.normalize('NFD');
  
  // Remove combining diacritical marks (accents, tildes, etc.)
  // Using ES5-compatible regex instead of \p{M}
  clean = clean.replace(/[\u0300-\u036f]/g, '');
  
  // Remove HTML tags
  clean = clean.replace(/<[^>]*>/g, ' ');
  
  // Remove special characters, keep only letters, numbers, spaces, and hyphens
  clean = clean.replace(/[^\w\s-]/g, ' ');
  
  // Collapse multiple whitespace into single spaces
  clean = clean.replace(/\s+/g, ' ');
  
  // Trim leading and trailing whitespace
  clean = clean.trim();
  
  const duration = performance.now() - startTime;
  
  // Record metrics
  recordMetric('sanitize_duration_ms', duration);
  recordMetric('sanitize_operations_total', 1);
  recordMetric('sanitize_input_length', raw.length);
  recordMetric('sanitize_output_length', clean.length);
  
  return clean;
}

/**
 * Tokenize cleaned text into search tokens
 * - Splits on whitespace
 * - Filters out empty strings
 * - Removes stop words
 * - Applies simple stemming
 * 
 * @param clean - Sanitized input string
 * @returns Array of search tokens
 */
export function tokenize(clean: string): string[] {
  if (!clean || typeof clean !== 'string') {
    recordMetric('tokenize_empty_input', 1);
    return [];
  }
  
  const startTime = performance.now();
  
  // Split on whitespace
  let tokens = clean.split(/\s+/).filter(Boolean);
  
  // Remove single characters
  tokens = tokens.filter(token => token.length > 1);
  
  // Remove stop words
  const beforeStopWords = tokens.length;
  tokens = tokens.filter(token => !STOP_WORDS.has(token));
  const stopWordsRemoved = beforeStopWords - tokens.length;
  
  // Apply simple stemming
  tokens = tokens.map(token => simpleStem(token));
  
  // Remove duplicates while preserving order
  const uniqueTokens = Array.from(new Set(tokens));
  
  const duration = performance.now() - startTime;
  
  // Record metrics
  recordMetric('tokenize_duration_ms', duration);
  recordMetric('tokenize_operations_total', 1);
  recordMetric('tokenize_input_tokens', beforeStopWords);
  recordMetric('tokenize_output_tokens', uniqueTokens.length);
  recordMetric('tokenize_stopwords_removed', stopWordsRemoved);
  
  return uniqueTokens;
}

/**
 * Expand tokens with synonyms from the synonym map
 * - Looks up each token in SYN_MAP
 * - Adds all synonyms to the result set
 * - Removes duplicates
 * 
 * @param tokens - Array of base tokens to expand
 * @returns Array of expanded tokens including synonyms
 */
export function expand(tokens: string[]): string[] {
  if (!tokens || !Array.isArray(tokens)) {
    recordMetric('expand_empty_input', 1);
    return [];
  }
  
  const startTime = performance.now();
  const expanded = new Set<string>();
  let synonymsAdded = 0;
  
  // Add original tokens
  tokens.forEach(token => expanded.add(token));
  
  // Add synonyms for each token
  tokens.forEach(token => {
    const synonyms = SYN_MAP[token];
    if (synonyms && Array.isArray(synonyms)) {
      synonyms.forEach(synonym => {
        const normalizedSynonym = synonym.toLowerCase();
        if (!expanded.has(normalizedSynonym)) {
          expanded.add(normalizedSynonym);
          synonymsAdded++;
        }
      });
    }
  });
  
  // Add simple stems and their synonyms
  tokens.forEach(token => {
    const stem = simpleStem(token);
    if (stem !== token && stem.length > 1 && !expanded.has(stem)) {
      expanded.add(stem);
      synonymsAdded++;
      
      // Also add synonyms for stems
      const stemSynonyms = SYN_MAP[stem];
      if (stemSynonyms && Array.isArray(stemSynonyms)) {
        stemSynonyms.forEach(synonym => {
          const normalizedSynonym = synonym.toLowerCase();
          if (!expanded.has(normalizedSynonym)) {
            expanded.add(normalizedSynonym);
            synonymsAdded++;
          }
        });
      }
    }
  });
  
  const result = Array.from(expanded).filter(token => token.length > 0);
  const duration = performance.now() - startTime;
  
  // Record metrics
  recordMetric('expand_duration_ms', duration);
  recordMetric('expand_operations_total', 1);
  recordMetric('expand_input_tokens', tokens.length);
  recordMetric('expand_output_tokens', result.length);
  recordMetric('expand_synonyms_added', synonymsAdded);
  
  return result;
}

/**
 * Record a metric value for monitoring and analytics
 * - Uses Prometheus metrics if available
 * - Falls back to console logging in development
 * 
 * @param name - Metric name
 * @param value - Metric value to record
 */
export function recordMetric(name: string, value: number): void {
  if (!name || typeof value !== 'number' || isNaN(value)) {
    return;
  }
  
  // Try to record to Prometheus if available
  if (promClient && searchMetricsRegistry.size > 0) {
    try {
      // Determine metric type based on name
      if (name.includes('_total') || name.includes('_operations_total')) {
        const counter = searchMetricsRegistry.get('counter');
        if (counter) {
          const operation = name.replace(/_total$|_operations_total$/, '');
          counter.inc({ operation, status: 'success' }, value);
        }
      } else if (name.includes('_duration')) {
        const histogram = searchMetricsRegistry.get('latency');
        if (histogram) {
          const operation = name.replace(/_duration_.*$/, '');
          // Convert milliseconds to seconds for Prometheus
          const valueInSeconds = name.includes('_ms') ? value / 1000 : value;
          histogram.observe({ operation, status: 'success' }, valueInSeconds);
        }
      } else if (name.includes('_tokens') || name.includes('_length') || name.includes('_added') || name.includes('_removed')) {
        const tokensHistogram = searchMetricsRegistry.get('tokens');
        if (tokensHistogram) {
          const operation = name.replace(/_(tokens|length|added|removed|input|output).*$/, '');
          tokensHistogram.observe({ operation }, value);
        }
      }
    } catch (error) {
      // Silently fail metric recording
      console.debug(`[Search Utils] Failed to record metric ${name}:`, error);
    }
  }
  
  // Debug logging in development
  if (process.env.NODE_ENV === 'development') {
    console.debug(`[Search Utils] Metric ${name}: ${value}`);
  }
}

/**
 * Simple stemming algorithm for basic word normalization
 * - Removes common suffixes
 * - Handles irregular plurals
 * 
 * @param word - Word to stem
 * @returns Stemmed word
 */
function simpleStem(word: string): string {
  if (!word || word.length < 3) {
    return word;
  }
  
  const lowered = word.toLowerCase();
  
  // Handle irregular plurals first
  const irregularPlurals: Record<string, string> = {
    'children': 'child',
    'people': 'person',
    'men': 'man',
    'women': 'woman',
    'feet': 'foot',
    'teeth': 'tooth',
    'mice': 'mouse',
    'geese': 'goose',
  };
  
  if (irregularPlurals[lowered]) {
    return irregularPlurals[lowered];
  }
  
  // Apply suffix removal rules
  if (lowered.endsWith('ies') && lowered.length > 4) {
    return lowered.slice(0, -3) + 'y';
  }
  
  if (lowered.endsWith('ed') && lowered.length > 3) {
    return lowered.slice(0, -2);
  }
  
  if (lowered.endsWith('ing') && lowered.length > 4) {
    return lowered.slice(0, -3);
  }
  
  if (lowered.endsWith('ly') && lowered.length > 3) {
    return lowered.slice(0, -2);
  }
  
  if (lowered.endsWith('er') && lowered.length > 3) {
    return lowered.slice(0, -2);
  }
  
  if (lowered.endsWith('s') && lowered.length > 2 && !lowered.endsWith('ss')) {
    return lowered.slice(0, -1);
  }
  
  return lowered;
}

/**
 * Utility function to process a complete search query
 * Combines sanitize, tokenize, and expand operations
 * 
 * @param query - Raw search query
 * @returns Processed query tokens
 */
export function processSearchQuery(query: string): {
  originalTokens: string[];
  expandedTokens: string[];
  clean: string;
} {
  const startTime = performance.now();
  
  const clean = sanitize(query);
  const originalTokens = tokenize(clean);
  const expandedTokens = expand(originalTokens);
  
  const duration = performance.now() - startTime;
  recordMetric('process_search_query_duration_ms', duration);
  
  return {
    originalTokens,
    expandedTokens,
    clean,
  };
}

/**
 * Get search metrics summary for debugging and monitoring
 * 
 * @returns Object with current metric values
 */
export function getSearchMetrics(): Record<string, any> {
  if (!promClient || !searchMetricsRegistry.size) {
    return { metricsAvailable: false };
  }
  
  try {
    return {
      metricsAvailable: true,
      registrySize: searchMetricsRegistry.size,
      metrics: Array.from(searchMetricsRegistry.keys()),
    };
  } catch (error) {
    return { metricsAvailable: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
