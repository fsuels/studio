import React from 'react';
import dynamic from 'next/dynamic';
import { Layout } from '@/components/layout/Layout';
import MarketingProviders from '@/components/providers/MarketingProviders';

const LanguageSwitch = dynamic(() => import('@/components/global/LanguageSwitch'));

interface Props { children: React.ReactNode; params: Promise<{ locale?: string }> }

export default async function MarketingLayout({ children, params }: Props) {
  const { locale: pathLocale } = await params;
  const detectedLocale =
    pathLocale === 'es' || pathLocale === 'en' ? (pathLocale as 'en' | 'es') : 'en';

  return (
    <MarketingProviders locale={detectedLocale}>
      <LanguageSwitch currentLocale={detectedLocale} showToast={false} />
      <Layout>{children}</Layout>
    </MarketingProviders>
  );
}
