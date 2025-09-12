/* src/app/[locale]/documents/bill-of-sale-vehicle/page.tsx
   Lightweight version for static-export: no runtime-i18n, no long blocking calls.
   Replace with full implementation once build performance is confirmed. */

import type { Metadata } from 'next';
import VehicleBillOfSalePageClientWrapper from '@/components/document/VehicleBillOfSalePageClientWrapper';

/* -------------------------------------------------------------------------- */
/*  Static metadata so Next.js can prerender quickly                          */
/* -------------------------------------------------------------------------- */
export const metadata: Metadata = {
  title: 'Vehicle Bill of Sale Template & Guide | 123LegalDoc',
  description:
    'Generate a legally solid vehicle bill of sale in under 5 minutes. Free printable PDF, e-sign-ready, attorney-reviewed, and valid in all 50 states.',
  openGraph: {
    title: 'Vehicle Bill of Sale Template & Guide | 123LegalDoc',
    description:
      'Generate a legally solid vehicle bill of sale in under 5 minutes. Free printable PDF, e-sign-ready, attorney-reviewed, and valid in all 50 states.',
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
export default async function VehicleBillOfSalePage({ params }: PageProps) {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const { locale } = await params; // kept for future enhancement
  /* eslint-enable  @typescript-eslint/no-unused-vars */

  return (
    <main className="py-8">
      <VehicleBillOfSalePageClientWrapper />
    </main>
  );
}
