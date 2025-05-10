// src/app/[locale]/docs/[docId]/page.tsx
// This is now a Server Component

import DocPageClient from './DocPageClient'; // Import the client component
import { documentLibrary, localizations } from '@/lib/document-library';
import type { LegalDocument } from '@/lib/document-library';

// generateStaticParams is a server-side function
export async function generateStaticParams() {
  const params = [];
  for (const locale of localizations) {
    for (const doc of documentLibrary) {
      if (doc.id !== 'general-inquiry') { // Exclude general inquiry or other non-detail pages
        params.push({ locale, docId: doc.id });
      }
    }
  }
  return params;
}

interface DocPageContainerProps {
  params: {
    locale: string;
    docId: string;
  };
}

export default function DocPageContainer({ params }: DocPageContainerProps) {
  // Pass params to the client component
  return <DocPageClient params={params} />;
}
