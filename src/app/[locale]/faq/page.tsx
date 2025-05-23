// src/app/[locale]/faq/page.tsx
import React from 'react';
import FaqClientContent from './faq-client-content';

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}

interface FaqPageProps {
  params: {
    locale: 'en' | 'es';
  };
}

export default function FAQPage({ params }: FaqPageProps) {
  const { locale } = params;
  return <FaqClientContent locale={locale} />;
}
