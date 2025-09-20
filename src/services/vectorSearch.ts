// src/services/vectorSearch.ts
// Vector index query helper with Redis caching, latency fallback, and HTTP endpoint integration

import type { SearchResult } from '@/lib/vector-search/pinecone-service';
import type { Redis } from 'ioredis';

// Module loaders are initialized lazily to avoid bundling server-only dependencies on the client
type NodeCrypto = typeof import('node:crypto');
type RedisConstructor = typeof import('ioredis')['default'];

let cryptoModulePromise: Promise<NodeCrypto | null> | null = null;
let redisConstructorPromise: Promise<RedisConstructor | null> | null = null;

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

async function loadCrypto(): Promise<NodeCrypto | null> {
  if (typeof window !== 'undefined') {
    return null;
  }

  if (!cryptoModulePromise) {
    cryptoModulePromise = import('node:crypto')
      .then((module) => module)
      .catch((error) => {
        logger.warn('[Vector Search] Unable to load crypto module', {
          error: error instanceof Error ? error.message : String(error),
        });
        return null;
      });
  }

  return cryptoModulePromise;
}

async function loadRedisConstructor(): Promise<RedisConstructor | null> {
  if (typeof window !== 'undefined') {
    return null;
  }

  if (!redisConstructorPromise) {
    redisConstructorPromise = import('ioredis')
      .then((module) => (module.default ?? module) as RedisConstructor)
      .catch((error) => {
        logger.warn('[Vector Search] Redis module unavailable, using fallback cache', {
          error: error instanceof Error ? error.message : String(error),
        });
        return null;
      });
  }

  return redisConstructorPromise;
}

// Vector search result interface aligned with Pinecone search results
export interface VectorSearchResult
  extends Pick<SearchResult, 'id' | 'score'> {
  metadata?: SearchResult['metadata'];
  explanation?: string;
}

// Cache configuration
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const CACHE_TTL_SECONDS = 24 * 60 * 60; // 24 hours in seconds for Redis
const HTTP_TIMEOUT_MS = 300; // 300ms timeout for vector endpoint

const FALLBACK_MAX_ENTRIES = 1000;

// Redis and fallback cache instances
type RedisLike = Pick<
  Redis,
  'ping' | 'get' | 'setex' | 'keys' | 'del' | 'info' | 'disconnect' | 'on' | 'connect'
>;
let redisClient: RedisLike | null = null;
let redisClientPromise: Promise<RedisLike | null> | null = null;
type SimpleCache<T> = {
  get: (key: string) => T | undefined;
  set: (key: string, value: T) => void;
  clear: () => void;
  delete: (key: string) => void;
  readonly size: number;
};
class MemoryResultCache implements SimpleCache<VectorSearchResult[]> {
  private readonly store = new Map<string, { value: VectorSearchResult[]; timestamp: number }>();

  constructor(private readonly ttlMs: number, private readonly maxEntries: number) {}

  get size(): number {
    return this.store.size;
  }

  get(key: string): VectorSearchResult[] | undefined {
    const entry = this.store.get(key);
    if (!entry) {
      return undefined;
    }

    if (Date.now() - entry.timestamp > this.ttlMs) {
      this.store.delete(key);
      return undefined;
    }

    return entry.value.map((item) => ({
      ...item,
      metadata: item.metadata ? { ...item.metadata } : item.metadata ?? null,
    }));
  }

  set(key: string, value: VectorSearchResult[]): void {
    this.store.set(key, {
      value: value.map((item) => ({
        ...item,
        metadata: item.metadata ? { ...item.metadata } : item.metadata ?? null,
      })),
      timestamp: Date.now(),
    });

    this.prune();
  }

  clear(): void {
    this.store.clear();
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  get maxSize(): number {
    return this.maxEntries;
  }

  private prune(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now - entry.timestamp > this.ttlMs) {
        this.store.delete(key);
      }
    }

    if (this.store.size <= this.maxEntries) {
      return;
    }

    const sortedKeys = [...this.store.entries()].sort((a, b) => a[1].timestamp - b[1].timestamp);
    for (const [key] of sortedKeys) {
      if (this.store.size <= this.maxEntries) {
        break;
      }
      this.store.delete(key);
    }
  }
}

let fallbackCache: SimpleCache<VectorSearchResult[]> | null = null;

/**
 * Initialize Redis client (server-side only)
 */
