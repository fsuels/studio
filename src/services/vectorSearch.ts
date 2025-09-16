// src/services/vectorSearch.ts
// Vector index query helper with Redis caching, latency fallback, and HTTP endpoint integration

// Conditional imports for server-side only
let crypto: unknown = null;
let Redis: unknown = null;

// Initialize server-side modules only when running on server
if (typeof window === 'undefined') {
  try {
    crypto = require('crypto');
    Redis = require('ioredis').default || require('ioredis');
  } catch (error) {
    console.warn('[Vector Search] Server-side modules not available:', error);
  }
}

// Logger interface - adapt to your logging system
interface Logger {
  info: (message: string, data?: unknown) => void;
  error: (message: string, data?: unknown) => void;
  warn: (message: string, data?: unknown) => void;
}

// Default console logger - replace with your app's logger
const logger: Logger = {
  info: (message: string, data?: unknown) => console.log(message, data),
  error: (message: string, data?: unknown) => console.error(message, data),
  warn: (message: string, data?: unknown) => console.warn(message, data),
};

// Vector search result interface
export interface VectorSearchResult {
  id: string;
  score: number;
}

// Cache configuration
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const CACHE_TTL_SECONDS = 24 * 60 * 60; // 24 hours in seconds for Redis
const HTTP_TIMEOUT_MS = 300; // 300ms timeout for vector endpoint

// Redis and fallback cache instances
type RedisLike = {
  ping: () => Promise<unknown>;
  get: (key: string) => Promise<string | null>;
  setex: (key: string, ttl: number, value: string) => Promise<unknown>;
  keys: (pattern: string) => Promise<string[]>;
  del: (...keys: string[]) => Promise<unknown>;
  info: (section?: string) => Promise<string>;
  disconnect: () => Promise<void>;
  on: (event: string, handler: (err: unknown) => void) => void;
};
let redisClient: RedisLike | null = null;
type SimpleCache<T> = {
  get: (key: string) => T | undefined;
  set: (key: string, value: T) => void;
  clear: () => void;
  delete: (key: string) => void;
  size: number;
};
let fallbackCache: SimpleCache<VectorSearchResult[]> | null = null;

/**
 * Initialize Redis client (server-side only)
 */
async function getRedisClient(): Promise<RedisLike | null> {
  // Return null if we're on the client side or Redis is not available
  if (typeof window !== 'undefined' || !Redis) {
    return null;
  }
  
  if (redisClient === null) {
    const redisUrl = process.env.REDIS_URL;
    
    if (!redisUrl) {
      logger.warn('No REDIS_URL configured, using fallback cache');
      return null;
    }
    
    try {
      // Using dynamic import without runtime types; narrow to RedisLike
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      redisClient = new (Redis as any)(redisUrl, {
        maxRetriesPerRequest: 3,
        connectTimeout: 5000,
        commandTimeout: 2000,
        lazyConnect: true,
      });
      
      // Test connection
      await redisClient.ping();
      
      logger.info('Redis client initialized for vector search cache', {
        url: redisUrl.replace(/:\/\/[^@]+@/, '://***:***@'), // Hide credentials
        ttlSeconds: CACHE_TTL_SECONDS
      });
      
      // Handle Redis errors gracefully
      redisClient.on('error', (error) => {
        logger.error('Redis error, will fall back to local cache', { error: error.message });
      });
      
    } catch (error) {
      logger.error('Failed to initialize Redis client, falling back to local cache', { error });
      redisClient = null;
    }
  }
  
  return redisClient;
}

/**
 * Get fallback LRU cache
 */
async function getFallbackCache(): Promise<SimpleCache<VectorSearchResult[]>> {
  if (!fallbackCache) {
    try {
      // Use a simple Map-based cache instead of tiny-lru for better compatibility
      const cache = new Map<string, { value: VectorSearchResult[]; timestamp: number }>();
      fallbackCache = {
        get: (key: string) => {
          const entry = cache.get(key);
          if (!entry) return undefined;
          if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
            cache.delete(key);
            return undefined;
          }
          return entry.value;
        },
        set: (key: string, value: VectorSearchResult[]) => {
          cache.set(key, { value, timestamp: Date.now() });
          // Simple cleanup: remove old entries if cache gets too large
          if (cache.size > 1000) {
            const entries = Array.from(cache.entries());
            const now = Date.now();
            entries.forEach(([k, entry]) => {
              if (now - entry.timestamp > CACHE_TTL_MS) {
                cache.delete(k);
              }
            });
          }
        },
        clear: () => cache.clear(),
        delete: (key: string) => cache.delete(key),
        size: cache.size,
      };
      logger.info('Vector search fallback cache initialized', { 
        maxSize: 1000, 
        ttlMs: CACHE_TTL_MS 
      });
    } catch (error) {
      logger.error('Failed to initialize fallback cache, using no-cache mode', { error });
      // Mock cache that doesn't actually cache
      fallbackCache = {
        get: () => undefined,
        set: () => {},
        clear: () => {},
        delete: () => {},
        size: 0,
      };
    }
  }
  return fallbackCache;
}

