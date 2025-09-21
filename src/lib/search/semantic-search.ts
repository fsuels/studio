import type { LegalDocument } from '@/types/documents';

type Locale = 'en' | 'es';

interface SemanticIndex {
  locale: Locale;
  docIds: string[];
  embeddings: Float32Array[];
  embeddingSize: number;
  builtAt: number;
}

interface SemanticCache {
  embedderPromise: Promise<EmbeddingPipeline | null> | null;
  indices: Partial<Record<Locale, Promise<SemanticIndex>>>;
  signatures: Partial<Record<Locale, string>>;
}

type EmbeddingPipeline = (
  inputs: string | string[],
  options?: { pooling?: 'mean'; normalize?: boolean }
) => Promise<{ data: Float32Array; dims: number[] }>;

const GLOBAL_KEY = '__123LEGaldoc__semantic_index__';

function getCache(): SemanticCache {
  const globalScope = globalThis as unknown as Record<string, SemanticCache | undefined>;
  if (!globalScope[GLOBAL_KEY]) {
    globalScope[GLOBAL_KEY] = {
      embedderPromise: null,
      indices: {},
      signatures: {},
    } satisfies SemanticCache;
  }
  return globalScope[GLOBAL_KEY] as SemanticCache;
}

async function loadEmbedder(): Promise<EmbeddingPipeline | null> {
  const cache = getCache();
  if (!cache.embedderPromise) {
    cache.embedderPromise = (async () => {
      try {
        const transformers = await import('@xenova/transformers');
        const { pipeline, env } = transformers;

        // Prefer CDN-hosted WASM assets for browsers; fallback handled internally.
        if (typeof window !== 'undefined') {
          env.allowLocalModels = false;
        }

        const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
          quantized: true,
        });

        return embedder as EmbeddingPipeline;
      } catch (error) {
        console.error('[SemanticSearch] Failed to load embedding model:', error);
        return null;
      }
    })();
  }

  return cache.embedderPromise;
}

function buildDocumentText(doc: LegalDocument, locale: Locale): string {
  const translation = doc.translations?.[locale] ?? doc.translations?.en;
  const parts: string[] = [];

  if (translation?.name) parts.push(translation.name);
  if (translation?.description) parts.push(translation.description);
  if (translation?.aliases?.length) parts.push(translation.aliases.join(' '));
  if (doc.keywords?.length) parts.push(doc.keywords.join(' '));
  if (locale === 'es' && Array.isArray((doc as unknown as { keywords_es?: string[] }).keywords_es)) {
    const esKeywords = (doc as unknown as { keywords_es?: string[] }).keywords_es;
    if (esKeywords?.length) parts.push(esKeywords.join(' '));
  }
  if (doc.category) parts.push(doc.category);
  parts.push(doc.id.replace(/-/g, ' '));

  return parts.join(' \u2022 ');
}

function computeSignature(documents: LegalDocument[]): string {
  return documents.map((doc) => doc.id).join('|');
}

async function buildSemanticIndex(
  locale: Locale,
  documents: LegalDocument[],
): Promise<SemanticIndex> {
  const embedder = await loadEmbedder();
  if (!embedder) {
    throw new Error('Embedding pipeline unavailable');
  }

  const texts = documents.map((doc) => buildDocumentText(doc, locale));
  const embeddings: Float32Array[] = [];
  let embeddingSize = 0;

  const batchSize = 12;
  for (let start = 0; start < texts.length; start += batchSize) {
    const batch = texts.slice(start, start + batchSize);
    const output = await embedder(batch, { pooling: 'mean', normalize: true });
    const { data, dims } = output;
    embeddingSize = dims[dims.length - 1] ?? 0;

    for (let i = 0; i < batch.length; i++) {
      const offset = i * embeddingSize;
      const vector = data.slice(offset, offset + embeddingSize);
      embeddings.push(new Float32Array(vector));
    }
  }

  return {
    locale,
    docIds: documents.map((doc) => doc.id),
    embeddings,
    embeddingSize,
    builtAt: Date.now(),
  };
}

async function ensureIndex(locale: Locale, documents: LegalDocument[]): Promise<SemanticIndex> {
  const cache = getCache();
  const signature = computeSignature(documents);

  if (!cache.indices[locale] || cache.signatures[locale] !== signature) {
    cache.signatures[locale] = signature;
    cache.indices[locale] = buildSemanticIndex(locale, documents);
  }

  return cache.indices[locale] as Promise<SemanticIndex>;
}

function dotProduct(a: Float32Array, b: Float32Array): number {
  const length = Math.min(a.length, b.length);
  let sum = 0;
  for (let i = 0; i < length; i++) {
    sum += a[i] * b[i];
  }
  return sum;
}

function clampScore(score: number): number {
  if (!Number.isFinite(score)) return 0;
  if (score < -1) return -1;
  if (score > 1) return 1;
  return score;
}

export interface SemanticRankingOptions {
  locale: Locale;
  documents: LegalDocument[];
  limit?: number;
}

export interface SemanticRankingResult {
  docId: string;
  score: number;
}

export async function rankDocumentsSemantically(
  query: string,
  { locale, documents, limit = 75 }: SemanticRankingOptions,
): Promise<SemanticRankingResult[]> {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  try {
    const [embedder, index] = await Promise.all([
      loadEmbedder(),
      ensureIndex(locale, documents),
    ]);

    if (!embedder) {
      return [];
    }

    const output = await embedder(trimmed, { pooling: 'mean', normalize: true });
    const queryEmbedding = new Float32Array(output.data);

    const scored: SemanticRankingResult[] = [];
    for (let i = 0; i < index.docIds.length; i++) {
      const docId = index.docIds[i];
      const embedding = index.embeddings[i];
      const score = clampScore(dotProduct(queryEmbedding, embedding));
      if (score > 0.05) {
        scored.push({ docId, score });
      }
    }

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit);
  } catch (error) {
    console.error('[SemanticSearch] ranking failed:', error);
    return [];
  }
}
