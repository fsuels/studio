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

  const langCode = lang.toLowerCase();
  const countryCode = (country || doc.jurisdiction || 'us').toLowerCase();

  // Prioritize explicit templatePaths if provided
  if (doc.templatePaths) {
    let path = doc.templatePaths[langCode] || doc.templatePaths['en'];
    if (path) {
      if (!path.startsWith('/')) {
        path = `/templates/${path}`;
      }
      return path.replace('{country}', countryCode);
    }
  }

  // Fallback to old individual properties
  if (langCode === 'es' && doc.templatePath_es) {
    return doc.templatePath_es.replace('{country}', countryCode);
  }
  if (doc.templatePath) {
    return doc.templatePath.replace('{country}', countryCode);
  }

  // Default standardized pattern
  return `/templates/${langCode}/${countryCode}/${doc.id}.md`;
}
