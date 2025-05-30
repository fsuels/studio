// src/app/[locale]/signwell/page.tsx
export const dynamic = 'force-static';

import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

interface SignWellPageProps {
  params: { locale: 'en' | 'es' } & Record<string, string>;
}

/* ───────── Static metadata (no i18next on server) ───────── */
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

export async function generateMetadata({
  params,
}: {
  params: { locale: 'en' | 'es' };
}): Promise<Metadata> {
  const { title, description } = META[params.locale] ?? META.en;
  return { title, description, openGraph: { title, description } };
}

/* ───────── Client content — NEVER loaded on the server ───────── */
const SignWellClientContent = typeof window === 'undefined'
  ? () => null
  : dynamic(() => import('./signwell-client-content'), { ssr: false });

export default function SignWellPage({ params }: SignWellPageProps) {
  return <SignWellClientContent params={params} />;
}
