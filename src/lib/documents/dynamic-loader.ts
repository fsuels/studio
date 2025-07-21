/**
 * Dynamic Document Loader
 * Optimizes bundle size by loading document types on-demand
 */

import type { LegalDocument } from '@/types/documents';

type DocumentLoader = () => Promise<{ default: LegalDocument }>;

// Document type mapping for dynamic imports
const US_DOCUMENT_MAP: Record<string, DocumentLoader> = {
  'vehicle-bill-of-sale': () => import('./us/vehicle-bill-of-sale').then(m => ({ default: m.vehicleBillOfSale })),
  'rental-agreement': () => import('./us/rental-agreement').then(m => ({ default: m.rentalAgreement })),
  'employment-contract': () => import('./us/employment-contract').then(m => ({ default: m.employmentContract })),
  'non-disclosure-agreement': () => import('./us/non-disclosure-agreement').then(m => ({ default: m.nonDisclosureAgreement })),
  'promissory-note': () => import('./us/promissory-note').then(m => ({ default: m.promissoryNote })),
  'power-of-attorney': () => import('./us/power-of-attorney').then(m => ({ default: m.powerOfAttorney })),
  'last-will-testament': () => import('./us/last-will-testament').then(m => ({ default: m.lastWillTestament })),
  'living-trust': () => import('./us/living-trust').then(m => ({ default: m.livingTrust })),
  'business-contract': () => import('./us/business-contract').then(m => ({ default: m.businessContract })),
  'lease-agreement': () => import('./us/lease-agreement').then(m => ({ default: m.leaseAgreement })),
  // Add other frequently used documents
};

const CA_DOCUMENT_MAP: Record<string, DocumentLoader> = {
  'promissory-note-ca': () => import('./ca/promissory-note').then(m => ({ default: m.promissoryNote })),
  // Add Canadian documents
};

// Cache for loaded documents to avoid re-imports
const documentCache = new Map<string, LegalDocument>();

/**
 * Dynamically loads a document type on-demand
 * @param jurisdiction - 'us' or 'ca'
 * @param documentType - Document type slug
 * @returns Promise resolving to the document configuration
 */
export async function loadDocument(
  jurisdiction: 'us' | 'ca',
  documentType: string
): Promise<LegalDocument | null> {
  const cacheKey = `${jurisdiction}-${documentType}`;
  
  // Return from cache if already loaded
  if (documentCache.has(cacheKey)) {
    return documentCache.get(cacheKey)!;
  }

  try {
    const documentMap = jurisdiction === 'us' ? US_DOCUMENT_MAP : CA_DOCUMENT_MAP;
    const loader = documentMap[documentType];
    
    if (!loader) {
      console.warn(`Document type '${documentType}' not found in ${jurisdiction} documents`);
      return null;
    }

    const { default: document } = await loader();
    documentCache.set(cacheKey, document);
    
    return document;
  } catch (error) {
    console.error(`Failed to load document ${jurisdiction}/${documentType}:`, error);
    return null;
  }
}

/**
 * Preloads commonly used documents for better UX
 */
export function preloadPopularDocuments() {
  // Preload top 10 most popular documents
  const popularDocs = [
    { jurisdiction: 'us' as const, type: 'vehicle-bill-of-sale' },
    { jurisdiction: 'us' as const, type: 'rental-agreement' },
    { jurisdiction: 'us' as const, type: 'employment-contract' },
    { jurisdiction: 'us' as const, type: 'non-disclosure-agreement' },
    { jurisdiction: 'us' as const, type: 'promissory-note' },
  ];

  popularDocs.forEach(({ jurisdiction, type }) => {
    loadDocument(jurisdiction, type).catch(() => {
      // Silently handle preload failures
    });
  });
}

/**
 * Gets available document types for a jurisdiction
 */
export function getAvailableDocuments(jurisdiction: 'us' | 'ca'): string[] {
  const documentMap = jurisdiction === 'us' ? US_DOCUMENT_MAP : CA_DOCUMENT_MAP;
  return Object.keys(documentMap);
}

// Auto-preload on module load in browser environment
if (typeof window !== 'undefined') {
  // Delay preloading to not block initial page load
  setTimeout(preloadPopularDocuments, 2000);
}