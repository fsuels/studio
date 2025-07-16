// src/app/[locale]/docs/[docId]/view/page.tsx
import React from 'react';
import ViewDocumentView from './view-document-view';

interface ViewDocumentPageProps {
  params: {
    locale: 'en' | 'es';
    docId: string;
  };
}

export default function ViewDocumentPage({ params }: ViewDocumentPageProps) {
  return <ViewDocumentView locale={params.locale} docId={params.docId} />;
}