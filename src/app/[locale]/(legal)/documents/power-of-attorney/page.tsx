/* src/app/[locale]/documents/power-of-attorney/page.tsx
   JSON-driven Power of Attorney document page using unified configuration loader */

import type { Metadata } from 'next';
import PowerOfAttorneyPageClientWrapper from '@/components/document/PowerOfAttorneyPageClientWrapper';

/* -------------------------------------------------------------------------- */
/*  Static metadata for SEO                                                  */
/* -------------------------------------------------------------------------- */
export const metadata: Metadata = {
  title: 'Power of Attorney Template | Colorado State Form | 123LegalDoc',
  description:
    'Generate a legally compliant Colorado Power of Attorney document in minutes. Includes durable, general, and limited power options with automatic notary and witness requirements.',
  openGraph: {
    title: 'Power of Attorney Template | Colorado State Form | 123LegalDoc',
    description:
      'Generate a legally compliant Colorado Power of Attorney document in minutes. Includes durable, general, and limited power options with automatic notary and witness requirements.',
  },
};

/*  Prerender /en/… and /es/… at build time */
export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}

interface PageProps {
  params: Promise<{ locale: 'en' | 'es' }>;
}

/* -------------------------------------------------------------------------- */
/*  Server Component shell — real UI lazy-loads in the client wrapper         */
/* -------------------------------------------------------------------------- */
export default async function PowerOfAttorneyPage({ params }: PageProps) {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const { locale } = await params; // kept for future enhancement
  /* eslint-enable  @typescript-eslint/no-unused-vars */

  return (
    <main className="py-8">
      <PowerOfAttorneyPageClientWrapper />
    </main>
  );
}
