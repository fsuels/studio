// src/app/[locale]/category/[category]/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CategoryPageClient from './CategoryPageClient';
import SEOConfig from '@/config/seo';
import { taxonomy } from '@/config/taxonomy';
import slugMap from '@/config/doc-meta/slug-category-map.json';
import { formatDocumentTitle } from '@/lib/format-utils';
import { localizations } from '@/lib/localizations';
import { getSiteUrl, LOCALE_LANGUAGE_TAGS } from '@/lib/seo/site';


// Generate static params for all categories
export async function generateStaticParams() {
  const categories = Object.keys(taxonomy.categories);
  const locales = ['en', 'es'];

  return locales.flatMap(locale =>
    categories.map(category => ({
      locale,
      category
    }))
  );
}

export const dynamicParams = false;

// Generate metadata for each category
export async function generateMetadata({
  params,
}: {
  params: { locale: 'en' | 'es'; category: string };
}): Promise<Metadata> {
  const { locale, category } = params;
  const categoryData = taxonomy.categories[category as keyof typeof taxonomy.categories];
  
  if (!categoryData) {
    return {
      title: 'Category Not Found',
      description: 'The requested category could not be found.'
    };
  }
  
  const displayTitle = (
    (categoryData as unknown as { displayName?: string; name?: string })
      .displayName ?? categoryData.name
  );
  const title = `${displayTitle} Legal Documents | 123LegalDoc`;
  const description = `Browse and create ${displayTitle} legal documents. Professional templates for all your ${categoryData.name.toLowerCase()} needs.`;
  const siteUrl = getSiteUrl();
  const metadataBase = new URL(siteUrl + '/');
  const canonicalPath = `/${locale}/category/${category}/`;
  const supportedLocales = localizations as readonly ('en' | 'es')[];
  const languageAlternates = supportedLocales.reduce<Record<string, string>>(
    (accumulator, supportedLocale) => {
      accumulator[supportedLocale] = `${siteUrl}/${supportedLocale}/category/${category}/`;
      return accumulator;
    },
    {},
  );
  languageAlternates['x-default'] = `${siteUrl}/en/category/${category}/`;
  const alternateOgLocales = supportedLocales
    .filter((supportedLocale) => supportedLocale !== locale)
    .map((supportedLocale) => LOCALE_LANGUAGE_TAGS[supportedLocale]);
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: siteUrl + canonicalPath,
      siteName: SEOConfig.openGraph?.site_name ?? '123LegalDoc',
      locale: LOCALE_LANGUAGE_TAGS[locale],
      alternateLocale: alternateOgLocales,
    },
    metadataBase,
    alternates: {
      canonical: canonicalPath,
      languages: languageAlternates,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: { locale: 'en' | 'es'; category: string };
}) {
  const { locale, category } = params;
  const categoryData = taxonomy.categories[category as keyof typeof taxonomy.categories];
  
  if (!categoryData) {
    notFound();
  }
  // Build a lightweight list of docs for this category using slug map
  const docs = Object.keys(slugMap)
    .filter((slug) => slugMap[slug as keyof typeof slugMap] === category)
    .map((slug) => ({ id: slug, name: formatDocumentTitle(slug), description: '' }));

  return (
    <CategoryPageClient locale={locale} category={category} docs={docs} />
  );
}
