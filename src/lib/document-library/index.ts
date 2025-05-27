// src/lib/document-library/index.ts
import { document as vehicleBillOfSale } from '../documents/us/vehicle-bill-of-sale';
import type { LegalDocument } from '@/types/documents';
import * as us_documents from '../documents/us'; // Renamed to avoid conflict with the 'us' key
import * as ca from '../documents/ca';
// …other countries…

export const documentLibraryByCountry: Record<string, LegalDocument[]> = {
  us: [
    vehicleBillOfSale,
    ...Object.values(us_documents).filter(doc => doc.id !== 'bill-of-sale-vehicle')
  ],
  ca: Object.values(ca),
  // …
};

export function getDocumentsForCountry(countryCode?: string): LegalDocument[] {
  const code = (countryCode || 'us').toLowerCase();
  return documentLibraryByCountry[code] || documentLibraryByCountry['us'];
}

export const supportedCountries = Object.keys(documentLibraryByCountry);

export const allDocuments: LegalDocument[] = Object.values(
  documentLibraryByCountry,
).flat();

export default documentLibraryByCountry['us'];
