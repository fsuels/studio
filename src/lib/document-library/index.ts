// src/lib/document-library/index.ts
import { z } from 'zod';
import type { LegalDocument, LocalizedText, Question } from '@/types/documents';
import * as us_docs_barrel from '../documents/us';
import * as ca_docs_barrel from '../documents/ca';
import { documentLibraryAdditions } from '../document-library-additions';
import { docLoaders } from '../document-loaders';
import { usStates } from '../usStates';

// Helper to ensure basic translations structure exists for name checking
const ensureBasicTranslations = (doc: any): LegalDocument => {
  if (!doc) {
    // console.warn('[ensureBasicTranslations] Received undefined/null doc');
    // Return a minimal fallback or throw, depending on desired strictness
    return { 
      id: 'unknown', 
      name: 'Unknown Document', 
      category: 'Miscellaneous', 
      schema: z.object({unknownField: z.string().optional()}), // Basic valid Zod schema
      translations: { 
        en: { name: 'Unknown Document', description: '', aliases: [] }, 
        es: { name: 'Documento Desconocido', description: '', aliases: [] } 
      } 
    } as unknown as LegalDocument; // Cast to satisfy, ensure fallback schema is valid
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


const isValidDocument = (docToCheck: any): docToCheck is LegalDocument => {
  if (!docToCheck || typeof docToCheck !== 'object') {
    // console.warn('[isValidDocument] Invalid document object:', docToCheck);
    return false;
  }
  // ensureBasicTranslations should have been called before this
  const d = docToCheck as LegalDocument; 

  const hasId = d && typeof d.id === 'string' && d.id.trim() !== '';
  const hasCategory = d && typeof d.category === 'string' && d.category.trim() !== '';
  const hasSchema = d && d.schema && typeof d.schema.parse === 'function';

  // Check for English translation name as the primary indicator of a valid name structure
  const hasValidEnglishName = d && d.translations?.en?.name && typeof d.translations.en.name === 'string' && d.translations.en.name.trim() !== '';
  
  const isValid = hasId && hasCategory && hasSchema && hasValidEnglishName;

  if (d && (d.id === 'bill-of-sale-vehicle' || d.id === 'promissory-note')) {
    // console.log(`[isValidDocument] Checking ${d.id}: Valid=${isValid}, ID=${hasId}, Cat=${hasCategory}, Schema=${hasSchema}, NameEN=${hasValidEnglishName}`);
    if (!isValid) {
        // console.warn(`[isValidDocument DEBUG ${d.id}] Failed validation. ID:${hasId}, Cat:${hasCategory}, Schema:${hasSchema}, NameEN:${hasValidEnglishName}, Translations:`, d.translations);
    }
  }
  return isValid;
};

const processBarrel = (barrel: Record<string, any>, countryCode: string): LegalDocument[] => {
  const docs: LegalDocument[] = [];
  // console.log(`[document-library] Processing barrel for country: ${countryCode}. Raw exports found: ${Object.keys(barrel).length}`);
  Object.values(barrel).forEach((exportedDoc: any) => {
    if (!exportedDoc || typeof exportedDoc !== 'object') {
        // console.warn(`[processBarrel ${countryCode}] Skipping invalid/undefined export.`);
        return;
    }
    const preppedDoc = ensureBasicTranslations(exportedDoc);

    if (preppedDoc && preppedDoc.id === 'promissory-note') {
        // console.log('[processBarrel] PROMISSORY_NOTE_PRE_VALIDATION (from barrel):', {
            // id: preppedDoc.id,
            // name: preppedDoc.name,
            // name_en_trans: preppedDoc.translations?.en?.name,
            // category: preppedDoc.category,
            // schemaExists: !!preppedDoc.schema,
            // questionsLength: preppedDoc.questions?.length
        // });
    }

    if (isValidDocument(preppedDoc)) {
      // console.log(`[document-library] Valid document found in ${countryCode} barrel: ${preppedDoc.id}`);
      docs.push(preppedDoc);
    } else {
      // console.warn(`[document-library] Invalid or incomplete document object found in ${countryCode} barrel and FILTERED OUT:`, preppedDoc ? {id: preppedDoc.id, name: preppedDoc.translations?.en?.name, category: preppedDoc.category, schemaExists: !!preppedDoc.schema} : 'undefined doc');
    }
  });
  // console.log(`[document-library] Valid documents after processing ${countryCode} barrel: ${docs.length}`);
  // if (countryCode === 'us' && docs.find(d => d.id === 'promissory-note')) {
    // console.log('[document-library] Promissory Note IS present in usDocsArray after processBarrel.');
  // }
  return docs;
};

const usDocsArray: LegalDocument[] = processBarrel(us_docs_barrel, 'us');
const caDocsArray: LegalDocument[] = processBarrel(ca_docs_barrel, 'ca');

// console.log(`[document-library] usDocsArray length: ${usDocsArray.length}`);
// console.log(`[document-library] caDocsArray length: ${caDocsArray.length}`);

const additionsArray: LegalDocument[] = documentLibraryAdditions.map(ensureBasicTranslations).filter(isValidDocument);
// console.log(`[document-library] additionsArray length after filter: ${additionsArray.length}`);


export const documentLibraryByCountry: Record<string, LegalDocument[]> = {
  us: usDocsArray,
  ca: caDocsArray,
};

const combinedDocsBeforeDedup: LegalDocument[] = Object.values(documentLibraryByCountry)
  .flat()
  .concat(additionsArray);

const uniqueDocsMap = new Map<string, LegalDocument>();
combinedDocsBeforeDedup.forEach(doc => {
  if (doc && doc.id) { // Ensure doc and doc.id are valid
    if (!uniqueDocsMap.has(doc.id)) {
      uniqueDocsMap.set(doc.id, doc);
    }
  } else {
    // console.warn('[document-library] Encountered a document without an ID during de-duplication:', doc);
  }
});
export const allDocuments: LegalDocument[] = Array.from(uniqueDocsMap.values());
// console.log(`[document-library] Combined docs before dedup: ${combinedDocsBeforeDedup.length}, After dedup (allDocuments): ${allDocuments.length}`);


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
    // console.warn(`[document-library] FOR_EACH_LOOP: Generated ID for doc without one: ${doc.id} (original name: ${doc.translations?.en?.name || doc.name})`);
  }

  if (!doc.schema || typeof doc.schema.parse !== 'function') {
    // console.warn(`[document-library] FOR_EACH_LOOP: Document ${doc.id} is missing a valid Zod schema. Applying default.`);
    doc.schema = defaultSchema as any; 
  }
  if (!Array.isArray(doc.questions)) {
    // console.warn(`[document-library] FOR_EACH_LOOP: Document ${doc.id} questions is not an array. Setting to empty array.`);
    doc.questions = [] as Question[];
  }

  const baseTranslations = doc.translations || { en: {}, es: {} };
  const enName = baseTranslations.en?.name || doc.name || doc.id;
  const esName = baseTranslations.es?.name || doc.name_es || baseTranslations.en?.name || doc.name || doc.id; 

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
    // if (doc.id === 'promissory-note' || doc.id === 'bill-of-sale-vehicle') {
      // console.log(`[document-library] FOR_EACH_LOOP - FINAL_CHECK for ${doc.id}: Name EN: ${doc.translations.en.name}, Questions: ${doc.questions?.length}, Schema Keys: ${doc.schema?.shape ? Object.keys(doc.schema.shape).join(', ') : (doc.schema?._def?.schema?.shape ? Object.keys(doc.schema._def.schema.shape).join(', ') : 'N/A')}`);
    // }
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
    if (!doc.jurisdiction) {
        // console.warn(`[document-library registry] Document ${doc.id} is missing jurisdiction. Defaulting to 'us'.`);
    }
    registry[`us/${doc.id}`] = doc;
  }
});


