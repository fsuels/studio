// src/lib/document-library/index.ts
import type { LegalDocument } from '@/types/documents';
import registry from './registry.json';
import { docLoaders } from '../document-loaders';
import { usStates, caProvinces } from './utils';
import { getDocumentUrl, getDocumentStartUrl } from './url';

export const documentLibrary: LegalDocument[] = registry as unknown as LegalDocument[];

export const documentLibraryByCountry: Record<string, LegalDocument[]> = {};
for (const doc of documentLibrary) {
  const c = doc.jurisdiction?.toLowerCase() || 'us';
  if (!documentLibraryByCountry[c]) documentLibraryByCountry[c] = [];
  documentLibraryByCountry[c].push(doc);
}

export const supportedCountries = Object.keys(documentLibraryByCountry);

export function getDocumentsForCountry(country: string): LegalDocument[] {
  return documentLibraryByCountry[country.toLowerCase()] || [];
}

export function getDocumentById(id: string, country?: string): LegalDocument | undefined {
  if (country) return getDocumentsForCountry(country).find(d => d.id === id);
  return documentLibrary.find(d => d.id === id);
}

export async function loadDoc(id: string, country = 'us'): Promise<LegalDocument | undefined> {
  const loader = docLoaders[`${country.toLowerCase()}/${id}`];
  return loader ? loader() : undefined;
}

export function findMatchingDocuments(query: string, locale: 'en' | 'es', state?: string): LegalDocument[] {
  const q = query.trim().toLowerCase();
  return documentLibrary.filter(doc => {
    if (state && doc.states !== 'all' && Array.isArray(doc.states) && !doc.states.includes(state)) {
      return false;
    }
    const t = doc.translations?.[locale] ?? doc.translations?.en ?? { name: doc.name, aliases: [] };
    const haystack = [doc.id, doc.name, t.name, ...(t.aliases || [])].join(' ').toLowerCase();
    return haystack.includes(q);
  });
}

export { usStates, caProvinces, getDocumentUrl, getDocumentStartUrl };
