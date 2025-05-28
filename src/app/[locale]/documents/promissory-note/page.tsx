import { lazyClient } from '@/lib/lazy-client';
import { getTranslator } from 'next-intl/server';
import { Metadata } from 'next';

// Assume these are potentially large client-only components
const VehicleBillOfSalePageClient = lazyClient(() => import('./VehicleBillOfSalePageClient'));
const VehicleFaqSection = lazyClient(() => import('./VehicleFaqSection')); // Assuming this exists based on previous steps

interface VehicleBillOfSalePageProps {
  params: { locale: string };
}

export async function generateMetadata({ params: { locale } }: VehicleBillOfSalePageProps): Promise<Metadata> {
  const t = await getTranslator(locale, ['doc_bill_of_sale_vehicle', 'common']);

  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
  };
}

export default async function BillOfSaleVehiclePage() {
  // The actual content will be rendered by the client component
  return (
    <>
      {/* The client component handles the rendering */}
      <VehicleBillOfSalePageClient />
      <VehicleFaqSection /> {/* Render the lazy-loaded component */}
    </>
  );
}

export const dynamic = 'force-dynamic';