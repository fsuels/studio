import { lazyClient } from '@/lib/lazy-client';
import { getTranslator } from 'next-intl/server';
import { Metadata } from 'next';

export async function generateMetadata({ params: { locale } }: VehicleBillOfSalePageProps): Promise<Metadata> {
  const t = await getTranslator(locale, ['doc_bill_of_sale_vehicle', 'common']);

  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
  };
}

export default async function BillOfSaleVehiclePage() {
  // This is a placeholder server component.
  // The actual content for the Promissory Note page should be added here
  // or within a client component imported specifically for this page.
  return (
    <>
      <h1>Promissory Note Page</h1>
      <p>
        This page is under construction. Please replace this content with the
        actual Promissory Note form and information.
      </p>
    </>
  );
}

export const dynamic = 'force-dynamic';