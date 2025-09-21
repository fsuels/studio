// Simplified vector search helper with in-memory caching. This keeps API routes
// compiling without Redis or external vector services.

import type { SearchResult } from '@/lib/vector-search/pinecone-service';
import { getAllDocuments } from '@/lib/document-library';
import { rankDocumentsSemantically } from '@/lib/search/semantic-search';
import { getDocumentTitle } from '@/lib/format-utils';
import type { LegalDocument } from '@/types/documents';

export interface VectorSearchFilters {
  category?: string[];
  jurisdiction?: string[];
  tags?: string[];
}

export interface VectorSearchOptions {
  topK?: number;
  minScore?: number;
  filters?: VectorSearchFilters;
  fetcher?: typeof globalThis.fetch;
  locale?: 'en' | 'es';
  /**
   * Optional query embedding provided by upstream callers. The current
   * implementation relies on semantic text search, but we keep this field so
   * future upgrades can blend true vector similarity without API changes.
   */
  queryEmbedding?: Float32Array;
}

export interface VectorSearchResult extends Pick<SearchResult, 'id' | 'score'> {
  metadata?: SearchResult['metadata'] & {
    title?: string;
    description?: string;
    category?: string;
    jurisdiction?: string;
    tags?: string[];
  };
  explanation?: string;
}

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const DEFAULT_TOP_K = 10;
const DEFAULT_LOCALE = 'en' as const;

const cache = new Map<string, { timestamp: number; results: VectorSearchResult[] }>();

function getCacheKey(query: string, options?: VectorSearchOptions): string {
  return JSON.stringify({
    query,
    topK: options?.topK ?? DEFAULT_TOP_K,
    minScore: options?.minScore ?? 0,
    filters: options?.filters ?? null,
    locale: options?.locale ?? DEFAULT_LOCALE,
  });
}

function readCache(key: string): VectorSearchResult[] | null {
  const entry = cache.get(key);
  if (!entry) {
    return null;
  }

  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }

  return entry.results.map((item) => ({ ...item }));
}

function writeCache(key: string, results: VectorSearchResult[]): void {
  cache.set(key, {
    timestamp: Date.now(),
    results: results.map((item) => ({ ...item })),
  });
}

function buildMockResult(query: string): VectorSearchResult[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return [];
  }

  return [
    {
      id: `mock_${normalized.replace(/\\s+/g, '_')}`,
      score: 0.92,
      metadata: {
        title: `Suggested document for "${query}"`,
        category: 'general',
        tags: ['mock', 'autocomplete'],
      },
      explanation: 'Stubbed response - replace with vector endpoint when available.',
    },
  ];
}

function filterDocuments(documents: LegalDocument[], filters?: VectorSearchFilters): LegalDocument[] {
  if (!filters) {
    return documents;
  }

  return documents.filter((doc) => {
    if (filters.category && filters.category.length > 0 && !filters.category.includes(doc.category)) {
      return false;
    }

    if (
      filters.jurisdiction &&
      filters.jurisdiction.length > 0 &&
      (!doc.jurisdiction || !filters.jurisdiction.includes(doc.jurisdiction))
    ) {
      return false;
    }

    if (filters.tags && filters.tags.length > 0) {
      const docTags = new Set(
        [
          ...(doc.keywords ?? []),
          ...(doc.translations?.en?.aliases ?? []),
          ...(doc.translations?.es?.aliases ?? []),
        ].map((tag) => tag.toLowerCase())
      );
      const hasTag = filters.tags.some((tag) => docTags.has(tag.toLowerCase()));
      if (!hasTag) {
        return false;
      }
    }

    return true;
  });
}

