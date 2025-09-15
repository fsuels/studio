'use client';

import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';

// Split heavy components for better loading
const WizardCore = dynamic(() => import('./WizardCore'), {
  loading: () => (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="ml-2">Loading document wizard...</span>
    </div>
  ),
  ssr: false
});

interface WizardShellProps {
  locale: 'en' | 'es';
  docId: string;
  docMeta?: any;
}

export default function WizardShell(props: WizardShellProps) {
  return (
    <div className="wizard-container">
      <Suspense fallback={
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <span className="ml-3 text-lg">Initializing wizard...</span>
        </div>
      }>
        <WizardCore {...props} />
      </Suspense>
    </div>
  );
}