/* src/app/[locale]/documents/page.tsx
   Document listing page showing all available documents */

import type { Metadata } from 'next';
import DocumentsListingPageClientWrapper from '@/components/document/DocumentsListingPageClientWrapper';

/* -------------------------------------------------------------------------- */
/*  Static metadata for SEO                                                  */
/* -------------------------------------------------------------------------- */
export const metadata: Metadata = {
  title: 'Legal Document Templates | 123LegalDoc',
  description:
    'Browse our comprehensive collection of legal document templates. Generate professionally drafted documents with state-specific compliance in minutes.',
  openGraph: {
    title: 'Legal Document Templates | 123LegalDoc',
    description:
      'Browse our comprehensive collection of legal document templates. Generate professionally drafted documents with state-specific compliance in minutes.',
  },
};

/*  Prerender /en/… and /es/… at build time */
export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}

interface PageProps {
  params: { locale: 'en' | 'es' };
}

/* -------------------------------------------------------------------------- */
/*  Server Component shell — real UI lazy-loads in the client wrapper         */
/* -------------------------------------------------------------------------- */
export default async function DocumentsListingPage({ params }: PageProps) {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const { locale } = params; // kept for future enhancement
  /* eslint-enable  @typescript-eslint/no-unused-vars */

  return (
    <main className="py-8">
      <DocumentsListingPageClientWrapper />
    </main>
  );
}
