/* src/app/[locale]/documents/basic-nda/page.tsx
   JSON-driven Basic NDA document page using unified configuration loader */

import type { Metadata } from 'next';
import BasicNDAPageClientWrapper from '@/components/document/BasicNDAPageClientWrapper';

/* -------------------------------------------------------------------------- */
/*  Static metadata for SEO                                                  */
/* -------------------------------------------------------------------------- */
export const metadata: Metadata = {
  title: 'Basic Non-Disclosure Agreement (NDA) Template | 123LegalDoc',
  description:
    'Generate a professional non-disclosure agreement in under 5 minutes. Customizable NDA template with mutual/unilateral options, state-specific compliance, and instant PDF generation.',
  openGraph: {
    title: 'Basic Non-Disclosure Agreement (NDA) Template | 123LegalDoc',
    description:
      'Generate a professional non-disclosure agreement in under 5 minutes. Customizable NDA template with mutual/unilateral options, state-specific compliance, and instant PDF generation.',
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
export default async function BasicNDAPage({ params }: PageProps) {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const { locale } = await params; // kept for future enhancement
  /* eslint-enable  @typescript-eslint/no-unused-vars */

  return (
    <main className="py-8">
      <BasicNDAPageClientWrapper />
    </main>
  );
}
