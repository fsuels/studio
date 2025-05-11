// src/app/[locale]/layout.tsx
'use client';

import { ReactNode, useEffect } from 'react'; // Added useEffect
import { useParams } from 'next/navigation';
import { ClientProviders } from '@/components/providers/ClientProviders';
import { useTranslation } from 'react-i18next'; // Import useTranslation

interface LocaleLayoutProps {
  children: ReactNode;
}

export default function LocaleLayout({ children }: LocaleLayoutProps) {
  const params = useParams();
  // Ensure locale is correctly typed and defaults if params.locale is not 'en' or 'es'
  const detectedLocale = (params?.locale === 'es' || params?.locale === 'en') ? params.locale : 'en';
  const { i18n } = useTranslation(); // Get i18n instance

  // Effect to synchronize i18next instance with the detected locale from URL
  useEffect(() => {
    if (i18n.isInitialized && i18n.language !== detectedLocale) {
      i18n.changeLanguage(detectedLocale);
    }
  }, [i18n, detectedLocale]);


  return (
    <ClientProviders locale={detectedLocale}>
      {children}
    </ClientProviders>
  );
}
