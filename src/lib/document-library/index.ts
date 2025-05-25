// src/lib/document-library/index.ts
import { z } from 'zod';
import type { LegalDocument, LocalizedText, Question } from '@/types/documents'; // Ensure Question is imported
import * as us_docs_barrel from '../documents/us';
import * as ca_docs_barrel from '../documents/ca';
import { documentLibraryAdditions } from '../document-library-additions';
import { docLoaders } from '../document-loaders'; // Ensure docLoaders is imported
import { usStates } from '../usStates';

// Helper to ensure basic translations structure exists for name checking
const ensureBasicTranslations = (doc: any): LegalDocument => {
  if (!doc) {
    // console.warn('[ensureBasicTranslations] Received undefined/null doc');
    return { id: 'unknown', name: 'Unknown Document', category: 'Miscellaneous', schema: z.object({_unknownField: z.string().optional()}), translations: { en: { name: 'Unknown Document', description: '', aliases: [] }, es: { name: 'Documento Desconocido', description: '', aliases: [] } } } as unknown as LegalDocument;
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
  if (!doc.translations.es.name) doc.translations.es.name = doc.name_es || doc.translations.en.name; // Fallback to EN if ES not present

  return doc as LegalDocument;
};


const isValidDocument = (docToCheck: any, docIdForLogging?: string): docToCheck is LegalDocument => {
  if (!docToCheck || typeof docToCheck !== 'object') {
    if (docIdForLogging) console.warn(`[isValidDocument] Invalid/null document object for: ${docIdForLogging}`);
    return false;
  }
  const d = docToCheck as LegalDocument;
  const hasId = d.id && typeof d.id === 'string' && d.id.trim() !== '';
  const hasCategory = d.category && typeof d.category === 'string' && d.category.trim() !== '';
  const hasSchema = d.schema && typeof d.schema.parse === 'function';
  const hasValidEnglishName = d.translations?.en?.name && typeof d.translations.en.name === 'string' && d.translations.en.name.trim() !== '';

  const isValid = hasId && hasCategory && hasSchema && hasValidEnglishName;

  if (docIdForLogging && (docIdForLogging === 'bill-of-sale-vehicle' || docIdForLogging === 'promissory-note')) {
    console.log(`[isValidDocument DEBUG ${docIdForLogging}]: Valid=${isValid}, ID=${hasId}, Cat=${hasCategory}, Schema=${hasSchema}, NameEN=${hasValidEnglishName}, Questions=${d.questions?.length}`);
    if (!isValid) {
        console.warn(`[isValidDocument DEBUG ${docIdForLogging}] Failed validation. Details: ID:${d.id}, Cat:${d.category}, Schema:${!!d.schema}, NameEN:${d.translations?.en?.name}`);
    }
  }
  return isValid;
};

const processBarrel = (barrel: Record<string, any>, countryCode: string): LegalDocument[] => {
  const docs: LegalDocument[] = [];
  console.log(`[document-library processBarrel ${countryCode}] Raw exports found: ${Object.keys(barrel).length}. Keys: ${Object.keys(barrel).join(', ')}`);
  Object.entries(barrel).forEach(([key, exportedDoc]) => {
    if (!exportedDoc || typeof exportedDoc !== 'object') {
        console.warn(`[processBarrel ${countryCode}] Skipping invalid/undefined export for key: ${key}.`);
        return;
    }
    // The exportedDoc here is the module object itself (e.g. { billOfSaleVehicle: { id: ..., ... } })
    // We need to extract the actual document configuration object from it.
    // It's often the value of the property named after the key, or a default export.
    const actualDocConfig = exportedDoc.default || exportedDoc[key] || Object.values(exportedDoc)[0];

    if (!actualDocConfig || typeof actualDocConfig !== 'object' || !actualDocConfig.id) {
        console.warn(`[processBarrel ${countryCode}] Could not extract valid document config from export key: ${key}. Module content:`, Object.keys(exportedDoc));
        return;
    }
     if (actualDocConfig.id === 'bill-of-sale-vehicle' || actualDocConfig.id === 'promissory-note') {
        console.log(`[processBarrel ${countryCode}] Found target doc before basic translation: ${actualDocConfig.id}`);
    }
    const preppedDoc = ensureBasicTranslations(actualDocConfig);

    if (preppedDoc.id === 'bill-of-sale-vehicle' || preppedDoc.id === 'promissory-note') {
        console.log(`[processBarrel ${countryCode}] Target doc after basic translation: ${preppedDoc.id}, Name EN: ${preppedDoc.translations?.en?.name}`);
    }

    if (isValidDocument(preppedDoc, preppedDoc.id)) {
      docs.push(preppedDoc);
    } else {
      // console.warn(`[document-library processBarrel ${countryCode}] Invalid/incomplete doc filtered out:`, preppedDoc ? {id: preppedDoc.id, name: preppedDoc.translations?.en?.name} : 'undefined doc');
    }
  });
  console.log(`[document-library processBarrel ${countryCode}] Valid documents after processing: ${docs.length}, IDs: ${docs.map(d=>d.id).join(', ')}`);
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
  .concat(additionsArray);

const uniqueDocsMap = new Map<string, LegalDocument>();
combinedDocsBeforeDedup.forEach(doc => {
  if (doc && doc.id) {
    if (!uniqueDocsMap.has(doc.id)) {
      uniqueDocsMap.set(doc.id, doc);
    }
  }
});
export const allDocuments: LegalDocument[] = Array.from(uniqueDocsMap.values());
console.log(`[document-library] Combined docs count: ${combinedDocsBeforeDedup.length}, After de-duplication (allDocuments): ${allDocuments.length}`);


const defaultSchema = z.object({
  _fallbackDetails: z.string().optional().describe("Default field for documents without a specific schema."),
});

export function generateIdFromName(nameInput: unknown): string {
  const name = String(nameInput || '');
  if (!name.trim()) return `doc-${Date.now()}${Math.random().toString(36).substring(2, 7)}`;
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

allDocuments.forEach(doc => {
  if (!doc.id) {
    doc.id = generateIdFromName(doc.translations?.en?.name || doc.name);
  }

  if (!doc.schema || typeof doc.schema.parse !== 'function') {
    doc.schema = defaultSchema as any;
  }
  if (!Array.isArray(doc.questions)) {
    doc.questions = [] as Question[];
  }

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
   if (doc.id === 'bill-of-sale-vehicle' || doc.id === 'promissory-note') {
      console.log(`[document-library FINAL_CHECK for ${doc.id}]: Name EN: ${doc.translations.en.name}, Questions: ${doc.questions?.length}, Schema Keys: ${doc.schema?.shape ? Object.keys(doc.schema.shape).join(', ') : (doc.schema?._def?.schema?.shape ? Object.keys(doc.schema._def.schema.shape).join(', ') : 'N/A')}`);
   }
});

export function getDocumentsForCountry(countryCode?: string): LegalDocument[] {
  const code = (countryCode || 'us').toLowerCase();
  return documentLibraryByCountry[code] || documentLibraryByCountry['us'] || [];
}

export const supportedCountries = Object.keys(documentLibraryByCountry);

export const registry: Record<string, LegalDocument> = {};
allDocuments.forEach(doc => {
  if (doc.jurisdiction && doc.id) {
    registry[`${doc.jurisdiction.toLowerCase()}/${doc.id}`] = doc;
  } else if (doc.id) {
    registry[`us/${doc.id}`] = doc;
  }
});


export function getDoc(docId: string, country = 'us'): LegalDocument | undefined {
  return registry[`${country.toLowerCase()}/${docId}`];
}
export { getDoc as getDocument };

export async function loadDoc(docId: string, country = 'us'): Promise<LegalDocument | undefined> {
  const loaderKey = `${country.toLowerCase()}/${docId}`;
  console.log(`[loadDoc] Attempting to load doc for key: ${loaderKey}. Available loaders: ${Object.keys(docLoaders).join(', ')}`);

  const loader = docLoaders[loaderKey];
  if (loader) {
    console.log(`[loadDoc] Found loader for ${loaderKey}. Executing...`);
    try {
      const module = await loader();
      console.log(`[loadDoc] Module loaded for ${loaderKey}. Module keys: ${Object.keys(module).join(', ')}`);

      let docConfig: LegalDocument | undefined = undefined;
      const camelCasedId = docId.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

      if (module[camelCasedId] && typeof module[camelCasedId] === 'object' && module[camelCasedId].id) {
        docConfig = module[camelCasedId] as LegalDocument;
        console.log(`[loadDoc] Found docConfig via camelCasedId ('${camelCasedId}') for ${loaderKey}`);
      } else if (module.default && typeof module.default === 'object' && module.default.id) {
        docConfig = module.default as LegalDocument;
        console.log(`[loadDoc] Found docConfig via default export for ${loaderKey}`);
      } else if (Object.keys(module).length === 1 && typeof Object.values(module)[0] === 'object' && (Object.values(module)[0] as LegalDocument).id) {
        docConfig = Object.values(module)[0] as LegalDocument;
        console.log(`[loadDoc] Found docConfig via single export for ${loaderKey}`);
      } else {
        // Attempt to find a key that matches the docId, possibly with 'Meta' suffix or if it's the only export
        const potentialKey = Object.keys(module).find(k => k.toLowerCase().includes(docId.toLowerCase().replace(/-/g, ''))) || Object.keys(module)[0];
        if (potentialKey && module[potentialKey] && typeof module[potentialKey] === 'object' && (module[potentialKey] as LegalDocument).id) {
            docConfig = module[potentialKey] as LegalDocument;
            console.log(`[loadDoc] Found docConfig via potential key ('${potentialKey}') for ${loaderKey}`);
        } else {
          console.error(`[loadDoc] Document config object not found or invalid structure in module for key: ${loaderKey}. Module content:`, module);
        }
      }

      if (docConfig) {
        return ensureBasicTranslations(docConfig);
      }
      return undefined;

    } catch (error) {
      console.error(`[loadDoc] Error loading document for key ${loaderKey}:`, error);
      return undefined;
    }
  }
  console.warn(`[loadDoc] No loader found in docLoaders for key: ${loaderKey}. Falling back to registry.`);
  return getDoc(docId, country); // Fallback to registry if loader doesn't exist (e.g. for additions not in loaders)
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

    const translation = doc.translations?.[lang] || doc.translations?.en;
    if (!translation || !translation.name) {
        console.warn(`[findMatchingDocuments] Doc ID ${doc.id} is missing translation.name for lang ${lang}. Skipping.`);
        return false;
    }

    const name = translation.name;
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

export { usStates };
export type { Question as DocumentQuestion, LegalDocument as LegalDocumentConfig, UpsellClause } from '@/types/documents';
export { docLoaders };
