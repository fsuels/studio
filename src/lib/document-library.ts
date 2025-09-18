// src/lib/document-library.ts - Updated to use dynamic loading system
import { z } from 'zod';
import type { LegalDocument, LocalizedText } from '@/types/documents';
import { preprocessQuery } from './search/comprehensive-synonym-map';
import {
  getAllDocumentMetadata,
  searchDocumentMetadata,
  getDocumentsByCategory,
  getManifestEntries,
  type DocumentMetadata
} from './document-metadata-registry';
import { loadDocument, loadDocuments } from './dynamic-document-loader';
import type { DocumentManifestEntry } from './documents/manifest.generated';

const manifestEntries = getManifestEntries();

const defaultSchema = z
  .object({
    _fallbackDetails: z
      .string()
      .optional()
      .describe('Fallback field for missing schemas'),
  })
  .describe('Manifest-derived placeholder schema');

const normalizeCountryCode = (jurisdiction?: string): string => {
  if (!jurisdiction) {
    return 'us';
  }

  const [country] = jurisdiction.split('/');
  return (country || 'us').toLowerCase();
};

const createBaseDocumentFromManifest = (
  entry: DocumentManifestEntry,
): LegalDocument => {
  const { meta } = entry;
  const enTranslation = meta.translations?.en ?? {
    name: meta.title || entry.id,
    description: meta.description || '',
    aliases: meta.aliases || [],
  };

  const esTranslation = meta.translations?.es ?? {
    name: enTranslation.name,
    description: enTranslation.description,
    aliases: enTranslation.aliases,
  };

  const enName = enTranslation.name || meta.title || entry.id;
  const enDescription = enTranslation.description || meta.description || '';
  const enAliases = enTranslation.aliases?.length
    ? enTranslation.aliases
    : meta.aliases || [];

  const esName = esTranslation.name || enName;
  const esDescription = esTranslation.description || enDescription;
  const esAliases = esTranslation.aliases?.length
    ? esTranslation.aliases
    : enAliases;

  const languageSupport = new Set<string>();
  languageSupport.add('en');
  if (esName || esDescription || esAliases.length) {
    languageSupport.add('es');
  }

  const document: LegalDocument = {
    id: entry.id,
    jurisdiction: meta.jurisdiction,
    category: meta.category || 'General',
    states:
      meta.states && meta.states.length ? [...meta.states] : undefined,
    schema: defaultSchema,
    questions: [],
    name: enName,
    description: enDescription,
    translations: {
      en: {
        name: enName,
        description: enDescription,
        aliases: [...enAliases],
      },
      es: {
        name: esName,
        description: esDescription,
        aliases: [...esAliases],
      },
    },
    aliases: enAliases.length ? [...enAliases] : undefined,
    aliases_es: esAliases.length ? [...esAliases] : undefined,
    languageSupport: Array.from(languageSupport),
    keywords: meta.tags?.length ? [...meta.tags] : undefined,
    searchTerms: meta.aliases?.length ? [...meta.aliases] : undefined,
    basePrice: 0,
    requiresNotarization: meta.requiresNotary ?? false,
    canBeRecorded: false,
    offerNotarization: meta.requiresNotary ?? false,
    offerRecordingHelp: false,
  };

  enrichDocument(document);
  return document;
};

const sortDocuments = (docs: LegalDocument[]): LegalDocument[] =>
  [...docs].sort((a, b) => {
    const nameA =
      a.translations?.en?.name || a.translations?.es?.name || a.name || a.id;
    const nameB =
      b.translations?.en?.name || b.translations?.es?.name || b.name || b.id;

    return nameA.localeCompare(nameB);
  });

const baseDocumentsByCountry: Record<string, LegalDocument[]> = {};

manifestEntries.forEach((entry) => {
  const countryCode = normalizeCountryCode(entry.meta.jurisdiction);
  const baseDoc = createBaseDocumentFromManifest(entry);

  if (!baseDocumentsByCountry[countryCode]) {
    baseDocumentsByCountry[countryCode] = [];
  }

  baseDocumentsByCountry[countryCode].push(baseDoc);
});

baseDocumentsByCountry['us'] = baseDocumentsByCountry['us'] || [];

const filterDocumentIdsByCountry = (countryCode: string): string[] => {
  const normalizedCountry = countryCode.toLowerCase();

  return manifestEntries
    .filter(
      (entry) => normalizeCountryCode(entry.meta.jurisdiction) === normalizedCountry,
    )
    .map((entry) => entry.id);
};

// Fast document loading using metadata-first approach
const loadDocumentsForCountry = async (
  countryCode: string,
): Promise<LegalDocument[]> => {
  const normalized = countryCode.toLowerCase();
  const baseDocuments = baseDocumentsByCountry[normalized] || [];
  const documentIds = filterDocumentIdsByCountry(normalized);

  if (documentIds.length === 0) {
    return sortDocuments(baseDocuments);
  }

  const results = await loadDocuments(documentIds);
  const docsById = new Map<string, LegalDocument>();

  baseDocuments.forEach((doc) => {
    docsById.set(doc.id, doc);
  });

  for (const [docId, result] of results) {
    if (result.document) {
      const loadedDoc = result.document;
      enrichDocument(loadedDoc);
      docsById.set(docId, loadedDoc);
    }
  }

  return sortDocuments(Array.from(docsById.values()));
};

