// src/app/[locale]/docs/[docId]/start/page.tsx

// Force dynamic rendering—this page needs user-specific data
export const dynamic = 'force-dynamic';

import React from 'react';
import { notFound } from 'next/navigation';
import StartWizardPageClient from './StartWizardPageClient';
import { documentLibrary } from '@/lib/document-library';
import { localizations } from '@/lib/localizations';

type StartWizardPageProps = {
  params: Promise<{ locale: 'en' | 'es'; docId: string }>;
};

// Revalidate every hour so start pages stay fresh without rebuilding
export const revalidate = 3600;

const isDev = process.env.NODE_ENV === 'development';

/**
 * Statically pre-generate all locale+docId combos,
 * but only log warnings in dev.
 */
export async function generateStaticParams(): Promise<
  Array<{ locale: 'en' | 'es'; docId: string }>
> {
  if (isDev) console.log('[generateStaticParams] Starting generation…');

  // derive locales array
  const locales: ('en' | 'es')[] =
    Array.isArray(localizations) && localizations.length > 0
      ? (localizations.map((l) => (typeof l === 'string' ? l : l.id)) as (
          | 'en'
          | 'es'
        )[])
      : (['en', 'es'] as ('en' | 'es')[]);

  const params: Array<{ locale: 'en' | 'es'; docId: string }> = [];

  for (const locale of locales) {
    for (const doc of documentLibrary) {
      if (!doc.id) {
        if (isDev)
          console.warn(
            `[generateStaticParams] Skipping doc with missing id for locale "${locale}".`,
          );
        continue;
      }
      if (doc.id === 'general-inquiry') {
        if (isDev)
          console.warn(
            `[generateStaticParams] Skipping "general-inquiry" doc for locale "${locale}".`,
          );
        continue;
      }
      if (!doc.schema) {
        if (isDev)
          console.warn(
            `[generateStaticParams] Document "${doc.id}" missing schema for locale "${locale}". Skipping.`,
          );
        continue;
      }
      params.push({ locale, docId: doc.id });
    }
  }

  if (isDev) {
    console.log(`[generateStaticParams] Generated ${params.length} params.`);
    if (params.length === 0) {
      console.warn(
        '[generateStaticParams] No params generated—check documentLibrary & localizations.',
      );
    }
  }

  return params;
}

/**
 * Server Component wrapper.
 * Validates params, then hands off to the client component.
 */
export default async function StartWizardPage({
  params,
}: StartWizardPageProps) {
  const { locale, docId } = await params;

  // Guard: if someone hits /docs/…/start for an unknown docId, 404.
  const docConfig = documentLibrary.find((d) => d.id === docId);
  if (!docConfig) {
    notFound();
  }

  // Delegate to the client for the form + preview + autosave logic
  return <StartWizardPageClient locale={locale} docId={docId} />;
}
