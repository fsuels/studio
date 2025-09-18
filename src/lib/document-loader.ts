// Document loader service bridging legacy consumers onto the manifest-backed loader

import type { LegalDocument } from '@/types/documents';
import { DOCUMENT_REGISTRY, type DocumentInfo } from '@/lib/document-registry';
import {
  logDocumentGenerationError,
  logDocumentGenerationStart,
  logDocumentGenerationSuccess,
} from './logging/document-generation-logger';
import { loadDocument as loadManifestDocument } from '@/lib/dynamic-document-loader';

export interface DocumentLoadResult {
  document: LegalDocument | null;
  metadata: DocumentInfo | null;
  source: 'manifest' | 'json' | 'fallback';
  error?: string;
}

/**
 * Safely load a document definition without causing webpack bundling issues.
 * Legacy callers expect this function to provide a usable LegalDocument or a
 * metadata-derived fallback; we now delegate to the manifest loader first.
 */
export async function loadDocumentDefinition(docId: string): Promise<DocumentLoadResult> {
  const baseContext = { documentId: docId };
  const start = logDocumentGenerationStart('legacy.loadDocumentDefinition', baseContext);

  const metadata = DOCUMENT_REGISTRY.find((doc) => doc.id === docId) ?? null;
  const manifestContext = { ...baseContext, attempt: 'manifest-loader' };

  try {
    const manifestResult = await loadManifestDocument(docId);

    if (manifestResult.document) {
      logDocumentGenerationSuccess(
        'legacy.loadDocumentDefinition',
        start,
        manifestContext,
        {
          source: manifestResult.source,
        },
      );

      return {
        document: manifestResult.document,
        metadata,
        source: 'manifest',
      };
    }

    if (manifestResult.error) {
      logDocumentGenerationError(
        'legacy.loadDocumentDefinition',
        start,
        manifestContext,
        new Error(manifestResult.error),
      );
    }
  } catch (error) {
    logDocumentGenerationError('legacy.loadDocumentDefinition', start, manifestContext, error as Error);
  }

  if (metadata) {
    const fallbackDocument: LegalDocument = {
      id: docId,
      name: metadata.title,
      description: metadata.description,
      category: metadata.category,
      jurisdiction: metadata.jurisdiction,
      schema: null as any,
      questions: [],
      translations: {
        en: {
          name: metadata.title,
          description: metadata.description,
          aliases: metadata.aliases ?? [],
        },
        es: {
          name: metadata.title,
          description: metadata.description,
          aliases: metadata.aliases ?? [],
        },
      },
      languageSupport: ['en', 'es'],
      basePrice: 0,
      requiresNotarization: metadata.requiresNotary ?? false,
      canBeRecorded: metadata.officialForm ?? false,
      offerNotarization: metadata.requiresNotary ?? false,
      offerRecordingHelp: false,
      states: metadata.states,
      aliases: metadata.aliases,
      aliases_es: metadata.aliases,
      keywords: metadata.tags,
      searchTerms: metadata.aliases,
    };

    logDocumentGenerationSuccess('legacy.loadDocumentDefinition', start, baseContext, {
      source: metadata.configType === 'json' ? 'json' : 'fallback',
    });

    return {
      document: fallbackDocument,
      metadata,
      source: metadata.configType === 'json' ? 'json' : 'fallback',
    };
  }

  const error = new Error(`No document definition found for ${docId}`);
  logDocumentGenerationError('legacy.loadDocumentDefinition', start, baseContext, error);

  return {
    document: null,
    metadata: null,
    source: 'fallback',
    error: error.message,
  };
}

/**
 * Get document metadata without loading the full definition
 */
export function getDocumentMetadata(docId: string): DocumentInfo | null {
  return DOCUMENT_REGISTRY.find((doc) => doc.id === docId) || null;
}

/**
 * Get all available documents
 */
export function getAllDocuments(): DocumentInfo[] {
  return DOCUMENT_REGISTRY;
}

/**
 * Check if a document exists in the registry
 */
export function documentExists(docId: string): boolean {
  return DOCUMENT_REGISTRY.some((doc) => doc.id === docId);
}