/**
 * Generate cache key from query embedding using MD5 hash (or fallback)
 */
function generateCacheKey(queryEmbedding: Float32Array, k: number): string {
  // Use crypto hash if available (server-side)
  if (crypto && typeof Buffer !== 'undefined') {
    try {
      const buffer = Buffer.from(queryEmbedding.buffer);
      const embeddingHash = crypto.createHash('md5').update(buffer).digest('hex');
      return `vector:${embeddingHash}:k${k}`;
    } catch (error) {
      logger.warn('Failed to generate crypto hash, using fallback', { error });
    }
  }
  
  // Fallback: simple string hash for client-side
  const embeddingStr = Array.from(queryEmbedding).join(',');
  let hash = 0;
  for (let i = 0; i < embeddingStr.length; i++) {
    const char = embeddingStr.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  const embeddingHash = Math.abs(hash).toString(16);
  return `vector:${embeddingHash}:k${k}`;
}

/**
 * Get cached results from Redis or fallback cache
 */
async function getCachedResults(cacheKey: string): Promise<VectorSearchResult[] | null> {
  const startTime = Date.now();
  
  try {
    // Try Redis first
    const redis = await getRedisClient();
    if (redis) {
      const cached = await redis.get(cacheKey);
      if (cached) {
        const results = JSON.parse(cached) as VectorSearchResult[];
        const duration = Date.now() - startTime;
        
        logger.info('Redis cache hit', {
          key: cacheKey,
          resultCount: results.length,
          duration,
          source: 'redis'
        });
        
        return results;
      }
    }
    
    // Fall back to local cache
    const localCache = await getFallbackCache();
    const cached = localCache.get(cacheKey);
    
    if (cached) {
      const duration = Date.now() - startTime;
      
      logger.info('Local cache hit', {
        key: cacheKey,
        resultCount: cached.length,
        duration,
        source: 'local'
      });
      
      return cached;
    }
    
    return null;
    
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.warn('Cache get failed', {
      key: cacheKey,
      duration,
      error: error instanceof Error ? error.message : String(error)
    });
    return null;
  }
}

/**
 * Cache results in Redis and fallback cache
 */
async function setCachedResults(cacheKey: string, results: VectorSearchResult[]): Promise<void> {
  const startTime = Date.now();
  
  try {
    // Try to cache in Redis
    const redis = await getRedisClient();
    if (redis) {
      await redis.setex(cacheKey, CACHE_TTL_SECONDS, JSON.stringify(results));
      
      const duration = Date.now() - startTime;
      logger.info('Results cached in Redis', {
        key: cacheKey,
        resultCount: results.length,
        duration,
        ttlSeconds: CACHE_TTL_SECONDS
      });
    }
    
    // Also cache locally as backup
    const localCache = await getFallbackCache();
    localCache.set(cacheKey, results.slice());
    
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error('Cache set failed', {
      key: cacheKey,
      duration,
      error: error instanceof Error ? error.message : String(error)
    });
    
    // Try local cache as fallback
    try {
      const localCache = await getFallbackCache();
      localCache.set(cacheKey, results.slice());
    } catch (fallbackError) {
      logger.error('Fallback cache set also failed', { fallbackError });
    }
  }
}

/**
 * Validate query embedding format and dimensions
 */
function validateQueryEmbedding(queryEmbedding: Float32Array): void {
  if (!queryEmbedding || !(queryEmbedding instanceof Float32Array)) {
    throw new Error('Query embedding must be a Float32Array');
  }
  
  if (queryEmbedding.length === 0) {
    throw new Error('Query embedding cannot be empty');
  }
  
  // Typical embedding dimensions validation
  const validDimensions = [384, 512, 768, 1024, 1536, 3072]; // Common sizes
  if (!validDimensions.includes(queryEmbedding.length)) {
    logger.warn('Unusual embedding dimensions detected', { 
      dimensions: queryEmbedding.length,
      expected: validDimensions 
    });
  }
}

/**
 * Perform HTTP request to vector endpoint with timeout and AbortController
 */
async function queryVectorEndpoint(
  queryEmbedding: Float32Array, 
  k: number, 
  endpoint: string
): Promise<VectorSearchResult[]> {
  const startTime = Date.now();
  const abortController = new AbortController();
  
  try {
    // Convert Float32Array to regular number array for JSON serialization
    const embeddingArray = Array.from(queryEmbedding);
    
    const requestBody = {
      vector: embeddingArray,
      k: k,
      timestamp: new Date().toISOString(),
    };
    
    logger.info('Querying vector endpoint with timeout', {
      endpoint,
      dimensions: embeddingArray.length,
      k,
      requestSize: JSON.stringify(requestBody).length,
      timeoutMs: HTTP_TIMEOUT_MS
    });
    
    // Create timeout promise
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        abortController.abort();
        reject(new Error(`Vector endpoint timeout after ${HTTP_TIMEOUT_MS}ms`));
      }, HTTP_TIMEOUT_MS);
    });
    
    // Create fetch promise
    const fetchPromise = fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'LegalDoc-VectorSearch/1.0',
      },
      body: JSON.stringify(requestBody),
      signal: abortController.signal,
    });
    
    // Race between fetch and timeout
    const response = await Promise.race([fetchPromise, timeoutPromise]);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const responseData = await response.json();
    const duration = Date.now() - startTime;
    
    // Validate response format
    if (!Array.isArray(responseData) && !Array.isArray(responseData.results)) {
      throw new Error('Invalid response format: expected array or object with results array');
    }
    
    const results = Array.isArray(responseData) ? responseData : responseData.results;
    
    // Validate and normalize results
    const normalizedResults: VectorSearchResult[] = results.map((item: unknown, index: number) => {
      const obj = item as { id?: unknown; score?: unknown };
      if (!obj || typeof obj !== 'object') {
        throw new Error(`Invalid result item at index ${index}: expected object`);
      }
      
      if (typeof obj.id !== 'string') {
        throw new Error(`Invalid result item at index ${index}: missing or invalid id`);
      }
      
      if (typeof obj.score !== 'number' || isNaN(obj.score)) {
        throw new Error(`Invalid result item at index ${index}: missing or invalid score`);
      }
      
      return {
        id: obj.id,
        score: obj.score,
      };
    });
    
    logger.info('Vector endpoint query completed', {
      endpoint,
      duration,
      resultCount: normalizedResults.length,
      topScore: normalizedResults.length > 0 ? normalizedResults[0].score : null,
      timedOut: false
    });
    
    return normalizedResults;
    
  } catch (error) {
    const duration = Date.now() - startTime;
    const isTimeout = error instanceof Error && error.message.includes('timeout');
    const isAborted = error instanceof Error && error.name === 'AbortError';
    
    logger.error('Vector endpoint query failed', {
      endpoint,
      duration,
      timedOut: isTimeout || isAborted,
      error: error instanceof Error ? error.message : String(error),
    });
    
    // Clean up abort controller
    abortController.abort();
    
    throw error;
  }
}

