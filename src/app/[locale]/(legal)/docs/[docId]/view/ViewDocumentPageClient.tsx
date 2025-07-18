// src/app/[locale]/(legal)/docs/[docId]/view/ViewDocumentPageClient.tsx
'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { Loader2 } from 'lucide-react';

const ViewDocumentView = dynamic(() => import('./view-document-view'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  ),
});

interface ViewDocumentPageClientProps {
  locale: 'en' | 'es';
  docId: string;
  actualDocId?: string;
}

export default function ViewDocumentPageClient({
  locale,
  docId,
  actualDocId,
}: ViewDocumentPageClientProps) {
  return <ViewDocumentView locale={locale} docId={docId} actualDocId={actualDocId} />;
}