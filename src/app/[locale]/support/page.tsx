// src/app/[locale]/support/page.tsx
import React from 'react';
import SupportClientContent from './support-client-content';

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}

interface SupportPageProps {
  params: {
    locale: 'en' | 'es';
  };
}

export default function SupportPage({ params }: SupportPageProps) {
  const { locale } = params;
  return <SupportClientContent locale={locale} />;
}
