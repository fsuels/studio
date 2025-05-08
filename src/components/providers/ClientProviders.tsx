// src/components/providers/ClientProviders.tsx
"use client";

import React, { ReactNode } from 'react'; // Removed useEffect, useState
import { useParams } from 'next/navigation';
import I18nClientProvider from '@/components/providers/I18nProvider';
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from '@/contexts/CartProvider';
import Header from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

interface ClientProvidersProps {
  children: ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  const params = useParams();
  // params can be null during initial server render if not available,
  // or on client before router is fully ready.
  // Defaulting to 'en' is a safe bet for SSR if locale isn't determined.
  // I18nClientProvider's useEffect will sync it on client.
  const locale = (params?.locale as 'en' | 'es') || 'en';

  return (
    <I18nClientProvider locale={locale}>
      <CartProvider>
        <Header /> {/* Header itself handles 'isMounted' for parts of its UI */}
        <main className="flex-grow">{children}</main>
        <Footer /> {/* Footer itself handles 'isMounted' for parts of its UI */}
        <Toaster />
      </CartProvider>
    </I18nClientProvider>
  );
}
