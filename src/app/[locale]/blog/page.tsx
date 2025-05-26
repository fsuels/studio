// src/app/[locale]/blog/page.tsx
import React from 'react';
import BlogClientContent from './blog-client-content';
import type { PageProps } from 'next';

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}

export default function BlogPage({ params }: PageProps<{ locale: 'en' | 'es' }>) {
  const { locale } = params;
  return <BlogClientContent locale={locale} />;
}
