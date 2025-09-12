import React from 'react';
import { ClientProviders } from '@/components/providers/ClientProviders';
import LanguageSwitch from '@/components/global/LanguageSwitch';
import { Layout } from '@/components/layout/Layout';
interface Props { children: React.ReactNode; params: { locale?: string } }

export default async function LegalGroupLayout({ children, params }: Props) {
  const { locale: pathLocale } = await params;
  const detectedLocale =
    pathLocale === 'es' || pathLocale === 'en' ? (pathLocale as 'en' | 'es') : 'en';

  return (
    <ClientProviders locale={detectedLocale}>
      <LanguageSwitch currentLocale={detectedLocale} showToast={false} />
      <Layout>{children}</Layout>
    </ClientProviders>
  );
}
