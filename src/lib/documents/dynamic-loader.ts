/**
 * Dynamic Document Loader (manifest-backed wrapper)
 * Provides the legacy `loadDocument(jurisdiction, type)` signature while
 * delegating to the manifest-driven loader so the UI and backend share a single source.
 */

import type { LegalDocument } from '@/types/documents';
import {
  loadDocument as loadManifestDocument,
  preloadCommonDocuments,
  getDocumentMetadata,
  getAllDocumentMetadata,
} from '@/lib/dynamic-document-loader';

const jurisdictionScopedCache = new Map<string, LegalDocument>();

const buildCacheKey = (jurisdiction: 'us' | 'ca', documentType: string) =>
  `${jurisdiction}:${documentType}`;

const resolveCandidateIds = (
  jurisdiction: 'us' | 'ca',
  documentType: string,
): string[] => {
  const normalizedJurisdiction = jurisdiction.toLowerCase();
  const normalizedType = documentType.trim();
  const normalizedTypeLower = normalizedType.toLowerCase();

  const candidates = new Set<string>();

  if (normalizedType) {
    candidates.add(normalizedType);
    if (normalizedType !== normalizedTypeLower) {
      candidates.add(normalizedTypeLower);
    }
  }

  const typeAlreadyIncludesJurisdiction = normalizedTypeLower.includes(
    normalizedJurisdiction,
  );

  if (!typeAlreadyIncludesJurisdiction && normalizedTypeLower) {
    candidates.add(`${normalizedJurisdiction}-${normalizedTypeLower}`);
    candidates.add(`${normalizedTypeLower}-${normalizedJurisdiction}`);
    candidates.add(`${normalizedJurisdiction}/${normalizedTypeLower}`);
  }

  return Array.from(candidates);
};

export async function loadDocument(
  jurisdiction: 'us' | 'ca',
  documentType: string,
): Promise<LegalDocument | null> {
  const cacheKey = buildCacheKey(jurisdiction, documentType);

  if (jurisdictionScopedCache.has(cacheKey)) {
    return jurisdictionScopedCache.get(cacheKey)!;
  }

  const candidateIds = resolveCandidateIds(jurisdiction, documentType);

  for (const candidate of candidateIds) {
    if (!getDocumentMetadata(candidate)) {
      continue;
    }

    const { document } = await loadManifestDocument(candidate);
    if (document) {
      jurisdictionScopedCache.set(cacheKey, document);
      return document;
    }
  }

  console.warn(
    `Document type '${documentType}' (${jurisdiction}) not found in manifest-backed loader`,
  );
  return null;
}

export function preloadPopularDocuments() {
  void preloadCommonDocuments();
}

export function getAvailableDocuments(jurisdiction: 'us' | 'ca'): string[] {
  const normalizedJurisdiction = jurisdiction.toLowerCase();

  return getAllDocumentMetadata()
    .filter((meta) =>
      meta.jurisdiction?.toLowerCase().startsWith(normalizedJurisdiction),
    )
    .map((meta) => meta.id);
}

if (typeof window !== 'undefined') {
  setTimeout(preloadPopularDocuments, 2000);
}
