// src/app/[locale]/category/[category]/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CategoryPageClient from './CategoryPageClient';
import { taxonomy } from '@/config/taxonomy';

interface CategoryPageProps {
  params: {
    locale: 'en' | 'es';
    category: string;
  };
}

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
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const categoryData = taxonomy.categories[params.category as keyof typeof taxonomy.categories];
  
  if (!categoryData) {
    return {
      title: 'Category Not Found',
      description: 'The requested category could not be found.'
    };
  }
  
  const title = `${categoryData.displayName || categoryData.name} Legal Documents | 123LegalDoc`;
  const description = `Browse and create ${categoryData.displayName || categoryData.name} legal documents. Professional templates for all your ${categoryData.name.toLowerCase()} needs.`;
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
    }
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const categoryData = taxonomy.categories[params.category as keyof typeof taxonomy.categories];
  
  if (!categoryData) {
    notFound();
  }
  
  return <CategoryPageClient locale={params.locale} category={params.category} />;
}