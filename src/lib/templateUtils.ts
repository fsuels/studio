// src/lib/templateUtils.ts
import type { LegalDocument } from '@/types/documents';

/**
 * Safely retrieves the template path for a document in the requested language.
 * It prioritizes the `templatePaths` object, then falls back to `templatePath` (for English)
 * or `templatePath_es` (for Spanish if `lang` is 'es').
 * @param doc The legal document object.
 * @param lang The desired language code (e.g., 'es', 'en', 'fr').
 * @returns The template path string (relative to /public), or undefined if not found.
 */
export function getTemplatePath(
  doc: LegalDocument | undefined | null,
  lang: string,
  country?: string
): string | undefined {
  if (!doc) return undefined;

  // Allow explicit paths on the document for backwards compatibility
  if (doc.templatePaths?.[lang]) {
    return doc.templatePaths[lang];
  }
  if (lang === 'es' && doc.templatePath_es) return doc.templatePath_es;
  if (lang === 'en' && doc.templatePath) return doc.templatePath;

  const countryCode = (country || doc.jurisdiction || 'US').toLowerCase();
  return `/templates/${lang}/${countryCode}/${doc.id}.md`;
}
