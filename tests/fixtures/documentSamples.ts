import type { LegalDocument } from '@/types/documents';
import { documentLibraryAdditions } from '@/lib/document-library-additions';

const SAMPLE_DOCUMENT_IDS = [
  'nda-contract',
  'partnership-agreement-add',
  'employment-contract-add',
];

const additionsById = new Map(
  documentLibraryAdditions.map((doc) => [doc.id, doc] as const),
);

export function getSampleDocuments(): LegalDocument[] {
  return SAMPLE_DOCUMENT_IDS.map((id) => {
    const document = additionsById.get(id);

    if (!document) {
      throw new Error(`Sample document not found: ${id}`);
    }

    return document;
  });
}

export const sampleDocumentIds = [...SAMPLE_DOCUMENT_IDS];
