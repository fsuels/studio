// src/app/[locale]/blog/[slug]/page.tsx
import React from 'react';
import BlogPostClientContent from './blog-post-client-content';
import { blogArticles } from '@/data/blogArticles';

export async function generateStaticParams() {
  const params = [];
  for (const locale of ['en', 'es']) {
    for (const article of blogArticles) {
      params!.push({ locale, slug: article.slug });
    }
  }
  return params;
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{
    locale: 'en' | 'es';
    slug: string;
  }>;
}) {
  const { locale, slug } = await params;
  const article = blogArticles.find((a) => a.slug === slug);
  return (
    <BlogPostClientContent
      locale={locale}
      slug={slug}
      article={article}
    />
  );
}