async function getRedisClient(): Promise<RedisLike | null> {
  if (typeof window !== 'undefined') {
    return null;
  }

  if (redisClient) {
    return redisClient;
  }

  if (redisClientPromise) {
    return redisClientPromise;
  }

  const redisUrl = process.env.REDIS_URL;

  if (!redisUrl) {
    logger.warn('No REDIS_URL configured, using fallback cache');
    return null;
  }

  redisClientPromise = (async () => {
    const RedisCtor = await loadRedisConstructor();
    if (!RedisCtor) {
      return null;
    }

    try {
      const client = new RedisCtor(redisUrl, {
        maxRetriesPerRequest: 3,
        connectTimeout: 5000,
        commandTimeout: 2000,
        lazyConnect: true,
      }) as RedisLike;

      if (typeof client.connect === 'function') {
        try {
          await client.connect();
        } catch (connectError) {
          logger.warn('Redis lazy connect failed, continuing with ping', {
            error:
              connectError instanceof Error
                ? connectError.message
                : String(connectError),
          });
        }
      }

      await client.ping();

      client.on('error', (error) => {
        logger.error('Redis error, falling back to local cache', {
          error: error instanceof Error ? error.message : String(error),
        });
      });

      redisClient = client;
      logger.info('Redis client initialized for vector search cache', {
        url: redisUrl.replace(/:\/\/[^@]+@/, '://***:***@'),
        ttlSeconds: CACHE_TTL_SECONDS,
      });

      return redisClient;
    } catch (error) {
      logger.error('Failed to initialize Redis client, falling back to local cache', {
        error: error instanceof Error ? error.message : String(error),
      });
      redisClient = null;
      return null;
    } finally {
      redisClientPromise = null;
    }
  })();

  return redisClientPromise;
}

/**
 * Get fallback cache instance
 */
function getFallbackCache(): SimpleCache<VectorSearchResult[]> {
  if (!fallbackCache) {
    fallbackCache = new MemoryResultCache(CACHE_TTL_MS, FALLBACK_MAX_ENTRIES);
    logger.info('Vector search fallback cache initialized', {
      maxSize: FALLBACK_MAX_ENTRIES,
      ttlMs: CACHE_TTL_MS,
    });
  }

  return fallbackCache;
}

/**
 * Generate cache key from query embedding using MD5 hash (or fallback)
 */
function generateCacheKey(
  queryEmbedding: Float32Array,
  k: number,
  cryptoModule: NodeCrypto | null,
): string {
  if (cryptoModule && typeof Buffer !== 'undefined') {
    try {
      const buffer = Buffer.from(queryEmbedding.buffer);
      const embeddingHash = cryptoModule
        .createHash('md5')
        .update(buffer)
        .digest('hex');
      return 'vector:' + embeddingHash + ':k' + k;
    } catch (error) {
      logger.warn('Failed to generate crypto hash, using fallback', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  const embeddingStr = Array.from(queryEmbedding).join(',');
  let hash = 0;
  for (let i = 0; i < embeddingStr.length; i++) {
    hash = (hash << 5) - hash + embeddingStr.charCodeAt(i);
    hash |= 0;
  }
  const embeddingHash = Math.abs(hash).toString(16);
  return 'vector:' + embeddingHash + ':k' + k;
}
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
    const localCache = getFallbackCache();
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
    const localCache = getFallbackCache();
    localCache.set(
      cacheKey,
      results.map((result) => ({
        ...result,
        metadata: result.metadata ? { ...result.metadata } : result.metadata ?? null,
      })),
    );
    
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error('Cache set failed', {
      key: cacheKey,
      duration,
      error: error instanceof Error ? error.message : String(error)
    });
    
    // Try local cache as fallback
    try {
      const localCache = getFallbackCache();
      localCache.set(
        cacheKey,
        results.map((result) => ({
          ...result,
          metadata: result.metadata ? { ...result.metadata } : result.metadata ?? null,
        })),
      );
    } catch (fallbackError) {
      logger.error('Fallback cache set also failed', {
        fallbackError:
          fallbackError instanceof Error
            ? fallbackError.message
            : String(fallbackError),
      });
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
      const obj = item as {
        id?: unknown;
        score?: unknown;
        metadata?: unknown;
        explanation?: unknown;
      };
      if (!obj || typeof obj !== 'object') {
        throw new Error(`Invalid result item at index ${index}: expected object`);
      }
      
      if (typeof obj.id !== 'string') {
        throw new Error(`Invalid result item at index ${index}: missing or invalid id`);
      }
      
      if (typeof obj.score !== 'number' || isNaN(obj.score)) {
        throw new Error(`Invalid result item at index ${index}: missing or invalid score`);
      }
      
      const metadata =
        obj.metadata && typeof obj.metadata === 'object'
          ? (obj.metadata as SearchResult['metadata'])
          : undefined;
      const explanation =
        typeof obj.explanation === 'string' ? obj.explanation : undefined;

      return {
        id: obj.id,
        score: obj.score,
        metadata,
        explanation,
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
    const cryptoModule = await loadCrypto();
    const cacheKey = generateCacheKey(queryEmbedding, k, cryptoModule);
    
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
    const cache = getFallbackCache();
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
    const cache = getFallbackCache();
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
      redisClientPromise = null;
      logger.info('Redis client disconnected');
    } catch (error) {
      logger.error('Failed to disconnect Redis client', { error });
    }
  }