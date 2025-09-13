// Dynamic document loader - loads document implementations on demand
import type { LegalDocument } from '@/types/documents';
import { getDocumentMetadata, type DocumentMetadata } from './document-metadata-registry';

export interface DocumentLoadResult {
  document: LegalDocument | null;
  metadata: DocumentMetadata | null;
  source: 'cache' | 'dynamic-import' | 'fallback';
  error?: string;
}

// Cache for loaded documents to avoid repeated imports
const documentCache = new Map<string, LegalDocument>();

// Document import mappings - temporarily empty to test build performance
const DOCUMENT_IMPORTS: Record<string, () => Promise<{ default?: LegalDocument; [key: string]: any }>> = {
  // Temporarily disabled for build testing
  // 'vehicle-bill-of-sale': () => import('./documents/us/vehicle-bill-of-sale'),
  // 'bill-of-sale-vehicle': () => import('./documents/us/vehicle-bill-of-sale'), // Alias
  // Add more specific imports as documents are verified and optimized
  // 'basic-nda': () => import('./documents/us/basic-nda'),
  // 'power-of-attorney': () => import('./documents/us/power-of-attorney'),
};

/**
 * Dynamically load a document implementation without bundling everything upfront
 */
export async function loadDocument(docId: string): Promise<DocumentLoadResult> {
  const metadata = getDocumentMetadata(docId);

  // Check cache first
  if (documentCache.has(docId)) {
    return {
      document: documentCache.get(docId)!,
      metadata,
      source: 'cache'
    };
  }

  // Try dynamic import if we have a mapping
  const importFn = DOCUMENT_IMPORTS[docId];
  if (importFn) {
    try {
      const module = await importFn();

      // Find the document in the module exports
      let document: LegalDocument | null = null;

      // Check default export first
      if (module.default && isValidDocument(module.default, docId)) {
        document = module.default;
      } else {
        // Check named exports
        const candidate = Object.values(module).find(
          (value: any) => isValidDocument(value, docId)
        ) as LegalDocument | undefined;

        if (candidate) {
          document = candidate;
        }
      }

      if (document) {
        // Enrich the document with metadata if needed
        enrichDocumentWithMetadata(document, metadata);

        // Cache the result
        documentCache.set(docId, document);

        return {
          document,
          metadata,
          source: 'dynamic-import'
        };
      }

      return {
        document: null,
        metadata,
        source: 'fallback',
        error: `Document ${docId} found in module but not valid`
      };

    } catch (error) {
      console.warn(`Failed to load document ${docId}:`, error);
      return {
        document: null,
        metadata,
        source: 'fallback',
        error: error instanceof Error ? error.message : 'Unknown import error'
      };
    }
  }

  // No import mapping found
  return {
    document: null,
    metadata,
    source: 'fallback',
    error: `No import mapping found for document ${docId}`
  };
}

/**
 * Load multiple documents efficiently
 */
export async function loadDocuments(docIds: string[]): Promise<Map<string, DocumentLoadResult>> {
  const results = new Map<string, DocumentLoadResult>();

  // Load documents in parallel
  const loadPromises = docIds.map(async (docId) => {
    const result = await loadDocument(docId);
    results.set(docId, result);
  });

  await Promise.all(loadPromises);
  return results;
}

/**
 * Pre-load commonly used documents for better performance
 */
export async function preloadCommonDocuments(): Promise<void> {
  const commonDocuments = ['vehicle-bill-of-sale', 'basic-nda'];

  // Load in background without blocking
  commonDocuments.forEach(docId => {
    loadDocument(docId).catch(error => {
      console.warn(`Failed to preload ${docId}:`, error);
    });
  });
}

/**
 * Check if an object is a valid document implementation
 */
function isValidDocument(obj: any, expectedId?: string): obj is LegalDocument {
  if (!obj || typeof obj !== 'object') return false;

  const hasRequiredFields = !!(
    obj.id &&
    typeof obj.id === 'string' &&
    obj.schema &&
    typeof obj.schema === 'object' &&
    typeof obj.schema.parse === 'function'
  );

  if (!hasRequiredFields) return false;

  // If we have an expected ID, verify it matches
  if (expectedId && obj.id !== expectedId) return false;

  return true;
}

/**
 * Enrich document with metadata for consistency
 */
function enrichDocumentWithMetadata(document: LegalDocument, metadata: DocumentMetadata | null): void {
  if (!metadata) return;

  // Ensure translations exist
  if (!document.translations) {
    document.translations = metadata.translations;
  }

  // Ensure category is set
  if (!document.category) {
    document.category = metadata.category;
  }

  // Add any missing fields from metadata
  if (metadata.requiresNotary !== undefined && document.requiresNotary === undefined) {
    document.requiresNotary = metadata.requiresNotary;
  }
}

/**
 * Get available document IDs that can be dynamically loaded
 */
export function getAvailableDocumentIds(): string[] {
  return Object.keys(DOCUMENT_IMPORTS);
}

/**
 * Clear the document cache (useful for development/testing)
 */
export function clearDocumentCache(): void {
  documentCache.clear();
}

// Re-export metadata functions for convenience
export {
  getAllDocumentMetadata,
  getDocumentMetadata,
  searchDocumentMetadata
} from './document-metadata-registry';