// src/app/[locale]/docs/[country]/[docId]/start/page.tsx
// This is now a Server Component

import StartWizardPageClient from './StartWizardPageClient';
import { getDocumentsForCountry, supportedCountries } from '@/lib/document-library/index';
import { localizations } from '@/lib/localizations'; // Assuming this defines your supported locales e.g. [{id: 'en'}, {id: 'es'}]
import type { LegalDocument } from '@/lib/document-library/index';

// Revalidate every hour so start pages stay fresh without rebuilding constantly
export const revalidate = 3600;

// generateStaticParams is crucial for static export of dynamic routes
export async function generateStaticParams() {
  console.log('[generateStaticParams /docs/[docId]/start] Starting generation...');
  if (!localizations || localizations.length === 0) {
    console.warn('[generateStaticParams /docs/[docId]/start] localizations is empty or undefined. No paths will be generated.');
    return [];
  }

  const params = [] as Array<{ locale: string; country: string; docId: string }>;
  for (const locale of localizations) {
    for (const country of supportedCountries) {
      const docs = getDocumentsForCountry(country);
      for (const doc of docs) {
        if (doc && doc.id !== 'general-inquiry' && doc.schema) {
          params.push({ locale, country, docId: doc.id });
        }
      }
    }
  }
  console.log(`[generateStaticParams /docs/[docId]/start] Generated ${params.length} params.`);
  return params;
}

interface StartWizardPageProps {
  params: {
    locale: 'en' | 'es';
    country: string;
    docId: string;
  };
}

// This Server Component now correctly passes params to the Client Component
export default async function StartWizardPage({ params }: StartWizardPageProps) {
  const { locale, docId } = params;
  // Await a microtask to satisfy Next.js dynamic route requirements
  await Promise.resolve();
  // The StartWizardPageClient will handle fetching its own specific document data
  // and form schema based on the docId and locale.
  return <StartWizardPageClient params={params} />;
}
