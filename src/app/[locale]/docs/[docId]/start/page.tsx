// src/app/[locale]/docs/[docId]/start/page.tsx

// Force dynamic rendering to avoid static-generation errors
export const dynamic = 'force-dynamic';

import React from 'react';
import StartWizardPageClient from './StartWizardPageClient';
import { documentLibrary } from '@/lib/document-library';
import { localizations } from '@/lib/localizations';

type StartWizardPageProps = {
  params: { locale: 'en' | 'es'; docId: string };
};

// Revalidate every hour so start pages stay fresh without rebuilding
export const revalidate = 3600;

const isDev = process.env.NODE_ENV === 'development';

/**
 * Generate all combinations of locale + document for static paths.
 * In development, logs detailed warnings for missing data.
 */
export async function generateStaticParams() {
  if (isDev) {
    console.log('[generateStaticParams] Starting generation…');
  }

  const locales =
    Array.isArray(localizations) && localizations.length > 0
      ? localizations.map((l) => (typeof l === 'string' ? l : l.id))
      : ['en', 'es'];

  const params: Array<{ locale: string; docId: string }> = [];

  for (const locale of locales) {
    for (const doc of documentLibrary) {
      if (!doc.id) {
        if (isDev) {
          console.warn(`[generateStaticParams] Skipping doc with missing id for locale "${locale}".`);
        }
        continue;
      }
      if (doc.id === 'general-inquiry') {
        if (isDev) {
          console.warn(`[generateStaticParams] Skipping "general-inquiry" doc for locale "${locale}".`);
        }
        continue;
      }
      if (!doc.schema) {
        if (isDev) {
          console.warn(
            `[generateStaticParams] Document "${doc.id}" missing schema in locale "${locale}". Skipping.`
          );
        }
        continue;
      }
      params.push({ locale, docId: doc.id });
    }
  }

  if (isDev) {
    console.log(`[generateStaticParams] Generated ${params.length} params.`);
    if (params.length === 0) {
      console.warn(
        '[generateStaticParams] No params generated—please check documentLibrary and localizations.'
      );
    }
  }

  return params;
}

// Server Component that delegates to client for rendering & data-loading
export default async function StartWizardPage({ params }: StartWizardPageProps) {
  // Required to satisfy Next.js server component signature
  await Promise.resolve();

  return <StartWizardPageClient locale={params.locale} docId={params.docId} />;
}
