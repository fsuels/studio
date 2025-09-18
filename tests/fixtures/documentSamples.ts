import type { LegalDocument } from '@/types/documents';
import { loadWorkflowDocument } from '@/lib/workflow/document-workflow';

const SAMPLE_DOCUMENT_IDS = [
  'non-disclosure-agreement',
  'partnership-agreement',
  'employment-contract',
];

export async function loadSampleDocuments(): Promise<LegalDocument[]> {
  const documents = await Promise.all(
    SAMPLE_DOCUMENT_IDS.map(async (id) => {
      const doc = await loadWorkflowDocument(id);
      if (!doc) {
        throw new Error(`Sample document not found: ${id}`);
      }
      return doc;
    }),
  );

  return documents;
}

export const sampleDocumentIds = [...SAMPLE_DOCUMENT_IDS];
