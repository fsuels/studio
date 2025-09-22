import React, { Suspense } from 'react';
import { ClientProviders } from '@/components/providers/ClientProviders';
import LanguageSwitch from '@/components/global/LanguageSwitch';
import { Layout } from '@/components/layout/Layout';
interface Props { children: React.ReactNode; params: Promise<{ locale?: string }> }

export default async function LegalGroupLayout({ children, params }: Props) {
  const resolvedParams = await params;
  const pathLocale = resolvedParams?.locale;
  const detectedLocale =
    pathLocale === 'es' || pathLocale === 'en' ? (pathLocale as 'en' | 'es') : 'en';

  return (
    <Suspense fallback={null}>
      <ClientProviders locale={detectedLocale}>
        <Suspense fallback={null}>
          <LanguageSwitch currentLocale={detectedLocale} showToast={false} />
        </Suspense>
        <Suspense fallback={null}>
          <Layout>{children}</Layout>
        </Suspense>
      </ClientProviders>
    </Suspense>
  );
}
