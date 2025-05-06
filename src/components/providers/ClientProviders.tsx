
"use client";

import React, { useState, useEffect, ReactNode } from 'react';
import I18nClientProvider from '@/components/providers/I18nProvider';
import { Toaster } from "@/components/ui/toaster";
import { Layout } from '@/components/layout/Layout'; // Import Layout
import { CartProvider } from '@/contexts/CartProvider'; // Import CartProvider
import { ThemeProvider } from 'next-themes'; // Import ThemeProvider

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
  // After hydration and the effect runs, render with I18nClientProvider and ThemeProvider.
  if (!isClient) {
    return (
      // Wrap directly in Layout
      <CartProvider>
        <Layout>
          {children}
          <Toaster />
        </Layout>
      </CartProvider>
    );
  }

  // Now we are definitely on the client, render with all providers
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <I18nClientProvider>
        <CartProvider>
          <Layout>
            {children}
            <Toaster />
          </Layout>
        </CartProvider>
      </I18nClientProvider>
    </ThemeProvider>
  );
}