export const documentLibraryByCountry: Record<string, LegalDocument[]> = Object.fromEntries(
  Object.entries(baseDocumentsByCountry).map(([countryCode, docs]) => [
    countryCode,
    sortDocuments(docs),
  ]),
);

// Cache for loaded documents to avoid repeated imports
const cachedDocumentsByCountry: Record<string, LegalDocument[] | undefined> = {};
let cachedAllDocuments: LegalDocument[] | null = null;
export let allDocuments: LegalDocument[] = Object.values(
  documentLibraryByCountry,
).flat();

// Dynamic document library loader
export const getDocumentsByCountry = async (
  country: string,
): Promise<LegalDocument[]> => {
  const normalized = country.toLowerCase();

  if (!cachedDocumentsByCountry[normalized]) {
    const docs = await loadDocumentsForCountry(normalized);
    cachedDocumentsByCountry[normalized] = docs;
    documentLibraryByCountry[normalized] = docs;
    allDocuments = Object.values(documentLibraryByCountry).flat();
    cachedAllDocuments = null;
  }

  return (
    cachedDocumentsByCountry[normalized] ||
    documentLibraryByCountry[normalized] ||
    []
  );
};

export function getDocumentsForCountry(countryCode?: string): LegalDocument[] {
  const code = (countryCode || 'us').toLowerCase();
  return documentLibraryByCountry[code] || documentLibraryByCountry['us'];
}

export const supportedCountries = Object.keys(documentLibraryByCountry).sort();

export const getAllDocuments = async (): Promise<LegalDocument[]> => {
  if (cachedAllDocuments) {
    return cachedAllDocuments;
  }

  const countryDocuments = await Promise.all(
    supportedCountries.map((countryCode) => getDocumentsByCountry(countryCode)),
  );

  cachedAllDocuments = countryDocuments.flat();

  return cachedAllDocuments;
};

// Backwards compatibility - synchronous version that returns known documents
export function findMatchingDocumentsSync(
  query: string,
  lang: 'en' | 'es',
  state?: string,
): LegalDocument[] {
  // Return the cached manifest-backed documents for synchronous access
  return Object.values(documentLibraryByCountry)
    .flat()
    .filter((d) => d.id !== 'general-inquiry');
}

