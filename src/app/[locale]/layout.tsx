// src/app/[locale]/layout.tsx
'use client';

import { ReactNode, useEffect, useMemo } from 'react'; // Added useMemo
import { useParams } from 'next/navigation';
import { ClientProviders } from '@/components/providers/ClientProviders';
import { useTranslation } from 'react-i18next';

interface LocaleLayoutProps {
  children: ReactNode;
}

export default function LocaleLayout({ children }: LocaleLayoutProps) {
  const params = useParams();
  const { i18n } = useTranslation("common");

  // Use useMemo to stabilize detectedLocale if params.locale itself is stable
  const detectedLocale = useMemo(() => {
    const pathLocale = params?.locale;
    return (pathLocale === 'es' || pathLocale === 'en') ? pathLocale : 'en';
  }, [params?.locale]);

  useEffect(() => {
    if (i18n.isInitialized && i18n.language !== detectedLocale) {
      i18n.changeLanguage(detectedLocale);
    }
  }, [i18n, detectedLocale]); // detectedLocale is now memoized

  return (
    <ClientProviders locale={detectedLocale}>
      {children}
    </ClientProviders>
  );
}
