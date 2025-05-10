// src/app/[locale]/docs/[docId]/page.tsx
// This is a Server Component that defines static paths and renders the client component.

import DocPageClient from './DocPageClient';
import { documentLibrary } from '@/lib/document-library';
import { localizations } from '@/lib/localizations'; // Ensure this path is correct

// generateStaticParams is crucial for static export of dynamic routes
export async function generateStaticParams() {
  console.log('[generateStaticParams /docs] Starting generation...');
  if (!documentLibrary || documentLibrary.length === 0) {
    console.warn('[generateStaticParams /docs] documentLibrary is empty or undefined. No paths will be generated.');
    return [];
  }
  if (!localizations || localizations.length === 0) {
    console.warn('[generateStaticParams /docs] localizations is empty or undefined. No paths will be generated.');
    return [];
  }

  const params = [];
  for (const locale of localizations) {
    for (const doc of documentLibrary) {
      // Ensure doc and doc.id are valid before pushing
      if (doc && doc.id && doc.id !== 'general-inquiry') { // Exclude general inquiry or other non-detail pages
        params.push({ locale, docId: doc.id });
      } else if (!doc || !doc.id) {
        console.warn(`[generateStaticParams /docs] Encountered a document with missing id in locale ${locale}. Skipping.`);
      }
    }
  }
  console.log(`[generateStaticParams /docs] Generated ${params.length} paths.`);
  return params;
}

interface DocPageProps { // Renamed from DocPageContainerProps for clarity
  params: {
    locale: string;
    docId: string;
  };
}

// This Server Component now correctly passes params to the Client Component
export default function DocPage({ params }: DocPageProps) {
  // The `params` prop is directly available here from Next.js
  // It's then passed down to the client component.
  return <DocPageClient params={params} />;
}
