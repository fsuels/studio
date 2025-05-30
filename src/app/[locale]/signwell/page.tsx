export const dynamic = 'force-static';
// src/app/[locale]/signwell/page.tsx
import React from 'react';
import dynamic from 'next/dynamic';
import type { Metadata } from 'next';

import dynamic from 'next/dynamic';

const SignwellHeroAnimationClient = dynamic(
  () => import('@/components/SignwellHeroAnimationClient'),
  { ssr: false },
);
interface SignWellPageProps {
  params: { locale: 'en' | 'es' } & Record<string, string>;
}
import i18n from '@/lib/i18n'; // Import i18n instance to access translations server-side for metadata

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}

// Dynamically generate metadata based on locale
export async function generateMetadata({
  params,
}: {
  params: { locale: 'en' | 'es' };
}): Promise<Metadata> {
  // Ensure i18next is initialized for the correct language to fetch metadata
  if (i18n.language !== params.locale) {
    await i18n.changeLanguage(params.locale);
  }

  const title = i18n.t('pageTitle', {
    ns: 'electronic-signature',
    defaultValue: 'eSign Documents Online Securely | 123LegalDoc',
  });
  const description = i18n.t('pageDescription', {
    ns: 'electronic-signature',
    defaultValue:
      'Upload, prepare, and send documents for legally binding electronic signatures with 123LegalDoc, powered by SignWell. Fast, secure, and compliant.',
  });

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

const SignWellClientContent = dynamic(
  () => import('./signwell-client-content'),
  { ssr: false }
);
export default function SignWellPage({ params }: SignWellPageProps) {
  return <SignWellClientContent params={params} />;
}
