// src/app/[locale]/layout.tsx
'use client';

import type { ReactNode } from 'react';
import { useParams } from 'next/navigation'; // Keep useParams to get locale if params prop is not used directly
import { ClientProviders } from '@/components/providers/ClientProviders';

// Font loading (like Inter) should be handled in the root layout (app/layout.tsx)
// const inter = Inter({ subsets: ['latin'] }); // Removed

interface LocaleLayoutProps {
  children: ReactNode;
  params: { locale: string }; // Next.js ensures params.locale is available
}

export default function LocaleLayout({ children, params }: LocaleLayoutProps) {
  // The 'locale' is directly available from the 'params' prop provided by Next.js
  const { locale } = params;

  return (
    // This ClientProviders instance will correctly set the i18n language
    // based on the URL segment.
    <ClientProviders locale={locale as 'en' | 'es'}>
      {children}
    </ClientProviders>
  );
}