async function fetchLocalSemanticResults(
  query: string,
  options: VectorSearchOptions,
): Promise<VectorSearchResult[] | null> {
  const documents = await getAllDocuments();
  if (!documents || documents.length === 0) {
    return null;
  }

  const locale = options.locale ?? DEFAULT_LOCALE;
  const topK = options.topK ?? DEFAULT_TOP_K;
  const filteredDocuments = filterDocuments(documents, options.filters);
  if (filteredDocuments.length === 0) {
    return [];
  }

  const ranked = await rankDocumentsSemantically(query, {
    locale,
    documents: filteredDocuments,
    // Over-fetch a bit so we can apply filters and minScore without starving results.
    limit: Math.max(topK * 2, topK + 5),
  });

  if (!ranked.length) {
    return [];
  }

  const indexedDocs = new Map(filteredDocuments.map((doc) => [doc.id, doc] as const));
  const minScore = options.minScore ?? 0;

  const results: VectorSearchResult[] = [];
  for (const { docId, score } of ranked) {
    const doc = indexedDocs.get(docId);
    if (!doc) {
      continue;
    }

    if (score < minScore) {
      continue;
    }

    const translation = doc.translations?.[locale] ?? doc.translations?.en;
    results.push({
      id: doc.id,
      score,
      metadata: {
        title: getDocumentTitle(doc, locale),
        description: translation?.description ?? doc.description ?? '',
        category: doc.category,
        jurisdiction: doc.jurisdiction,
        tags: doc.keywords ?? [],
      },
      explanation: 'Local semantic relevance',
    });

    if (results.length >= topK) {
      break;
    }
  }

  return results;
}

async function fetchRemoteResults(
  query: string,
  options: VectorSearchOptions,
): Promise<VectorSearchResult[] | null> {
  const endpoint = process.env.VECTOR_SEARCH_ENDPOINT;
  if (!endpoint) {
    return null;
  }

  const fetcher = options.fetcher ?? globalThis.fetch;
  if (!fetcher) {
    return null;
  }

  try {
    const response = await fetcher(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        topK: options.topK ?? DEFAULT_TOP_K,
        minScore: options.minScore ?? 0,
        filters: options.filters ?? undefined,
        locale: options.locale ?? DEFAULT_LOCALE,
      }),
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as {
      results?: Array<{ id: string; score: number; metadata?: Record<string, unknown> }>;
    };

    return (data.results ?? []).map((item) => ({
      id: item.id,
      score: item.score,
      metadata: item.metadata ?? undefined,
    }));
  } catch (error) {
    console.warn('[vectorSearch] remote fetch failed', error);
    return null;
  }
}

export async function vectorSearch(
  query: string,
  options: VectorSearchOptions = {},
): Promise<VectorSearchResult[]> {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    return [];
  }

  const cacheKey = getCacheKey(trimmedQuery, options);
  const cached = readCache(cacheKey);
  if (cached) {
    return cached;
  }

  // Attempt remote endpoint first if configured.
  const remoteResults = await fetchRemoteResults(trimmedQuery, options);
  let results = remoteResults;

  if (!results || results.length === 0) {
    results = await fetchLocalSemanticResults(trimmedQuery, options);
  }

  if (!results || results.length === 0) {
    results = buildMockResult(trimmedQuery);
  }

  writeCache(cacheKey, results);
  return results;
}

export async function clearVectorSearchCache(): Promise<void> {
  cache.clear();
}

export async function getVectorSearchCacheStats(): Promise<{
  redis: { available: false; keyCount: number; memoryUsage?: string };
  fallback: { size: number; maxSize: number };
  ttl: number;
  timeout: number;
}> {
  return {
    redis: { available: false, keyCount: 0 },
    fallback: { size: cache.size, maxSize: Number.POSITIVE_INFINITY },
    ttl: CACHE_TTL_MS,
    timeout: 0,
  };
}

export async function disconnectVectorSearchCache(): Promise<void> {
  // No-op for the stub implementation.
}

export function createEmbedding(values: number[]): Float32Array {
  return new Float32Array(values);
}

export function normalizeVector(vector: Float32Array): Float32Array {
  const magnitude = Math.hypot(...vector);
  if (magnitude === 0) {
    throw new Error('Cannot normalize zero vector');
  }
  return new Float32Array(vector.map((value) => value / magnitude));
}

export default vectorSearch