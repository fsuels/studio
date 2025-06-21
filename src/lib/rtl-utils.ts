// src/lib/rtl-utils.ts

/**
 * List of RTL (Right-to-Left) language codes
 */
const RTL_LANGUAGES = new Set([
  'ar', // Arabic
  'he', // Hebrew
  'fa', // Persian/Farsi
  'ur', // Urdu
  'ku', // Kurdish
  'ps', // Pashto
  'sd', // Sindhi
  'yi', // Yiddish
  'arc', // Aramaic
  'ckb', // Central Kurdish (Sorani)
  'dv', // Dhivehi/Maldivian
  'ha', // Hausa (when written in Arabic script)
  'ji', // Yiddish (alternative code)
  'iw', // Hebrew (alternative code)
  'az-arab', // Azerbaijani (Arabic script)
  'ks', // Kashmiri
  'ug', // Uyghur
]);

/**
 * Determines if a given locale/language code is RTL
 */
export function isRTL(locale: string): boolean {
  if (!locale) return false;

  // Handle full locale codes (e.g., 'ar-SA', 'he-IL')
  const langCode = locale.toLowerCase().split('-')[0];

  return RTL_LANGUAGES.has(langCode) || RTL_LANGUAGES.has(locale.toLowerCase());
}

/**
 * Gets the text direction for a given locale
 */
export function getTextDirection(locale: string): 'ltr' | 'rtl' {
  return isRTL(locale) ? 'rtl' : 'ltr';
}

/**
 * Gets the appropriate CSS direction attribute value
 */
export function getDirAttribute(locale: string): 'ltr' | 'rtl' {
  return getTextDirection(locale);
}

/**
 * Returns CSS class names for directional styling
 */
export function getDirectionalClasses(locale: string): {
  dir: 'ltr' | 'rtl';
  textAlign: string;
  marginStart: string;
  marginEnd: string;
  paddingStart: string;
  paddingEnd: string;
  borderStart: string;
  borderEnd: string;
} {
  const isRtl = isRTL(locale);

  return {
    dir: isRtl ? 'rtl' : 'ltr',
    textAlign: isRtl ? 'text-end' : 'text-start',
    marginStart: isRtl ? 'me-auto' : 'ms-auto',
    marginEnd: isRtl ? 'ms-auto' : 'me-auto',
    paddingStart: isRtl ? 'pe-4' : 'ps-4',
    paddingEnd: isRtl ? 'ps-4' : 'pe-4',
    borderStart: isRtl ? 'border-e' : 'border-s',
    borderEnd: isRtl ? 'border-s' : 'border-e',
  };
}

/**
 * Utility to conditionally apply RTL/LTR specific classes
 */
export function applyDirectionalClass(
  locale: string,
  ltrClass: string,
  rtlClass: string,
): string {
  return isRTL(locale) ? rtlClass : ltrClass;
}

/**
 * Hook-like function to get directional properties for a locale
 */
export function useDirectional(locale: string) {
  const direction = getTextDirection(locale);
  const isRtl = direction === 'rtl';

  return {
    direction,
    isRtl,
    isLtr: !isRtl,
    dirAttribute: getDirAttribute(locale),
    classes: getDirectionalClasses(locale),
    apply: (ltrClass: string, rtlClass: string) =>
      applyDirectionalClass(locale, ltrClass, rtlClass),
  };
}

/**
 * Flips horizontal positioning values for RTL
 */
export function flipForRTL(
  locale: string,
  value: 'left' | 'right',
): 'left' | 'right' {
  if (!isRTL(locale)) return value;
  return value === 'left' ? 'right' : 'left';
}

/**
 * Returns the correct margin/padding logical property class
 */
export function getLogicalSpacingClass(
  locale: string,
  property: 'margin' | 'padding',
  side: 'start' | 'end',
  size: string,
): string {
  const prefix = property === 'margin' ? 'm' : 'p';
  const logicalSide = side === 'start' ? 's' : 'e';

  return `${prefix}${logicalSide}-${size}`;
}
