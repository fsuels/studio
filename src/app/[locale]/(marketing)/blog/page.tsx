// src/app/[locale]/blog/page.tsx
import React from 'react';
import BlogClientContent from './blog-client-content';

type BlogPageProps = {
  params: { locale: 'en' | 'es' };
};

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}

export default function BlogPage({ params }: BlogPageProps) {
  const { locale } = params;
  return <BlogClientContent locale={locale} />;
}
