// src/app/[locale]/layout.tsx

import type { ReactNode } from 'react';
import { Layout } from '@/components/layout/Layout';
import dynamic from 'next/dynamic';
const LanguageSwitch = dynamic(
  () => import('@/components/global/LanguageSwitch'),
  { ssr: false },
);
import MarketingClient from '@/app/marketing-client';

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale?: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale: pathLocale } = await params;

  // Fallback to 'en' if the locale isn’t 'en' or 'es'
  const detectedLocale =
    pathLocale === 'es' || pathLocale === 'en'
      ? (pathLocale as 'en' | 'es')
      : 'en';

  return (
    <MarketingClient locale={detectedLocale}>
      <LanguageSwitch currentLocale={detectedLocale} showToast={false} />
      <Layout>{children}</Layout>
    </MarketingClient>
  );
}