/**
 * Vector search with caching and HTTP endpoint integration
 * 
 * @param queryEmbedding - Query vector as Float32Array
 * @param k - Number of nearest neighbors to return (default: 10)
 * @returns Array of search results with id and similarity score
 */
export async function vectorSearch(
  queryEmbedding: Float32Array, 
  k: number = 10
): Promise<VectorSearchResult[]> {
  const startTime = Date.now();
  
  try {
    // Check if vector endpoint is configured
    const vectorEndpoint = process.env.VECTOR_ENDPOINT || process.env.NEXT_PUBLIC_VECTOR_ENDPOINT;
    
    if (!vectorEndpoint) {
      logger.info('No VECTOR_ENDPOINT configured, returning empty results');
      return [];
    }
    
    // Validate input parameters
    validateQueryEmbedding(queryEmbedding);
    
    if (k <= 0 || k > 1000) {
      throw new Error('Parameter k must be between 1 and 1000');
    }
    
    // Generate cache key
    const cacheKey = generateCacheKey(queryEmbedding, k);
    
    // Check cache (Redis + fallback)
    const cachedResult = await getCachedResults(cacheKey);
    
    if (cachedResult) {
      return cachedResult;
    }
    
    logger.info('Cache miss', { 
      key: cacheKey,
      dimensions: queryEmbedding.length,
      k,
    });
    
    // Query vector endpoint with timeout fallback
    let results: VectorSearchResult[];
    
    try {
      results = await queryVectorEndpoint(queryEmbedding, k, vectorEndpoint);
    } catch (error) {
      const isTimeout = error instanceof Error && 
        (error.message.includes('timeout') || error.name === 'AbortError');
      
      if (isTimeout) {
        logger.warn('Vector endpoint timeout, returning empty results', {
          endpoint: vectorEndpoint,
          timeoutMs: HTTP_TIMEOUT_MS,
          dimensions: queryEmbedding.length,
          k
        });
        return [];
      }
      
      throw error;
    }
    
    // Cache results (Redis + fallback)
    await setCachedResults(cacheKey, results);
    
    const totalDuration = Date.now() - startTime;
    logger.info('Vector search completed', {
      key: cacheKey,
      duration: totalDuration,
      resultCount: results.length,
      cached: false,
    });
    
    return results;
    
  } catch (error) {
    const totalDuration = Date.now() - startTime;
    logger.error('Vector search failed', {
      duration: totalDuration,
      k,
      dimensions: queryEmbedding?.length || 'unknown',
      error: error instanceof Error ? error.message : String(error),
    });
    
    // Return empty array on error to maintain API contract
    return [];
  }
}

