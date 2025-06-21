/**
 * React hook for dynamic document loading
 * Provides loading states and error handling for document types
 */

import { useState, useEffect } from 'react';
import type { LegalDocument } from '@/types/documents';
import { loadDocument } from '@/lib/documents/dynamic-loader';

interface UseDocumentState {
  document: LegalDocument | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook for dynamically loading document types
 * @param jurisdiction - 'us' or 'ca'
 * @param documentType - Document type slug
 * @returns Document state with loading and error states
 */
export function useDocument(
  jurisdiction: 'us' | 'ca' | null,
  documentType: string | null
): UseDocumentState {
  const [state, setState] = useState<UseDocumentState>({
    document: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!jurisdiction || !documentType) {
      setState({ document: null, loading: false, error: null });
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    loadDocument(jurisdiction, documentType)
      .then(document => {
        setState({
          document,
          loading: false,
          error: document ? null : `Document type '${documentType}' not found`,
        });
      })
      .catch(error => {
        setState({
          document: null,
          loading: false,
          error: error.message || 'Failed to load document',
        });
      });
  }, [jurisdiction, documentType]);

  return state;
}

/**
 * Hook for preloading multiple documents
 * Useful for preloading documents the user might access next
 */
export function usePreloadDocuments() {
  const preloadDocument = (jurisdiction: 'us' | 'ca', documentType: string) => {
    loadDocument(jurisdiction, documentType).catch(() => {
      // Silently handle preload failures
    });
  };

  const preloadMultiple = (documents: Array<{ jurisdiction: 'us' | 'ca'; type: string }>) => {
    documents.forEach(({ jurisdiction, type }) => {
      preloadDocument(jurisdiction, type);
    });
  };

  return { preloadDocument, preloadMultiple };
}