// src/app/[locale]/blog/page.tsx
import React from 'react';
import BlogClientContent from './blog-client-content';
// Define the shape of params expected for this page
interface BlogPageProps {
  params: {
    locale: 'en' | 'es';
  };
}

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}

export default function BlogPage({ params }: BlogPageProps) {
  const { locale } = params;
  return <BlogClientContent locale={locale} />;
}
