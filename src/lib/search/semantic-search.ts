import MiniSearch from 'minisearch';
import type { LegalDocument } from '@/types/documents';

type Locale = 'en' | 'es';

interface SemanticIndexEntry {
  id: string;
  name: string;
  description: string;
  aliases: string[];
  keywords: string[];
  category: string;
}

interface SemanticIndex {
  locale: Locale;
  searcher: MiniSearch<SemanticIndexEntry>;
  builtAt: number;
  signature: string;
}

interface SemanticRankingOptions {
  locale: Locale;
  documents: LegalDocument[];
  limit?: number;
}

export interface SemanticRankingResult {
  docId: string;
  score: number;
}

const GLOBAL_CACHE_KEY = '__123legaldoc_semantic_index__';

function getCache(): Map<Locale, SemanticIndex> {
  const globalScope = globalThis as Record<string, unknown>;
  if (!globalScope[GLOBAL_CACHE_KEY]) {
    globalScope[GLOBAL_CACHE_KEY] = new Map<Locale, SemanticIndex>();
  }
  return globalScope[GLOBAL_CACHE_KEY] as Map<Locale, SemanticIndex>;
}

function buildIndexEntry(doc: LegalDocument, locale: Locale): SemanticIndexEntry {
  const translation = doc.translations?.[locale] || doc.translations?.en;

  const aliases = translation?.aliases?.map((alias) => alias.toLowerCase()) ?? [];
  const keywords = (
    locale === 'es'
      ? ((doc as unknown as { keywords_es?: string[] }).keywords_es ?? doc.keywords)
      : doc.keywords
  )?.map((kw) => kw.toLowerCase()) ?? [];

  return {
    id: doc.id,
    name: (translation?.name || doc.name || doc.id).toLowerCase(),
    description: (translation?.description || doc.description || '').toLowerCase(),
    aliases,
    keywords,
    category: doc.category.toLowerCase(),
  };
}

function computeSignature(documents: LegalDocument[]): string {
  return documents.map((doc) => doc.id).sort().join('|');
}

function createMiniSearch(): MiniSearch<SemanticIndexEntry> {
  return new MiniSearch<SemanticIndexEntry>({
    idField: 'id',
    fields: ['name', 'description', 'aliases', 'keywords', 'category'],
    storeFields: ['id'],
    searchOptions: {
      boost: { name: 4, description: 2, aliases: 3, keywords: 3, category: 1 },
      prefix: true,
      fuzzy: 0.2,
      combineWith: 'and',
      processTerm: (term) => (term.length <= 1 ? null : term.toLowerCase()),
    },
  });
}

function ensureIndex(locale: Locale, documents: LegalDocument[]): SemanticIndex {
  const cache = getCache();
  const signature = computeSignature(documents);
  const cached = cache.get(locale);
  if (cached && cached.signature === signature) {
    return cached;
  }

  const searcher = createMiniSearch();
  const entries = documents.map((doc) => buildIndexEntry(doc, locale));
  searcher.addAll(entries);

  const index: SemanticIndex = {
    locale,
    searcher,
    builtAt: Date.now(),
    signature,
  };

  cache.set(locale, index);
  return index;
}

export async function rankDocumentsSemantically(
  query: string,
  options: SemanticRankingOptions,
): Promise<SemanticRankingResult[]> {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) {
    return [];
  }

  try {
    const { locale, documents, limit = 75 } = options;
    const index = ensureIndex(locale, documents);

    const searchResults = index.searcher.search(trimmed, {
      prefix: true,
      fuzzy: 0.2,
      combineWith: 'and',
    });

    return searchResults
      .slice(0, limit)
      .map((result) => ({ docId: result.id, score: result.score ?? 0 }));
  } catch (error) {
    console.error('[SemanticSearch] MiniSearch ranking failed:', error);
    return [];
  }
}
