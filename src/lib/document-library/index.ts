// src/lib/document-library/index.ts
import type { DocumentDefinition } from '@/types/document';
import * as us from '../documents/us';
import * as ca from '../documents/ca';
// …other countries…

export const documentLibraryByCountry: Record<string, DocumentDefinition[]> = {
  us: Object.values(us) as DocumentDefinition[],
  ca: Object.values(ca) as DocumentDefinition[],
  // …
};

export function getDocumentsForCountry(countryCode?: string): DocumentDefinition[] {
  const code = (countryCode || 'us').toLowerCase();
  return documentLibraryByCountry[code] || documentLibraryByCountry['us'];
}

export const supportedCountries = Object.keys(documentLibraryByCountry);

export const allDocuments: DocumentDefinition[] = Object.values(
  documentLibraryByCountry,
).flat();

export default documentLibraryByCountry['us'];
