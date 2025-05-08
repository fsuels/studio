// src/components/providers/ClientProviders.tsx
"use client";

import React, { ReactNode, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import I18nClientProvider from '@/components/providers/I18nProvider';
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from '@/contexts/CartProvider';
import Header from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import GooglePlacesLoader from '@/components/GooglePlacesLoader'; // Import the loader

interface ClientProvidersProps {
  children: ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  const params = useParams();
  const locale = (params?.locale as 'en' | 'es') || 'en';
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Render a minimal version or null during SSR/pre-hydration to avoid mismatches
    // This is important if Header or Footer have client-only logic that might
    // cause hydration errors before i18n or other client-side data is ready.
    return (
      <I18nClientProvider locale={locale}>
         {/* Render children directly, or a basic skeleton if Header/Footer cause issues */}
        {children}
        <Toaster />
      </I18nClientProvider>
    );
  }

  return (
    <I18nClientProvider locale={locale}>
      <CartProvider>
        <GooglePlacesLoader /> {/* Load Google Maps API script */}
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
        <Toaster />
      </CartProvider>
    </I18nClientProvider>
  );
}