/**
 * Clear the vector search cache (both Redis and fallback)
 */
export async function clearVectorSearchCache(): Promise<void> {
  const errors: string[] = [];
  
  try {
    // Clear Redis cache
    const redis = await getRedisClient();
    if (redis) {
      // Delete all vector search keys (pattern-based deletion)
      const keys = await redis.keys('vector:*');
      if (keys.length > 0) {
        await redis.del(...keys);
        logger.info('Redis vector search cache cleared', { keysDeleted: keys.length });
      }
    }
  } catch (error) {
    const errorMsg = `Redis clear failed: ${error instanceof Error ? error.message : String(error)}`;
    errors.push(errorMsg);
    logger.error(errorMsg);
  }
  
  try {
    // Clear fallback cache
    const cache = await getFallbackCache();
    cache.clear();
    logger.info('Fallback vector search cache cleared');
  } catch (error) {
    const errorMsg = `Fallback clear failed: ${error instanceof Error ? error.message : String(error)}`;
    errors.push(errorMsg);
    logger.error(errorMsg);
  }
  
  if (errors.length === 0) {
    logger.info('Vector search cache cleared successfully');
  } else {
    logger.warn('Vector search cache clear completed with errors', { errors });
  }
}

/**
 * Get cache statistics for both Redis and fallback cache
 */
export async function getVectorSearchCacheStats(): Promise<{
  redis: {
    available: boolean;
    keyCount: number;
    memoryUsage?: string;
  };
  fallback: {
    size: number;
    maxSize: number;
  };
  ttl: number;
  timeout: number;
}> {
  const stats = {
    redis: {
      available: false,
      keyCount: 0,
      memoryUsage: undefined as string | undefined,
    },
    fallback: {
      size: 0,
      maxSize: 1000,
    },
    ttl: CACHE_TTL_MS,
    timeout: HTTP_TIMEOUT_MS,
  };
  
  try {
    // Redis stats
    const redis = await getRedisClient();
    if (redis) {
      stats.redis.available = true;
      const keys = await redis.keys('vector:*');
      stats.redis.keyCount = keys.length;
      
      try {
        const info = await redis.info('memory');
        const memoryMatch = info.match(/used_memory_human:([^\r\n]+)/);
        if (memoryMatch) {
          stats.redis.memoryUsage = memoryMatch[1].trim();
        }
      } catch (_memoryError) {
        // Memory info not critical
      }
    }
  } catch (error) {
    logger.error('Failed to get Redis cache stats', { error });
  }
  
  try {
    // Fallback cache stats
    const cache = await getFallbackCache();
    stats.fallback.size = cache.size || 0;
  } catch (error) {
    logger.error('Failed to get fallback cache stats', { error });
  }
  
  return stats;
}

/**
 * Utility function to create embedding from array (for testing)
 */
export function createEmbedding(values: number[]): Float32Array {
  return new Float32Array(values);
}

/**
 * Utility function to normalize vectors (optional preprocessing)
 */
export function normalizeVector(vector: Float32Array): Float32Array {
  const magnitude = Math.sqrt(Array.from(vector).reduce((sum, val) => sum + val * val, 0));
  if (magnitude === 0) {
    throw new Error('Cannot normalize zero vector');
  }
  return new Float32Array(Array.from(vector).map(val => val / magnitude));
}

/**
 * Disconnect Redis client (for cleanup)
 */
export async function disconnectVectorSearchCache(): Promise<void> {
  if (redisClient) {
    try {
      await redisClient.disconnect();
      redisClient = null;
      logger.info('Redis client disconnected');
    } catch (error) {
      logger.error('Failed to disconnect Redis client', { error });
    }
  }
}

export default vectorSearch;
