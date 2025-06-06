// src/components/providers/ClientProviders.tsx
'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import I18nClientProvider from '@/components/providers/I18nProvider';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/contexts/CartProvider';
import { AuthProvider } from '@/hooks/useAuth'; // Ensure this is the correct export
import { Loader2 } from 'lucide-react';

interface ClientProvidersProps {
  children: ReactNode;
  locale: 'en' | 'es';
}

// Statically import Header and Footer so they are included in the main bundle.
// This avoids an additional network request on every navigation.
import Header from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import dynamic from 'next/dynamic';

// Load non-critical widgets lazily
const ContactFormButton = dynamic(() => import('@/components/ContactFormButton'));
const ActivityTicker = dynamic(() => import('@/components/ActivityTicker'));

const AppShell = React.memo(function AppShell({
  children,
}: {
  children: ReactNode;
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // AppShell now always renders its main structure without waiting for
  // dynamic imports of the header and footer.
  return (
    <>
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
      <ContactFormButton />
      <ActivityTicker />
      {/* Conditionally render Toaster only on the client after mount */}
      {isMounted && <Toaster />}
    </>
  );
});

export function ClientProviders({ children, locale }: ClientProvidersProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <I18nClientProvider
      locale={locale}
      fallback={
        <div
          id="app-providers-loading"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-2 mt-2 text-muted-foreground">
            Initializing Application...
          </p>
        </div>
      }
    >
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            <AppShell>{children}</AppShell>
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </I18nClientProvider>
  );
}
