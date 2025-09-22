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
import { getWorkflowDocuments } from '@/lib/workflow/document-workflow';
import type { DocumentSummary } from '@/lib/workflow/document-workflow';
import { CURATED_CATEGORY_KEYS, CATEGORY_MATCHES } from '@/lib/homepage/popular-docs-config';

const MAX_DOCS_PER_CATEGORY = 24;

function matchesCategory(doc: DocumentSummary, categoryKey: string): boolean {
  const synonyms = CATEGORY_MATCHES[categoryKey] ?? [];
  const categoryLabel = doc.category.toLowerCase();

  if (synonyms.length === 0) {
    return categoryLabel.includes(categoryKey.replace(/-/g, ' '));
  }

  return synonyms.some((value) => categoryLabel.includes(value.toLowerCase()));
}

function buildPopularDocs(): DocumentSummary[] {
  const allDocs = getWorkflowDocuments({ jurisdiction: 'us' });
  const seen = new Set<string>();
  const curated: DocumentSummary[] = [];

  for (const categoryKey of CURATED_CATEGORY_KEYS) {
    let count = 0;
    for (const doc of allDocs) {
      if (matchesCategory(doc, categoryKey) && !seen.has(doc.id)) {
        curated.push(doc);
        seen.add(doc.id);
        count += 1;
      }

      if (count >= MAX_DOCS_PER_CATEGORY) {
        break;
      }
    }
  }

  return curated;
}

interface PageProps {
  params: Promise<{ locale?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const localeParam = resolvedParams?.locale;

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
  const resolvedParams = await params;
  const localeParam = resolvedParams?.locale;

  const supportedLocales = localizations as readonly ('en' | 'es')[];
  const locale = supportedLocales.includes(localeParam as 'en' | 'es')
    ? (localeParam as 'en' | 'es')
    : defaultLocale;

  const popularDocs = buildPopularDocs();

  return (
    <>
      <HomePageStructuredData locale={locale} />
      <HomePageClient locale={locale} popularDocs={popularDocs} />
    </>
  );
}
