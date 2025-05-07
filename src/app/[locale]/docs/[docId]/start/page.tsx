
// src/app/[locale]/docs/[docId]/start/page.tsx
'use client';

import { useParams, notFound, useRouter } from 'next/navigation';
import WizardLayout from '@/components/WizardLayout'; 
import { documentLibrary, type LegalDocument } from '@/lib/document-library'; 
import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast'; // Import useToast

export default function StartWizardPage() {
  const params = useParams();
  const router = useRouter(); 
  const { toast } = useToast(); // Initialize useToast

  const locale = params.locale as 'en' | 'es';
  const docIdFromPath = params.docId as string; 

  const [docConfig, setDocConfig] = useState<LegalDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (docIdFromPath) {
      const foundDoc = documentLibrary.find(d => d.id === docIdFromPath);
      if (foundDoc) {
        setDocConfig(foundDoc);
      } else {
        notFound();
      }
      setIsLoading(false);
    } else {
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
    return <p>Document configuration could not be loaded.</p>;
  }
  
  return (
    <WizardLayout
      locale={locale}
      doc={docConfig}
      onComplete={(checkoutUrl) => {
        if (checkoutUrl) {
            toast({ title: "Proceeding to Checkout", description: "Redirecting to secure payment..." });
            router.push(checkoutUrl);
        } else {
            console.error("Checkout URL not provided from WizardLayout onComplete.");
            toast({ title: "Checkout Error", description: "Could not initiate checkout. Please try again.", variant: "destructive" });
            router.push(`/${locale}/dashboard?status=checkout_error`); 
        }
      }}
    />
  );
}
