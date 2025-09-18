import type { LegalDocument, LocalizedText } from '@/types/documents';
import type { DocumentSummary } from '@/lib/workflow/document-workflow';

/**
 * Safely retrieves the localized text object (name, description, aliases)
 * for a document in the requested language, falling back to English.
 * @param doc The legal document object.
 * @param lang The desired language code (e.g., 'es', 'en').
 * @returns The LocalizedText object for the language or English fallback.
 */
export function getDocTranslation(
  doc: LegalDocument | DocumentSummary | null | undefined,
  lang: string,
): LocalizedText {
  // Base fallback if no document or no translations
  if (!doc || !doc.translations) {
    return {
      name: doc?.id || 'Untitled Document',
      description: '',
      aliases: [],
    };
  }

  // Try requested language
  const localized = doc.translations[lang];
  if (localized) {
    return localized;
  }

  // Fallback to English
  const en = doc.translations['en'];
  if (en) {
    return en;
  }

  // Last resort: use ID
  return {
    name: doc.id,
    description: '',
    aliases: [],
  };
}
