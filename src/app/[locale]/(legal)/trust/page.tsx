import { Metadata } from 'next';
import { TrustCenter } from '@/components/trust/TrustCenter';

export const revalidate = 3600; // ISR: revalidate every 60 minutes

export const metadata: Metadata = {
  title: 'Trust & Compliance Center | 123LegalDoc',
  description:
    'View our security certifications, compliance reports, uptime status, and data processing agreements. Enterprise-grade security and compliance for legal document automation.',
  keywords: [
    'SOC 2',
    'GDPR',
    'CCPA',
    'compliance',
    'security',
    'data processing agreement',
    'uptime',
    'trust center',
  ],
  openGraph: {
    title: 'Trust & Compliance Center | 123LegalDoc',
    description:
      'Enterprise-grade security and compliance for legal document automation.',
    type: 'website',
  },
};

interface TrustPageProps {
  params: Promise<{ locale: 'en' | 'es' }>;
}

export default async function TrustPage({ params }: TrustPageProps) {
  const { locale } = await params;

  return <TrustCenter locale={locale} />;
}
