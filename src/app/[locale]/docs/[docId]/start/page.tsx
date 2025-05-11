// src/app/[locale]/docs/[docId]/start/page.tsx
// This is now a Server Component

import StartWizardPageClient from './StartWizardPageClient';
import { documentLibrary } from '@/lib/document-library';
import { localizations } from '@/lib/localizations'; // Assuming this defines your supported locales e.g. [{id: 'en'}, {id: 'es'}]

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
        params.push({ locale: locale, docId: doc.id });
      }
    }
    if (params.length === 0) console.warn('[generateStaticParams /docs/[docId]/start] No params generated with fallback locales.');
    return params;
  }

  const params = [];
  // Assuming localizations is an array of objects like { id: 'en' }
  // If it's an array of strings like ['en', 'es'], change `localeObj.id` to `localeObj`
  for (const localeObj of localizations) { 
    const locale = typeof localeObj === 'string' ? localeObj : (localeObj as { id: string }).id; // Handle both formats
    if (!locale) {
        console.warn("""[generateStaticParams /docs/[docId]/start] Invalid locale object encountered:""", localeObj);
        continue;
    }
    for (const doc of documentLibrary) {
      if (!doc.id) {
        console.warn("""[generateStaticParams /docs/[docId]/start] Document with missing ID encountered:""", doc);
        continue;
      }
      params.push({ locale: locale, docId: doc.id });
    }
  }
  console.log(`[generateStaticParams /docs/[docId]/start] Generated ${params.length} params.`);
  if (params.length === 0) {
      console.warn('[generateStaticParams /docs/[docId]/start] No params were generated. Check documentLibrary and localizations content and structure.');
      // Example: Manually add a known good param for debugging if all else fails
      // params.push({ locale: 'en', docId: 'bill-of-sale-vehicle' }); 
  }
  return params;
}

interface StartWizardPageProps {
  params: {
    locale: 'en' | 'es';
    docId: string;
  };
}

export default function StartWizardPage({ params }: StartWizardPageProps) {
  const { locale, docId } = params;
  // The StartWizardPageClient will handle fetching its own specific document data
  // and form schema based on the docId and locale.
  return <StartWizardPageClient params={{ locale, docId }} />;
}
