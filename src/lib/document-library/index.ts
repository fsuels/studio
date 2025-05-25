// src/lib/document-library/index.ts
import { z } from 'zod';
import type { LegalDocument, LocalizedText } from '@/types/documents';
import { docLoaders } from '../document-loaders';
// Dynamic document discovery will replace explicit barrels

// Helper function to ensure a document object is valid
const isValidDocument = (doc: any): doc is LegalDocument => {
  if (!doc || typeof doc !== 'object' || Array.isArray(doc) || !('id' in doc)) {
    // If it doesn't even look like a document, silently ignore
    return false;
  }

  const hasId = typeof doc.id === 'string' && doc.id.trim() !== '';
  const hasCategory = typeof (doc as any).category === 'string' && (doc as any).category.trim() !== '';
  const hasSchema = (doc as any).schema && typeof (doc as any).schema.parse === 'function';

  // Check for English translation name as the primary indicator of a valid name structure
  const hasValidName =
    ((doc as any).translations && (doc as any).translations.en && typeof (doc as any).translations.en.name === 'string' && (doc as any).translations.en.name.trim() !== '') ||
    (typeof (doc as any).name === 'string' && (doc as any).name.trim() !== '');

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

// Dynamically import all document modules under /src/lib/documents
// Next.js uses webpack, so we use require.context instead of import.meta.glob
type RegistryDoc = Record<string, LegalDocument>;
const modules = (require as any).context('../documents', true, /index\.ts$/);

export const registry: Record<string, LegalDocument> = {};
export const documentLibraryByCountry: Record<string, LegalDocument[]> = {};

for (const path of modules.keys()) {
  const mod = modules(path) as RegistryDoc;
  for (const exported of Object.values(mod)) {
    if (
      exported &&
      typeof exported === 'object' &&
      !Array.isArray(exported) &&
      'id' in exported
    ) {
      const doc = ensureBasicTranslations(exported);
      if (isValidDocument(doc)) {
        const parts = path.split('/');
        const idx = parts.findIndex(p => p === 'documents');
        const country = parts[idx + 1];
        const slug = parts[idx + 2];
        registry[`${country}/${slug}`] = doc;
        if (!documentLibraryByCountry[country]) documentLibraryByCountry[country] = [];
        documentLibraryByCountry[country].push(doc);
        break;
      }
    }
  }
}

export function getDocumentsForCountry(countryCode?: string): LegalDocument[] {
  const code = (countryCode || 'us').toLowerCase();
  return documentLibraryByCountry[code] || documentLibraryByCountry['us'] || [];
}

export const supportedCountries = Object.keys(documentLibraryByCountry);

const tempAllDocuments: LegalDocument[] = Object.values(registry);
console.log(`[document-library] Documents from registry: ${tempAllDocuments.length}`);

export function getDoc(docId: string, country = 'us'): LegalDocument | undefined {
  return registry[`${country}/${docId}`];
}
export { getDoc as getDocument };

export async function loadDoc(
  docId: string,
  country = 'us'
): Promise<LegalDocument | undefined> {
  const loader = docLoaders[`${country}/${docId}`];
  if (!loader) return undefined;
  try {
    return await loader();
  } catch (err) {
    console.error(
      `[document-library] Failed to load document ${country}/${docId}:`,
      err
    );
    return undefined;
  }
}

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
