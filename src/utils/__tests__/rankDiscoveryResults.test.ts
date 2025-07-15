// src/utils/__tests__/rankDiscoveryResults.test.ts
// Tests for rankDiscoveryResults utility

import {
  rank,
  calculateRankingStats,
  filterByMinScore,
  filterByReason,
  getTopResults,
  type RawHit,
  type DiscoveryResult,
} from '../rankDiscoveryResults';

// Mock the search config
jest.mock('../../config/search', () => ({
  RANK_WEIGHTS: {
    original: 2.0,
    synonym: 1.0,
  },
}));

describe('rankDiscoveryResults', () => {
  describe('rank function', () => {
    it('should return empty array for empty input', () => {
      expect(rank([], ['test'])).toEqual([]);
      expect(rank([{ id: 'test', keywordsHit: new Set(['test']) }], [])).toEqual([]);
    });

    it('should score keyword-only matches correctly', () => {
      const rawHits: RawHit[] = [
        {
          id: 'doc1',
          keywordsHit: new Set(['car', 'vehicle']),
        },
        {
          id: 'doc2',
          keywordsHit: new Set(['car']),
        },
      ];

      const originalTokens = ['car', 'vehicle'];
      const results = rank(rawHits, originalTokens);

      expect(results).toHaveLength(2);
      
      // doc1 should rank higher (2 original hits vs 1)
      expect(results[0].id).toBe('doc1');
      expect(results[0].score).toBe(4); // 2 original hits * 2.0 weight
      expect(results[0].reason).toBe('keyword');
      expect(results[0].originalHits).toEqual(new Set(['car', 'vehicle']));
      expect(results[0].synonymHits).toEqual(new Set());
      
      expect(results[1].id).toBe('doc2');
      expect(results[1].score).toBe(2); // 1 original hit * 2.0 weight
      expect(results[1].reason).toBe('keyword');
      expect(results[1].originalHits).toEqual(new Set(['car']));
      expect(results[1].synonymHits).toEqual(new Set());
    });

    it('should score synonym-only matches correctly', () => {
      const rawHits: RawHit[] = [
        {
          id: 'doc1',
          keywordsHit: new Set(['automobile', 'auto']),
        },
        {
          id: 'doc2',
          keywordsHit: new Set(['automobile']),
        },
      ];

      const originalTokens = ['car']; // None of the hits match original tokens
      const results = rank(rawHits, originalTokens);

      expect(results).toHaveLength(2);
      
      // doc1 should rank higher (2 synonym hits vs 1)
      expect(results[0].id).toBe('doc1');
      expect(results[0].score).toBe(2); // 2 synonym hits * 1.0 weight
      expect(results[0].reason).toBe('synonym');
      expect(results[0].originalHits).toEqual(new Set());
      expect(results[0].synonymHits).toEqual(new Set(['automobile', 'auto']));
      
      expect(results[1].id).toBe('doc2');
      expect(results[1].score).toBe(1); // 1 synonym hit * 1.0 weight
      expect(results[1].reason).toBe('synonym');
      expect(results[1].originalHits).toEqual(new Set());
      expect(results[1].synonymHits).toEqual(new Set(['automobile']));
    });

    it('should score hybrid matches correctly', () => {
      const rawHits: RawHit[] = [
        {
          id: 'doc1',
          keywordsHit: new Set(['car', 'automobile', 'auto']),
        },
        {
          id: 'doc2',
          keywordsHit: new Set(['car', 'vehicle']),
        },
      ];

      const originalTokens = ['car', 'vehicle'];
      const results = rank(rawHits, originalTokens);

      expect(results).toHaveLength(2);
      
      // doc1: 1 original (car) + 2 synonyms (automobile, auto) = 1*2 + 2*1 = 4
      // doc2: 2 originals (car, vehicle) + 0 synonyms = 2*2 + 0*1 = 4
      // They should tie on score, but doc2 has more total hits (2 vs 3), so doc1 wins
      expect(results[0].id).toBe('doc1');
      expect(results[0].score).toBe(4);
      expect(results[0].reason).toBe('hybrid');
      expect(results[0].originalHits).toEqual(new Set(['car']));
      expect(results[0].synonymHits).toEqual(new Set(['automobile', 'auto']));
      expect(results[0].totalHits).toBe(3);
      
      expect(results[1].id).toBe('doc2');
      expect(results[1].score).toBe(4);
      expect(results[1].reason).toBe('keyword');
      expect(results[1].originalHits).toEqual(new Set(['car', 'vehicle']));
      expect(results[1].synonymHits).toEqual(new Set());
      expect(results[1].totalHits).toBe(2);
    });

    it('should handle tie-breaking correctly', () => {
      const rawHits: RawHit[] = [
        {
          id: 'doc-z',
          keywordsHit: new Set(['car']),
        },
        {
          id: 'doc-a',
          keywordsHit: new Set(['car']),
        },
        {
          id: 'doc-m',
          keywordsHit: new Set(['car']),
        },
      ];

      const originalTokens = ['car'];
      const results = rank(rawHits, originalTokens);

      expect(results).toHaveLength(3);
      
      // All have same score and total hits, should be sorted alphabetically by ID
      expect(results[0].id).toBe('doc-a');
      expect(results[1].id).toBe('doc-m');
      expect(results[2].id).toBe('doc-z');
      
      results.forEach(result => {
        expect(result.score).toBe(2);
        expect(result.reason).toBe('keyword');
        expect(result.totalHits).toBe(1);
      });
    });

    it('should handle complex tie-breaking with different total hits', () => {
      const rawHits: RawHit[] = [
        {
          id: 'doc-z',
          keywordsHit: new Set(['automobile', 'auto']), // 2 synonyms = score 2, totalHits 2
        },
        {
          id: 'doc-a',
          keywordsHit: new Set(['automobile', 'auto', 'vehicle']), // 3 synonyms = score 3, totalHits 3
        },
        {
          id: 'doc-m',
          keywordsHit: new Set(['automobile', 'auto']), // 2 synonyms = score 2, totalHits 2
        },
      ];

      const originalTokens = ['car']; // No matches, all are synonyms
      const results = rank(rawHits, originalTokens);

      expect(results).toHaveLength(3);
      
      // doc-a should be first (highest score)
      expect(results[0].id).toBe('doc-a');
      expect(results[0].score).toBe(3);
      
      // doc-a and doc-z have same score (2), but different IDs, should be alphabetical
      expect(results[1].id).toBe('doc-m');
      expect(results[1].score).toBe(2);
      
      expect(results[2].id).toBe('doc-z');
      expect(results[2].score).toBe(2);
    });

    it('should correctly determine reason types', () => {
      const rawHits: RawHit[] = [
        {
          id: 'keyword-only',
          keywordsHit: new Set(['car', 'vehicle']),
        },
        {
          id: 'synonym-only',
          keywordsHit: new Set(['automobile', 'auto']),
        },
        {
          id: 'hybrid',
          keywordsHit: new Set(['car', 'automobile']),
        },
      ];

      const originalTokens = ['car', 'vehicle'];
      const results = rank(rawHits, originalTokens);

      expect(results).toHaveLength(3);
      
      const keywordOnly = results.find(r => r.id === 'keyword-only')!;
      expect(keywordOnly.reason).toBe('keyword');
      expect(keywordOnly.originalHits.size).toBe(2);
      expect(keywordOnly.synonymHits.size).toBe(0);
      
      const synonymOnly = results.find(r => r.id === 'synonym-only')!;
      expect(synonymOnly.reason).toBe('synonym');
      expect(synonymOnly.originalHits.size).toBe(0);
      expect(synonymOnly.synonymHits.size).toBe(2);
      
      const hybrid = results.find(r => r.id === 'hybrid')!;
      expect(hybrid.reason).toBe('hybrid');
      expect(hybrid.originalHits.size).toBe(1);
      expect(hybrid.synonymHits.size).toBe(1);
    });

    it('should handle edge cases', () => {
      // Empty keywords hit
      const rawHits: RawHit[] = [
        {
          id: 'empty',
          keywordsHit: new Set(),
        },
      ];

      const originalTokens = ['car'];
      const results = rank(rawHits, originalTokens);

      expect(results).toHaveLength(1);
      expect(results[0].score).toBe(0);
      expect(results[0].reason).toBe('synonym'); // Falls through to synonym case
      expect(results[0].totalHits).toBe(0);
    });
  });

  describe('calculateRankingStats', () => {
    it('should return zero stats for empty results', () => {
      const stats = calculateRankingStats([]);
      
      expect(stats).toEqual({
        totalResults: 0,
        keywordOnlyResults: 0,
        synonymOnlyResults: 0,
        hybridResults: 0,
        averageScore: 0,
        maxScore: 0,
        minScore: 0,
      });
    });

    it('should calculate stats correctly', () => {
      const results: DiscoveryResult[] = [
        {
          id: 'doc1',
          score: 4,
          reason: 'keyword',
          originalHits: new Set(['car']),
          synonymHits: new Set(),
          totalHits: 1,
        },
        {
          id: 'doc2',
          score: 3,
          reason: 'hybrid',
          originalHits: new Set(['car']),
          synonymHits: new Set(['auto']),
          totalHits: 2,
        },
        {
          id: 'doc3',
          score: 2,
          reason: 'synonym',
          originalHits: new Set(),
          synonymHits: new Set(['automobile', 'auto']),
          totalHits: 2,
        },
      ];

      const stats = calculateRankingStats(results);
      
      expect(stats.totalResults).toBe(3);
      expect(stats.keywordOnlyResults).toBe(1);
      expect(stats.synonymOnlyResults).toBe(1);
      expect(stats.hybridResults).toBe(1);
      expect(stats.averageScore).toBe(3); // (4+3+2)/3
      expect(stats.maxScore).toBe(4);
      expect(stats.minScore).toBe(2);
    });
  });

  describe('filterByMinScore', () => {
    const results: DiscoveryResult[] = [
      {
        id: 'doc1',
        score: 4,
        reason: 'keyword',
        originalHits: new Set(),
        synonymHits: new Set(),
        totalHits: 1,
      },
      {
        id: 'doc2',
        score: 2,
        reason: 'synonym',
        originalHits: new Set(),
        synonymHits: new Set(),
        totalHits: 1,
      },
      {
        id: 'doc3',
        score: 3,
        reason: 'hybrid',
        originalHits: new Set(),
        synonymHits: new Set(),
        totalHits: 1,
      },
    ];

    it('should filter by minimum score', () => {
      const filtered = filterByMinScore(results, 3);
      
      expect(filtered).toHaveLength(2);
      expect(filtered.map(r => r.id)).toEqual(['doc1', 'doc3']);
    });

    it('should return empty array when no results meet threshold', () => {
      const filtered = filterByMinScore(results, 10);
      
      expect(filtered).toHaveLength(0);
    });

    it('should return all results when threshold is 0', () => {
      const filtered = filterByMinScore(results, 0);
      
      expect(filtered).toHaveLength(3);
    });
  });

  describe('filterByReason', () => {
    const results: DiscoveryResult[] = [
      {
        id: 'doc1',
        score: 4,
        reason: 'keyword',
        originalHits: new Set(),
        synonymHits: new Set(),
        totalHits: 1,
      },
      {
        id: 'doc2',
        score: 2,
        reason: 'synonym',
        originalHits: new Set(),
        synonymHits: new Set(),
        totalHits: 1,
      },
      {
        id: 'doc3',
        score: 3,
        reason: 'hybrid',
        originalHits: new Set(),
        synonymHits: new Set(),
        totalHits: 1,
      },
    ];

    it('should filter by single reason', () => {
      const filtered = filterByReason(results, ['keyword']);
      
      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe('doc1');
    });

    it('should filter by multiple reasons', () => {
      const filtered = filterByReason(results, ['keyword', 'hybrid']);
      
      expect(filtered).toHaveLength(2);
      expect(filtered.map(r => r.id)).toEqual(['doc1', 'doc3']);
    });

    it('should return empty array when no reasons match', () => {
      const filtered = filterByReason(results, []);
      
      expect(filtered).toHaveLength(0);
    });
  });

  describe('getTopResults', () => {
    const results: DiscoveryResult[] = [
      {
        id: 'doc1',
        score: 4,
        reason: 'keyword',
        originalHits: new Set(),
        synonymHits: new Set(),
        totalHits: 1,
      },
      {
        id: 'doc2',
        score: 3,
        reason: 'hybrid',
        originalHits: new Set(),
        synonymHits: new Set(),
        totalHits: 1,
      },
      {
        id: 'doc3',
        score: 2,
        reason: 'synonym',
        originalHits: new Set(),
        synonymHits: new Set(),
        totalHits: 1,
      },
    ];

    it('should return top N results', () => {
      const top2 = getTopResults(results, 2);
      
      expect(top2).toHaveLength(2);
      expect(top2.map(r => r.id)).toEqual(['doc1', 'doc2']);
    });

    it('should return all results when limit exceeds length', () => {
      const top10 = getTopResults(results, 10);
      
      expect(top10).toHaveLength(3);
      expect(top10).toEqual(results);
    });

    it('should return empty array when limit is 0', () => {
      const top0 = getTopResults(results, 0);
      
      expect(top0).toHaveLength(0);
    });
  });

  describe('integration tests', () => {
    it('should rank realistic search results correctly', () => {
      const rawHits: RawHit[] = [
        {
          id: 'bill-of-sale-vehicle',
          keywordsHit: new Set(['car', 'vehicle', 'bill', 'sale', 'auto']),
        },
        {
          id: 'generic-contract',
          keywordsHit: new Set(['purchase', 'agreement']),
        },
        {
          id: 'motorcycle-sale',
          keywordsHit: new Set(['vehicle', 'purchase', 'motorcycle']),
        },
      ];

      const originalTokens = ['car', 'purchase'];
      const results = rank(rawHits, originalTokens);

      expect(results).toHaveLength(3);
      
      // bill-of-sale-vehicle: 1 original (car) + 4 synonyms (vehicle, bill, sale, auto) = 1*2 + 4*1 = 6
      expect(results[0].id).toBe('bill-of-sale-vehicle');
      expect(results[0].score).toBe(6);
      expect(results[0].reason).toBe('hybrid');
      
      // motorcycle-sale: 1 original (purchase) + 2 synonyms (vehicle, motorcycle) = 1*2 + 2*1 = 4
      expect(results[1].id).toBe('motorcycle-sale');
      expect(results[1].score).toBe(4);
      expect(results[1].reason).toBe('hybrid');
      
      // generic-contract: 1 original (purchase) + 1 synonym (agreement) = 1*2 + 1*1 = 3
      expect(results[2].id).toBe('generic-contract');
      expect(results[2].score).toBe(3);
      expect(results[2].reason).toBe('hybrid');
    });
  });
});
