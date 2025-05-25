// src/lib/document-library/index.ts
import { z } from 'zod';
import type { LegalDocument, LocalizedText, Question } from '@/types/documents';
import * as us_docs_barrel from '../documents/us';
import * as ca_docs_barrel from '../documents/ca';
import { documentLibraryAdditions } from '../document-library-additions';
import { docLoaders } from '../document-loaders';

// Helper to ensure basic translations structure exists for name checking
const ensureBasicTranslations = (doc: any): LegalDocument => {
  if (!doc) {
    return { id: 'unknown_fallback', name: 'Unknown Document', category: 'Miscellaneous', schema: z.object({ _unknownField: z.string().optional() }), translations: { en: { name: 'Unknown Document', description: '', aliases: [] }, es: { name: 'Documento Desconocido', description: '', aliases: [] } } } as unknown as LegalDocument;
  }
  if (!doc.id) { // Assign a temporary ID if missing, for logging purposes
    doc.id = `temp_id_${Math.random().toString(36).substring(2, 7)}`;
    console.warn(`[ensureBasicTranslations] Document missing ID, assigned temporary: ${doc.id}`, doc);
  }
  doc.translations = doc.translations || { en: {}, es: {} };
  doc.translations.en = doc.translations.en || {};
  doc.translations.es = doc.translations.es || {};

  if (!doc.translations.en.name && doc.name) {
    doc.translations.en.name = doc.name;
  }
  if (!doc.translations.es.name && doc.name_es) {
    doc.translations.es.name = doc.name_es;
  }
  // Fallback if specific lang name isn't there but general top-level name is
  if (!doc.translations.en.name) doc.translations.en.name = doc.name || doc.id;
  if (!doc.translations.es.name) doc.translations.es.name = doc.name_es || doc.translations.en.name || doc.id;

  return doc as LegalDocument;
};

const isValidDocument = (docToCheck: any, docIdForLogging?: string): docToCheck is LegalDocument => {
  if (!docToCheck || typeof docToCheck !== 'object') {
    if (docIdForLogging) console.warn(`[isValidDocument] Invalid/null document object for: ${docIdForLogging}`);
    return false;
  }
  const d = docToCheck as LegalDocument;
  const hasId = d.id && typeof d.id === 'string' && d.id.trim() !== '' && d.id !== 'unknown_fallback' && !d.id.startsWith('temp_id_');
  const hasCategory = d.category && typeof d.category === 'string' && d.category.trim() !== '';
  const hasSchema = d.schema && typeof d.schema.parse === 'function';
  const hasValidEnglishName = d.translations?.en?.name && typeof d.translations.en.name === 'string' && d.translations.en.name.trim() !== '';

  const isValid = hasId && hasCategory && hasSchema && hasValidEnglishName;

  if (docIdForLogging && (docIdForLogging.includes('bill-of-sale') || docIdForLogging.includes('promissory-note'))) {
    console.log(`[isValidDocument DEBUG ${docIdForLogging}]: Valid=${isValid}, ID=${hasId}(${d.id}), Cat=${hasCategory}(${d.category}), Schema=${hasSchema}, NameEN=${hasValidEnglishName}(${d.translations?.en?.name}), Questions=${d.questions?.length}`);
    if (!isValid) {
      console.warn(`[isValidDocument DEBUG ${docIdForLogging}] Failed validation. Details: ID:${d.id}, Cat:${d.category}, Schema Type:${typeof d.schema}, NameEN:${d.translations?.en?.name}`);
    }
  }
  return isValid;
};

const processBarrel = (barrel: Record<string, any>, countryCode: string): LegalDocument[] => {
  const docs: LegalDocument[] = [];
  const documentObjects = Object.values(barrel); // Assumes barrel exports are the doc objects themselves
  console.log(`[processBarrel ${countryCode}] Raw exports found: ${documentObjects.length}.`);

  documentObjects.forEach((docCandidate: any) => {
    if (!docCandidate || typeof docCandidate !== 'object') {
      // console.warn(`[processBarrel ${countryCode}] Skipping invalid/undefined export candidate.`);
      return;
    }
    // Ensure basic translations exist before validation, especially for name
    const preppedDoc = ensureBasicTranslations(docCandidate);

    if (isValidDocument(preppedDoc, preppedDoc.id)) {
      docs.push(preppedDoc);
    } else {
      // console.warn(`[processBarrel ${countryCode}] Invalid/incomplete doc filtered out after prep:`, preppedDoc ? {id: preppedDoc.id, name: preppedDoc.translations?.en?.name} : 'undefined doc');
    }
  });
  console.log(`[processBarrel ${countryCode}] Valid documents after processing: ${docs.length}, IDs: ${docs.map(d => d.id).join(', ')}`);
  return docs;
};

