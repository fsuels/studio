// src/components/providers/ClientProviders.tsx
'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import I18nClientProvider from '@/components/providers/I18nProvider';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/contexts/CartProvider';
import { AuthProvider } from '@/hooks/useAuth'; // Ensure this is the correct export
import { AccessibilityProvider } from '@/contexts/AccessibilityProvider';
import { DiscoveryModalProvider } from '@/contexts/DiscoveryModalContext';
import { Loader2 } from 'lucide-react';
import { ThemeProvider } from 'next-themes';
import { usePathname } from 'next/navigation';

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
const GlobalKeyboardShortcuts = dynamic(() =>
  import('@/components/accessibility/GlobalKeyboardShortcuts').then((m) => ({
    default: m.GlobalKeyboardShortcuts,
  })),
);
const DocumentDiscoveryModal = dynamic(() =>
  import('@/components/global/DocumentDiscoveryModal'),
);
const AIFeatureTooltip = dynamic(() =>
  import('@/components/shared/AIFeatureTooltip'),
);

const AppShell = React.memo(function AppShell({
  children,
}: {
  children: ReactNode;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

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
      {isMounted && <GlobalKeyboardShortcuts />}
      {/* Global Document Discovery Modal */}
      {isMounted && <DocumentDiscoveryModal />}
      {/* AI Feature Educational Tooltip */}
      {isMounted && !/^\/?$|^\/(en|es)\/?$/.test(pathname || '') && (
        <AIFeatureTooltip />
      )}
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
              <DiscoveryModalProvider>
                <CartProvider>
                  <AppShell>{children}</AppShell>
                </CartProvider>
              </DiscoveryModalProvider>
            </AccessibilityProvider>
          </AuthProvider>
        </QueryClientProvider>
      </I18nClientProvider>
    </ThemeProvider>
  );
}
