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

interface BlogPostPageProps {
  params: {
    locale: 'en' | 'es';
    slug: string;
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale, slug } = params;
  return <BlogPostClientContent locale={locale} slug={slug} />;
}
