// src/lib/document-library/index.ts
// Master registry for legal documents, organized by country.

import type { LegalDocument } from '@/types/documents';

// Import all documents from each supported country namespace
import * as us from '../documents/us';
import * as ca from '../documents/ca';
// Import namespaces for other countries as they are added
// import * as uk from '../documents/uk';
// import * as au from '../documents/au';
// import * as nz from '../documents/nz';
// import * as sg from '../documents/sg';
// import * as mx from '../documents/mx';
// import * as es from '../documents/es';
// import * as co from '../documents/co';
// import * as cl from '../documents/cl';

// Aggregate documents into a record keyed by country code
export const documentLibraryByCountry: Record<string, LegalDocument[]> = {
  us: Object.values(us),
  ca: Object.values(ca),
  // uk: Object.values(uk),
  // au: Object.values(au),
  // nz: Object.values(nz),
  // sg: Object.values(sg),
  // mx: Object.values(mx),
  // es: Object.values(es),
  // co: Object.values(co),
  // cl: Object.values(cl),
};

// Helper to get documents for a specific country (defaults to US)
export function getDocumentsForCountry(countryCode?: string): LegalDocument[] {
  const code = (countryCode || 'us').toLowerCase();
  return documentLibraryByCountry[code] || documentLibraryByCountry['us'];
}

// List of supported country codes
export const supportedCountries = Object.keys(documentLibraryByCountry);

// Flat list of all documents
export const allDocuments: LegalDocument[] = Object.values(documentLibraryByCountry).flat();

// Default export = US library (for backward compatibility)
export default documentLibraryByCountry['us'];
