// src/app/[locale]/category/[category]/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CategoryPageClient from './CategoryPageClient';
import { taxonomy } from '@/config/taxonomy';
import slugMap from '@/config/doc-meta/slug-category-map.json';
import { formatDocumentTitle } from '@/lib/format-utils';


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

// Generate metadata for each category
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: 'en' | 'es'; category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
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
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
    }
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: 'en' | 'es'; category: string }>;
}) {
  const { locale, category } = await params;
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
