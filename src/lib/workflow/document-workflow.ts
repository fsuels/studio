import { getAllDocumentMetadata, type DocumentMetadata } from '@/lib/document-metadata-registry';
import { loadDocument } from '@/lib/dynamic-document-loader';
import type { LegalDocument } from '@/types/documents';
import { preprocessQuery } from '@/lib/search/comprehensive-synonym-map';
import type { SearchResult } from '@/lib/document-library';

export interface DocumentSummary {
  id: string;
  title: string;
  description: string;
  category: string;
  jurisdiction: string;
  states?: string[];
  requiresNotary?: boolean;
  tags?: string[];
  aliases?: string[];
  translations: DocumentMetadata['translations'];
  languageSupport: string[];
  basePrice?: number;
  canBeRecorded?: boolean;
}

interface FilterOptions {
  jurisdiction?: string;
  state?: string;
  language?: 'en' | 'es';
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

const matchesState = (metadata: DocumentMetadata, state?: string) => {
  if (!state) return true;

  const normalizedState = state.toLowerCase();
  if (!metadata.states || metadata.states.length === 0) {
    return true;
  }

  const states = metadata.states.map((value) => value.toLowerCase());
  if (states.includes('all')) return true;
  return states.includes(normalizedState);
};

const mapToSummary = (metadata: DocumentMetadata): DocumentSummary => ({
  id: metadata.id,
  title: metadata.title,
  description: metadata.description,
  category: metadata.category,
  jurisdiction: metadata.jurisdiction,
  states: metadata.states,
  requiresNotary: metadata.requiresNotary,
  tags: metadata.tags,
  aliases: metadata.aliases,
  translations: metadata.translations,
  languageSupport: [
    'en',
    ...(metadata.translations?.es?.name ? ['es'] : []),
  ],
  basePrice: undefined,
  canBeRecorded: undefined,
});

const matchesQuery = (
  metadata: DocumentMetadata,
  tokens: string[],
  language: 'en' | 'es',
) => {
  if (tokens.length === 0) return true;

  const translation = metadata.translations?.[language] ?? metadata.translations?.en;

  const searchSpace: string[] = [
    metadata.title,
    metadata.description,
    ...(metadata.aliases ?? []),
    ...(metadata.tags ?? []),
    translation?.name,
    translation?.description,
    ...(translation?.aliases ?? []),
  ]
    .filter(Boolean)
    .map((value) => value!.toLowerCase());

  return tokens.every((token) =>
    searchSpace.some((text) => text.includes(token)),
  );
};

export function getWorkflowCategories(options: FilterOptions = {}): string[] {
  const jurisdiction = options.jurisdiction ?? DEFAULT_JURISDICTION;
  const state = options.state;

  const categories = getAllDocumentMetadata()
    .filter(
      (metadata) =>
        metadata.id !== 'general-inquiry' &&
        matchesJurisdiction(metadata, jurisdiction) &&
        matchesState(metadata, state),
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
        matchesJurisdiction(metadata, jurisdiction) &&
        matchesState(metadata, options.state),
    )
    .map(mapToSummary)
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function getWorkflowDocuments(options: FilterOptions = {}): DocumentSummary[] {
  const jurisdiction = options.jurisdiction ?? DEFAULT_JURISDICTION;

  return getAllDocumentMetadata()
    .filter(
      (metadata) =>
        metadata.id !== 'general-inquiry' &&
        matchesJurisdiction(metadata, jurisdiction) &&
        matchesState(metadata, options.state),
    )
    .map(mapToSummary)
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function searchWorkflowDocuments(
  query: string,
  options: FilterOptions = {},
): DocumentSummary[] {
  const normalizedQuery = preprocessQuery(query || '');
  const tokens = normalizedQuery
    .split(/\s+/)
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean);

  if (tokens.length === 0) {
    return getWorkflowDocuments(options);
  }

  const jurisdiction = options.jurisdiction ?? DEFAULT_JURISDICTION;
  const language = options.language ?? 'en';

  return getAllDocumentMetadata()
    .filter(
      (metadata) =>
        metadata.id !== 'general-inquiry' &&
        matchesJurisdiction(metadata, jurisdiction) &&
        matchesState(metadata, options.state) &&
        matchesQuery(metadata, tokens, language),
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

export function getWorkflowDocumentById(
  documentId: string,
): DocumentSummary | undefined {
  return getWorkflowDocuments().find((doc) => doc.id === documentId);
}
