// src/components/providers/ClientProviders.tsx
"use client";

import React, { ReactNode, useEffect, useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import I18nClientProvider from '@/components/providers/I18nProvider';
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from '@/contexts/CartProvider';
import { AuthProvider } from '@/hooks/useAuth'; // Corrected: AuthProvider is a named export
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import { FooterSkeleton } from '@/components/layout/Footer';

interface ClientProvidersProps {
  children: ReactNode;
  locale: 'en' | 'es';
}

// Skeleton Loaders
const HeaderSkeleton = () => <div className="h-14 bg-muted animate-pulse"></div>; // Adjusted height

// Dynamically import Header and Footer
const DynamicHeader = dynamic(() => import('@/components/layout/Header'), {
  loading: () => <HeaderSkeleton />,
});

const DynamicFooter = dynamic(() => import('@/components/layout/Footer').then(mod => mod.Footer), {
  loading: () => <FooterSkeleton />,
});


const AppShell = React.memo(function AppShell({ children }: { children: ReactNode }) {
  const { ready } = useTranslation("common"); // t function not directly used here
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !ready) {
    return (
      <div id="app-shell-loading" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <HeaderSkeleton />
        <div style={{ display: 'flex', flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-2 mt-2 text-muted-foreground">Loading Interface...</p>
        </div>
        <FooterSkeleton />
      </div>
    );
  }

  return (
    <>
      {/* <DynamicHeader /> */}
      <main className="flex-grow">{children}</main>
      {/* <DynamicFooter /> */}
      <Toaster />
    </>
  );
});

export function ClientProviders({ children, locale }: ClientProvidersProps) {
  return (
    <Suspense fallback={ // Global suspense for initial provider setup
        <div id="app-providers-loading" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
           <p className="ml-2 mt-2 text-muted-foreground">Initializing Application...</p>
        </div>
    }>
      <I18nClientProvider locale={locale}>
        <AuthProvider>
          <CartProvider>
            <AppShell>{children}</AppShell>
          </CartProvider>
        </AuthProvider>
      </I18nClientProvider>
    </Suspense>
  );
}
