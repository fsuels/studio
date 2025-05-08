
"use client";

import React, { ReactNode } from 'react';
import I18nClientProvider from '@/components/providers/I18nProvider';
import { Toaster } from "@/components/ui/toaster";
// Layout component (which includes Header/Footer) is removed from here.
// The root app/layout.tsx will now manage the overall page structure including Header and Footer.
import { CartProvider } from '@/contexts/CartProvider';

interface ClientProvidersProps {
  children: ReactNode;
  locale: 'en' | 'es';
}

export function ClientProviders({ children, locale }: ClientProvidersProps) {
  return (
    <I18nClientProvider locale={locale}>
      <CartProvider>
        {/* The main page structure (Header, main content, Footer) is now handled by app/layout.tsx */}
        {children}
        <Toaster />
      </CartProvider>
    </I18nClientProvider>
  );
}
