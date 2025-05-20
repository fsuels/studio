import VehicleBillOfSaleDisplay from '@/components/docs/VehicleBillOfSaleDisplay'

export const metadata = {
  title: 'Vehicle Bill of Sale - 100% Legal in All 50 States',
  description: 'Create a legally binding vehicle bill of sale online in minutes. Valid in all 50 states. Free PDF, bilingual, attorney-reviewed.'
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
