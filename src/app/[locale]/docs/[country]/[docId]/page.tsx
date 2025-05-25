// src/app/[locale]/docs/[country]/[docId]/page.tsx
// This is a Server Component that defines static paths and renders the client component.

import DocPageClient from './DocPageClient';
import { getDocumentsForCountry, supportedCountries } from '@/lib/document-library';
import { localizations } from '@/lib/localizations'; // Ensure this path is correct

// Revalidate this page every hour for fresh content while caching aggressively
export const revalidate = 3600;

// generateStaticParams is crucial for static export of dynamic routes
export async function generateStaticParams() {
  console.log('[generateStaticParams /docs] Starting generation...');
  if (!supportedCountries || supportedCountries.length === 0) {
    console.warn('[generateStaticParams /docs] supportedCountries is empty.');
    return [];
  }
  if (!localizations || localizations.length === 0) {
    console.warn('[generateStaticParams /docs] localizations is empty or undefined. No paths will be generated.');
    return [];
  }

  const params = [];
  for (const locale of localizations) {
    for (const country of supportedCountries) {
      const docs = getDocumentsForCountry(country);
      for (const doc of docs) {
        if (doc && doc.id && doc.id !== 'general-inquiry') {
          params!.push({ locale, country, docId: doc.id });
        } else if (!doc || !doc.id) {
          console.warn(`[generateStaticParams /docs] Missing id for ${country} document in locale ${locale}.`);
        }
      }
    }
  }
  console.log(`[generateStaticParams /docs] Generated ${params!.length} paths.`);
  return params;
}

interface DocPageProps { // Renamed from DocPageContainerProps for clarity
  params: {
    locale: string;
    country: string;
    docId: string;
  };
}

// This Server Component now correctly passes params to the Client Component
export default async function DocPage({ params }: DocPageProps) {
  // Await a microtask to comply with Next.js dynamic param handling
  await Promise.resolve();
  // The `params` prop is directly available here from Next.js
  // It's then passed down to the client component.
  return <DocPageClient params={params} />;
}
