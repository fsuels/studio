// src/app/[locale]/documents/bill-of-sale-vehicle/page.tsx
import VehicleBillOfSaleDisplay from '@/components/docs/VehicleBillOfSaleDisplay'
import type { Metadata } from 'next';
import i18n from '@/lib/i18n'; // Import i18n instance

// Dynamically generate metadata based on locale
export async function generateMetadata({ params }: { params: { locale: 'en' | 'es' } }): Promise<Metadata> {
  const { locale } = params;
  // Ensure i18next is initialized for the correct language to fetch metadata
  if (i18n.language !== locale) {
    await i18n.changeLanguage(locale);
  }
  await i18n.loadNamespaces('doc_bill_of_sale_vehicle'); // Load the specific namespace

  const title = i18n.t('metaTitle', { ns: 'doc_bill_of_sale_vehicle', defaultValue: 'Vehicle Bill of Sale Template & How-To Guide | 123LegalDoc' });
  const description = i18n.t('metaDescription', { ns: 'doc_bill_of_sale_vehicle', defaultValue: 'Generate a legally solid vehicle bill of sale in under 5 minutes. Free printable PDF, e-sign-ready, attorney-reviewed, and valid in all 50 states.' });

  return {
    title,
    description,
    // You can add openGraph details here if needed, using translated values
    openGraph: {
      title,
      description,
      // e.g., images: [{ url: `https://www.123legaldoc.com/og-images/bill-of-sale-${locale}.png` }],
    },
  };
}

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }]
}

interface PageProps {
  params: { locale: 'en' | 'es' }
}

export default function VehicleBillOfSalePage({ params }: PageProps) {
  const { locale } = params
  return (
    <main className="py-8">
      <VehicleBillOfSaleDisplay locale={locale} />
    </main>
  )
}
