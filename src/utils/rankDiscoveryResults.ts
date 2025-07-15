// src/utils/rankDiscoveryResults.ts
// Client-side ranking utility for search discovery results

import { RANK_WEIGHTS } from '../config/search';

/**
 * Raw hit data from Firestore search with keyword matches
 */
export interface RawHit {
  id: string;
  keywordsHit: Set<string>;
}

/**
 * Ranked discovery result with score and reasoning
 */
export interface DiscoveryResult {
  id: string;
  score: number;
  reason: 'keyword' | 'synonym' | 'hybrid';
  originalHits: Set<string>;
  synonymHits: Set<string>;
  totalHits: number;
}

/**
 * Ranking statistics for analysis
 */
export interface RankingStats {
  totalResults: number;
  keywordOnlyResults: number;
  synonymOnlyResults: number;
  hybridResults: number;
  averageScore: number;
  maxScore: number;
  minScore: number;
}

/**
 * Rank discovery results based on keyword match quality
 * 
 * @param rawHits - Array of raw hits with keyword matches
 * @param originalTokens - Original search tokens (not expanded)
 * @returns Sorted array of discovery results (highest score first)
 */
export function rank(rawHits: RawHit[], originalTokens: string[]): DiscoveryResult[] {
  if (!rawHits.length || !originalTokens.length) {
    return [];
  }

  // Convert original tokens to Set for faster lookup
  const originalTokensSet = new Set(originalTokens);
  
  // Calculate scores for each hit
  const scoredResults: DiscoveryResult[] = rawHits.map(hit => {
    // Separate original and synonym hits
    const originalHits = new Set(
      Array.from(hit.keywordsHit).filter(keyword => originalTokensSet.has(keyword))
    );
    
    const synonymHits = new Set(
      Array.from(hit.keywordsHit).filter(keyword => !originalTokensSet.has(keyword))
    );
    
    // Calculate score using weighted approach
    const score = 
      originalHits.size * RANK_WEIGHTS.original + 
      synonymHits.size * RANK_WEIGHTS.synonym;
    
    // Determine reason based on hit types
    let reason: 'keyword' | 'synonym' | 'hybrid';
    if (originalHits.size > 0 && synonymHits.size > 0) {
      reason = 'hybrid';
    } else if (originalHits.size > 0) {
      reason = 'keyword';
    } else {
      reason = 'synonym';
    }
    
    return {
      id: hit.id,
      score,
      reason,
      originalHits,
      synonymHits,
      totalHits: hit.keywordsHit.size,
    };
  });
  
  // Sort by score (descending), then by total hits (descending), then by ID (ascending) for tie-breaking
  return scoredResults.sort((a, b) => {
    // Primary sort: score (higher is better)
    if (a.score !== b.score) {
      return b.score - a.score;
    }
    
    // Secondary sort: total hits (more is better)
    if (a.totalHits !== b.totalHits) {
      return b.totalHits - a.totalHits;
    }
    
    // Tertiary sort: ID (alphabetical for consistency)
    return a.id.localeCompare(b.id);
  });
}

/**
 * Calculate ranking statistics for analysis
 * 
 * @param results - Ranked discovery results
 * @returns Statistics object
 */
export function calculateRankingStats(results: DiscoveryResult[]): RankingStats {
  if (!results.length) {
    return {
      totalResults: 0,
      keywordOnlyResults: 0,
      synonymOnlyResults: 0,
      hybridResults: 0,
      averageScore: 0,
      maxScore: 0,
      minScore: 0,
    };
  }
  
  const scores = results.map(r => r.score);
  const totalScore = scores.reduce((sum, score) => sum + score, 0);
  
  return {
    totalResults: results.length,
    keywordOnlyResults: results.filter(r => r.reason === 'keyword').length,
    synonymOnlyResults: results.filter(r => r.reason === 'synonym').length,
    hybridResults: results.filter(r => r.reason === 'hybrid').length,
    averageScore: totalScore / results.length,
    maxScore: Math.max(...scores),
    minScore: Math.min(...scores),
  };
}

/**
 * Filter results by minimum score threshold
 * 
 * @param results - Ranked discovery results
 * @param minScore - Minimum score threshold
 * @returns Filtered results
 */
export function filterByMinScore(results: DiscoveryResult[], minScore: number): DiscoveryResult[] {
  return results.filter(result => result.score >= minScore);
}

/**
 * Filter results by reason type
 * 
 * @param results - Ranked discovery results
 * @param reasons - Array of reason types to include
 * @returns Filtered results
 */
export function filterByReason(
  results: DiscoveryResult[], 
  reasons: Array<'keyword' | 'synonym' | 'hybrid'>
): DiscoveryResult[] {
  const reasonSet = new Set(reasons);
  return results.filter(result => reasonSet.has(result.reason));
}

/**
 * Get top N results
 * 
 * @param results - Ranked discovery results
 * @param limit - Maximum number of results to return
 * @returns Top N results
 */
export function getTopResults(results: DiscoveryResult[], limit: number): DiscoveryResult[] {
  return results.slice(0, limit);
}
