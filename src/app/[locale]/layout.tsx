// src/app/[locale]/layout.tsx

import type { ReactNode } from 'react';
import { ClientProviders } from '@/components/providers/ClientProviders';

interface LocaleLayoutProps {
  children: ReactNode;
  params: { locale?: string };
}

export default function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const pathLocale = params.locale;
  const detectedLocale =
    pathLocale === 'es' || pathLocale === 'en' ? (pathLocale as 'en' | 'es') : 'en';

  return <ClientProviders locale={detectedLocale}>{children}</ClientProviders>;
}
