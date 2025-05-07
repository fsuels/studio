// src/app/[locale]/docs/[docId]/start/page.tsx
'use client';

import { useParams, notFound, useRouter } from 'next/navigation';
import WizardLayout from '@/components/WizardLayout'; // Updated to WizardLayout
import { documentLibrary, type LegalDocument } from '@/lib/document-library'; // Using LegalDocument
import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function StartPage() {
  const params = useParams();
  const router = useRouter();

  const locale = params.locale as 'en' | 'es';
  const docId = params.docId as string;

  const [docConfig, setDocConfig] = useState<LegalDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (docId) {
      const foundDoc = documentLibrary.find(d => d.id === docId);
      if (foundDoc) {
        setDocConfig(foundDoc);
      } else {
        notFound(); // Trigger Next.js not found if doc config isn't found
      }
      setIsLoading(false);
    } else {
      setIsLoading(false);
      notFound(); // No docId means not found
    }
  }, [docId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Loading document wizard...</p>
      </div>
    );
  }

  if (!docConfig) {
    // This should be caught by notFound() earlier, but as a safeguard:
    return <p>Document configuration could not be loaded.</p>;
  }
  
  return (
    <WizardLayout
      locale={locale}
      doc={docConfig}
      onComplete={(checkoutUrl) => {
        // checkoutUrl is the Stripe session URL
        // Redirect user to Stripe checkout
        if (checkoutUrl) {
            router.push(checkoutUrl);
        } else {
            // Fallback or error handling if checkoutUrl is not provided
            // For example, redirect to a generic success/error page or dashboard
            console.error("Checkout URL not provided from WizardLayout onComplete.");
            router.push(`/${locale}/dashboard?status=error`); // Example fallback
        }
      }}
    />
  );
}
