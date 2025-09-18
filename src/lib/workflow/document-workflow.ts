import { getAllDocumentMetadata, type DocumentMetadata } from '@/lib/document-metadata-registry';
import { loadDocument } from '@/lib/dynamic-document-loader';
import type { LegalDocument } from '@/types/documents';

export interface DocumentSummary {
  id: string;
  title: string;
  description: string;
  category: string;
  jurisdiction: string;
  states?: string[];
  requiresNotary?: boolean;
}

interface FilterOptions {
  jurisdiction?: string;
}

const DEFAULT_JURISDICTION = 'us';

const normalize = (value: string | undefined | null) => value?.toLowerCase() ?? '';

const matchesJurisdiction = (
  metadata: DocumentMetadata,
  jurisdiction: string,
) => {
  const normalizedJurisdiction = normalize(jurisdiction);
  const metadataJurisdiction = normalize(metadata.jurisdiction);

  if (!normalizedJurisdiction) return true;
  if (metadataJurisdiction === normalizedJurisdiction) return true;

  if (metadata.states && metadata.states.length) {
    const states = metadata.states.map((state) => state.toLowerCase());
    if (states.includes('all')) return true;
    if (states.includes(normalizedJurisdiction)) return true;
  }

  return false;
};

const mapToSummary = (metadata: DocumentMetadata): DocumentSummary => ({
  id: metadata.id,
  title: metadata.title,
  description: metadata.description,
  category: metadata.category,
  jurisdiction: metadata.jurisdiction,
  states: metadata.states,
  requiresNotary: metadata.requiresNotary,
});

export function getWorkflowCategories(options: FilterOptions = {}): string[] {
  const jurisdiction = options.jurisdiction ?? DEFAULT_JURISDICTION;

  const categories = getAllDocumentMetadata()
    .filter(
      (metadata) =>
        metadata.id !== 'general-inquiry' &&
        matchesJurisdiction(metadata, jurisdiction),
    )
    .map((metadata) => metadata.category);

  return Array.from(new Set(categories)).sort((a, b) => a.localeCompare(b));
}

export function getWorkflowDocumentsByCategory(
  category: string,
  options: FilterOptions = {},
): DocumentSummary[] {
  const jurisdiction = options.jurisdiction ?? DEFAULT_JURISDICTION;
  const normalizedCategory = category.toLowerCase();

  return getAllDocumentMetadata()
    .filter(
      (metadata) =>
        metadata.id !== 'general-inquiry' &&
        metadata.category.toLowerCase() === normalizedCategory &&
        matchesJurisdiction(metadata, jurisdiction),
    )
    .map(mapToSummary)
    .sort((a, b) => a.title.localeCompare(b.title));
}

export async function loadWorkflowDocument(
  documentId: string,
): Promise<LegalDocument | null> {
  const { document } = await loadDocument(documentId);
  return document ?? null;
}
