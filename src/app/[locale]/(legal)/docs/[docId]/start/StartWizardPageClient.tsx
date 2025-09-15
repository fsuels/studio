// src/app/[locale]/(legal)/docs/[docId]/start/StartWizardPageClient.tsx
'use client';

import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';

// Lazy load the wizard shell for better performance
const WizardShell = dynamic(() => import('./components/WizardShell'), {
  loading: () => (
    <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <span className="ml-3 text-lg">Loading document wizard...</span>
    </div>
  ),
  ssr: false
});

interface StartWizardPageClientProps {
  locale: 'en' | 'es';
  docId: string;
  docMeta?: {
    id: string;
    basePrice?: number;
    category?: string;
    name?: string;
    description?: string;
    translations?: {
      en?: { name?: string; description?: string };
      es?: { name?: string; description?: string };
    };
  };
}

export default function StartWizardPageClient({ locale, docId, docMeta }: StartWizardPageClientProps) {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <span className="ml-3 text-lg">Starting wizard...</span>
      </div>
    }>
      <WizardShell locale={locale} docId={docId} docMeta={docMeta} />
    </Suspense>
  );
}
