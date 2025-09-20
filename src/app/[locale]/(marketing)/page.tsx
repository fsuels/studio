// src/app/[locale]/(marketing)/page.tsx
import type { Metadata } from 'next';
import HomePageClient from '../HomePageClient';
import { HomePageStructuredData } from '../HomePageStructuredData';
import { defaultLocale, localizations } from '@/lib/localizations';
import SEOConfig from '@/config/seo';
import {
  buildLanguageAlternates,
  getCanonicalPathForLocale,
  getSiteUrl,
  LOCALE_LANGUAGE_TAGS,
} from '@/lib/seo/site';

interface PageProps {
  params: { locale?: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam } = params;

  const supportedLocales = localizations as readonly ('en' | 'es')[];
  const locale = supportedLocales.includes(localeParam as 'en' | 'es')
    ? (localeParam as 'en' | 'es')
    : defaultLocale;

  const siteUrl = getSiteUrl();
  const fallbackTitle = SEOConfig.title ?? '123LegalDoc';
  const fallbackDescription =
    SEOConfig.description ?? 'Create legal documents tailored to your needs.';
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
      default: fallbackTitle,
      template: '%s | ' + fallbackTitle,
    },
    description: fallbackDescription,
    alternates: {
      canonical: canonicalPath,
      languages: alternates,
    },
    openGraph: {
      type: 'website',
      url: siteUrl + canonicalPath,
      title: fallbackTitle,
      description: fallbackDescription,
      siteName: SEOConfig.openGraph?.site_name ?? fallbackTitle,
      locale: ogLocale,
      alternateLocale: alternateOgLocales,
    },
    twitter: {
      card: 'summary_large_image',
      title: fallbackTitle,
      description: fallbackDescription,
    },
  };
}

export async function generateStaticParams() {
  if (process.env.LIMIT_SSG === 'true') {
    return [{ locale: 'en' }];
  }
  return localizations.map((locale) => ({ locale }));
}

export default async function HomePageContainer({ params }: PageProps) {
  const { locale: localeParam } = params;

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
