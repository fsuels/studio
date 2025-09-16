// Document loader service with safe static imports
import type { LegalDocument } from '@/types/documents';
import { DOCUMENT_REGISTRY, type DocumentInfo } from '@/lib/document-registry';

// Static imports for known documents that actually exist - this avoids dynamic import issues
const documentLoaders: Record<string, () => Promise<{ default?: LegalDocument; [key: string]: any }>> = {
  'vehicle-bill-of-sale': () => import('@/lib/documents/us/vehicle-bill-of-sale'),
  'bill-of-sale-vehicle': () => import('@/lib/documents/us/vehicle-bill-of-sale'),
  // Add more entries here only for documents that actually exist in the filesystem
};

export interface DocumentLoadResult {
  document: LegalDocument | null;
  metadata: DocumentInfo | null;
  source: 'typescript' | 'json' | 'fallback';
  error?: string;
}

/**
 * Safely load a document definition without causing webpack bundling issues
 */
export async function loadDocumentDefinition(docId: string): Promise<DocumentLoadResult> {
  // First, check if we have metadata for this document
  const metadata = DOCUMENT_REGISTRY.find(doc => doc.id === docId);
  
  // If we have a static loader for this document, use it
  const loader = documentLoaders[docId];
  if (loader) {
    try {
      const module = await loader();
      
      // Try to find the document in the module
      let document: LegalDocument | null = null;
      
      // Check default export first
      if (module.default && typeof module.default === 'object' && module.default.id === docId) {
        document = module.default;
      } else {
        // Check named exports
        const candidate = Object.values(module).find(
          (value: any) => value && typeof value === 'object' && value.id === docId && value.schema
        ) as LegalDocument | undefined;
        
        if (candidate) {
          document = candidate;
        }
      }
      
      if (document) {
        return {
          document,
          metadata,
          source: 'typescript'
        };
      }
    } catch (error) {
      console.warn(`Failed to load TypeScript document ${docId}:`, error);
    }
  }
  
  // For JSON-based documents or fallback, create a minimal document structure
  if (metadata) {
    const fallbackDocument: LegalDocument = {
      id: docId,
      name: metadata.title,
      description: metadata.description,
      category: metadata.category,
      schema: null as any, // Will be handled by config loader
      questions: [], // Will be loaded dynamically
      basePrice: 0,
      requiresNotarization: metadata.requiresNotary || false,
      canBeRecorded: false,
      offerNotarization: false,
      offerRecordingHelp: false,
      languageSupport: ['en', 'es']
    };
    
    return {
      document: fallbackDocument,
      metadata,
      source: metadata.configType === 'json' ? 'json' : 'fallback'
    };
  }
  
  // Ultimate fallback for unknown documents
  const unknownDocument: LegalDocument = {
    id: docId,
    name: docId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    description: `Document template for ${docId}`,
    category: 'General',
    schema: null as any,
    questions: [],
    basePrice: 0,
    requiresNotarization: false,
    canBeRecorded: false,
    offerNotarization: false,
    offerRecordingHelp: false,
    languageSupport: ['en', 'es']
  };
  
  return {
    document: unknownDocument,
    metadata: null,
    source: 'fallback',
    error: `No document definition found for ${docId}`
  };
}

/**
 * Get document metadata without loading the full definition
 */
export function getDocumentMetadata(docId: string): DocumentInfo | null {
  return DOCUMENT_REGISTRY.find(doc => doc.id === docId) || null;
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
  return DOCUMENT_REGISTRY.some(doc => doc.id === docId) || Object.prototype.hasOwnProperty.call(documentLoaders, docId);
}