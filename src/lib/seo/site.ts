// src/lib/seo/site.ts
// Shared helpers for computing site-level SEO metadata values.

export const FALLBACK_SITE_URL = 'https://123legaldoc.com';

function normalizeSiteUrl(rawUrl: string): string {
  try {
    const url = new URL(rawUrl.trim());
    const pathname = url.pathname.replace(/\/$/, '');
    const normalizedPath = pathname && pathname !== '/' ? pathname : '';
    return url.origin + normalizedPath;
  } catch {
    return FALLBACK_SITE_URL;
  }
}

export function getSiteUrl(): string {
  const envValue =
    process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? process.env.VERCEL_URL;

  if (!envValue) {
    return FALLBACK_SITE_URL;
  }

  const candidate = envValue.startsWith('http') ? envValue : 'https://' + envValue;
  return normalizeSiteUrl(candidate);
}

export const LOCALE_LANGUAGE_TAGS: Record<'en' | 'es', string> = {
  en: 'en-US',
  es: 'es-US',
};

export function buildLanguageAlternates(
  locales: readonly ('en' | 'es')[],
  siteUrl: string,
): Record<string, string> {
  const alternates: Record<string, string> = {};

  locales.forEach((locale) => {
    alternates[locale] = siteUrl + '/' + locale + '/';
  });

  alternates['x-default'] = siteUrl + '/en/';
  return alternates;
}

export function getCanonicalPathForLocale(locale: 'en' | 'es'): string {
  return '/' + locale + '/';
}
