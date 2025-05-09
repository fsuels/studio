// app/[locale]/layout.tsx
'use client';

import { ReactNode } from 'react';
import { useParams } from 'next/navigation';
import { ClientProviders } from '@/components/providers/ClientProviders';

interface LocaleLayoutProps {
  children: ReactNode;
  // params is implicitly available via useParams hook in client components
}

export default function LocaleLayout({ children }: LocaleLayoutProps) {
  const params = useParams();
  // Ensure locale is correctly typed and defaults if params.locale is not 'en' or 'es'
  const locale = (params?.locale === 'es' || params?.locale === 'en') ? params.locale : 'en';

  return (
    <ClientProviders locale={locale}>
      {children}
    </ClientProviders>
  );
}
