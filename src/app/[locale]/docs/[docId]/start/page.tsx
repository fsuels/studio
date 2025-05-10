// src/app/[locale]/docs/[docId]/start/page.tsx
// This is now a Server Component

import StartWizardPageClient from './StartWizardPageClient';
import { documentLibrary } from '@/lib/document-library';
import { localizations } from '@/lib/localizations';

// generateStaticParams is crucial for static export of dynamic routes
export async function generateStaticParams() {
  console.log('[generateStaticParams /docs/[docId]/start] Starting generation...');
  if (!documentLibrary || documentLibrary.length === 0) {
    console.warn('[generateStaticParams /docs/[docId]/start] documentLibrary is empty or undefined. No paths will be generated.');
    return [];
  }
  if (!localizations || localizations.length === 0) {
    console.warn('[generateStaticParams /docs/[docId]/start] localizations is empty or undefined. No paths will be generated.');
    return [];
  }

  const params = [];
  for (const locale of localizations) {
    for (const doc of documentLibrary) {
      // Ensure doc and doc.id are valid and not 'general-inquiry'
      if (doc && doc.id && doc.id !== 'general-inquiry') {
        params.push({ locale, docId: doc.id });
      } else if (!doc || !doc.id) {
        console.warn(`[generateStaticParams /docs/[docId]/start] Encountered a document with missing id in locale ${locale}. Skipping.`);
      }
    }
  }
  console.log(`[generateStaticParams /docs/[docId]/start] Generated ${params.length} paths.`);
  return params;
}

interface StartWizardPageProps {
  params: {
    locale: string;
    docId: string;
  };
}

// This Server Component now correctly passes params to the Client Component
export default function StartWizardPageContainer({ params }: StartWizardPageProps) {
  // The `params` prop is directly available here from Next.js
  // It's then passed down to the client component.
  return <StartWizardPageClient params={params} />;
}