export function generateIdFromName(name: string): string {
  if (!name || typeof name !== 'string') return `doc-${Date.now()}`;
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

// Function to enrich documents - called dynamically when documents are loaded
function enrichDocument(doc: LegalDocument): void {
  // 1) Ensure an ID
  if (!doc.id) {
    if (doc.name) {
      doc.id = generateIdFromName(doc.name);
    } else if (doc.translations?.en?.name) {
      doc.id = generateIdFromName(doc.translations.en.name);
    } else {
      doc.id = `unknown-doc-${Math.random().toString(36).slice(2, 9)}`;
    }
  }

  // 2) Default schema
  if (!doc.schema) {
    console.warn(
      `Document ${doc.id} is missing a schema. Applying default schema.`,
    );
    doc.schema = defaultSchema;
  }

  // 3) Ensure a questions array
  if (!Array.isArray(doc.questions)) {
    doc.questions = [];
  }

  // 4) Normalize translations
  const base = doc.translations || {};
  doc.translations = {
    en: {
      name: base.en?.name || doc.name || doc.id,
      description: base.en?.description || doc.description || '',
      aliases: base.en?.aliases || doc.aliases || [],
    },
    es: {
      name: base.es?.name || base.en?.name || doc.name || doc.id,
      description:
        base.es?.description || base.en?.description || doc.description || '',
      aliases: base.es?.aliases || base.en?.aliases || doc.aliases || [],
    },
  };
}

/**
 * Intelligent search with comprehensive keyword matching, synonyms, and ranking.
 */
export async function findMatchingDocuments(
  query: string,
  lang: 'en' | 'es',
  state?: string,
): Promise<LegalDocument[]> {
  const allDocuments = await getAllDocuments();

  if (!query && !state) {
    return allDocuments.filter((d) => d.id !== 'general-inquiry');
  }

  const originalTokens = query.toLowerCase().split(/\s+/).filter(t => t.length > 1);
  const expandedTokens = preprocessQuery(query, lang);

  const results: Array<{ document: LegalDocument; score: number }> = [];

  allDocuments.forEach((d) => {
    if (d.id === 'general-inquiry') return;

    const t = d.translations?.[lang] || d.translations?.en;
    if (!t) return;

    // Collect all searchable text
    const searchableFields = [
      t.name?.toLowerCase() || '',
      t.description?.toLowerCase() || '',
      ...(t.aliases || []).map(a => a.toLowerCase()),
      ...(d.keywords || []).map(k => k.toLowerCase()),
      ...(lang === 'es' ? (d.keywords_es || []) : []).map(k => k.toLowerCase()),
      ...(d.searchTerms || []).map(s => s.toLowerCase()),
      d.category.toLowerCase(),
      d.id.toLowerCase().replace(/-/g, ' ')
    ].filter(Boolean);

    // Check state filter
    const matchesState =
      !state ||
      state === 'all' ||
      d.states === 'all' ||
      (Array.isArray(d.states) && d.states.includes(state));

    if (!matchesState) return;

    // Calculate relevance score
    let score = 0;
    let hasMatch = false;

    // Exact phrase match (highest priority)
    const fullQuery = query.toLowerCase();
    if (searchableFields.some(field => field.includes(fullQuery))) {
      score += 50;
      hasMatch = true;
    }

    // Original token matches (high priority)
    originalTokens.forEach(token => {
      if (searchableFields.some(field => field.includes(token))) {
        score += 10;
        hasMatch = true;
      }
    });

    // Expanded synonym matches (medium priority)
    expandedTokens.forEach(token => {
      if (searchableFields.some(field => field.includes(token))) {
        score += 3;
        hasMatch = true;
      }
    });

    // Partial word matches (low priority)
    expandedTokens.forEach(token => {
      searchableFields.forEach(field => {
        const words = field.split(/\s+/);
        words.forEach(word => {
          if (word.startsWith(token) || word.endsWith(token)) {
            score += 1;
            hasMatch = true;
          }
        });
      });
    });

    // Boost score for category matches
    if (d.category.toLowerCase().includes(fullQuery)) {
      score += 20;
    }

    // Boost for exact ID matches
    if (d.id.toLowerCase().replace(/-/g, ' ').includes(fullQuery)) {
      score += 15;
    }

    if (hasMatch && score > 0) {
      results.push({ document: d, score });
    }
  });

  // Sort by relevance score (descending)
  results.sort((a, b) => b.score - a.score);
  
  return results.map(r => r.document);
}

export async function search(
  query: string,
  lang: 'en' | 'es',
  state?: string,
): Promise<LegalDocument[]> {
  return findMatchingDocuments(query, lang, state);
}

// Fast metadata-based search (doesn't load full documents)
export function searchMetadata(
  query: string,
  lang: 'en' | 'es' = 'en'
): DocumentMetadata[] {
  return searchDocumentMetadata(query, lang);
}

// Load documents from metadata search results
export async function searchAndLoadDocuments(
  query: string,
  lang: 'en' | 'es' = 'en',
  maxResults: number = 10
): Promise<LegalDocument[]> {
  const metadataResults = searchMetadata(query, lang).slice(0, maxResults);
  const docIds = metadataResults.map(meta => meta.id);

  const loadResults = await loadDocuments(docIds);
  const documents: LegalDocument[] = [];

  for (const [docId, result] of loadResults) {
    if (result.document) {
      documents.push(result.document);
    }
  }

  return documents;
}

// Backwards compatible synchronous search
export function searchSync(
  query: string,
  lang: 'en' | 'es',
  state?: string,
): LegalDocument[] {
  return findMatchingDocumentsSync(query, lang, state);
}

// Category-based document loading
export async function loadDocumentsByCategory(category: string): Promise<LegalDocument[]> {
  const metadata = getDocumentsByCategory(category);
  const docIds = metadata.map(meta => meta.id);

  const loadResults = await loadDocuments(docIds);
  const documents: LegalDocument[] = [];

  for (const [docId, result] of loadResults) {
    if (result.document) {
      documents.push(result.document);
    }
  }

  return documents;
}

// Jurisdiction-based document loading
export async function getDocumentsByJurisdiction(jurisdiction: string): Promise<LegalDocument[]> {
  const metadata = getAllDocumentMetadata().filter(doc => doc.jurisdiction === jurisdiction);
  const docIds = metadata.map(meta => meta.id);

  const loadResults = await loadDocuments(docIds);
  const documents: LegalDocument[] = [];

  for (const [docId, result] of loadResults) {
    if (result.document) {
      documents.push(result.document);
    }
  }

  return documents;
}

// Async version of document library
export const getDocumentLibrary = async (): Promise<LegalDocument[]> => {
  return getDocumentsByCountry('us');
};

// Export new functionality
export {
  getAllDocumentMetadata,
  getDocumentMetadata,
  searchDocumentMetadata,
  loadDocument,
  loadDocuments,
  preloadCommonDocuments
} from './dynamic-document-loader';

export {
  getAllDocumentMetadata as getDocumentMetadataRegistry,
  type DocumentMetadata
} from './document-metadata-registry';

export type { LegalDocument, LocalizedText };
export { usStates } from './usStates';
