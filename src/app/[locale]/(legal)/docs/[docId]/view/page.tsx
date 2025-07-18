// src/app/[locale]/docs/[docId]/view/page.tsx
import React from 'react';
import ViewDocumentPageClient from './ViewDocumentPageClient';

interface ViewDocumentPageProps {
  params: Promise<{
    locale: 'en' | 'es';
    docId: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ViewDocumentPage({ params, searchParams }: ViewDocumentPageProps) {
  // Await params for Next.js 15 compatibility
  const { locale, docId } = await params;
  const search = await searchParams;
  
  // Debug logging to understand the routing
  console.log('🔍 ViewDocumentPage received params:', { locale, docId, searchParams: search });
  
  // Extract the actual document ID from search params if provided
  const actualDocId = (search?.docId as string) || docId;
  
  return <ViewDocumentPageClient locale={locale} docId={docId} actualDocId={actualDocId} />;
}