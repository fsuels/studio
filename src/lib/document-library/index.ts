
// src/lib/document-library/index.ts
import { z } from 'zod';
import type { LegalDocument, LocalizedText, Question } from '@/types/documents'; // Ensure Question is imported
import * as us_docs_barrel from '../documents/us';
import * as ca_docs_barrel from '../documents/ca';
import { documentLibraryAdditions } from '../document-library-additions';
import { docLoaders } from '../document-loaders'; // Ensure docLoaders is imported

// Helper to ensure basic translations structure exists for name checking
const ensureBasicTranslations = (doc: any): LegalDocument => {
  if (!doc) {
    // console.warn('[ensureBasicTranslations] Received undefined/null doc');
    // Return a minimal fallback or throw, depending on desired strictness
    return { id: 'unknown', name: 'Unknown Document', category: 'Miscellaneous', schema: z.object({}), questions: [], languageSupport: ['en'], basePrice: 0, requiresNotarization: false, canBeRecorded: false, offerNotarization: false, offerRecordingHelp: false, translations: { en: { name: 'Unknown Document', description: '', aliases: [] }, es: { name: 'Documento Desconocido', description: '', aliases: [] } } } as unknown as LegalDocument;
  }
  if (!doc.translations) {
    doc.translations = { en: {}, es: {} };
  }
  if (!doc.translations.en) {
    doc.translations.en = {};
  }
  if (!doc.translations.es) {
    doc.translations.es = {};
  }
  if (doc.name && !doc.translations.en.name) {
    doc.translations.en.name = doc.name;
  }
  if (doc.name_es && !doc.translations.es.name) {
    doc.translations.es.name = doc.name_es;
  }
  // Ensure aliases are arrays
  if (doc.translations.en.aliases && !Array.isArray(doc.translations.en.aliases)) {
    doc.translations.en.aliases = [String(doc.translations.en.aliases)];
  } else if (!doc.translations.en.aliases) {
    doc.translations.en.aliases = [];
  }
  if (doc.translations.es.aliases && !Array.isArray(doc.translations.es.aliases)) {
    doc.translations.es.aliases = [String(doc.translations.es.aliases)];
  } else if (!doc.translations.es.aliases) {
    doc.translations.es.aliases = [];
  }
  return doc as LegalDocument;
};


const isValidDocument = (doc: any): doc is LegalDocument => {
  if (!doc || typeof doc !== 'object') {
    // console.warn('[isValidDocument] Invalid document object:', doc);
    return false;
  }
  const hasEnglishName = doc.translations?.en?.name || doc.name;

  if (!doc.id || doc.id === 'unknown' || doc.id === 'error-doc') {
    // console.warn(`[isValidDocument] Invalid or missing ID for doc:`, doc.id || 'NO ID');
    return false;
  }
  if (!hasEnglishName) {
    // console.warn(`[isValidDocument] Missing English name for doc: ${doc.id}`);
    return false;
  }
  if (!doc.category) {
    // console.warn(`[isValidDocument] Missing category for doc: ${doc.id}`);
    return false;
  }
  // Schema check removed here; will be defaulted later if missing.
  // if (!doc.schema) {
  //   console.warn(`[isValidDocument] Missing schema for doc: ${doc.id}`);
  //   return false;
  // }
  return true;
};

function processBarrel(barrel: any, countryCode: string): LegalDocument[] {
  const docs: LegalDocument[] = [];
  if (!barrel || typeof barrel !== 'object') {
    console.warn(`[processBarrel] Barrel for ${countryCode} is invalid or empty.`);
    return docs;
  }
  // console.log(`[processBarrel] Processing barrel for ${countryCode}. Raw entries found: ${Object.keys(barrel).length}`);

  for (const key in barrel) {
    if (Object.prototype.hasOwnProperty.call(barrel, key)) {
      let docCandidate = barrel[key];
      if (typeof docCandidate === 'object' && docCandidate !== null) {
        docCandidate = ensureBasicTranslations(docCandidate);
        if (isValidDocument(docCandidate)) {
          // Ensure country is set if not present in metadata
          if (!docCandidate.jurisdiction) {
            docCandidate.jurisdiction = countryCode.toUpperCase();
          }
          docs.push(docCandidate);
        } else {
          // console.warn(`[processBarrel] Invalid document skipped from ${countryCode} barrel (key: ${key}):`, docCandidate?.id || 'No ID');
        }
      } else {
        // console.warn(`[processBarrel] Non-object entry skipped from ${countryCode} barrel (key: ${key}).`);
      }
    }
  }
  // console.log(`[processBarrel] Valid documents extracted from ${countryCode} barrel: ${docs.length}`);
  return docs;
}

