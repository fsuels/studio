// src/hooks/__tests__/useDiscoverySearch.test.ts
// Tests for useDiscoverySearch hook

import { renderHook, act } from '@testing-library/react';
import { useDiscoverySearch } from '../useDiscoverySearch';
import type { MarketplaceTemplate } from '../../types/marketplace';
import type { DiscoveryResult } from '../../types/discovery';
import { getDocs, collection, query, where, limit } from 'firebase/firestore';
import { vectorSearch } from '../../services/vectorSearch';
import { rankDiscoveryResults } from '../../utils/rankDiscoveryResults';

// Mock the search config
jest.mock('../../config/search', () => ({
  SYN_MAP: {
    buy: ['buy', 'purchase', 'acquire', 'obtain'],
    buying: ['buying', 'purchasing', 'acquiring'],
    car: ['car', 'vehicle', 'auto', 'automobile'],
    used: ['used', 'pre-owned', 'second-hand'],
  },
  STOP_WORDS: new Set(['a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with']),
  RANK_WEIGHTS: {
    semantic: 0.7,
    keyword: 0.3,
  },
}));

// Mock vector search
jest.mock('../../services/vectorSearch');

// Mock ranking utility
jest.mock('../../utils/rankDiscoveryResults');

// Mock Firebase
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
  limit: jest.fn(),
}));

jest.mock('../../lib/firebase', () => ({
  db: {}, // Mock db object
}));

// Mock performance.now for consistent testing
const mockPerformanceNow = jest.fn();
Object.defineProperty(window, 'performance', {
  value: { now: mockPerformanceNow },
  writable: true,
});

// Get mocked functions with proper typing
const mockGetDocs = getDocs as jest.MockedFunction<typeof getDocs>;
const mockCollection = collection as jest.MockedFunction<typeof collection>;
const mockQuery = query as jest.MockedFunction<typeof query>;
const mockWhere = where as jest.MockedFunction<typeof where>;
const mockLimit = limit as jest.MockedFunction<typeof limit>;
const mockVectorSearch = vectorSearch as jest.MockedFunction<typeof vectorSearch>;
const mockRankDiscoveryResults = rankDiscoveryResults as jest.MockedFunction<typeof rankDiscoveryResults>;

