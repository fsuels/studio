// src/components/providers/ClientProviders.tsx
"use client";

import React, { ReactNode } from 'react';
import { useParams } from 'next/navigation'; // Import useParams
import I18nClientProvider from '@/components/providers/I18nProvider';
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from '@/contexts/CartProvider';
import Header from '@/components/layout/Header'; // Add Header here
import { Footer } from '@/components/layout/Footer'; // Add Footer here

interface ClientProvidersProps {
  children: ReactNode;
  // locale prop is removed, it will be determined internally
}

export function ClientProviders({ children }: ClientProvidersProps) {
  const params = useParams();
  // Ensure params is not null and params.locale exists, otherwise default to 'en'
  const locale = (params?.locale as 'en' | 'es') || 'en'; 

  return (
    <I18nClientProvider locale={locale}>
      <CartProvider>
        <Header /> {/* Render Header within providers */}
        <main className="flex-grow">{children}</main>
        <Footer /> {/* Render Footer within providers */}
        <Toaster />
      </CartProvider>
    </I18nClientProvider>
  );
}