const usDocsArray = processBarrel(us_docs_barrel, 'us');
const caDocsArray = processBarrel(ca_docs_barrel, 'ca');

const additionsArray = Array.isArray(documentLibraryAdditions)
  ? documentLibraryAdditions.map(ensureBasicTranslations).filter(isValidDocument)
  : [];
// console.log(`[document-library] Valid additions found: ${additionsArray.length}`);

const combinedDocs = [...usDocsArray, ...caDocsArray, ...additionsArray];
// console.log(`[document-library] Total combined documents before de-duplication: ${combinedDocs.length}`);

// De-duplicate based on id
const uniqueDocumentsMap = new Map<string, LegalDocument>();
combinedDocs.forEach(doc => {
  if (doc && doc.id) { // Ensure doc and doc.id are defined
    uniqueDocumentsMap.set(doc.id, doc);
  }
});
const uniqueDocuments = Array.from(uniqueDocumentsMap.values());
// console.log(`[document-library] Total unique documents: ${uniqueDocuments.length}`);
// console.log(`[document-library] Unique document IDs: ${uniqueDocuments.map(d => d.id).join(', ')}`);


const defaultSchema = z.object({
  __placeholder: z.string().optional().describe("This is a placeholder schema if none is provided for a document."),
});

// Final processing: ensure all documents have default schema, questions, and full translations
export const allDocuments: LegalDocument[] = uniqueDocuments.map(doc => {
  const baseTranslations = doc.translations || { en: {}, es: {} };
  if (!baseTranslations.en) baseTranslations.en = {};
  if (!baseTranslations.es) baseTranslations.es = {};

  const enName = baseTranslations.en.name || doc.name || doc.id;
  const esName = baseTranslations.es.name || doc.name_es || enName; // Fallback to English name if Spanish name is missing

  const finalDoc = {
    ...doc,
    name: enName, // Ensure top-level name is English name
    name_es: esName, // Ensure top-level name_es is Spanish name
    schema: doc.schema || defaultSchema,
    questions: doc.questions || [],
    languageSupport: doc.languageSupport || ['en'],
    basePrice: typeof doc.basePrice === 'number' ? doc.basePrice : 0,
    requiresNotarization: !!doc.requiresNotarization,
    canBeRecorded: !!doc.canBeRecorded,
    offerNotarization: !!doc.offerNotarization,
    offerRecordingHelp: !!doc.offerRecordingHelp,
    states: doc.states || 'all',
    translations: {
      en: {
        name: enName,
        description: baseTranslations.en.description || doc.description || '',
        aliases: Array.isArray(baseTranslations.en.aliases) ? baseTranslations.en.aliases : (doc.aliases || []),
      },
      es: {
        name: esName,
        description: baseTranslations.es.description || doc.description_es || baseTranslations.en.description || doc.description || '',
        aliases: Array.isArray(baseTranslations.es.aliases) ? baseTranslations.es.aliases : (doc.aliases_es || doc.aliases || []),
      },
      // Preserve other language translations if they exist
      ...Object.fromEntries(Object.entries(baseTranslations).filter(([lang]) => lang !== 'en' && lang !== 'es'))
    },
    upsellClauses: doc.upsellClauses || [],
    compliance: doc.compliance || {},
  };
  // If (doc.id === 'bill-of-sale-vehicle' || doc.id === 'promissory-note') {
  //   console.log(`[document-library] Final processed doc ${doc.id}:`, {
  //       id: finalDoc.id,
  //       name: finalDoc.name,
  //       name_es: finalDoc.name_es,
  //       category: finalDoc.category,
  //       questionsLength: finalDoc.questions.length,
  //       schemaKeys: finalDoc.schema?.shape ? Object.keys(finalDoc.schema.shape) : 'N/A',
  //       enNameInTranslations: finalDoc.translations?.en?.name,
  //   });
  // }
  return finalDoc;
});

// console.log(`[document-library] Final allDocuments count: ${allDocuments.length}`);
// console.log(`[document-library] Final allDocuments IDs: ${allDocuments.map(d => d.id).join(', ')}`);

export const documentLibrary = allDocuments; // This is the main export used by components

// Group documents by country
export const documentLibraryByCountry: Record<string, LegalDocument[]> = {};
allDocuments.forEach(doc => {
  const country = doc.jurisdiction?.toLowerCase() || 'us'; // Default to 'us' if no jurisdiction
  if (!documentLibraryByCountry[country]) {
    documentLibraryByCountry[country] = [];
  }
  documentLibraryByCountry[country].push(doc);
});

