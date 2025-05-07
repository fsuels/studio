
"use client";

import React, { ReactNode } from 'react';
import I18nClientProvider from '@/components/providers/I18nProvider';
import { Toaster } from "@/components/ui/toaster";
import { Layout } from '@/components/layout/Layout'; 
import { CartProvider } from '@/contexts/CartProvider'; 
// ThemeProvider is now in RootLayout, so it's removed from here.
// No need for isClient state here for gating ThemeProvider or I18nClientProvider directly.
// Component-level isHydrated checks will handle client-specific rendering for translations.

interface ClientProvidersProps {
  children: ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <I18nClientProvider> {/* I18nProvider is always rendered */}
      <CartProvider>
        <Layout>
          {children}
          <Toaster />
        </Layout>
      </CartProvider>
    </I18nClientProvider>
  );
}
