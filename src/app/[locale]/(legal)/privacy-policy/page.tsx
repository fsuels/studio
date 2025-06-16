// src/app/[locale]/privacy-policy/page.tsx
import PrivacyPolicyPage from '@/app/privacy-policy/page';

// Static generation for legal pages (revalidate weekly)
export const dynamic = 'force-static';
export const revalidate = 604800; // 1 week

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}

export default function LocalePrivacyPolicyPage() {
  return <PrivacyPolicyPage />;
}
