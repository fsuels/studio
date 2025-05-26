// src/app/[locale]/docs/[docId]/start/page.tsx
// This is now a Server Component

import StartWizardPageClient from './StartWizardPageClient';
import { documentLibrary } from '@/lib/document-library';
import { localizations } from '@/lib/localizations'; // Assuming this defines your supported locales e.g. [{id: 'en'}, {id: 'es'}]
interface StartWizardPageProps {
  params: { locale: 'en' | 'es'; docId: string } & Record<string, string>;
}

// Revalidate every hour so start pages stay fresh without rebuilding constantly
export const revalidate = 3600;

// generateStaticParams is crucial for static export of dynamic routes
export async function generateStaticParams() {
  console.log('[generateStaticParams /docs/[docId]/start] Starting generation...');
  if (!documentLibrary || documentLibrary.length === 0) {
    console.warn('[generateStaticParams /docs/[docId]/start] documentLibrary is empty or undefined. No paths will be generated.');
    return [];
  }
  if (!localizations || localizations.length === 0) {
    // Assuming localizations is an array like [{ id: 'en' }, { id: 'es' }]
    // If it's just an array of strings ['en', 'es'], adjust accordingly.
    console.warn('[generateStaticParams /docs/[docId]/start] localizations is empty or undefined. Defaulting to EN/ES if possible, otherwise no paths.');
    // Fallback or error, for now, let's assume it might be an array of strings if complex object fails
    const defaultLocales = ['en', 'es']; 
    const params = [];
    for (const locale of defaultLocales) {
      for (const doc of documentLibrary) {
         // Ensure doc and doc.id are valid and it's not a general inquiry type if that shouldn't have a start page
        if (doc && doc.id && doc.id !== 'general-inquiry' && doc.schema) { // Added check for doc.schema
            params!.push({ locale: locale, docId: doc.id });
        } else if (!doc || !doc.id) {
            console.warn(`[generateStaticParams /docs/[docId]/start] Encountered a document with missing id in locale ${locale}. Skipping.`);
        } else if (!doc.schema) {
            console.warn(`[generateStaticParams /docs/[docId]/start] Document with id ${doc.id} is missing a schema in locale ${locale}. Skipping.`);
        }
      }
    }
    if (params!.length === 0) console.warn('[generateStaticParams /docs/[docId]/start] No params generated with fallback locales.');
    return params;
  }

  const params = [];
  // Assuming localizations is an array of objects like { id: 'en' }
  // If it's an array of strings like ['en', 'es'], change `localeObj.id` to `localeObj`
  for (const localeObj of localizations) { 
    const locale = typeof localeObj === 'string' ? localeObj : (localeObj as { id: string }).id; // Handle both formats
    if (!locale) {
        console.warn(`[generateStaticParams /docs/[docId]/start] Invalid locale object encountered:`, localeObj);
        continue;
    }
    for (const doc of documentLibrary) {
      if (!doc.id) {
        console.warn(`[generateStaticParams /docs/[docId]/start] Document with missing ID encountered:`, doc);
        continue;
      }
       // Ensure doc and doc.id are valid and it's not a general inquiry type if that shouldn't have a start page
      if (doc && doc.id !== 'general-inquiry' && doc.schema) { // Added check for doc.schema
        params!.push({ locale: locale, docId: doc.id });
      } else if (!doc.schema) {
         console.warn(`[generateStaticParams /docs/[docId]/start] Document with id ${doc.id} is missing a schema in locale ${locale}. Skipping generation for this combination.`);
      }
    }
  }
  console.log(`[generateStaticParams /docs/[docId]/start] Generated ${params!.length} params!.`);
  if (params!.length === 0) {
      console.warn('[generateStaticParams /docs/[docId]/start] No params were generated. Check documentLibrary and localizations content and structure.');
      // Example: Manually add a known good param for debugging if all else fails
      // params!.push({ locale: 'en', docId: 'bill-of-sale-vehicle' }); 
  }
  return params;
}

// This Server Component now correctly passes params to the Client Component
export default async function StartWizardPage({ params }: StartWizardPageProps) {
  // Await a microtask to satisfy Next.js dynamic route requirements
  await Promise.resolve();
  // The StartWizardPageClient will handle fetching its own specific document data
  // and form schema based on the docId and locale.
  return <StartWizardPageClient />;
}
