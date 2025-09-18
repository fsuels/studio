// src/app/[locale]/page.tsx
import type { Metadata } from 'next';
import HomePageClient from './HomePageClient';
import { HomePageStructuredData } from './HomePageStructuredData';
import { defaultLocale, localizations } from '@/lib/localizations';
import SEOConfig from '@/../next-seo.config';
import {
  buildLanguageAlternates,
  getCanonicalPathForLocale,
  getSiteUrl,
  LOCALE_LANGUAGE_TAGS,
} from '@/lib/seo/site';

interface PageProps {
  params: Promise<{ locale?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;

  const supportedLocales = localizations as readonly ('en' | 'es')[];
  const locale = supportedLocales.includes(localeParam as 'en' | 'es')
    ? (localeParam as 'en' | 'es')
    : defaultLocale;

  const siteUrl = getSiteUrl();
  const metadataBase = new URL(siteUrl + '/');
  const canonicalPath = getCanonicalPathForLocale(locale);
  const alternates = buildLanguageAlternates(supportedLocales, siteUrl);
  const ogLocale = LOCALE_LANGUAGE_TAGS[locale];
  const alternateOgLocales = supportedLocales
    .filter((supportedLocale) => supportedLocale !== locale)
    .map((supportedLocale) => LOCALE_LANGUAGE_TAGS[supportedLocale]);

  return {
    metadataBase,
    title: {
      default: SEOConfig.title,
      template: '%s | ' + SEOConfig.title,
    },
    description: SEOConfig.description,
    alternates: {
      canonical: canonicalPath,
      languages: alternates,
    },
    openGraph: {
      type: 'website',
      url: siteUrl + canonicalPath,
      title: SEOConfig.title,
      description: SEOConfig.description,
      siteName: SEOConfig.openGraph?.site_name ?? '123LegalDoc',
      locale: ogLocale,
      alternateLocale: alternateOgLocales,
    },
    twitter: {
      card: 'summary_large_image',
      title: SEOConfig.title,
      description: SEOConfig.description,
    },
  };
}

export async function generateStaticParams() {
  // 1) If LIMIT_SSG=true, only build 'en' (or any one locale you choose)
  if (process.env.LIMIT_SSG === 'true') {
    return [{ locale: 'en' }];
  }

  // 2) Otherwise, build all locales as before
  return localizations.map((locale) => ({ locale }));
}

export default async function HomePageContainer({ params }: PageProps) {
  const { locale: localeParam } = await params;

  const supportedLocales = localizations as readonly ('en' | 'es')[];
  const locale = supportedLocales.includes(localeParam as 'en' | 'es')
    ? (localeParam as 'en' | 'es')
    : defaultLocale;

  return (
    <>
      <HomePageStructuredData locale={locale} />
      <HomePageClient />
    </>
  );
}
