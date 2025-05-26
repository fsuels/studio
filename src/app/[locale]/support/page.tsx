// src/app/[locale]/support/page.tsx
import React from 'react';
import SupportClientContent from './support-client-content';
import type { PageProps } from 'next';

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}

export default function SupportPage({ params }: PageProps<{ locale: 'en' | 'es' }>) {
  const { locale } = params;
  return <SupportClientContent locale={locale} />;
}
