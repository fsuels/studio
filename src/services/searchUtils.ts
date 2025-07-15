// src/services/searchUtils.ts
// Search utilities for query processing and expansion

import { SYN_MAP, STOP_WORDS } from '../config/search';

/**
 * Sanitize raw search query
 * - Normalize Unicode characters
 * - Remove diacritical marks
 * - Convert to lowercase
 * - Remove special characters except spaces and hyphens
 */
export function sanitize(rawQuery: string): string {
  return rawQuery
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks (compatible with ES5+)
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ') // Keep only word characters, spaces, and hyphens
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

/**
 * Tokenize sanitized query into individual terms
 * - Split on whitespace
 * - Filter out empty strings
 * - Remove stop words
 * - Filter out single characters
 */
export function tokenize(cleanQuery: string): string[] {
  return cleanQuery
    .split(/\s+/)
    .filter(token => token.length > 1) // Remove single characters
    .filter(token => !STOP_WORDS.has(token)); // Remove stop words
}

/**
 * Expand tokens using synonym mapping
 * - Add original tokens
 * - Add synonyms from SYN_MAP
 * - Add simple stems (remove common suffixes)
 * - Deduplicate results
 */
export function expand(tokens: string[]): string[] {
  const expandedSet = new Set<string>();
  
  // Add original tokens
  tokens.forEach(token => expandedSet.add(token));
  
  // Add synonyms from SYN_MAP
  tokens.forEach(token => {
    const synonyms = SYN_MAP[token] || [];
    synonyms.forEach(synonym => expandedSet.add(synonym.toLowerCase()));
  });
  
  // Add simple stems
  tokens.forEach(token => {
    const stem = simpleStem(token);
    if (stem !== token && stem.length > 1) {
      expandedSet.add(stem);
      
      // Also add synonyms for stems
      const stemSynonyms = SYN_MAP[stem] || [];
      stemSynonyms.forEach(synonym => expandedSet.add(synonym.toLowerCase()));
    }
  });
  
  // Convert Set to Array and filter out empty strings
  return Array.from(expandedSet)
    .filter(token => token.length > 0)
    .sort(); // Sort for consistent output
}

/**
 * Simple stemmer for common English suffixes
 * Used internally by expand function
 */
function simpleStem(word: string): string {
  const lowered = word.toLowerCase();
  
  // Remove common suffixes
  if (lowered.endsWith('ing') && lowered.length > 4) {
    return lowered.slice(0, -3);
  }
  if (lowered.endsWith('ed') && lowered.length > 3) {
    return lowered.slice(0, -2);
  }
  if (lowered.endsWith('er') && lowered.length > 3) {
    return lowered.slice(0, -2);
  }
  if (lowered.endsWith('ly') && lowered.length > 3) {
    return lowered.slice(0, -2);
  }
  if (lowered.endsWith('s') && lowered.length > 2 && !lowered.endsWith('ss')) {
    return lowered.slice(0, -1);
  }
  
  return lowered;
}

/**
 * Utility function to get search metrics
 * Returns information about query processing
 */
export function getSearchMetrics(originalTokens: string[], expandedTokens: string[]) {
  return {
    originalTokenCount: originalTokens.length,
    expandedTokenCount: expandedTokens.length,
    expansionRatio: expandedTokens.length / Math.max(originalTokens.length, 1),
    uniqueExpansions: expandedTokens.filter(token => !originalTokens.includes(token)),
  };
}