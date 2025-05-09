// src/components/providers/ClientProviders.tsx
"use client";

import React, { ReactNode, useEffect, useState } from 'react';
// import { useParams } from 'next/navigation'; // REMOVED - Locale will be passed as a prop
import I18nClientProvider from '@/components/providers/I18nProvider';
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from '@/contexts/CartProvider';
import Header from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import GooglePlacesLoader from '@/components/GooglePlacesLoader';

interface ClientProvidersProps {
  children: ReactNode;
  locale: 'en' | 'es'; // Locale is now a required prop
}

export function ClientProviders({ children, locale }: ClientProvidersProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Render a minimal version or null during SSR/pre-hydration to avoid mismatches
    return (
      <I18nClientProvider locale={locale}>
        {children}
        <Toaster />
      </I18nClientProvider>
    );
  }

  return (
    <I18nClientProvider locale={locale}>
      <CartProvider>
        <GooglePlacesLoader />
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
        <Toaster />
      </CartProvider>
    </I18nClientProvider>
  );
}
