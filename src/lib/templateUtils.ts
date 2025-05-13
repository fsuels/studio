// src/lib/templateUtils.ts
import type { LegalDocument } from '@/types/documents';

/**
 * Safely retrieves the template path for a document in the requested language,
 * falling back to English.
 * @param doc The legal document object.
 * @param lang The desired language code (e.g., 'es', 'fr').
 * @returns The template path string, or undefined if not found.
 */
export function getTemplatePath(doc: LegalDocument | undefined | null, lang: string): string | undefined {
    if (!doc?.templatePaths) return undefined;
    // Return path for requested language, fallback to English, or return undefined
    return doc.templatePaths[lang] ?? doc.templatePaths['en'];
}