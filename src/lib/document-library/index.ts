// src/lib/document-library/index.ts
import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import type { LegalDocument } from '@/types/documents';

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));
const documentsDir = join(__dirname, '../documents');

function loadDocumentsForCountry(code: string): LegalDocument[] {
  try {
    const mod = require(join(documentsDir, code));
    return Object.values(mod) as LegalDocument[];
  } catch {
    return [];
  }
}

export const documentLibraryByCountry: Record<string, LegalDocument[]> = {};

for (const entry of readdirSync(documentsDir, { withFileTypes: true })) {
  if (entry.isDirectory()) {
    documentLibraryByCountry[entry.name] = loadDocumentsForCountry(entry.name);
  }
}

export function getDocumentsForCountry(countryCode?: string): LegalDocument[] {
  const code = (countryCode || 'us').toLowerCase();
  return documentLibraryByCountry[code] || documentLibraryByCountry['us'] || [];
}

export const supportedCountries = Object.keys(documentLibraryByCountry);

export const allDocuments: LegalDocument[] = Object.values(documentLibraryByCountry).flat();

export const documentLibrary = getDocumentsForCountry('us');

export default documentLibrary;

export { documentLibraryByCountry };

export { usStates } from '../usStates';
export type { Question, UpsellClause } from '@/types/documents';
