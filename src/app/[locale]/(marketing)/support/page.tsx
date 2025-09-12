// src/app/[locale]/support/page.tsx
import React from 'react';
import SupportClientContent from './support-client-content';
interface SupportPageProps {
  params: { locale: 'en' | 'es' } & Record<string, string>;
}

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}

export default async function SupportPage({ params }: SupportPageProps) {
  const { locale } = params;
  return <SupportClientContent locale={locale} />;
}
