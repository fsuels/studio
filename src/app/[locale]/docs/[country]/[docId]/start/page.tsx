// src/app/[locale]/docs/[country]/[docId]/start/page.tsx
// This is now a Server Component

import StartWizardPageClient from './StartWizardPageClient';
import { getDocumentsForCountry, supportedCountries } from '@/lib/document-library/index';
import { localizations } from '@/lib/localizations';

// Revalidate every hour so start pages stay fresh without rebuilding constantly
export const revalidate = 3600;

// generateStaticParams is crucial for static export of dynamic routes
export async function generateStaticParams() {
  const params: Array<{ locale: string; country: string; docId: string }> = [];
  if (!localizations || localizations.length === 0) return params;

  for (const locale of localizations) {
    for (const country of supportedCountries) {
      const docs = getDocumentsForCountry(country);
      for (const doc of docs) {
        if (doc && doc.id && doc.schema && doc.id !== 'general-inquiry') {
          params.push({ locale, country, docId: doc.id });
        }
      }
    }
  }

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
