// src/lib/document-library.ts
import { z } from 'zod';
import { documentLibraryAdditions } from './document-library-additions';
import type { LegalDocument, LocalizedText } from '@/types/documents';
import * as us_docs_barrel from './documents/us';
import * as ca_docs_barrel from './documents/ca';
import { preprocessQuery, calculateRelevanceScore } from './search/comprehensive-synonym-map';
// …other countries…

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

const usDocsArray: LegalDocument[] =
  Object.values(us_docs_barrel).filter(isValidDocument);
const caDocsArray: LegalDocument[] =
  Object.values(ca_docs_barrel).filter(isValidDocument);
const additionsArray: LegalDocument[] =
  documentLibraryAdditions.filter(isValidDocument);

export const documentLibraryByCountry: Record<string, LegalDocument[]> = {
  us: usDocsArray,
  ca: caDocsArray,
  // …other country arrays…
};

export function getDocumentsForCountry(countryCode?: string): LegalDocument[] {
  const code = (countryCode || 'us').toLowerCase();
  return documentLibraryByCountry[code] || documentLibraryByCountry['us'];
}

export const supportedCountries = Object.keys(documentLibraryByCountry);

export const allDocuments: LegalDocument[] = [
  ...Object.values(documentLibraryByCountry).flat(),
  ...additionsArray,
];

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

// Enrich every document with id/schema/questions/translations
allDocuments.forEach((doc) => {
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
});

/**
 * Intelligent search with comprehensive keyword matching, synonyms, and ranking.
 */
export function findMatchingDocuments(
  query: string,
  lang: 'en' | 'es',
  state?: string,
): LegalDocument[] {
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

export function search(
  query: string,
  lang: 'en' | 'es',
  state?: string,
): LegalDocument[] {
  return findMatchingDocuments(query, lang, state);
}

const defaultDocumentLibrary = getDocumentsForCountry('us');
export default defaultDocumentLibrary;
export { defaultDocumentLibrary as documentLibrary };
export type { LegalDocument, LocalizedText };
export { usStates } from './usStates';
