
"use client";

import React, { useState, useEffect, ReactNode } from 'react';
import I18nClientProvider from '@/components/providers/I18nProvider';
import { PromoBanner } from '@/components/landing/PromoBanner';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from "@/components/ui/toaster";

interface ClientProvidersProps {
  children: ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This effect runs only on the client, after the initial render
    setIsClient(true);
  }, []);

  // During SSR or initial client render before the effect runs, render basic structure.
  // After hydration and the effect runs, render with I18nClientProvider.
  if (!isClient) {
    return (
      <>
        <PromoBanner />
        <main className="flex-grow">{children}</main>
        <Footer />
        <Toaster />
      </>
    );
  }

  // Now we are definitely on the client, render with the i18n provider
  return (
    <I18nClientProvider>
      <PromoBanner />
      <main className="flex-grow">{children}</main>
      <Footer />
      <Toaster />
    </I18nClientProvider>
  );
}
