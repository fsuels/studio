// src/app/[locale]/terms-of-service/page.tsx
import TermsOfServicePage from '@/app/terms-of-service/page';

// Static generation for legal pages (revalidate weekly)
export const dynamic = 'force-static';
export const revalidate = 604800; // 1 week

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}

export default function LocaleTermsPage() {
  return <TermsOfServicePage />;
}
