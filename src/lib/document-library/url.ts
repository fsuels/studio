// src/lib/document-library/url.ts

export function getDocumentUrl(
  locale: string,
  country: string,
  docId: string,
  step: 'start' | 'review' | 'share' = 'start'
) {
  return `/${locale}/docs/${country}/${docId}/${step}`;
}

