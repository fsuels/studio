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
): string | undefined {
  if (!doc) return undefined;

  // Prioritize the new templatePaths structure
  if (doc.templatePaths) {
    if (doc.templatePaths[lang]) {
      return doc.templatePaths[lang];
    }
    // Fallback to English if the specific language is not found in templatePaths
    if (doc.templatePaths['en']) {
      return doc.templatePaths['en'];
    }
  }

  // Fallback to old individual properties if templatePaths is not defined or doesn't have the lang/en
  if (lang === 'es' && doc.templatePath_es) {
    return doc.templatePath_es;
  }
  if (doc.templatePath) {
    // Default to templatePath if lang is 'en' or as a last resort
    return doc.templatePath;
  }

  return undefined; // No suitable template path found
}
