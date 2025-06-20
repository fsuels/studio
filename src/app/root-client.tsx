// src/app/root-client.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/hooks/useAuth';
import { Toaster } from '@/components/ui/toaster';
import { CommandPaletteProvider } from '@/hooks/useCommandPalette';
import GlobalCommandPalette from '@/components/global/GlobalCommandPalette';
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

  if (typeof window !== 'undefined') {
    mark('root-layout-start');
  }

  useEffect(() => {
    mark('root-layout-end');
    measure('root-layout', 'root-layout-start', 'root-layout-end');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <I18nextProvider i18n={i18n}>
          <CommandPaletteProvider>
            {children}
            <GlobalCommandPalette />
            <Toaster />
          </CommandPaletteProvider>
        </I18nextProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
