// src/lib/document-library/index.ts
import { z } from 'zod';
import type { LegalDocument, LocalizedText, Question } from '@/types/documents'; // Ensure Question is imported
import * as us_docs_barrel from '../documents/us';
import * as ca_docs_barrel from '../documents/ca';
import { documentLibraryAdditions } from '../document-library-additions';

// Helper to ensure basic translations structure exists for name checking
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
  // Populate from top-level name if translations.en.name is missing
  if (!doc.translations.en.name && doc.name) {
    doc.translations.en.name = doc.name;
  }
  // Populate from top-level name_es if translations.es.name is missing
  if (!doc.translations.es.name && doc.name_es) {
    doc.translations.es.name = doc.name_es;
  }
  return doc as LegalDocument;
};


const isValidDocument = (doc: any): doc is LegalDocument => {
  const d = ensureBasicTranslations(doc); // Ensure translations.en.name can be checked

  const hasId = d && typeof d.id === 'string' && d.id.trim() !== '';
  const hasCategory = d && typeof d.category === 'string' && d.category.trim() !== '';
  const hasSchema = d && d.schema && typeof d.schema.parse === 'function';
  const hasValidEnglishName = d && d.translations?.en?.name && typeof d.translations.en.name === 'string' && d.translations.en.name.trim() !== '';

  if (d && (d.id === 'bill-of-sale-vehicle' || d.id === 'promissory-note')) {
    // console.log(`[isValidDocument] Checking ${d.id}: ID=${hasId}, Cat=${hasCategory}, Schema=${hasSchema}, NameEN=${hasValidEnglishName}`);
  }

  if (!hasId) { /* console.warn('[isValidDocument] Invalid/Missing ID:', d?.id, d?.translations?.en?.name); */ }
  if (!hasCategory) { /* console.warn('[isValidDocument] Invalid/Missing Category for doc:', d?.id, d?.translations?.en?.name); */ }
  if (!hasSchema) { /* console.warn('[isValidDocument] Invalid/Missing Zod Schema for doc:', d?.id, d?.translations?.en?.name); */ }
  if (!hasValidEnglishName) { /* console.warn('[isValidDocument] Invalid/Missing English Name (in translations) for doc:', d?.id); */ }

  return hasId && hasCategory && hasSchema && hasValidEnglishName;
};

const processBarrel = (barrel: any, countryCode: string): LegalDocument[] => {
  const docs: LegalDocument[] = [];
  // console.log(`[document-library] Processing barrel for country: ${countryCode}. Found ${Object.keys(barrel).length} raw exports.`);
  Object.values(barrel).forEach((exportedDoc: any) => {
    const preppedDoc = ensureBasicTranslations(exportedDoc);
    if (isValidDocument(preppedDoc)) {
      // console.log(`[document-library] Valid document found in ${countryCode} barrel: ${preppedDoc.id}`);
      docs.push(preppedDoc);
      if (preppedDoc.id === 'promissory-note') {
        // console.log('[document-library] PROMISSORY_NOTE_FROM_BARREL (US):', JSON.stringify({id: preppedDoc.id, name_en: preppedDoc.translations?.en?.name, qCount: preppedDoc.questions?.length, schema: !!preppedDoc.schema}, null, 2));
      }
    } else {
      // console.warn(`[document-library] Invalid or incomplete document object found in ${countryCode} barrel:`, preppedDoc ? preppedDoc.id || preppedDoc.name : 'undefined doc');
    }
  });
  // console.log(`[document-library] Valid documents after processing ${countryCode} barrel: ${docs.length}`);
  return docs;
};

const usDocsArray: LegalDocument[] = processBarrel(us_docs_barrel, 'us');
const caDocsArray: LegalDocument[] = processBarrel(ca_docs_barrel, 'ca');
const additionsArray: LegalDocument[] = documentLibraryAdditions.map(ensureBasicTranslations).filter(isValidDocument); // Ensure additions are also filtered and prepped

export const documentLibraryByCountry: Record<string, LegalDocument[]> = {
  us: usDocsArray,
  ca: caDocsArray,
  // …
};

// Combine all documents from barrels and additions
const combinedDocsBeforeDedup: LegalDocument[] = Object.values(documentLibraryByCountry)
  .flat()
  .concat(additionsArray); // additionsArray is already filtered

// De-duplicate the combined list based on doc.id
const uniqueDocsMap = new Map<string, LegalDocument>();
combinedDocsBeforeDedup.forEach(doc => {
  if (doc && doc.id) { // Ensure doc and doc.id are valid
    if (!uniqueDocsMap.has(doc.id)) {
      uniqueDocsMap.set(doc.id, doc);
    } else {
      // console.warn(`[document-library] Duplicate document ID found and overwritten during de-duplication: ${doc.id}. Keeping first encountered.`);
    }
  }
});

export const allDocuments: LegalDocument[] = Array.from(uniqueDocsMap.values());
// console.log(`[document-library] Total unique documents in allDocuments after de-duplication: ${allDocuments.length}`);


// Default schema for documents that might be missing one (should be less needed now with isValidDocument)
const defaultSchema = z.object({
  _fallbackDetails: z.string().optional().describe("Default field for documents without a specific schema."),
});

