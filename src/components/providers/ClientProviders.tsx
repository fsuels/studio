"use client";

import React, { ReactNode, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import I18nClientProvider from '@/components/providers/I18nProvider';
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from '@/contexts/CartProvider';
import GooglePlacesLoader from '@/components/GooglePlacesLoader';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';

interface ClientProvidersProps {
  children: ReactNode;
  locale: 'en' | 'es';
}

// Skeleton Loaders
const HeaderSkeleton = () => <div className="h-16 bg-gray-200 dark:bg-gray-800 animate-pulse"></div>;
const FooterSkeleton = () => <div className="h-40 bg-gray-200 dark:bg-gray-800 animate-pulse"></div>;

// Dynamically import Header and Footer
const DynamicHeader = dynamic(() => import('@/components/layout/Header'), {
  loading: () => <HeaderSkeleton />,
  ssr: false, // Consider if SSR is needed for Header (e.g., for LCP or SEO)
});

const DynamicFooter = dynamic(() => import('@/components/layout/Footer').then(mod => mod.Footer), {
  loading: () => <FooterSkeleton />,
  ssr: false, // Consider if SSR is needed for Footer
});

// This sub-component will be rendered inside I18nClientProvider
// and can safely use the useTranslation hook.
function AppShell({ children }: { children: ReactNode }) {
  const { ready, t } = useTranslation();

  if (!ready) {
    return (
      <div id="app-i18n-loading" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-2 mt-2 text-muted-foreground">Initializing interface...</p>
      </div>
    );
  }

  return (
    <CartProvider>
      <GooglePlacesLoader />
      <DynamicHeader />
      <main className="flex-grow">{children}</main>
      <DynamicFooter />
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
    return (
      <div id="app-initial-mount-loading" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-2 mt-2 text-muted-foreground">Loading application...</p>
      </div>
    );
  }

  return (
    <I18nClientProvider locale={locale}>
      <AppShell>{children}</AppShell>
    </I18nClientProvider>
  );
}