export function getDoc(docId: string, country = 'us'): LegalDocument | undefined {
  return registry[`${country.toLowerCase()}/${docId}`];
}
export { getDoc as getDocument };

export async function loadDoc(docId: string, country = 'us'): Promise<LegalDocument | undefined> {
  const loaderKey = `${country.toLowerCase()}/${docId}`;
  const loader = docLoaders[loaderKey];
  if (loader) {
    try {
      const module = await loader();
      const docConfig = module.default || module[docId] || module[docId.replace(/-/g, '_')] || module[docId.replace(/-([a-z])/g, g => g[1].toUpperCase())] || Object.values(module)[0];

      if (docConfig && typeof docConfig === 'object' && 'id' in docConfig) { 
        return ensureBasicTranslations(docConfig as any) as LegalDocument; 
      } else {
        // console.error(`[loadDoc] Document config not found or invalid in module for key: ${loaderKey}`, module);
        return undefined;
      }
    } catch (error) {
      // console.error(`[loadDoc] Error loading document for key ${loaderKey}:`, error);
      return undefined;
    }
  }
  // console.warn(`[loadDoc] No loader found for key: ${loaderKey}. Falling back to registry.`);
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

    const translation = doc.translations?.[lang] || doc.translations?.en;
    if (!translation || !translation.name) {
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
