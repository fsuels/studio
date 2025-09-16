// Document metadata registry - lightweight document information without implementations
// This allows fast enumeration and search without loading heavy document code

import {
  DOCUMENT_METADATA as GENERATED_METADATA,
  DOCUMENT_MANIFEST,
} from './documents/manifest.generated';

export interface DocumentMetadata {
  id: string;
  title: string;
  description: string;
  category: string;
  jurisdiction: string;
  tags: string[];
  aliases: string[];
  requiresNotary?: boolean;
  officialForm?: boolean;
  states?: string[];
  estimatedTime?: string; // e.g., "5 minutes"
  complexity?: 'simple' | 'intermediate' | 'complex';
  translations: {
    en: {
      name: string;
      description: string;
      aliases: string[];
    };
    es: {
      name: string;
      description: string;
      aliases: string[];
    };
  };
}

const normalizeStrings = (values: string[]): string[] => {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
};

const mapGeneratedToDocumentMetadata = (): Record<string, DocumentMetadata> => {
  const entries: Array<[string, DocumentMetadata]> = Object.values(GENERATED_METADATA).map(
    (meta) => {
      const tags = meta.tags?.length
        ? meta.tags
        : normalizeStrings([
            ...meta.translations.en.aliases,
            ...meta.translations.es.aliases,
            meta.category,
          ]);

      return [
        meta.id,
        {
          id: meta.id,
          title: meta.title || meta.translations.en.name || meta.id,
          description: meta.description || meta.translations.en.description || '',
          category: meta.category || 'Uncategorized',
          jurisdiction: meta.jurisdiction || 'us',
          tags,
          aliases: normalizeStrings([
            ...(meta.aliases || []),
            ...meta.translations.en.aliases,
            ...meta.translations.es.aliases,
          ]),
          requiresNotary: meta.requiresNotary,
          officialForm: meta.officialForm,
          states: meta.states,
          estimatedTime: meta.estimatedTime,
          complexity: meta.complexity,
          translations: meta.translations,
        },
      ];
    },
  );

  return Object.fromEntries(entries);
};

// Lightweight metadata for all documents - generated automatically
export const DOCUMENT_METADATA: Record<string, DocumentMetadata> = mapGeneratedToDocumentMetadata();

// Helper functions for metadata operations
export function getDocumentMetadata(docId: string): DocumentMetadata | null {
  return DOCUMENT_METADATA[docId] || null;
}

export function getAllDocumentMetadata(): DocumentMetadata[] {
  return Object.values(DOCUMENT_METADATA);
}

export function getDocumentsByCategory(category: string): DocumentMetadata[] {
  const normalizedCategory = category.toLowerCase();
  return Object.values(DOCUMENT_METADATA).filter(
    (doc) => doc.category.toLowerCase() === normalizedCategory,
  );
}

export function getDocumentsByJurisdiction(jurisdiction: string): DocumentMetadata[] {
  const normalizedJurisdiction = jurisdiction.toLowerCase();
  return Object.values(DOCUMENT_METADATA).filter(
    (doc) => doc.jurisdiction.toLowerCase() === normalizedJurisdiction,
  );
}

export function searchDocumentMetadata(
  query: string,
  lang: 'en' | 'es' = 'en',
): DocumentMetadata[] {
  const searchTerms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((term) => term.length > 1);

  if (searchTerms.length === 0) {
    return getAllDocumentMetadata();
  }

  return Object.values(DOCUMENT_METADATA).filter((doc) => {
    const translation = doc.translations[lang] || doc.translations.en;
    const searchableText = [
      translation.name,
      translation.description,
      ...translation.aliases,
      ...doc.tags,
      ...doc.aliases,
      doc.category,
    ]
      .join(' ')
      .toLowerCase();

    return searchTerms.some((term) => searchableText.includes(term));
  });
}

export function getManifestEntries() {
  return DOCUMENT_MANIFEST;
}
