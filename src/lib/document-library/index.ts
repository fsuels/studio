// src/lib/document-library/index.ts
import { z } from 'zod';
import type { LegalDocument, LocalizedText } from '@/types/documents';
import * as us_docs_barrel from '../documents/us'; // Corrected path
import * as ca_docs_barrel from '../documents/ca'; // Corrected path
// …other countries…

// Helper function to ensure a document object is valid
const isValidDocument = (doc: any): doc is LegalDocument => {
  const hasId = doc && typeof doc.id === 'string' && doc.id.trim() !== '';
  const hasCategory = doc && typeof doc.category === 'string' && doc.category.trim() !== '';
  const hasSchema = doc && doc.schema && typeof doc.schema.parse === 'function';

  // Check for English translation name as the primary indicator of a valid name structure
  const hasValidName = doc &&
    ( (doc.translations && doc.translations.en && typeof doc.translations.en.name === 'string' && doc.translations.en.name.trim() !== '') ||
      (typeof doc.name === 'string' && doc.name.trim() !== '') );

  if (!hasId) console.warn('[isValidDocument] Invalid/Missing ID:', doc?.id, doc?.name);
  if (!hasCategory) console.warn('[isValidDocument] Invalid/Missing Category for doc:', doc?.id, doc?.name);
  if (!hasSchema) console.warn('[isValidDocument] Invalid/Missing Zod Schema for doc:', doc?.id, doc?.name);
  if (!hasValidName) console.warn('[isValidDocument] Invalid/Missing English Name (in translations or top-level) for doc:', doc?.id);

  return hasId && hasCategory && hasSchema && hasValidName;
};

// Helper function to ensure basic translations exist before validation
const ensureBasicTranslations = (doc: any): LegalDocument => {
  if (!doc.translations) {
    doc.translations = { en: {}, es: {} };
  }
  if (!doc.translations.en) {
    doc.translations.en = {};
  }
  if (!doc.translations.es) {
    doc.translations.es = {};
  }
  if (!doc.translations.en.name && doc.name) {
    doc.translations.en.name = doc.name;
  }
  if (!doc.translations.es.name && doc.name_es) {
    doc.translations.es.name = doc.name_es;
  }
  // Ensure aliases are arrays
  if (doc.translations.en && !Array.isArray(doc.translations.en.aliases)) {
    doc.translations.en.aliases = doc.aliases || [];
  }
  if (doc.translations.es && !Array.isArray(doc.translations.es.aliases)) {
    doc.translations.es.aliases = doc.aliases_es || [];
  }
  return doc as LegalDocument;
};

// Process a barrel file (e.g., us_docs_barrel)
const processBarrel = (barrel: Record<string, any>, barrelName: string): LegalDocument[] => {
  console.log(`[document-library] Processing barrel: ${barrelName}. Raw entries: ${Object.keys(barrel).length}`);
  const docs = Object.values(barrel)
    .map(ensureBasicTranslations) // Ensure basic translation structure for name check
    .filter(doc => {
      const isValid = isValidDocument(doc);
      if ((doc?.id === 'bill-of-sale-vehicle' || doc?.id === 'promissory-note') && !isValid) {
        console.error(`[document-library processBarrel] CRITICAL: ${doc.id} FAILED isValidDocument check within ${barrelName}.`);
      }
      return isValid;
    });
  console.log(`[document-library] Valid documents from ${barrelName}: ${docs.length}`);
  if (docs.find(d => d.id === 'promissory-note')) {
    console.log(`[document-library] Promissory Note FOUND in ${barrelName} after validation.`);
  }
  return docs;
};

const usDocsArray: LegalDocument[] = processBarrel(us_docs_barrel, 'us_docs_barrel');
const caDocsArray: LegalDocument[] = processBarrel(ca_docs_barrel, 'ca_docs_barrel');
// Add other countries here, e.g.:
// const ukDocsArray: LegalDocument[] = processBarrel(uk_docs_barrel, 'uk_docs_barrel');

export const documentLibraryByCountry: Record<string, LegalDocument[]> = {
  us: usDocsArray,
  ca: caDocsArray,
  // uk: ukDocsArray,
};

export function getDocumentsForCountry(countryCode?: string): LegalDocument[] {
  const code = (countryCode || 'us').toLowerCase();
  return documentLibraryByCountry[code] || documentLibraryByCountry['us'] || [];
}

