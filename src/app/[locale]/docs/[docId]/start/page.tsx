// src/app/[locale]/docs/[docId]/start/page.tsx
'use client';

import { useParams, notFound, useRouter } from 'next/navigation'; // Added useRouter
import React, { useEffect, useState } from 'react'; // Added useState, useEffect
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast'; 
import { documentLibrary, type LegalDocument } from '@/lib/document-library'; 

// Import new/updated components
import Breadcrumb from '@/components/Breadcrumb'; // Assuming Breadcrumb component exists or is created
import WizardForm from '@/components/WizardForm';
import DocumentPreview from '@/components/DocumentPreview'; // Assuming DocumentPreview exists
import { useTranslation } from 'react-i18next';


export default function StartWizardPage() {
  const params = useParams();
  const router = useRouter(); 
  const { toast } = useToast(); 
  const { t } = useTranslation();

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
        // If document not found, call notFound() from next/navigation
        console.error(`Document config not found for docId: ${docIdFromPath}`);
        notFound(); 
      }
      setIsLoading(false);
    } else {
      // If no docIdFromPath, it's also a notFound scenario
      setIsLoading(false);
      notFound();
    }
  }, [docIdFromPath]);


  if (isLoading || !docConfig) { // Check !docConfig as well
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Loading document wizard...</p>
      </div>
    );
  }
  
  const documentDisplayName = locale === 'es' && docConfig.name_es ? docConfig.name_es : docConfig.name;

  return (
    <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      <Breadcrumb
        items={[
          { label: t('Home', { ns: 'translation'}), href: `/${locale}` },
          { label: documentDisplayName, href: `/${locale}/docs/${docIdFromPath}` },
          { label: t('Create', { ns: 'translation'}) },
        ]}
      />
      
      {/* WizardForm will now render its own ProgressStepper at its top */}
      {/* The two-column layout will be managed within WizardLayout if that's still used,
          or directly here if WizardLayout is removed/refactored as per the user's example.
          The user's new example for this page directly includes WizardForm and DocumentPreview.
      */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
        <div className="lg:col-span-2">
           <WizardForm
            locale={locale}
            doc={docConfig}
            onComplete={(checkoutUrl) => {
              if (checkoutUrl) {
                  toast({ title: "Proceeding to Checkout", description: "Redirecting to secure payment..." });
                  router.push(checkoutUrl);
              } else {
                  console.error("Checkout URL not provided onComplete.");
                  toast({ title: "Checkout Error", description: "Could not initiate checkout. Please try again.", variant: "destructive" });
                  router.push(`/${locale}/dashboard?status=checkout_error`); 
              }
            }}
          />
        </div>
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <h3 className="text-xl font-semibold mb-4 text-center text-card-foreground">{t('Live Preview')}</h3>
             <DocumentPreview docId={docIdFromPath} locale={locale} alt={`${documentDisplayName} preview`} />
          </div>
        </div>
      </div>
    </main>
  );
}
