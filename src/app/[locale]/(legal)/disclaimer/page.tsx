// src/app/[locale]/disclaimer/page.tsx
import DisclaimerPage from '@/app/disclaimer/page';

// Static generation for legal pages (revalidate weekly)
export const dynamic = 'force-static';
export const revalidate = 604800; // 1 week

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}

export default function LocaleDisclaimerPage() {
  return <DisclaimerPage />;
}
