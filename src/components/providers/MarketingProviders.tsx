// src/components/providers/MarketingProviders.tsx
'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import I18nClientProvider from '@/components/providers/I18nProvider';
import { AuthProvider } from '@/hooks/useAuth';
import { ThemeProvider } from 'next-themes';
import { Loader2 } from 'lucide-react';
import { DiscoveryModalProvider, useDiscoveryModal } from '@/contexts/DiscoveryModalContext';
import { useDeferredComponent } from '@/hooks/useDeferredComponent';

interface MarketingProvidersProps {
  children: ReactNode;
  locale: 'en' | 'es';
}

function MarketingDiscoveryModalLayer({ children }: { children: ReactNode }) {
  const { showDiscoveryModal } = useDiscoveryModal();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const DocumentDiscoveryModalComponent = useDeferredComponent(
    () => import('@/components/global/DocumentDiscoveryModal'),
    {
      trigger: showDiscoveryModal,
      preload: isMounted,
    },
  );

  return (
    <>
      {children}
      {DocumentDiscoveryModalComponent && <DocumentDiscoveryModalComponent />}
      {showDiscoveryModal && !DocumentDiscoveryModalComponent && (
        <div className="fixed inset-0 z-[999] grid place-items-center bg-background/75">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      )}
    </>
  );
}

/**
 * Lightweight client providers for marketing pages only.
 * Avoids shipping heavy app-only contexts while keeping shared UI like the AI Finder modal working.
 */
export function MarketingProviders({ children, locale }: MarketingProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <I18nClientProvider
        locale={locale}
        namespaces={["common", "header", "footer", "faq", "support"]}
        fallback={
          <div
            id="marketing-providers-loading"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
            }}
          >
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        }
      >
        {/* Ensure header components using useAuth and modal context have providers on marketing pages */}
        <AuthProvider>
          <DiscoveryModalProvider>
            <MarketingDiscoveryModalLayer>{children}</MarketingDiscoveryModalLayer>
          </DiscoveryModalProvider>
        </AuthProvider>
      </I18nClientProvider>
    </ThemeProvider>
  );
}

export default MarketingProviders;
