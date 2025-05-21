// src/lib/document-library.ts
import { z } from 'zod';
import { documentLibraryAdditions } from './document-library-additions';
import type { LegalDocument, LocalizedText } from '@/types/documents';
import * as us_docs_barrel from './documents/us';
import * as ca_docs_barrel from './documents/ca';

// Helper function to ensure basic translations object exists and has a name for validation
const ensureBasicTranslations = (doc: any): any => {
  if (!doc) return doc;

  if (!doc.translations) {
    doc.translations = { en: {}, es: {} };
  }
  if (typeof doc.translations.en !== 'object' || doc.translations.en === null) {
    doc.translations.en = {};
  }
  if (typeof doc.translations.es !== 'object' || doc.translations.es === null) {
    doc.translations.es = {};
  }

  // Ensure English name for validation
  if (!doc.translations.en.name && typeof doc.name === 'string' && doc.name.trim()) {
    doc.translations.en.name = doc.name;
  }

  // Ensure Spanish name if Spanish top-level name exists, or fallback to English for structure
  if (!doc.translations.es.name) {
    if (typeof doc.name_es === 'string' && doc.name_es.trim()) {
      doc.translations.es.name = doc.name_es;
    } else if (doc.translations.en?.name) { // Fallback to English name if es name is completely missing
      doc.translations.es.name = doc.translations.en.name;
    }
  }
  return doc;
};

const isValidDocument = (doc: any): doc is LegalDocument => {
  if (!doc) {
    // console.warn('[isValidDocument] Received undefined or null document.');
    return false;
  }
  const hasId = !!(typeof doc.id === 'string' && doc.id.trim());
  const hasCategory = !!(typeof doc.category === 'string' && doc.category.trim());
  const hasSchema = !!(doc.schema && typeof doc.schema.parse === 'function');
  
  // isValidDocument now relies on doc.translations.en.name being populated by ensureBasicTranslations
  const hasValidEnName = !!(doc.translations?.en?.name && typeof doc.translations.en.name === 'string' && doc.translations.en.name.trim());

  if (doc.id === 'bill-of-sale-vehicle' || doc.id === 'promissory-note') {
      console.log(`[isValidDocument debug for ${doc.id}] hasId: ${hasId}, hasCategory: ${hasCategory}, hasSchema: ${hasSchema}, hasValidEnName: ${hasValidEnName} (checked doc.translations.en.name: '${doc.translations?.en?.name}')`);
      if (!hasValidEnName) {
          console.warn(`[isValidDocument FAILURE for ${doc.id}] English name is missing or invalid. doc.name: '${doc.name}', doc.translations.en.name: '${doc.translations?.en?.name}'`);
      }
       if (!hasSchema) {
          console.warn(`[isValidDocument FAILURE for ${doc.id}] Schema is missing or invalid.`);
      }
  }
  
  const result = hasId && hasCategory && hasSchema && hasValidEnName;
  if (!result && doc.id) {
     console.warn(`[isValidDocument] Document with ID '${doc.id}' FAILED validation. Results - Id:${hasId}, Cat:${hasCategory}, Schema:${hasSchema}, Name:${hasValidEnName}`);
  }
  return result;
};

const processBarrel = (barrel: Record<string, any>): LegalDocument[] => {
  if (!barrel || typeof barrel !== 'object') {
    console.warn('[processBarrel] Received invalid barrel:', barrel);
    return [];
  }
  // console.log('[processBarrel] Raw barrel entries:', Object.keys(barrel));
  const processedDocs = Object.values(barrel)
    .map(ensureBasicTranslations) // Ensure basic translation structure for name check
    .filter(isValidDocument); // Then filter
  // console.log('[processBarrel] Valid documents after processing:', processedDocs.map(d => d.id));
  return processedDocs;
};

const usDocsArray: LegalDocument[] = processBarrel(us_docs_barrel);
const caDocsArray: LegalDocument[] = processBarrel(ca_docs_barrel);
const additionsArray: LegalDocument[] = documentLibraryAdditions.map(ensureBasicTranslations).filter(isValidDocument);

console.log('[document-library] US Docs Count:', usDocsArray.length, 'IDs:', usDocsArray.map(d=>d.id).join(', '));
if (!usDocsArray.find(d => d.id === 'bill-of-sale-vehicle')) {
    console.error("[document-library] CRITICAL: bill-of-sale-vehicle NOT found in usDocsArray after filtering!");
}


export const documentLibraryByCountry: Record<string, LegalDocument[]> = {
  us: usDocsArray,
  ca: caDocsArray,
};

export function getDocumentsForCountry(countryCode?: string): LegalDocument[] {
  const code = (countryCode || 'us').toLowerCase();
  return documentLibraryByCountry[code] || documentLibraryByCountry['us'] || [];
}

export const supportedCountries = Object.keys(documentLibraryByCountry);

export const allDocuments: LegalDocument[] = Object.values(documentLibraryByCountry)
  .flat()
  .concat(additionsArray); 

const defaultSchema = z.object({
  _fallbackDetails: z.string().optional().describe("Default field for documents without a specific schema."),
});

export function generateIdFromName(name: string): string {
  if (!name || typeof name !== 'string') return `doc-${Date.now()}`; 
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

allDocuments.forEach(doc => {
  if (!doc) {
    console.warn('[document-library] Encountered undefined document in allDocuments forEach loop.');
    return;
  }
  
  // Standardize ID generation if missing (should ideally be set in definition)
  if (!doc.id) {
    const nameForId = doc.translations?.en?.name || doc.name || `unknown-doc-${Math.random().toString(36).substring(2, 7)}`;
    doc.id = generateIdFromName(nameForId);
    console.warn(`[document-library] Generated ID for document: ${doc.id} (from name: ${nameForId})`);
  }

  if (!doc.schema) {
    console.warn(`[document-library] Document ${doc.id} is missing a schema. Applying default.`);
    doc.schema = defaultSchema;
  }
  if (!doc.questions) {
    doc.questions = [];
  }

  // Consolidate translations, ensuring en and es objects exist
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
  // Ensure top-level names are also set from these consolidated translations
  if (!doc.name && doc.translations.en?.name) {
      doc.name = doc.translations.en.name;
  }
  if (!doc.name_es && doc.translations.es?.name) {
      doc.name_es = doc.translations.es.name;
  }
});

export function findMatchingDocuments(
  query: string,
  lang: 'en' | 'es',
  state?: string,
): LegalDocument[] {
  if (!query && !state) return allDocuments.filter(doc => doc && doc.id !== 'general-inquiry'); 
  
  const lowerQuery = query.toLowerCase();

  return allDocuments.filter(doc => {
    if (!doc || doc.id === 'general-inquiry') return false;

    const translation = doc.translations?.[lang] || doc.translations?.en;
    if (!translation || !translation.name) {
        console.warn(`[findMatchingDocuments] Document ID ${doc.id} missing valid translation name for lang '${lang}'.`);
        return false; 
    }

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

export { usStates } from './usStates';
export type { Question, LegalDocument, UpsellClause } from '@/types/documents';
