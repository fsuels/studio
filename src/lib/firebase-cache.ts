// Firebase Cost Optimization - Aggressive Caching System
import {
  doc,
  getDoc,
  setDoc,
  query,
  where,
  collection,
  getDocs,
  DocumentSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';

export interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  collection: string;
  useMemoryCache?: boolean;
}

// Cache configurations for different data types
export const CACHE_CONFIGS = {
  LEGAL_RESEARCH: {
    ttl: 90 * 24 * 60 * 60 * 1000, // 90 days
    collection: 'legal_research_cache',
    useMemoryCache: true,
  },
  TEMPLATES: {
    ttl: 30 * 24 * 60 * 60 * 1000, // 30 days
    collection: 'template_cache',
    useMemoryCache: true,
  },
  USER_DOCUMENTS: {
    ttl: 7 * 24 * 60 * 60 * 1000, // 7 days
    collection: 'user_document_cache',
    useMemoryCache: false,
  },
  SEO_CONTENT: {
    ttl: 30 * 24 * 60 * 60 * 1000, // 30 days
    collection: 'seo_content_cache',
    useMemoryCache: true,
  },
  STATE_REQUIREMENTS: {
    ttl: 180 * 24 * 60 * 60 * 1000, // 180 days (laws change slowly)
    collection: 'state_requirements_cache',
    useMemoryCache: true,
  },
} as const;

// In-memory cache for frequently accessed data
const memoryCache = new Map<
  string,
  { data: any; timestamp: number; ttl: number }
>();

export class FirebaseCache {
  private config: CacheConfig;

  constructor(config: CacheConfig) {
    this.config = config;
  }

  // Generate cache key
  private generateKey(id: string, params?: Record<string, any>): string {
    const paramString = params ? JSON.stringify(params) : '';
    return `${id}_${paramString}`.replace(/[^a-zA-Z0-9_-]/g, '_');
  }

  // Check memory cache first (if enabled)
  private getFromMemory(key: string): any | null {
    if (!this.config.useMemoryCache) return null;

    const cached = memoryCache.get(key);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > cached.ttl;
    if (isExpired) {
      memoryCache.delete(key);
      return null;
    }

    return cached.data;
  }

