// src/lib/document-library/url.ts

/**
 * Generates the URL for the document's informational detail page.
 * Example: /en/docs/us/bill-of-sale-vehicle
 */
export function getDocumentUrl(
  locale: string,
  country: string,
  docId: string
): string {
  return `/${locale}/docs/${country.toLowerCase()}/${docId}`;
}

/**
 * Generates the URL for the document's wizard/start page.
 * Example: /en/docs/us/bill-of-sale-vehicle/start
 */
export function getDocumentStartUrl(
  locale: string,
  country: string,
  docId: string
): string {
  return `/${locale}/docs/${country.toLowerCase()}/${docId}/start`;
}