const usDocsArray: LegalDocument[] = processBarrel(us_docs_barrel, 'us');
const caDocsArray: LegalDocument[] = processBarrel(ca_docs_barrel, 'ca');

const additionsArray: LegalDocument[] = documentLibraryAdditions.map(ensureBasicTranslations).filter(doc => isValidDocument(doc, doc.id));
console.log(`[document-library] documentLibraryAdditions processed. Valid additions: ${additionsArray.length}`);

export const documentLibraryByCountry: Record<string, LegalDocument[]> = {
  us: usDocsArray,
  ca: caDocsArray,
};

const combinedDocsBeforeDedup: LegalDocument[] = Object.values(documentLibraryByCountry)
  .flat()
  .concat(additionsArray); // additionsArray is already filtered

const uniqueDocsMap = new Map<string, LegalDocument>();
combinedDocsBeforeDedup.forEach(doc => {
  if (doc && doc.id) {
    if (!uniqueDocsMap.has(doc.id)) {
      uniqueDocsMap.set(doc.id, doc);
    }
  }
});
export const allDocuments: LegalDocument[] = Array.from(uniqueDocsMap.values());
console.log(`[document-library] Combined docs count before dedup: ${combinedDocsBeforeDedup.length}, After de-duplication (allDocuments): ${allDocuments.length}`);
console.log('[document-library] Final allDocuments IDs:', allDocuments.map(d => d.id).join(', '));


const defaultSchema = z.object({
  _fallbackDetails: z.string().optional().describe("Default field for documents without a specific schema."),
});

