// src/lib/document-library/url.ts

export function getDocumentUrl(
  locale: string,
  country: string,
  docId: string,
) {
  return `/${locale}/docs/${country}/${docId}`;
}

export function getDocumentStartUrl(
  locale: string,
  country: string,
  docId: string,
) {
  return `${getDocumentUrl(locale, country, docId)}/start`;
}