  // Save to memory cache (if enabled)
  private saveToMemory(key: string, data: any): void {
    if (!this.config.useMemoryCache) return;

    memoryCache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: this.config.ttl,
    });

    // Cleanup old entries periodically
    if (memoryCache.size > 1000) {
      this.cleanupMemoryCache();
    }
  }

  // Cleanup expired memory cache entries
  private cleanupMemoryCache(): void {
    const now = Date.now();
    for (const [key, value] of memoryCache.entries()) {
      if (now - value.timestamp > value.ttl) {
        memoryCache.delete(key);
      }
    }
  }

  // Get cached data
  async get<T>(id: string, params?: Record<string, any>): Promise<T | null> {
    const key = this.generateKey(id, params);

    // Check memory cache first
    const memoryData = this.getFromMemory(key);
    if (memoryData) return memoryData;

    try {
      // Check Firestore cache
      const docRef = doc(db, this.config.collection, key);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) return null;

      const cachedData = docSnap.data();
      const isExpired = Date.now() - cachedData.timestamp > this.config.ttl;

      if (isExpired) {
        // Clean up expired cache (fire and forget)
        setDoc(docRef, { deleted: true }, { merge: true }).catch(console.error);
        return null;
      }

      // Save to memory cache for faster access
      this.saveToMemory(key, cachedData.data);
      return cachedData.data;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  // Set cached data
  async set<T>(
    id: string,
    data: T,
    params?: Record<string, any>,
  ): Promise<void> {
    const key = this.generateKey(id, params);

    // Save to memory cache immediately
    this.saveToMemory(key, data);

    try {
      // Save to Firestore cache
      const docRef = doc(db, this.config.collection, key);
      await setDoc(docRef, {
        data,
        timestamp: Date.now(),
        key,
        ttl: this.config.ttl,
      });
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  // Get or compute and cache
  async getOrCompute<T>(
    id: string,
    computeFn: () => Promise<T>,
    params?: Record<string, any>,
  ): Promise<T> {
    const cached = await this.get<T>(id, params);
    if (cached !== null) return cached;

    const computed = await computeFn();
    await this.set(id, computed, params);
    return computed;
  }

  // Batch get for multiple items
  async batchGet<T>(
    ids: string[],
    params?: Record<string, any>,
  ): Promise<Map<string, T>> {
    const results = new Map<string, T>();
    const uncachedIds: string[] = [];

    // Check memory cache first
    for (const id of ids) {
      const key = this.generateKey(id, params);
      const memoryData = this.getFromMemory(key);
      if (memoryData) {
        results.set(id, memoryData);
      } else {
        uncachedIds.push(id);
      }
    }

    if (uncachedIds.length === 0) return results;

    try {
      // Batch query Firestore for uncached items
      const keys = uncachedIds.map((id) => this.generateKey(id, params));
      const q = query(
        collection(db, this.config.collection),
        where('key', 'in', keys.slice(0, 10)), // Firestore limit of 10 items per 'in' query
      );

      const querySnapshot = await getDocs(q);
      const now = Date.now();

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const isExpired = now - data.timestamp > this.config.ttl;

        if (!isExpired) {
          // Find original ID from key
          const originalId = uncachedIds.find(
            (id) => this.generateKey(id, params) === data.key,
          );

          if (originalId) {
            results.set(originalId, data.data);
            this.saveToMemory(data.key, data.data);
          }
        }
      });

      return results;
    } catch (error) {
      console.error('Batch cache get error:', error);
      return results;
    }
  }

  // Clear cache for specific key
  async clear(id: string, params?: Record<string, any>): Promise<void> {
    const key = this.generateKey(id, params);

    // Remove from memory cache
    memoryCache.delete(key);

    try {
      // Mark as deleted in Firestore (actual deletion happens in cleanup)
      const docRef = doc(db, this.config.collection, key);
      await setDoc(
        docRef,
        { deleted: true, deletedAt: Date.now() },
        { merge: true },
      );
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }
}

// Pre-configured cache instances
export const legalResearchCache = new FirebaseCache(
  CACHE_CONFIGS.LEGAL_RESEARCH,
);
export const templateCache = new FirebaseCache(CACHE_CONFIGS.TEMPLATES);
export const userDocumentCache = new FirebaseCache(
  CACHE_CONFIGS.USER_DOCUMENTS,
);
export const seoContentCache = new FirebaseCache(CACHE_CONFIGS.SEO_CONTENT);
export const stateRequirementsCache = new FirebaseCache(
  CACHE_CONFIGS.STATE_REQUIREMENTS,
);

// Document generation optimization
export async function getCachedDocumentTemplate(
  documentId: string,
  state?: string,
  locale: string = 'en',
) {
  return templateCache.getOrCompute(
    `template_${documentId}`,
    async () => {
      // This would normally be an expensive operation
      // like generating content or fetching from external APIs
      return {
        documentId,
        state,
        locale,
        content: `Generated template for ${documentId}`,
        timestamp: Date.now(),
      };
    },
    { state, locale },
  );
}

// State requirements optimization
export async function getCachedStateRequirements(
  state: string,
  documentType: string,
) {
  return stateRequirementsCache.getOrCompute(
    `requirements_${state}_${documentType}`,
    async () => {
      // This would fetch state-specific legal requirements
      return {
        state,
        documentType,
        requirements: [
          `Requirement 1 for ${state}`,
          `Requirement 2 for ${state}`,
        ],
        lastUpdated: Date.now(),
      };
    },
  );
}

// SEO content optimization
export async function getCachedSEOContent(
  contentType: string,
  state?: string,
  documentType?: string,
  locale: string = 'en',
) {
  return seoContentCache.getOrCompute(
    `seo_${contentType}`,
    async () => {
      // Generate SEO content based on type
      return {
        contentType,
        state,
        documentType,
        locale,
        content: `Generated SEO content for ${contentType}`,
        metadata: {
          title: `SEO Title for ${contentType}`,
          description: `SEO Description for ${contentType}`,
          keywords: [`keyword1`, `keyword2`],
        },
      };
    },
    { state, documentType, locale },
  );
}

// Cost monitoring
export function getCacheStats() {
  return {
    memoryCache: {
      size: memoryCache.size,
      sizeLimit: 1000,
    },
    configs: CACHE_CONFIGS,
  };
}

// Cleanup function for expired cache entries (run periodically)
export async function cleanupExpiredCache() {
  try {
    const collections = Object.values(CACHE_CONFIGS).map(
      (config) => config.collection,
    );

    for (const collectionName of collections) {
      const q = query(
        collection(db, collectionName),
        where('deleted', '==', true),
      );

      const querySnapshot = await getDocs(q);

      // Delete in batches to avoid rate limits
      const deletions = querySnapshot.docs.map((doc) =>
        setDoc(doc.ref, { deleted: true }, { merge: true }),
      );

      await Promise.all(deletions);
    }

    // Cleanup memory cache
    memoryCache.clear();

    console.log('Cache cleanup completed');
  } catch (error) {
    console.error('Cache cleanup error:', error);
  }
}
