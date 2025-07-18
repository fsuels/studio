// src/app/[locale]/docs/[docId]/view/page.tsx
import React from 'react';
import ViewDocumentView from './view-document-view';

interface ViewDocumentPageProps {
  params: Promise<{
    locale: 'en' | 'es';
    docId: string;
  }>;
}

export default async function ViewDocumentPage({ params }: ViewDocumentPageProps) {
  // Await params for Next.js 15 compatibility
  const { locale, docId } = await params;
  
  // Debug logging to understand the routing
  console.log('🔍 ViewDocumentPage received params:', { locale, docId });
  
  return <ViewDocumentView locale={locale} docId={docId} />;
}