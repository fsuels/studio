export const supportedLocales = ['en', 'es'] as const;
export type Locale = (typeof supportedLocales)[number];

export const fallbackLocale: Locale = 'en';

export const resolveLocale = (
  raw?: string | string[],
): Locale => {
  const val = Array.isArray(raw) ? raw[0] : raw;
  return supportedLocales.includes(val as Locale) ? (val as Locale) : fallbackLocale;
};
