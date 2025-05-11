"use client";

import React, { ReactNode, useEffect, useState } from 'react';
import I18nClientProvider from '@/components/providers/I18nProvider'; // Assuming this is the correct path
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from '@/contexts/CartProvider';
import Header from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import GooglePlacesLoader from '@/components/GooglePlacesLoader';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react'; // Assuming you have Loader2 for a visual cue

interface ClientProvidersProps {
  children: ReactNode;
  locale: 'en' | 'es';
}

// This sub-component will be rendered inside I18nClientProvider
// and can safely use the useTranslation hook.
function AppShell({ children }: { children: ReactNode }) {
  const { ready, t } = useTranslation(); // t can be used for loading messages if needed

  if (!ready) {
    // i18next is not ready yet, show a loader.
    // This loader is shown AFTER ClientProviders isMounted is true, 
    // and I18nClientProvider has mounted.
    return (
      <div id="app-i18n-loading" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-2 mt-2 text-muted-foreground">Initializing interface...</p>
      </div>
    );
  }

  // i18next is ready, render the main application structure
  return (
    <CartProvider>
      <GooglePlacesLoader />
      <Header /> {/* Header should ideally also have its own internal isMounted/ready checks if it's complex */}
      <main className="flex-grow">{children}</main>
      <Footer /> {/* Footer should ideally also have its own internal isMounted/ready checks */}
      <Toaster />
    </CartProvider>
  );
}

export function ClientProviders({ children, locale }: ClientProvidersProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Render a static placeholder during the very first client render to match SSR.
    // This should be minimal and not involve translations or complex client-side logic.
    return (
      <div id="app-initial-mount-loading" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-2 mt-2 text-muted-foreground">Loading application...</p>
      </div>
    );
  }

  // Once mounted on the client, render the I18nClientProvider,
  // which will then render AppShell that waits for i18next to be ready.
  return (
    <I18nClientProvider locale={locale} /* pass any required namespaces here */>
      <AppShell>{children}</AppShell>
    </I18nClientProvider>
  );
}
