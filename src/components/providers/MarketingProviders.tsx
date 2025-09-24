// src/components/providers/MarketingProviders.tsx
'use client';

import React, { ReactNode } from 'react';
import I18nClientProvider from '@/components/providers/I18nProvider';
import { AuthProvider } from '@/hooks/useAuth';
import { ThemeProvider } from 'next-themes';
import { Loader2 } from 'lucide-react';

interface MarketingProvidersProps {
  children: ReactNode;
  locale: 'en' | 'es';
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
        {/* Ensure header components using useAuth have providers on marketing pages */}
        <AuthProvider>{children}</AuthProvider>
      </I18nClientProvider>
    </ThemeProvider>
  );
}

export default MarketingProviders;
