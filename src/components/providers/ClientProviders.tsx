
"use client";

import React, { ReactNode } from 'react';
import I18nClientProvider from '@/components/providers/I18nProvider';
import { Toaster } from "@/components/ui/toaster";
import { Layout } from '@/components/layout/Layout'; 
import { CartProvider } from '@/contexts/CartProvider'; 

interface ClientProvidersProps {
  children: ReactNode;
  locale: 'en' | 'es'; // Add locale prop
}

export function ClientProviders({ children, locale }: ClientProvidersProps) {
  return (
    <I18nClientProvider locale={locale}> {/* Pass locale to I18nProvider */}
      <CartProvider>
        <Layout>
          {children}
          <Toaster />
        </Layout>
      </CartProvider>
    </I18nClientProvider>
  );
}
