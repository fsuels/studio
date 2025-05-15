// src/lib/document-library.ts
import { z } from 'zod'; // Ensure z is imported
import { documentLibraryAdditions } from './document-library-additions';
import type { LegalDocument } from '@/types/documents';
import * as us_docs_barrel from './documents/us';
import * as ca_docs_barrel from './documents/ca';
// …other countries…

const isValidDocument = (doc: any): doc is LegalDocument => {
  return doc && typeof doc === 'object' && 'id' in doc && 'name' in doc && 'category' in doc && 'schema' in doc;
};

const usDocsArray: LegalDocument[] = Object.values(us_docs_barrel).filter(isValidDocument);
const caDocsArray: LegalDocument[] = Object.values(ca_docs_barrel).filter(isValidDocument);
const additionsArray: LegalDocument[] = documentLibraryAdditions.filter(isValidDocument);

export const documentLibraryByCountry: Record<string, LegalDocument[]> = {
  us: usDocsArray,
  ca: caDocsArray,
  // …
};

export function getDocumentsForCountry(countryCode?: string): LegalDocument[] {
  const code = (countryCode || 'us').toLowerCase();
  return documentLibraryByCountry[code] || documentLibraryByCountry['us'] || [];
}

export const supportedCountries = Object.keys(documentLibraryByCountry);

export const allDocuments: LegalDocument[] = Object.values(documentLibraryByCountry)
  .flat()
  .concat(additionsArray);

// Default schema for documents that might be missing one
const defaultSchema = z.object({
  _fallbackDetails: z.string().optional().describe("Default field for documents without a specific schema."),
});

export function generateIdFromName(name: string): string {
  if (!name || typeof name !== 'string') return `doc-${Date.now()}`; // Fallback for undefined names
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

allDocuments.forEach(doc => {
  if (!doc.id && doc.name) {
    doc.id = generateIdFromName(doc.name);
  } else if (!doc.id) {
    // If name is also missing, generate a truly unique ID
    doc.id = `unknown-doc-${Math.random().toString(36).substring(2, 9)}`;
  }

  if (!doc.schema) {
    console.warn(`Document ${doc.id} is missing a schema. Applying default.`);
    doc.schema = defaultSchema;
  }
  if (!doc.questions) {
    doc.questions = [];
  }
  // Ensure translations object and its properties exist
  if (!doc.translations) {
    doc.translations = { en: {}, es: {} };
  }
  if (!doc.translations.en) doc.translations.en = {};
  if (!doc.translations.es) doc.translations.es = {};

  doc.translations.en = {
    name: doc.translations.en.name || doc.name || doc.id,
    description: doc.translations.en.description || doc.description || '',
    aliases: doc.translations.en.aliases || doc.aliases || [],
  };
  doc.translations.es = {
    name: doc.translations.es.name || doc.name_es || doc.translations.en.name,
    description: doc.translations.es.description || doc.description_es || doc.translations.en.description,
    aliases: doc.translations.es.aliases || doc.aliases_es || doc.translations.en.aliases || [],
  };
});


export function findMatchingDocuments(
  query: string,
  lang: 'en' | 'es',
  state?: string,
): LegalDocument[] {
  if (!query && !state) return allDocuments.filter(doc => doc.id !== 'general-inquiry'); // Return all if no query/state
  
  const lowerQuery = query.toLowerCase();

  return allDocuments.filter(doc => {
    if (doc.id === 'general-inquiry') return false;

    const translation = doc.translations?.[lang] || doc.translations?.en;
    if (!translation) return false; // Skip if no translation found for the doc

    const name = translation.name || '';
    const description = translation.description || '';
    const aliases = translation.aliases || [];

    const matchesQuery =
      query.trim() === '' || // If query is empty, it matches all documents (state filter will still apply)
      name.toLowerCase().includes(lowerQuery) ||
      description.toLowerCase().includes(lowerQuery) ||
      aliases.some(a => a.toLowerCase().includes(lowerQuery));

    const matchesState =
      !state || state === 'all' || state.trim() === '' || // If no state selected, it matches
      doc.states === 'all' ||
      (Array.isArray(doc.states) && doc.states.includes(state));

    return matchesQuery && matchesState;
  });
}

const defaultDocumentLibrary = getDocumentsForCountry('us');
export default defaultDocumentLibrary;

export { defaultDocumentLibrary as documentLibrary };

// Export usStates as well from here as it's a core part of document definitions
export { usStates } from './usStates';
export type { Question, LegalDocument, UpsellClause } from '@/types/documents';