export function generateIdFromName(nameInput: unknown): string {
  const name = String(nameInput || '');
  if (!name.trim()) return `doc-${Date.now()}${Math.random().toString(36).substring(2, 7)}`;
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

allDocuments.forEach(doc => {
  // ID should be set by now from metadata.ts
  if (!doc.id) {
    doc.id = generateIdFromName(doc.translations?.en?.name || doc.name); // Fallback if ID somehow still missing
    console.warn(`[document-library loop] Document was missing ID, generated: ${doc.id}`, doc);
  }

  if (!doc.schema || typeof doc.schema.parse !== 'function') {
    console.warn(`[document-library loop] Document ${doc.id} is missing a valid schema. Applying default.`);
    doc.schema = defaultSchema as any;
  }
  if (!Array.isArray(doc.questions)) {
    doc.questions = [] as Question[];
  }

  // Re-ensure translations object and its properties exist, and populate from top-level if necessary
  // This might be redundant if ensureBasicTranslations did a perfect job, but good for safety.
  const baseTranslations = doc.translations || { en: {}, es: {} };
  doc.translations = {
    en: {
      name: baseTranslations.en?.name || doc.name || doc.id,
      description: baseTranslations.en?.description || doc.description || '',
      aliases: Array.isArray(baseTranslations.en?.aliases) ? baseTranslations.en.aliases : (Array.isArray(doc.aliases) ? doc.aliases : []),
    },
    es: {
      name: baseTranslations.es?.name || doc.name_es || baseTranslations.en?.name || doc.name || doc.id,
      description: baseTranslations.es?.description || doc.description_es || baseTranslations.en?.description || doc.description || '',
      aliases: Array.isArray(baseTranslations.es?.aliases) ? baseTranslations.es.aliases : (Array.isArray(doc.aliases_es) ? doc.aliases_es : (Array.isArray(baseTranslations.en?.aliases) ? baseTranslations.en.aliases : (Array.isArray(doc.aliases) ? doc.aliases : []))),
    },
  };
  // Additional languages can be merged here if needed, e.g., for Canadian French
  if (doc.jurisdiction === 'CA' && baseTranslations.fr) {
    doc.translations.fr = {
        name: baseTranslations.fr.name || doc.translations.en.name,
        description: baseTranslations.fr.description || doc.translations.en.description,
        aliases: baseTranslations.fr.aliases || [],
    };
  }


  if (doc.id === 'bill-of-sale-vehicle' || doc.id === 'promissory-note' || doc.id === 'promissory-note-ca') {
      const schemaShape = doc.schema?.shape || doc.schema?._def?.schema?.shape;
      console.log(`[document-library FINAL_CHECK for ${doc.id}]: Name EN: ${doc.translations.en.name}, Questions: ${doc.questions?.length}, Schema Keys: ${schemaShape ? Object.keys(schemaShape).join(', ') : 'N/A'}`);
   }
});

export function getDocumentsForCountry(countryCode?: string): LegalDocument[] {
  const code = (countryCode || 'us').toLowerCase();
  return documentLibraryByCountry[code] || documentLibraryByCountry['us'] || [];
}

export const supportedCountries = Object.keys(documentLibraryByCountry);

export const registry: Record<string, LegalDocument> = {};
allDocuments.forEach(doc => {
  if (doc.id && typeof doc.id === 'string') { // Check if doc.id is a string
    const countryCode = (doc.jurisdiction || 'us').toLowerCase();
    registry[`${countryCode}/${doc.id}`] = doc;
  }
});


export function getDoc(docId: string, country = 'us'): LegalDocument | undefined {
  return registry[`${country.toLowerCase()}/${docId}`];
}
export { getDoc as getDocument };

export async function loadDoc(docId: string, country = 'us'): Promise<LegalDocument | undefined> {
  const loaderKey = `${country.toLowerCase()}/${docId}`;
  console.log(`[loadDoc] Attempting to load doc for key: ${loaderKey}. Available loaders keys: ${Object.keys(docLoaders).join(', ')}`);

  const loader = docLoaders[loaderKey];
  if (loader) {
    console.log(`[loadDoc] Found loader for ${loaderKey}. Executing...`);
    try {
      const module = await loader();
      console.log(`[loadDoc] Module loaded for ${loaderKey}. Module keys: ${Object.keys(module).join(', ')}`);

      let docConfig: LegalDocument | undefined = undefined;
      // Try to match camelCased ID, e.g., bill-of-sale-vehicle -> billOfSaleVehicle
      const camelCasedId = docId.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

      if (module[camelCasedId] && typeof module[camelCasedId] === 'object' && module[camelCasedId].id) {
        docConfig = module[camelCasedId] as LegalDocument;
        console.log(`[loadDoc] Found docConfig via camelCasedId ('${camelCasedId}') for ${loaderKey}`);
      } else if (module.default && typeof module.default === 'object' && module.default.id) {
        docConfig = module.default as LegalDocument;
        console.log(`[loadDoc] Found docConfig via default export for ${loaderKey}`);
      } else if (Object.keys(module).length > 0 && typeof Object.values(module)[0] === 'object' && (Object.values(module)[0] as LegalDocument).id) {
        // Fallback: try the first export if it looks like a doc
        const firstExportKey = Object.keys(module)[0];
        docConfig = Object.values(module)[0] as LegalDocument;
        console.log(`[loadDoc] Found docConfig via first export ('${firstExportKey}') in module for ${loaderKey}`);
      } else {
        console.error(`[loadDoc] Document config object not found or invalid structure in module for key: ${loaderKey}. Module content:`, module);
      }

      if (docConfig) {
        return ensureBasicTranslations(docConfig); // Ensure translations after dynamic load too
      }
      return undefined;

    } catch (error) {
      console.error(`[loadDoc] Error loading document dynamically for key ${loaderKey}:`, error);
      return undefined;
    }
  }
  console.warn(`[loadDoc] No dynamic loader found in docLoaders for key: ${loaderKey}. Falling back to static registry.`);
  return getDoc(docId, country); // Fallback to registry if loader doesn't exist
}


export { usStates } from './utils';
export type { Question as DocumentQuestion, LegalDocument as LegalDocumentConfig, UpsellClause } from '@/types/documents';
export { docLoaders }; // Also export docLoaders itself if needed elsewhere
