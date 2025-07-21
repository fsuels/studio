// src/app/root-client.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/hooks/useAuth';
import { Toaster } from '@/components/ui/toaster';
import i18n from '@/lib/i18n';
import { mark, measure } from '@/utils/performance';

export default function RootClient({
  children,
}: {
  children: React.ReactNode;
}) {
  // Create QueryClient instance once per app session
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
            retry: 2,
            retryDelay: (attemptIndex) =>
              Math.min(1000 * 2 ** attemptIndex, 30000),
          },
          mutations: {
            retry: 1,
          },
        },
      }),
  );

  useEffect(() => {
    mark('root-layout-start');
    mark('root-layout-end');
    measure('root-layout', 'root-layout-start', 'root-layout-end');

    // Handle browser extension attributes that cause hydration mismatches
    const removeExtensionAttributes = () => {
      const body = document.body;
      if (body) {
        // Remove common extension attributes that cause hydration errors
        body.removeAttribute('ap-style');
        body.removeAttribute('spellcheck');
        body.removeAttribute('cz-shortcut-listen');
        body.removeAttribute('data-new-gr-c-s-check-loaded');
        body.removeAttribute('data-gr-ext-installed');
      }
    };

    // Remove attributes immediately and after a short delay
    removeExtensionAttributes();
    const timeoutId = setTimeout(removeExtensionAttributes, 100);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <I18nextProvider i18n={i18n}>
          {children}
          <Toaster />
        </I18nextProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
