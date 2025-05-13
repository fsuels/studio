// src/lib/document-library/index.ts
import type { LegalDocument } from '@/types/documents';
import * as us from '../documents/us';
import * as ca from '../documents/ca';
// …other countries…

export const documentLibraryByCountry: Record<string, LegalDocument[]> = {
  us: Object.values(us),
  ca: Object.values(ca),
  // …
};

export function getDocumentsForCountry(countryCode?: string): LegalDocument[] {
  const code = (countryCode || 'us').toLowerCase();
  return documentLibraryByCountry[code] || documentLibraryByCountry['us'];
}

export const supportedCountries = Object.keys(documentLibraryByCountry);

export const allDocuments: LegalDocument[] = Object.values(documentLibraryByCountry).flat();

export default documentLibraryByCountry['us'];