// List of all country codes present
export const supportedCountries = Object.keys(documentLibraryByCountry);

// Helper to get docs by country
export function getDocumentsForCountry(country: string): LegalDocument[] {
  return documentLibraryByCountry[country.toLowerCase()] || [];
}

// Helper to get a single document by ID, optionally by country
export function getDocumentById(id: string, country?: string): LegalDocument | undefined {
  if (country) {
    return (documentLibraryByCountry[country.toLowerCase()] || []).find(doc => doc.id === id);
  }
  return allDocuments.find(doc => doc.id === id);
}

// Lazy loader for full document modules (server-side use for DocPageClient)
export async function loadDoc(docId: string, country = 'us'): Promise<LegalDocument | undefined> {
  const loaderKey = `${country.toLowerCase()}/${docId}`;
  // console.log(`[loadDoc] Attempting to load doc for key: ${loaderKey}`);
  // console.log(`[loadDoc] Available loaders:`, Object.keys(docLoaders));

  const loader = docLoaders[loaderKey];
  if (loader) {
    // console.log(`[loadDoc] Found loader for ${loaderKey}. Executing...`);
    try {
      const module = await loader();
      // console.log(`[loadDoc] Module loaded for ${loaderKey}. Module keys:`, Object.keys(module));

      // Attempt to extract the document config from the module
      // It could be a named export (e.g., billOfSaleVehicle) or default
      let docConfig: LegalDocument | undefined = undefined;
      const camelCasedId = docId.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

      if (module[camelCasedId] && typeof module[camelCasedId] === 'object') {
        docConfig = module[camelCasedId];
        // console.log(`[loadDoc] Found docConfig via camelCasedId ('${camelCasedId}') for ${loaderKey}`);
      } else if (module.default && typeof module.default === 'object') {
        docConfig = module.default;
        // console.log(`[loadDoc] Found docConfig via default export for ${loaderKey}`);
      } else if (Object.keys(module).length === 1 && typeof Object.values(module)[0] === 'object') {
        // Fallback: if module has only one export, assume it's the document
        docConfig = Object.values(module)[0] as LegalDocument;
        // console.log(`[loadDoc] Found docConfig via single export for ${loaderKey}`);
      } else {
        // Check for common export patterns like `{ id: 'doc-id', metadata: {...} }`
        // The script `generate-doc-loaders.js` was updated to try `m.docIdCamelCase || m.default || Object.values(m)[0]`
        // so one of these should ideally hit.
        // If still not found, iterate through module keys for a potential match
        for (const key in module) {
          if (typeof module[key] === 'object' && module[key] !== null && module[key].id === docId) {
            docConfig = module[key];
            // console.log(`[loadDoc] Found docConfig via iterating module keys (key: '${key}') for ${loaderKey}`);
            break;
          }
        }
      }
      
      if (docConfig && typeof docConfig === 'object' && docConfig.id === docId) {
        // console.log(`[loadDoc] Successfully loaded and validated docConfig for ${loaderKey}:`, docConfig.id);
        return docConfig;
      } else {
        // console.error(`[loadDoc] Document config object not found or invalid structure in module for key: ${loaderKey}. Module content:`, module);
      }
    } catch (error) {
      // console.error(`[loadDoc] Error executing loader for ${loaderKey}:`, error);
    }
  } else {
    // console.warn(`[loadDoc] No loader found for key: ${loaderKey}`);
  }
  return undefined;
}

// Fallback for legacy components or direct use
export const docs = allDocuments;
export { usStates } from '../usStates';

export { docLoaders }; // Make docLoaders available if needed elsewhere, though primarily used by loadDoc

// Log a summary at the end of module evaluation
// console.log(`[document-library] Initialization complete. Total documents loaded: ${allDocuments.length}. Supported countries: ${supportedCountries.join(', ')}.`);
// const billOfSaleInLib = allDocuments.find(d => d.id === 'bill-of-sale-vehicle');
// console.log('[document-library] Bill of Sale in final allDocuments:', billOfSaleInLib ? { id: billOfSaleInLib.id, name: billOfSaleInLib.name, questions: billOfSaleInLib.questions?.length } : 'NOT FOUND');

// const promissoryNoteInLib = allDocuments.find(d => d.id === 'promissory-note');
// console.log('[document-library] Promissory Note in final allDocuments:', promissoryNoteInLib ? { id: promissoryNoteInLib.id, name: promissoryNoteInLib.name, questions: promissoryNoteInLib.questions?.length } : 'NOT FOUND');
