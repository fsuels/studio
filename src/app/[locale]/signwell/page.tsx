// src/app/[locale]/signwell/page.tsx
import React from 'react';
import SignWellClientContent from './signwell-client-content';
import type { Metadata } from 'next';
import i18n from '@/lib/i18n'; // Import i18n instance to access translations server-side for metadata

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}

// Dynamically generate metadata based on locale
export async function generateMetadata({ params }: { params: { locale: 'en' | 'es' } }): Promise<Metadata> {
  // Ensure i18next is initialized for the correct language to fetch metadata
  if (i18n.language !== params.locale) {
    await i18n.changeLanguage(params.locale);
  }
  
  const title = i18n.t('pageTitle', { ns: 'electronic-signature', defaultValue: 'Electronic Signature | 123LegalDoc' });
  const description = i18n.t('pageDescription', { ns: 'electronic-signature', defaultValue: 'Send and sign documents online securely.' });

  return {
    title,
    description,
    // Add other metadata like openGraph if needed
    openGraph: {
      title,
      description,
      // images: [{ url: 'https://www.123legaldoc.com/og-esign.png' }], // Replace with actual OG image
    },
  };
}


interface SignWellPageProps {
  params: { locale: 'en' | 'es' };
}

export default function SignWellPage({ params }: SignWellPageProps) {
  return <SignWellClientContent params={params} />;
}
