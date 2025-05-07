
// src/app/[locale]/docs/[docId]/start/page.tsx
'use client';

import { useParams, notFound, useRouter } from 'next/navigation';
import WizardLayout from '@/components/WizardLayout'; // Using existing WizardLayout
import { documentLibrary, type LegalDocument } from '@/lib/document-library'; // Using LegalDocument
import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function StartWizardPage() {
  const params = useParams();
  const router = useRouter(); // For navigation

  const locale = params.locale as 'en' | 'es';
  const docIdFromPath = params.docId as string; // Renamed to avoid conflict

  const [docConfig, setDocConfig] = useState<LegalDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (docIdFromPath) {
      const foundDoc = documentLibrary.find(d => d.id === docIdFromPath);
      if (foundDoc) {
        setDocConfig(foundDoc);
      } else {
        // If docConfig is not found, trigger Next.js not found page
        notFound();
      }
      setIsLoading(false);
    } else {
       // If no docId in params, also not found
      setIsLoading(false);
      notFound();
    }
  }, [docIdFromPath]);


  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Loading document wizard...</p>
      </div>
    );
  }

  if (!docConfig) {
    // This state should ideally be caught by notFound() earlier,
    // but as a safeguard:
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
            console.error("Checkout URL not provided from WizardLayout onComplete.");
            router.push(`/${locale}/dashboard?status=error`); // Example fallback
        }
      }}
    />
  );
}
