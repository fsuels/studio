// src/app/[locale]/layout.tsx
'use client';

import type { ReactNode } from 'react';
import { useParams } from 'next/navigation';
import { ClientProviders } from '@/components/providers/ClientProviders';
import { Inter } from 'next/font/google'; // Assuming Inter is used, adjust if different

const inter = Inter({ subsets: ['latin'] }); // Example font loading

interface LocaleLayoutProps {
  children: ReactNode;
  params: { locale: string }; // Next.js ensures params.locale is available
}

export default function LocaleLayout({ children, params }: LocaleLayoutProps) {
  // No need to use useParams() here if Next.js provides params directly to layout
  const { locale } = params;

  return (
    // The <html> and <body> tags are now in the root src/app/layout.tsx
    // This layout component will be nested within that.
    // Pass the detected locale to ClientProviders
    <ClientProviders locale={locale as 'en' | 'es'}>
      {children}
    </ClientProviders>
  );
}