export function generateIdFromName(nameInput: unknown): string {
  const name = String(nameInput || ''); // Ensure name is a string
  if (!name.trim()) return `doc-${Date.now()}${Math.random().toString(36).substring(2, 7)}`;
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

allDocuments.forEach(doc => {
  // Ensure ID (should be less necessary if isValidDocument is effective)
  if (!doc.id) {
    doc.id = generateIdFromName(doc.translations?.en?.name || doc.name);
    // console.warn(`[document-library] FOR_EACH_LOOP: Generated ID for doc without one: ${doc.id} (original name: ${doc.translations?.en?.name || doc.name})`);
  }

  // Ensure schema
  if (!doc.schema || typeof doc.schema.parse !== 'function') {
    // console.warn(`[document-library] FOR_EACH_LOOP: Document ${doc.id} is missing a valid Zod schema. Applying default.`);
    doc.schema = defaultSchema;
  }
  // Ensure questions is an array
  if (!Array.isArray(doc.questions)) {
    // console.warn(`[document-library] FOR_EACH_LOOP: Document ${doc.id} questions is not an array. Setting to empty array.`);
    doc.questions = [] as Question[]; // Cast to Question[]
  }

  // Consolidate and ensure translations structure (already partially done by ensureBasicTranslations)
  const baseTranslations = doc.translations || { en: {}, es: {} }; // ensure baseTranslations is initialized
  const enName = baseTranslations.en?.name || doc.name || doc.id;
  const esName = baseTranslations.es?.name || doc.name_es || enName; // Fallback to English name if Spanish name missing

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

  // For debugging specific documents after all processing
  if (doc.id === 'promissory-note' || doc.id === 'bill-of-sale-vehicle') {
    // console.log(`[document-library] FOR_EACH_LOOP - FINAL_CHECK for ${doc.id}: Name EN: ${doc.translations.en.name}, Questions: ${doc.questions?.length}, Schema Keys: ${doc.schema?.shape ? Object.keys(doc.schema.shape).join(', ') : (doc.schema?._def?.schema?.shape ? Object.keys(doc.schema._def.schema.shape).join(', ') : 'N/A')}`);
  }
});

export function getDocumentsForCountry(countryCode?: string): LegalDocument[] {
  const code = (countryCode || 'us').toLowerCase();
  return documentLibraryByCountry[code] || documentLibraryByCountry['us'] || [];
}

export const supportedCountries = Object.keys(documentLibraryByCountry);

const tempAllDocumentsRegistryCheck: LegalDocument[] = Object.values(allDocuments); // Use the de-duplicated list
// console.log(`[document-library] Documents from allDocuments for registry check: ${tempAllDocumentsRegistryCheck.length}`);

// This registry might be redundant if allDocuments is the source of truth for UI components.
// If used, ensure it's also built from the de-duplicated list.
export const registry: Record<string, LegalDocument> = {};
tempAllDocumentsRegistryCheck.forEach(doc => {
  if (doc.jurisdiction && doc.id) {
    registry[`${doc.jurisdiction.toLowerCase()}/${doc.id}`] = doc;
  } else if (doc.id) { // Fallback for docs without explicit jurisdiction (treat as 'us')
    registry[`us/${doc.id}`] = doc;
  }
});


export function getDoc(docId: string, country = 'us'): LegalDocument | undefined {
  return registry[`${country.toLowerCase()}/${docId}`];
}
export { getDoc as getDocument }; // Alias for backward compatibility if needed

export async function loadDoc(docId: string, country = 'us'): Promise<LegalDocument | undefined> {
  const loaderKey = `${country.toLowerCase()}/${docId}`;
  const loader = docLoaders[loaderKey];
  if (loader) {
    try {
      // The loader function returns a module, and the document is the default export
      // or a named export matching the camelCased docId.
      const module = await loader();
      // Attempt to find the document configuration within the loaded module
      // Common patterns: default export, or named export matching camelCase(docId) or the docId itself.
      const docConfig = module.default || module[docId] || module[docId.replace(/-/g, '_')] || module[docId.replace(/-([a-z])/g, g => g[1].toUpperCase())] || Object.values(module)[0];

      if (docConfig && isValidDocument(ensureBasicTranslations(docConfig))) { // Re-validate after dynamic load
        return docConfig as LegalDocument;
      } else {
        console.error(`[loadDoc] Document config not found or invalid in module for key: ${loaderKey}`, module);
        return undefined;
      }
    } catch (error) {
      console.error(`[loadDoc] Error loading document for key ${loaderKey}:`, error);
      return undefined;
    }
  }
  console.warn(`[loadDoc] No loader found for key: ${loaderKey}. Falling back to registry.`);
  // Fallback to registry if loader not found (though registry might also be incomplete if loaders are primary)
  return getDoc(docId, country);
}


export function findMatchingDocuments(
  query: string,
  lang: 'en' | 'es',
  state?: string,
): LegalDocument[] {
  if (!query && !state) return allDocuments.filter(doc => doc.id !== 'general-inquiry');

  const lowerQuery = query.toLowerCase();

  return allDocuments.filter(doc => {
    if (doc.id === 'general-inquiry') return false;

    // Ensure translations and name exist
    const translation = doc.translations?.[lang] || doc.translations?.en;
    if (!translation || !translation.name) {
        // console.warn(`[findMatchingDocuments] Document ${doc.id} missing name in translation for lang ${lang}.`);
        return false;
    }

    const name = translation.name; // Already guarded by above check
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

export { usStates } from '../usStates';
export type { Question, LegalDocument, UpsellClause } from '@/types/documents'; // Question import added here
export { docLoaders } from '../document-loaders'; // Ensure docLoaders is exported
