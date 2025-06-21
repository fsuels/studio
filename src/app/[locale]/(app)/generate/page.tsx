'use client';

import React from 'react';
import dynamic from 'next/dynamic';

/** Client-only component that hosts the full “Generate Document” flow */
const DocumentFlow = dynamic(
  () => import('@/components/workflow/DocumentFlow'),
  {
    ssr: false, // keep heavy Stripe/preview logic out of the server bundle
  },
);

export default function GeneratePage() {
  return (
    <main className="container mx-auto py-8">
      <DocumentFlow />
    </main>
  );
}
