// src/app/[locale]/faq/page.tsx
import React from 'react';
import FaqClientContent from './faq-client-content';
import type { PageProps } from 'next';

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}

export default function FAQPage({ params }: PageProps<{ locale: 'en' | 'es' }>) {
  const { locale } = params;
  return <FaqClientContent locale={locale} />;
}
