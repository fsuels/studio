// src/lib/schema-utils.ts

/**
 * Converts a camelCase or snake_case string into a human-readable Title Case string.
 * Example: 'buyer_name' -> 'Buyer Name', 'vehicleVin' -> 'Vehicle Vin'
 * @param key The string to prettify.
 * @returns A title-cased string.
 */
export const prettify = (key: string): string => {
  if (!key) return '';

  // Replace underscores/hyphens with spaces, then split by space or camelCase transitions
  const words = key
    .replace(/_/g, ' ')
    .replace(/-/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Split camelCase
    .toLowerCase()
    .split(' ');

  // Capitalize each word
  return words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
