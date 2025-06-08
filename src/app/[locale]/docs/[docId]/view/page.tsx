// src/app/[locale]/docs/[docId]/view/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import DocumentDetail from '@/components/DocumentDetail';
import { useAuth } from '@/hooks/useAuth';
import { getSignWellUrl } from '@/services/signwell';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface ViewDocumentPageProps {
  params: { locale: 'en' | 'es'; docId: string };
}

export default function ViewDocumentPage({ params }: ViewDocumentPageProps) {
  const { locale, docId } = params;
  const { isLoggedIn, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [isSigning, setIsSigning] = useState(false);

  // Navigate back to the start‐wizard, preserving any saved data
  const handleEdit = () => {
    router.push(`/${locale}/docs/${docId}/start`);
  };

  // Opens SignWell flow in a new tab
  const handleSign = async () => {
    setIsSigning(true);
    try {
      const url = await getSignWellUrl(docId);
      window.open(url, '_blank');
    } catch (err) {
      console.error('Error fetching SignWell URL', err);
    } finally {
      setIsSigning(false);
    }
  };

  // Simple guard: only logged in users can download (you'd replace with real payment check)
  const handleDownload = () => {
    if (!isLoggedIn) {
      router.push(`/${locale}/signin`);
    } else {
      router.push(`/${locale}/checkout?docId=${docId}`);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => router.back()}
            className="text-2xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
          <h1 className="text-2xl font-bold">
            {/* Ideally replace docId with a friendly title lookup */}
            {docId.replace(/-/g, ' ')}
          </h1>
        </div>

        <div className="flex space-x-2">
          <Button onClick={handleEdit}>Edit</Button>

          <Button onClick={handleSign} disabled={isSigning}>
            {isSigning ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Sign
          </Button>

          <Button variant="secondary" onClick={handleDownload}>
            Download
          </Button>
        </div>
      </div>

      {/* Document preview */}
      <div className="border rounded-lg overflow-hidden">
        <DocumentDetail docId={docId} locale={locale} />
      </div>
    </div>
  );
}