export const supportedCountries = Object.keys(documentLibraryByCountry);

// Start with documents from defined barrels
let tempAllDocuments: LegalDocument[] = Object.values(documentLibraryByCountry).flat();
console.log(`[document-library] Documents from barrels: ${tempAllDocuments.length}`);

// Add documents from documentLibraryAdditions if they are valid
// Note: documentLibraryAdditions.ts itself should import 'z' if it defines schemas
// import { documentLibraryAdditions } from './document-library-additions'; // Assuming it exists
// const additionsArray: LegalDocument[] = documentLibraryAdditions
//   .map(ensureBasicTranslations)
//   .filter(isValidDocument);
// console.log(`[document-library] Valid documents from additions: ${additionsArray.length}`);
// tempAllDocuments = tempAllDocuments.concat(additionsArray);
// console.log(`[document-library] Total documents after additions: ${tempAllDocuments.length}`);

export const allDocuments: LegalDocument[] = [...new Map(tempAllDocuments.map(doc => [doc.id, doc])).values()];
console.log(`[document-library] Final unique documents in allDocuments: ${allDocuments.length}`);


// Default schema for documents that might be missing one
const defaultSchema = z.object({
  _fallbackDetails: z.string().optional().describe("Default field for documents without a specific schema."),
});

export function generateIdFromName(nameInput: unknown): string {
  const name = String(nameInput || ''); // Ensure name is a string
  if (!name.trim()) return `doc-${Date.now()}${Math.random().toString(36).substring(2, 7)}`;
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

allDocuments.forEach(doc => {
  // Ensure ID
  if (!doc.id) {
    doc.id = generateIdFromName(doc.translations?.en?.name || doc.name);
    console.warn(`[document-library] Generated ID for doc without one: ${doc.id} (original name: ${doc.translations?.en?.name || doc.name})`);
  }

  // Ensure schema
  if (!doc.schema || typeof doc.schema.parse !== 'function') {
    console.warn(`[document-library] Document ${doc.id} is missing a valid Zod schema. Applying default.`);
    doc.schema = defaultSchema;
  }
  // Ensure questions is an array
  if (!Array.isArray(doc.questions)) {
    doc.questions = [];
  }

  // Consolidate and ensure translations structure
  const baseTranslations = doc.translations || { en: {}, es: {} };
  const enName = baseTranslations.en?.name || doc.name || doc.id;
  const esName = baseTranslations.es?.name || doc.name_es || baseTranslations.en?.name || doc.name || doc.id; // Fallback to English name if Spanish name missing

  doc.translations = {
    en: {
      name: enName,
      description: baseTranslations.en?.description || doc.description || '',
      aliases: Array.isArray(baseTranslations.en?.aliases) ? baseTranslations.en.aliases : (Array.isArray(doc.aliases) ? doc.aliases : []),
    },
    es: {
      name: esName,
      description: baseTranslations.es?.description || doc.description_es || baseTranslations.en?.description || doc.description || '',
      aliases: Array.isArray(baseTranslations.es?.aliases) ? baseTranslations.es.aliases : (Array.isArray(doc.aliases_es) ? doc.aliases_es : (Array.isArray(baseTranslations.en?.aliases) ? baseTranslations.en.aliases : (Array.isArray(doc.aliases) ? doc.aliases : []))),
    },
  };

  // For debugging specific documents
  if (doc.id === 'promissory-note' || doc.id === 'bill-of-sale-vehicle') {
    console.log(`[document-library POST-PROCESSING] Doc: ${doc.id}, Name EN: ${doc.translations.en.name}, Questions: ${doc.questions?.length}, Schema: ${!!doc.schema}`);
  }
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
    if (!translation || !translation.name) {
        console.warn(`[findMatchingDocuments] Document ${doc.id} missing name in translation for lang ${lang}.`);
        return false;
    }

    const name = translation.name || ''; // Already guarded by above check
    const description = translation.description || '';
    const aliases = Array.isArray(translation.aliases) ? translation.aliases : [];

    const matchesQuery =
      query.trim() === '' ||
      name.toLowerCase().includes(lowerQuery) ||
      description.toLowerCase().includes(lowerQuery) ||
      aliases.some(a => typeof a === 'string' && a.toLowerCase().includes(lowerQuery));

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

export { usStates } from '../usStates'; // Corrected path
export type { Question, LegalDocument, UpsellClause } from '@/types/documents';
