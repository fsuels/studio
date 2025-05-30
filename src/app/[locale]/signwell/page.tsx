export const dynamic = 'force-static';
// src/app/[locale]/signwell/page.tsx
import React from 'react';
import SignWellClientContent from './signwell-client-content';
interface SignWellPageProps {
  params: { locale: 'en' | 'es' } & Record<string, string>;
}
import type { Metadata } from 'next';
import SignwellHeroAnimationClient from '@/components/SignwellHeroAnimationClient';

// Basic metadata strings to avoid loading react-i18next on the server
const META = {
  en: {
    title: 'eSign Documents Online Securely | 123LegalDoc',
    description:
      'Upload, prepare, and send documents for legally binding electronic signatures with 123LegalDoc, powered by SignWell. Fast, secure, and compliant.',
  },
  es: {
    title: 'Firmar Documentos Electrónicamente | 123LegalDoc',
    description:
      'Suba, prepare y envíe documentos para firmas electrónicas legalmente vinculantes con 123LegalDoc, impulsado por SignWell. Rápido, seguro y conforme.',
  },
} as const;

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}

// Dynamically generate metadata based on locale
export async function generateMetadata({
  params,
}: {
  params: { locale: 'en' | 'es' };
}): Promise<Metadata> {
  const { title, description } = META[params.locale] ?? META.en;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      // images: [{ url: 'https://www.123legaldoc.com/og-images/esign-landing.png' }], // Example OG image
    },
  };
}

export default function SignWellPage({ params }: SignWellPageProps) {
  return <SignWellClientContent params={params} />;
}
