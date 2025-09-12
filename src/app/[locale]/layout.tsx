// src/app/[locale]/layout.tsx

import type { ReactNode } from 'react';
import { Layout } from '@/components/layout/Layout';
import LanguageSwitch from '@/components/global/LanguageSwitch';
import MarketingClient from '@/app/marketing-client';

interface LocaleLayoutProps {
  children: ReactNode;
  params: { locale?: string };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  // Await params before using its properties (Next.js 15 requirement)
  const { locale: pathLocale } = await params;

  // Fallback to 'en' if the locale isn’t 'en' or 'es'
  const detectedLocale =
    pathLocale === 'es' || pathLocale === 'en'
      ? (pathLocale as 'en' | 'es')
      : 'en';

  return (
    <MarketingClient>
      <LanguageSwitch currentLocale={detectedLocale} showToast={false} />
      <Layout>{children}</Layout>
    </MarketingClient>
  );
}
