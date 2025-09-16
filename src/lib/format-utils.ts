/**
 * Utility functions for formatting text and data
 */

/**
 * Converts kebab-case document IDs to proper title case
 * Example: "credit-card-agreement" -> "Credit Card Agreement"
 */
export function formatDocumentTitle(id: string): string {
  return id
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Gets the best available document title with proper formatting fallback
 */
export function getDocumentTitle(
  doc: { 
    translations?: Record<string, { name?: string }>;
    name?: string;
    id: string;
  },
  locale: string = 'en'
): string {
  return doc.translations?.[locale]?.name || doc.name || formatDocumentTitle(doc.id);
}