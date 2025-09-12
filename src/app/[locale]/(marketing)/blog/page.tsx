// src/app/[locale]/blog/page.tsx
import React from 'react';
import BlogClientContent from './blog-client-content';
import { blogArticles } from '@/data/blogArticles';

type BlogPageProps = {
  params: Promise<{ locale: 'en' | 'es' }>;
};

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;
  // Send a lean list to the client to avoid bundling the entire dataset there
  const articles = blogArticles.map((a) => ({
    slug: a.slug,
    title_en: a.title_en,
    title_es: (a as any).title_es,
    summary_en: (a as any).summary_en,
    summary_es: (a as any).summary_es,
    date: a.date,
  }));
  return <BlogClientContent locale={locale} articles={articles} />;
}
