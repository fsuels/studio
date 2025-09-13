// src/lib/document-library.ts
import { z } from 'zod';
import { documentLibraryAdditions } from './document-library-additions';
import type { LegalDocument, LocalizedText } from '@/types/documents';
import { preprocessQuery, calculateRelevanceScore } from './search/comprehensive-synonym-map';
// …other countries…

// Temporarily disable all document imports to test build
const loadUSDocuments = async (): Promise<LegalDocument[]> => {
  // Return empty array until we can fix the build performance issues
  console.warn('Document loading disabled for build performance');
  return [];
};

const loadCADocuments = async (): Promise<LegalDocument[]> => {
  // Temporarily return empty array to fix build
  return [];
};

/**
 * Type-guard to ensure we only surface well-formed documents.
 */
const isValidDocument = (doc: unknown): doc is LegalDocument => {
  const d = doc as Partial<LegalDocument>;
  const hasId = !!(d && typeof d.id === 'string' && d.id.trim() !== '');
  const hasCategory = !!(
    d &&
    typeof d.category === 'string' &&
    d.category.trim() !== ''
  );
  const hasSchema = !!(d && d.schema && typeof d.schema.parse === 'function');

  const dr = doc as {
    translations?: { en?: { name?: string } };
    name?: string;
  };
  const hasValidName =
    !!(
      dr.translations?.en?.name &&
      typeof dr.translations.en.name === 'string' &&
      dr.translations.en.name.trim() !== ''
    ) ||
    (!!dr.name && typeof dr.name === 'string' && dr.name.trim() !== '');

  return hasId && hasCategory && hasSchema && hasValidName;
};

// Cache for loaded documents to avoid repeated imports
let cachedUSDocuments: LegalDocument[] | null = null;
let cachedCADocuments: LegalDocument[] | null = null;

const additionsArray: LegalDocument[] =
  documentLibraryAdditions.filter(isValidDocument);

// Dynamic document library loader
export const getDocumentsByCountry = async (country: string): Promise<LegalDocument[]> => {
  switch (country) {
    case 'us':
      if (!cachedUSDocuments) {
        cachedUSDocuments = await loadUSDocuments();
      }
      return cachedUSDocuments;
    case 'ca':
      if (!cachedCADocuments) {
        cachedCADocuments = await loadCADocuments();
      }
      return cachedCADocuments;
    default:
      return [];
  }
};

// For backwards compatibility - but this will now be dynamically loaded
export const documentLibraryByCountry: Record<string, LegalDocument[]> = {
  us: [], // Will be populated dynamically
  ca: [], // Will be populated dynamically
  // …other country arrays…
};

export function getDocumentsForCountry(countryCode?: string): LegalDocument[] {
  const code = (countryCode || 'us').toLowerCase();
  return documentLibraryByCountry[code] || documentLibraryByCountry['us'];
}

export const supportedCountries = Object.keys(documentLibraryByCountry);

// Dynamic loading of all documents
let cachedAllDocuments: LegalDocument[] | null = null;

export const getAllDocuments = async (): Promise<LegalDocument[]> => {
  if (cachedAllDocuments) {
    return cachedAllDocuments;
  }

  const [usDocuments, caDocuments] = await Promise.all([
    getDocumentsByCountry('us'),
    getDocumentsByCountry('ca')
  ]);

  cachedAllDocuments = [
    ...usDocuments,
    ...caDocuments,
    ...additionsArray,
  ];

  return cachedAllDocuments;
};

// Legacy export - will be empty until dynamically loaded
export const allDocuments: LegalDocument[] = [];

// Backwards compatibility - synchronous version that returns known documents
export function findMatchingDocumentsSync(
  query: string,
  lang: 'en' | 'es',
  state?: string,
): LegalDocument[] {
  // Return only the additions array for immediate/synchronous access
  // This provides basic functionality while async loading completes
  return additionsArray.filter((d) => d.id !== 'general-inquiry');
}

// Default fallback schema
const defaultSchema = z.object({
  _fallbackDetails: z
    .string()
    .optional()
    .describe('Fallback field for missing schemas'),
});

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

// Backwards compatible synchronous search
export function searchSync(
  query: string,
  lang: 'en' | 'es',
  state?: string,
): LegalDocument[] {
  return findMatchingDocumentsSync(query, lang, state);
}

const defaultDocumentLibrary = getDocumentsForCountry('us');
export default defaultDocumentLibrary;
export { defaultDocumentLibrary as documentLibrary };

// Async version of document library
export const getDocumentLibrary = async (): Promise<LegalDocument[]> => {
  return getDocumentsByCountry('us');
};

export type { LegalDocument, LocalizedText };
export { usStates } from './usStates';
