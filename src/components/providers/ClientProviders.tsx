// src/components/providers/ClientProviders.tsx
'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import I18nClientProvider from '@/components/providers/I18nProvider';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/contexts/CartProvider';
import { AuthProvider } from '@/hooks/useAuth'; // Ensure this is the correct export
import { AccessibilityProvider } from '@/contexts/AccessibilityProvider';
import { Loader2 } from 'lucide-react';
import { ThemeProvider } from 'next-themes';

interface ClientProvidersProps {
  children: ReactNode;
  locale: 'en' | 'es';
}

// Statically import Footer so it is included in the main bundle.
// This avoids an additional network request on every navigation.
import { Footer } from '@/components/layout/Footer';
import dynamic from 'next/dynamic';

// Load non-critical widgets lazily
const ContactFormButton = dynamic(() =>
  import('@/components/shared').then((m) => ({ default: m.ContactFormButton })),
);
const ActivityTicker = dynamic(() =>
  import('@/components/shared').then((m) => ({ default: m.ActivityTicker })),
);
const AccessibilityToolbar = dynamic(() =>
  import('@/components/accessibility/AccessibilityToolbar').then((m) => ({
    default: m.AccessibilityToolbar,
  })),
);
const GlobalKeyboardShortcuts = dynamic(() =>
  import('@/components/accessibility/GlobalKeyboardShortcuts').then((m) => ({
    default: m.GlobalKeyboardShortcuts,
  })),
);

const AppShell = React.memo(function AppShell({
  children,
}: {
  children: ReactNode;
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // AppShell now renders child content and global components
  // The Layout component will handle Header and main structure
  return (
    <>
      {children}
      <ContactFormButton />
      <ActivityTicker />
      {/* Conditionally render accessibility components only on the client after mount */}
      {isMounted && <AccessibilityToolbar />}
      {isMounted && <GlobalKeyboardShortcuts />}
      {/* Conditionally render Toaster only on the client after mount */}
      {isMounted && <Toaster />}
    </>
  );
});

export function ClientProviders({ children, locale }: ClientProvidersProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
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
            <AccessibilityProvider>
              <CartProvider>
                <AppShell>{children}</AppShell>
              </CartProvider>
            </AccessibilityProvider>
          </AuthProvider>
        </QueryClientProvider>
      </I18nClientProvider>
    </ThemeProvider>
  );
}
