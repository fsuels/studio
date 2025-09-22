import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Layout } from '@/components/layout/Layout';
import MarketingProviders from '@/components/providers/MarketingProviders';

const LanguageSwitch = dynamic(() => import('@/components/global/LanguageSwitch'));

interface Props { children: React.ReactNode; params: Promise<{ locale?: string }> }

export default async function MarketingLayout({ children, params }: Props) {
  const resolvedParams = await params;
  const pathLocale = resolvedParams?.locale;
  const detectedLocale =
    pathLocale === 'es' || pathLocale === 'en' ? (pathLocale as 'en' | 'es') : 'en';

  return (
    <Suspense fallback={null}>
      <MarketingProviders locale={detectedLocale}>
        <Suspense fallback={null}>
          <LanguageSwitch currentLocale={detectedLocale} showToast={false} />
        </Suspense>
        <Suspense fallback={null}>
          <Layout>{children}</Layout>
        </Suspense>
      </MarketingProviders>
    </Suspense>
  );
}

