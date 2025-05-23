
'use client';
import React, { useEffect } from 'react';
import { AuthProvider } from '@/hooks/useAuth';
import { mark, measure } from '@/utils/performance';
import { DefaultSeo } from 'next-seo';
// Removed import SEO from '@/next-seo.config'; to use hardcoded values

export default function RootClient({ children }: { children: React.ReactNode }) {
  if (typeof window !== 'undefined') {
    mark('root-layout-start');
  }

  useEffect(() => {
    mark('root-layout-end');
    measure('root-layout', 'root-layout-start', 'root-layout-end');
  }, []);

  // Simplified SEO props for diagnostics
  const simplifiedSeoProps = {
    title: '123LegalDoc',
    description: 'AI-Powered Legal Document Generation',
  };

  return (
    <AuthProvider>
      <DefaultSeo {...simplifiedSeoProps} />
      {children}
    </AuthProvider>
  );
}