// Mock localStorage for experiment flags
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(global, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

describe('useDiscoverySearch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPerformanceNow.mockReturnValue(1000);
    
    // Setup default Firebase mock chain
    mockCollection.mockReturnValue({} as any);
    mockQuery.mockReturnValue({} as any);
    mockWhere.mockReturnValue({} as any);
    mockLimit.mockReturnValue({} as any);
    
    // Setup default localStorage mock
    mockLocalStorage.getItem.mockReturnValue('false');
    
    // Mock console methods
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('processQuery', () => {
    it('should process a basic query and return tokens', () => {
      const { result } = renderHook(() => useDiscoverySearch());

      act(() => {
        result.current.processQuery('buying a used car');
      });

      expect(result.current.tokens.originalTokens).toEqual(['buying', 'used', 'car']);
      expect(result.current.tokens.expandedTokens).toContain('buy');
      expect(result.current.tokens.expandedTokens).toContain('purchase');
      expect(result.current.tokens.expandedTokens).toContain('car');
      expect(result.current.tokens.expandedTokens).toContain('vehicle');
      expect(result.current.tokens.expandedTokens).toContain('auto');
    });

    it('should expand tokens with synonyms from SYN_MAP', () => {
      const { result } = renderHook(() => useDiscoverySearch());

      act(() => {
        result.current.processQuery('buying a used car');
      });

      const { expandedTokens } = result.current.tokens;
      
      // Should include original tokens
      expect(expandedTokens).toContain('buying');
      expect(expandedTokens).toContain('used');
      expect(expandedTokens).toContain('car');
      
      // Should include synonyms for 'buy' (from 'buying' stem)
      expect(expandedTokens).toContain('buy');
      expect(expandedTokens).toContain('purchase');
      expect(expandedTokens).toContain('acquire');
      expect(expandedTokens).toContain('obtain');
      
      // Should include synonyms for 'car'
      expect(expandedTokens).toContain('vehicle');
      expect(expandedTokens).toContain('auto');
      expect(expandedTokens).toContain('automobile');
      
      // Should include synonyms for 'used'
      expect(expandedTokens).toContain('pre-owned');
      expect(expandedTokens).toContain('second-hand');
    });

    it('should filter out stop words', () => {
      const { result } = renderHook(() => useDiscoverySearch());

      act(() => {
        result.current.processQuery('buying a used car');
      });

      const { originalTokens } = result.current.tokens;
      
      // Stop words should be filtered out
      expect(originalTokens).not.toContain('a');
      expect(originalTokens).not.toContain('the');
      expect(originalTokens).not.toContain('and');
      
      // Real tokens should remain
      expect(originalTokens).toContain('buying');
      expect(originalTokens).toContain('used');
      expect(originalTokens).toContain('car');
    });

    it('should handle empty queries', () => {
      const { result } = renderHook(() => useDiscoverySearch());

      act(() => {
        result.current.processQuery('');
      });

      expect(result.current.tokens.originalTokens).toEqual([]);
      expect(result.current.tokens.expandedTokens).toEqual([]);
    });

    it('should handle queries with special characters', () => {
      const { result } = renderHook(() => useDiscoverySearch());

      act(() => {
        result.current.processQuery('buying a car!@#$%');
      });

      expect(result.current.tokens.originalTokens).toEqual(['buying', 'car']);
      expect(result.current.tokens.expandedTokens).toContain('buy');
      expect(result.current.tokens.expandedTokens).toContain('vehicle');
    });

    it('should normalize Unicode characters', () => {
      const { result } = renderHook(() => useDiscoverySearch());

      act(() => {
        result.current.processQuery('café résumé');
      });

      expect(result.current.tokens.originalTokens).toEqual(['cafe', 'resume']);
    });

    it('should handle single character tokens', () => {
      const { result } = renderHook(() => useDiscoverySearch());

      act(() => {
        result.current.processQuery('a b car');
      });

      // Single characters should be filtered out
      expect(result.current.tokens.originalTokens).not.toContain('a');
      expect(result.current.tokens.originalTokens).not.toContain('b');
      expect(result.current.tokens.originalTokens).toContain('car');
    });
  });

  describe('metrics', () => {
    it('should track query processing time', () => {
      mockPerformanceNow.mockReturnValueOnce(1000).mockReturnValueOnce(1050);
      
      const { result } = renderHook(() => useDiscoverySearch());

      act(() => {
        result.current.processQuery('test query');
      });

      expect(result.current.metrics.queryProcessingTime).toBe(50);
      expect(result.current.metrics.lastQueryTimestamp).toBeGreaterThan(0);
    });

    it('should track Firestore reads', () => {
      const { result } = renderHook(() => useDiscoverySearch());

      // Simulate Firestore reads
      const logFirestoreRead = (window as any).__logFirestoreRead;
      
      act(() => {
        logFirestoreRead(5);
      });

      expect(result.current.metrics.firestoreReads).toBe(5);

      act(() => {
        logFirestoreRead(3);
      });

      expect(result.current.metrics.firestoreReads).toBe(8);
    });

    it('should reset metrics', () => {
      mockPerformanceNow.mockReturnValueOnce(1000).mockReturnValueOnce(1050);
      
      const { result } = renderHook(() => useDiscoverySearch());

      act(() => {
        result.current.processQuery('test');
      });

      expect(result.current.metrics.queryProcessingTime).toBe(50);

      act(() => {
        result.current.resetMetrics();
      });

      expect(result.current.metrics.queryProcessingTime).toBe(0);
      expect(result.current.metrics.firestoreReads).toBe(0);
      expect(result.current.metrics.lastQueryTimestamp).toBe(0);
    });
  });

  describe('token deduplication', () => {
    it('should deduplicate expanded tokens', () => {
      const { result } = renderHook(() => useDiscoverySearch());

      act(() => {
        result.current.processQuery('car car vehicle');
      });

      const { expandedTokens } = result.current.tokens;
      const carCount = expandedTokens.filter(token => token === 'car').length;
      const vehicleCount = expandedTokens.filter(token => token === 'vehicle').length;

      expect(carCount).toBe(1);
      expect(vehicleCount).toBe(1);
    });
  });

  describe('stemming', () => {
    it('should apply simple stemming rules', () => {
      const { result } = renderHook(() => useDiscoverySearch());

      act(() => {
        result.current.processQuery('buying');
      });

      const { expandedTokens } = result.current.tokens;
      
      // Should include the stem 'buy' and its synonyms
      expect(expandedTokens).toContain('buy');
      expect(expandedTokens).toContain('purchase');
    });
  });

  describe('console logging', () => {
    it('should log query processing details', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const { result } = renderHook(() => useDiscoverySearch());

      act(() => {
        result.current.processQuery('buying a used car');
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        '[Discovery Search] Query processed:',
        expect.objectContaining({
          rawQuery: 'buying a used car',
          clean: 'buying a used car', // Fixed: sanitize doesn't remove stop words
          originalTokens: ['buying', 'used', 'car'],
          expandedTokens: expect.any(Array),
          processingTime: expect.any(String),
        })
      );

      consoleSpy.mockRestore();
    });
  });

  describe('Firestore search', () => {
    const mockTemplate: MarketplaceTemplate = {
      id: 'test-template-1',
      name: 'Vehicle Bill of Sale',
      slug: 'vehicle-bill-of-sale',
      description: 'Template for buying and selling used cars',
      createdBy: 'user123',
      creatorProfile: {} as any,
      category: 'automotive',
      tags: ['vehicle', 'purchase', 'legal'],
      keywords: ['car', 'vehicle', 'buy', 'purchase', 'auto', 'used'],
      jurisdiction: 'US',
      languageSupport: ['en'],
      visibility: 'public' as const,
      pricing: {} as any,
      currentVersion: '1.0.0',
      latestVersionId: 'v1',
      versions: ['v1'],
      stats: {} as any,
      ratings: {} as any,
      lastUpdated: {} as any,
      moderationStatus: 'approved' as const,
    };

    it('should search Firestore and return results for "buying a used car"', async () => {
      // Mock Firestore query snapshot
      const mockQuerySnapshot = {
        size: 1,
        forEach: jest.fn((callback) => {
          callback({
            id: 'test-template-1',
            data: () => mockTemplate,
          });
        }),
      };

      mockGetDocs.mockResolvedValue(mockQuerySnapshot);

      const { result } = renderHook(() => useDiscoverySearch());

      await act(async () => {
        await result.current.searchFirestore('buying a used car');
      });

      // Verify Firestore query was called with correct parameters
      expect(mockCollection).toHaveBeenCalledWith({}, 'marketplace-templates');
      expect(mockWhere).toHaveBeenCalledWith(
        'keywords',
        'array-contains-any',
        ['acquire', 'acquiring', 'auto', 'automobile', 'buy', 'buying', 'car', 'obtain', 'pre-owned', 'purchase']
      );
      expect(mockLimit).toHaveBeenCalledWith(50);

      // Mock ranking function to return ranked results
      const mockRankedResults = [{
        ...mockTemplate,
        score: 2.4,
      }];
      mockRankDiscoveryResults.mockReturnValue(mockRankedResults as any);

      // Verify results
      expect(result.current.results).toHaveLength(1);
      expect(result.current.results[0].id).toBe('test-template-1');
      expect(result.current.results[0].title).toBe('Vehicle Bill of Sale');
      expect(result.current.results[0].reason).toBe('keyword');
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(result.current.metrics.firestoreReads).toBe(1);
    });

    it('should handle empty search results', async () => {
      const mockQuerySnapshot = {
        size: 0,
        forEach: jest.fn(),
      };

      mockGetDocs.mockResolvedValue(mockQuerySnapshot);

      const { result } = renderHook(() => useDiscoverySearch());

      await act(async () => {
        await result.current.searchFirestore('nonexistent query');
      });

      expect(result.current.results).toHaveLength(0);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle Firestore errors', async () => {
      const mockError = new Error('Firestore connection failed');
      mockGetDocs.mockRejectedValue(mockError);

      const { result } = renderHook(() => useDiscoverySearch());

      await act(async () => {
        await result.current.searchFirestore('test query');
      });

      expect(result.current.results).toHaveLength(0);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe('Firestore connection failed');
    });

    it('should limit search tokens to 10 for array-contains-any', async () => {
      const mockQuerySnapshot = {
        size: 0,
        forEach: jest.fn(),
      };

      mockGetDocs.mockResolvedValue(mockQuerySnapshot);

      const { result } = renderHook(() => useDiscoverySearch());

      // Create a query with many tokens that would expand to more than 10
      const longQuery = 'buying selling trading purchasing acquiring obtaining car vehicle auto automobile truck motorcycle';

      await act(async () => {
        await result.current.searchFirestore(longQuery);
      });

      // Verify that only 10 tokens were passed to array-contains-any
      const whereCall = mockWhere.mock.calls.find(call => call[0] === 'keywords' && call[1] === 'array-contains-any');
      expect(whereCall).toBeDefined();
      expect(whereCall[2]).toHaveLength(10);
    });

    it('should handle empty query gracefully', async () => {
      const { result } = renderHook(() => useDiscoverySearch());

      await act(async () => {
        await result.current.searchFirestore('');
      });

      expect(result.current.results).toHaveLength(0);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(mockGetDocs).not.toHaveBeenCalled();
    });

    it('should reset results when resetMetrics is called', () => {
      const { result } = renderHook(() => useDiscoverySearch());

      // Set some mock results
      act(() => {
        result.current.processQuery('test');
      });

      // Reset should clear results
      act(() => {
        result.current.resetMetrics();
      });

      expect(result.current.results).toHaveLength(0);
      expect(result.current.error).toBe(null);
      expect(result.current.metrics.firestoreReads).toBe(0);
    });

    it('should show loading state during search', async () => {
      let resolvePromise: (value: any) => void;
      const pendingPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      mockGetDocs.mockReturnValue(pendingPromise);

      const { result } = renderHook(() => useDiscoverySearch());

      // Start search without awaiting
      act(() => {
        result.current.searchFirestore('test query');
      });

      // Should be loading
      expect(result.current.loading).toBe(true);

      // Resolve the promise
      resolvePromise!({
        size: 0,
        forEach: jest.fn(),
      });

      // Wait for the promise to resolve
      await act(async () => {
        await pendingPromise;
      });

      // Should no longer be loading
      expect(result.current.loading).toBe(false);
    });
  });

  describe('hybridSearch', () => {
    const mockTemplate: MarketplaceTemplate = {
      id: 'test-template-1',
      name: 'Employment Contract',
      title: 'Employment Contract',
      slug: 'employment-contract',
      description: 'Template for employment agreements',
      createdBy: 'user123',
      creatorProfile: {} as any,
      category: 'employment',
      tags: ['employment', 'contract', 'legal'],
      keywords: ['employment', 'contract', 'job', 'work'],
      jurisdiction: 'US',
      languageSupport: ['en'],
      visibility: 'public' as const,
      pricing: {} as any,
      currentVersion: '1.0.0',
      latestVersionId: 'v1',
      versions: ['v1'],
      stats: {} as any,
      ratings: {} as any,
      lastUpdated: {} as any,
      moderationStatus: 'approved' as const,
    };

    it('should combine keyword and vector search results with hybrid reason', async () => {
      // Enable hybrid experiment
      mockLocalStorage.getItem.mockReturnValue('true');

      // Setup mock data
      const mockKeywordTemplates = [
        { id: 'template1', title: 'Employment Contract', name: 'Employment Contract' },
        { id: 'template2', title: 'NDA Template', name: 'NDA Template' },
      ];

      const mockVectorResults = [
        { id: 'template2', score: 0.95 }, // Overlap with keyword
        { id: 'template3', score: 0.88 }, // Vector-only
      ];

      const mockRankedKeywordResults = [
        { id: 'template1', title: 'Employment Contract', score: 2.4 },
        { id: 'template2', title: 'NDA Template', score: 1.8 },
      ];

      // Mock Firebase query
      const mockQuerySnapshot = {
        size: 2,
        forEach: jest.fn((callback) => {
          mockKeywordTemplates.forEach((template) => {
            callback({
              id: template.id,
              data: () => template,
            });
          });
        }),
      };

      mockGetDocs.mockResolvedValue(mockQuerySnapshot as any);
      mockRankDiscoveryResults.mockReturnValue(mockRankedKeywordResults as any);
      mockVectorSearch.mockResolvedValue(mockVectorResults);

      // Create query embedding
      const queryEmbedding = new Float32Array([0.1, 0.2, 0.3, 0.4]);

      // Render hook
      const { result } = renderHook(() => useDiscoverySearch());

      // Execute hybrid search
      await act(async () => {
        await result.current.hybridSearch('employment contract', queryEmbedding);
      });

      // Verify vector search was called
      expect(mockVectorSearch).toHaveBeenCalledWith(queryEmbedding, 20);

      // Verify results contain expected items
      const { results } = result.current;
      expect(results).toHaveLength(3);

      // Check for hybrid result (appears in both searches)
      const hybridResult = results.find(r => r.id === 'template2');
      expect(hybridResult).toBeDefined();
      expect(hybridResult?.reason).toBe('hybrid');
      expect(hybridResult?.confidence).toBeGreaterThan(0);

      // Check for keyword-only result (may be keyword or synonym)
      const keywordResult = results.find(r => r.id === 'template1');
      expect(keywordResult).toBeDefined();
      expect(['keyword', 'synonym']).toContain(keywordResult?.reason);

      // Check for semantic-only result
      const semanticResult = results.find(r => r.id === 'template3');
      expect(semanticResult).toBeDefined();
      expect(semanticResult?.reason).toBe('semantic');

      // Verify results are sorted by confidence (descending)
      for (let i = 0; i < results.length - 1; i++) {
        expect(results[i].confidence).toBeGreaterThanOrEqual(results[i + 1].confidence);
      }
    });

    it('should fall back to keyword search when hybrid experiment is disabled', async () => {
      // Disable hybrid experiment
      mockLocalStorage.getItem.mockReturnValue('false');

      const mockKeywordTemplates = [
        { id: 'template1', title: 'Test Contract', name: 'Test Contract' },
      ];

      const mockRankedResults = [
        { id: 'template1', title: 'Test Contract', score: 2.0 },
      ];

      // Mock Firebase query
      const mockQuerySnapshot = {
        size: 1,
        forEach: jest.fn((callback) => {
          mockKeywordTemplates.forEach((template) => {
            callback({
              id: template.id,
              data: () => template,
            });
          });
        }),
      };

      mockGetDocs.mockResolvedValue(mockQuerySnapshot as any);
      mockRankDiscoveryResults.mockReturnValue(mockRankedResults as any);

      // Render hook
      const { result } = renderHook(() => useDiscoverySearch());

      // Execute hybrid search
      await act(async () => {
        await result.current.hybridSearch('test query');
      });

      // Verify vector search was NOT called
      expect(mockVectorSearch).not.toHaveBeenCalled();

      // Verify keyword search was executed
      expect(mockGetDocs).toHaveBeenCalled();

      // Verify results are keyword-only
      const { results } = result.current;
      expect(results).toHaveLength(1);
      expect(['keyword', 'synonym']).toContain(results[0].reason);
    });

    it('should handle weighted scoring correctly', async () => {
      // Enable hybrid experiment
      mockLocalStorage.getItem.mockReturnValue('true');

      const mockKeywordTemplates = [
        { id: 'template1', title: 'Test Template', name: 'Test Template' },
      ];

      const mockVectorResults = [
        { id: 'template1', score: 0.9 },
      ];

      const mockRankedKeywordResults = [
        { id: 'template1', title: 'Test Template', score: 2.0 },
      ];

      // Mock Firebase query
      const mockQuerySnapshot = {
        size: 1,
        forEach: jest.fn((callback) => {
          mockKeywordTemplates.forEach((template) => {
            callback({
              id: template.id,
              data: () => template,
            });
          });
        }),
      };

      mockGetDocs.mockResolvedValue(mockQuerySnapshot as any);
      mockRankDiscoveryResults.mockReturnValue(mockRankedKeywordResults as any);
      mockVectorSearch.mockResolvedValue(mockVectorResults);

      // Render hook
      const { result } = renderHook(() => useDiscoverySearch());

      // Execute hybrid search
      await act(async () => {
        await result.current.hybridSearch('test', new Float32Array([0.1, 0.2]));
      });

      // Verify weighted scoring
      const { results } = result.current;
      expect(results).toHaveLength(1);
      
      const hybridResult = results[0];
      expect(hybridResult.reason).toBe('hybrid');
      
      // Expected score: (0.9 * 0.7) + (2.0 * 0.3) = 0.63 + 0.6 = 1.23
      expect(hybridResult.confidence).toBeCloseTo(1.23, 2);
    });

    it('should handle empty results gracefully', async () => {
      // Enable hybrid experiment
      mockLocalStorage.getItem.mockReturnValue('true');

      // Mock empty results
      const mockQuerySnapshot = {
        size: 0,
        forEach: jest.fn(),
      };

      mockGetDocs.mockResolvedValue(mockQuerySnapshot as any);
      mockRankDiscoveryResults.mockReturnValue([]);
      mockVectorSearch.mockResolvedValue([]);

      // Render hook
      const { result } = renderHook(() => useDiscoverySearch());

      // Execute hybrid search
      await act(async () => {
        await result.current.hybridSearch('nonexistent query', new Float32Array([0.1]));
      });

      // Verify empty results
      const { results } = result.current;
      expect(results).toHaveLength(0);
    });

    it('should handle vector search without query embedding', async () => {
      // Enable hybrid experiment
      mockLocalStorage.getItem.mockReturnValue('true');

      const mockKeywordTemplates = [
        { id: 'template1', title: 'Test Template', name: 'Test Template' },
      ];

      const mockRankedResults = [
        { id: 'template1', title: 'Test Template', score: 1.5 },
      ];

      // Mock Firebase query
      const mockQuerySnapshot = {
        size: 1,
        forEach: jest.fn((callback) => {
          mockKeywordTemplates.forEach((template) => {
            callback({
              id: template.id,
              data: () => template,
            });
          });
        }),
      };

      mockGetDocs.mockResolvedValue(mockQuerySnapshot as any);
      mockRankDiscoveryResults.mockReturnValue(mockRankedResults as any);

      // Render hook
      const { result } = renderHook(() => useDiscoverySearch());

      // Execute hybrid search without embedding
      await act(async () => {
        await result.current.hybridSearch('test query'); // No embedding provided
      });

      // Verify vector search was not called
      expect(mockVectorSearch).not.toHaveBeenCalled();

      // Verify keyword-only results
      const { results } = result.current;
      expect(results).toHaveLength(1);
      expect(['keyword', 'synonym']).toContain(results[0].reason);
    });

    it('should handle errors gracefully', async () => {
      // Enable hybrid experiment
      mockLocalStorage.getItem.mockReturnValue('true');

      // Mock Firebase error
      mockGetDocs.mockRejectedValue(new Error('Firebase connection failed'));

      // Render hook
      const { result } = renderHook(() => useDiscoverySearch());

      // Execute hybrid search
      await act(async () => {
        await result.current.hybridSearch('test query');
      });

      // Verify error handling
      expect(result.current.error).toBe('Firebase connection failed');
      expect(result.current.loading).toBe(false);
      expect(result.current.results).toHaveLength(0);
    });

    it('should check localStorage for experiment flags', () => {
      // Render hook
      const { result } = renderHook(() => useDiscoverySearch());

      // Trigger experiment check indirectly through hybridSearch
      act(() => {
        result.current.hybridSearch('test');
      });

      // Verify localStorage was checked
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('experiment_hybridSearch');
    });
  });
});