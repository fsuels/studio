// src/app/[locale]/layout.tsx
'use client';

import { ReactNode, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { ClientProviders } from '@/components/providers/ClientProviders';

interface LocaleLayoutProps {
  children: ReactNode;
}

export default function LocaleLayout({ children }: LocaleLayoutProps) {
  const params = useParams();

  // Use useMemo to stabilize detectedLocale if params.locale itself is stable
  const detectedLocale = useMemo(() => {
    const pathLocale = params?.locale;
    return (pathLocale === 'es' || pathLocale === 'en') ? pathLocale : 'en';
  }, [params?.locale]);

  return (
    <ClientProviders locale={detectedLocale}>
      {children}
    </ClientProviders>
  );
}
