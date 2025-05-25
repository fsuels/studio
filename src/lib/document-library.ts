// src/lib/document-library.ts
import { z } from 'zod';
import { documentLibraryAdditions } from './document-library-additions';
import type { LegalDocument, LocalizedText } from '@/types/documents'; // Ensure LocalizedText is imported
import * as us_docs_barrel from './documents/us';
import * as ca_docs_barrel from './documents/ca';
// …other countries…

const isValidDocument = (doc: any): doc is LegalDocument => {
  const hasId = doc && typeof doc.id === 'string' && doc.id.trim() !== '';
  const hasCategory = doc && typeof doc.category === 'string' && doc.category.trim() !== '';
  const hasSchema = doc && doc.schema && typeof doc.schema.parse === 'function';

  // Check for English translation name as the primary indicator of a valid name structure
  // OR fallback to top-level name if translations are not yet populated by the forEach loop
  const hasValidTranslationsOrName = doc &&
                                   ( (doc.translations &&
                                      doc.translations.en &&
                                      typeof doc.translations.en.name === 'string' &&
                                      doc.translations.en.name.trim() !== '') ||
                                     (typeof doc.name === 'string' && doc.name.trim() !== '')
                                   );

  return hasId && hasCategory && hasSchema && hasValidTranslationsOrName;
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
  .concat(additionsArray.filter(isValidDocument)); // Ensure additions are also filtered

// Default schema for documents that might be missing one
const defaultSchema = z.object({
  _fallbackDetails: z.string().optional().describe("Default field for documents without a specific schema."),
});

export function generateIdFromName(name: string): string {
  if (!name || typeof name !== 'string') return `doc-${Date.now()}`; 
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

allDocuments.forEach(doc => {
  if (doc.id === 'promissory-note') {
    console.log('[document-library] processing:', doc.id, doc.translations?.en?.name);
  }
  if (!doc.id && doc.name) { // Check top-level name for ID generation
    doc.id = generateIdFromName(doc.name);
  } else if (!doc.id && doc.translations?.en?.name) { // Fallback to translation if top-level name is missing
    doc.id = generateIdFromName(doc.translations.en.name);
  } else if (!doc.id) {
    doc.id = `unknown-doc-${Math.random().toString(36).substring(2, 9)}`;
  }

  if (!doc.schema) {
    console.warn(`Document ${doc.id} is missing a schema. Applying default.`);
    doc.schema = defaultSchema;
  }
  if (!doc.questions) {
    doc.questions = [];
  }

  // Ensure translations object and its properties exist, and populate from top-level if necessary
  const baseTranslations = doc.translations || { en: {}, es: {} };
  doc.translations = {
    en: {
      name: baseTranslations.en?.name || doc.name || doc.id,
      description: baseTranslations.en?.description || doc.description || '',
      aliases: baseTranslations.en?.aliases || doc.aliases || [],
    },
    es: {
      name: baseTranslations.es?.name || doc.name_es || baseTranslations.en?.name || doc.name || doc.id,
      description: baseTranslations.es?.description || doc.description_es || baseTranslations.en?.description || doc.description || '',
      aliases: baseTranslations.es?.aliases || doc.aliases_es || baseTranslations.en?.aliases || doc.aliases || [],
    },
  };
});


export function findMatchingDocuments(
  query: string,
  lang: 'en' | 'es',
  state?: string,
): LegalDocument[] {
  if (!query && !state) return allDocuments.filter(doc => doc.id !== 'general-inquiry'); 
  
  const lowerQuery = query.toLowerCase();

  return allDocuments.filter(doc => {
    if (doc.id === 'general-inquiry') return false;

    const translation = doc.translations?.[lang] || doc.translations?.en;
    if (!translation || !translation.name) return false; 

    const name = translation.name || '';
    const description = translation.description || '';
    const aliases = translation.aliases || [];

    const matchesQuery =
      query.trim() === '' || 
      name.toLowerCase().includes(lowerQuery) ||
      description.toLowerCase().includes(lowerQuery) ||
      aliases.some(a => a.toLowerCase().includes(lowerQuery));

    const matchesState =
      !state || state === 'all' || state.trim() === '' || 
      doc.states === 'all' ||
      (Array.isArray(doc.states) && doc.states.includes(state));

    return matchesQuery && matchesState;
  });
}

const defaultDocumentLibrary = getDocumentsForCountry('us');
export default defaultDocumentLibrary;

export { defaultDocumentLibrary as documentLibrary };

export { usStates } from './document-library/utils';
export type { Question, LegalDocument, UpsellClause } from '@/types/documents';
