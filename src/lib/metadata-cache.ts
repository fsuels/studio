// src/lib/metadata-cache.ts
import { getDocMeta } from '@/config/doc-meta';

interface CacheEntry {
  data: any;
  timestamp: number;
  expiresAt: number;
}

interface CacheStats {
  hits: number;
  misses: number;
  size: number;
}

class MetadataCache {
  private cache = new Map<string, CacheEntry>();
  private readonly TTL = 5 * 60 * 1000; // 5 minutes
  private readonly MAX_SIZE = 500; // Max cached documents
  private stats: CacheStats = { hits: 0, misses: 0, size: 0 };

  // Preload popular documents
  private readonly POPULAR_DOCS = [
    'lease-agreement',
    'employment-contract',
    'nda',
    'bill-of-sale-vehicle',
    'power-of-attorney',
    'last-will-testament',
    'operating-agreement',
    'purchase-agreement'
  ];

  constructor() {
    this.preloadPopularDocs();
    this.startCleanupTimer();
  }

  async get(slug: string): Promise<any> {
    const now = Date.now();
    const entry = this.cache.get(slug);

    // Check if cached and not expired
    if (entry && entry.expiresAt > now) {
      this.stats.hits++;
      return entry.data;
    }

    // Cache miss - fetch from source
    this.stats.misses++;
    
    try {
      const data = await getDocMeta(slug);
      
      if (data) {
        this.set(slug, data);
        return data;
      }
      
      return null;
    } catch (error) {
      console.warn(`Failed to fetch metadata for ${slug}:`, error);
      return null;
    }
  }

  set(slug: string, data: any): void {
    const now = Date.now();
    
    // Implement LRU eviction if cache is full
    if (this.cache.size >= this.MAX_SIZE && !this.cache.has(slug)) {
      this.evictOldest();
    }

    this.cache.set(slug, {
      data,
      timestamp: now,
      expiresAt: now + this.TTL
    });

    this.stats.size = this.cache.size;
  }

  // Batch fetch multiple documents efficiently
  async getBatch(slugs: string[]): Promise<Record<string, any>> {
    const results: Record<string, any> = {};
    const toFetch: string[] = [];

    // First, get all available from cache
    for (const slug of slugs) {
      const cached = this.getCached(slug);
      if (cached) {
        results[slug] = cached;
        this.stats.hits++;
      } else {
        toFetch.push(slug);
        this.stats.misses++;
      }
    }

    // Fetch remaining in parallel
    if (toFetch.length > 0) {
      const fetchPromises = toFetch.map(async (slug) => {
        try {
          const data = await getDocMeta(slug);
          if (data) {
            this.set(slug, data);
            return { slug, data };
          }
        } catch (error) {
          console.warn(`Failed to fetch metadata for ${slug}:`, error);
        }
        return { slug, data: null };
      });

      const fetchResults = await Promise.all(fetchPromises);
      fetchResults.forEach(({ slug, data }) => {
        if (data) {
          results[slug] = data;
        }
      });
    }

    return results;
  }

  // Get from cache only (no fetch)
  getCached(slug: string): any | null {
    const now = Date.now();
    const entry = this.cache.get(slug);
    
    if (entry && entry.expiresAt > now) {
      return entry.data;
    }
    
    // Remove expired entry
    if (entry) {
      this.cache.delete(slug);
      this.stats.size = this.cache.size;
    }
    
    return null;
  }

  // Preload popular documents in background
  private async preloadPopularDocs(): Promise<void> {
    try {
      const results = await this.getBatch(this.POPULAR_DOCS);
      console.log(`Preloaded ${Object.keys(results).length} popular documents`);
    } catch (error) {
      console.warn('Failed to preload popular documents:', error);
    }
  }

  // Clean up expired entries periodically
  private startCleanupTimer(): void {
    setInterval(() => {
      const now = Date.now();
      let cleaned = 0;

      for (const [slug, entry] of this.cache.entries()) {
        if (entry.expiresAt <= now) {
          this.cache.delete(slug);
          cleaned++;
        }
      }

      if (cleaned > 0) {
        this.stats.size = this.cache.size;
        console.log(`Cleaned ${cleaned} expired cache entries`);
      }
    }, 2 * 60 * 1000); // Every 2 minutes
  }

  // Evict oldest entry (LRU)
  private evictOldest(): void {
    let oldestSlug = '';
    let oldestTime = Date.now();

    for (const [slug, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestSlug = slug;
      }
    }

    if (oldestSlug) {
      this.cache.delete(oldestSlug);
    }
  }

  // Get cache statistics
  getStats(): CacheStats & { hitRate: number } {
    const total = this.stats.hits + this.stats.misses;
    return {
      ...this.stats,
      hitRate: total > 0 ? this.stats.hits / total : 0
    };
  }

  // Clear all cache
  clear(): void {
    this.cache.clear();
    this.stats = { hits: 0, misses: 0, size: 0 };
  }

  // Warm cache with frequently accessed documents for a role
  async warmCacheForRole(roleKey: string): Promise<void> {
    try {
      const { taxonomy } = await import('@/config/taxonomy');
      const role = taxonomy.roles[roleKey];
      
      if (role?.quickDocs) {
        const slugs = Object.keys(role.quickDocs);
        await this.getBatch(slugs);
        console.log(`Warmed cache for role ${roleKey} with ${slugs.length} documents`);
      }
    } catch (error) {
      console.warn(`Failed to warm cache for role ${roleKey}:`, error);
    }
  }
}

// Singleton instance
export const metadataCache = new MetadataCache();

// Enhanced getDocMeta with caching
export async function getCachedDocMeta(slug: string) {
  return metadataCache.get(slug);
}

// Batch fetch with caching
export async function getCachedDocMetaBatch(slugs: string[]) {
  return metadataCache.getBatch(slugs);
}

export default metadataCache;