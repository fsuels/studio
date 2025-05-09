// src/app/[locale]/docs/[docId]/start/page.tsx
'use client';

import { useParams, notFound, useRouter } from 'next/navigation';
import React, { useEffect, useState, useCallback, useMemo } from 'react'; // Added useMemo
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { documentLibrary, type LegalDocument } from '@/lib/document-library';
import Breadcrumb from '@/components/Breadcrumb';
import WizardForm from '@/components/WizardForm';
// import PreviewPane from '@/components/PreviewPane'; // No longer directly used here
import { useTranslation } from 'react-i18next';
import { z } from 'zod'; 
import WizardLayout from '@/components/WizardLayout'; // Import WizardLayout
import PreviewPane from '@/components/PreviewPane'; // Keep for WizardLayout structure

export default function StartWizardPage() {
  const params = useParams();
  const { t, i18n } = useTranslation();
  const router = useRouter(); 

  const locale = params.locale as 'en' | 'es';
  const docIdFromPath = params.docId as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);
  const { toast } = useToast();

  // Memoize docConfig to stabilize its reference as long as docIdFromPath doesn't change
  const docConfig = useMemo(() => {
    if (!docIdFromPath) return null;
    const foundDoc = documentLibrary.find(d => d.id === docIdFromPath);
    
    if (foundDoc) {
      let isValidSchema = false;
      if (foundDoc.schema) {
        const schema = foundDoc.schema;
        isValidSchema = schema instanceof z.ZodObject && typeof schema.shape === 'object' && schema.shape !== null && Object.keys(schema.shape).length > 0;
        if (!isValidSchema && schema._def && schema._def.schema && schema._def.schema instanceof z.ZodObject) {
           isValidSchema = typeof schema._def.schema.shape === 'object' && schema._def.schema.shape !== null && Object.keys(schema._def.schema.shape).length > 0;
        }
      }
      if (isValidSchema) {
        return foundDoc;
      } else {
        console.error(`[StartWizardPage] Schema invalid for docId: ${docIdFromPath}. FoundDoc valid: ${!!foundDoc}, Schema valid: ${isValidSchema}.`);
        return null; // Mark as invalid for further handling
      }
    }
    console.error(`[StartWizardPage] Document config not found for docId: ${docIdFromPath}.`);
    return null; // Document not found
  }, [docIdFromPath]);


  useEffect(() => {
    setIsHydrated(true);
    if (docIdFromPath) {
      if (docConfig) {
        setIsLoading(false);
      } else {
        // This console.error moved to useMemo for earlier detection if docConfig is null
        setIsLoading(false); 
        notFound(); // Trigger 404 if docConfig couldn't be resolved
      }
    } else if (isHydrated) { // Only call notFound if hydrated and no docIdFromPath
      setIsLoading(false);
      notFound(); 
    }
  }, [docIdFromPath, docConfig, isHydrated, notFound]);


  const handleWizardComplete = useCallback((checkoutUrl: string) => {
    toast({ title: t("Proceeding to Checkout", {ns: 'translation'}), description: t("Redirecting to secure payment...", {ns: 'translation'}) });
    router.push(checkoutUrl);
  }, [toast, t, router]);


  if (!isHydrated || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">{t('Loading document wizard...', {ns: 'translation'})}</p>
      </div>
    );
  }

  if (!docConfig) {
    // This case should ideally be handled by notFound() in useEffect, 
    // but as a fallback if isLoading becomes false before notFound() is called or if notFound() fails.
    // Or, if notFound() is not desired, render an explicit error message.
    // For now, notFound() should handle it.
    return <div className="text-center py-10 text-destructive">{t("Document configuration error or document not found.", { ns: 'translation'})}</div>;
  }
  
  const documentDisplayName = locale === 'es' && docConfig.name_es ? docConfig.name_es : docConfig.name;

  return (
    <WizardLayout locale={locale} doc={docConfig}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-0">
        <div className="lg:col-span-1">
          <WizardForm
            locale={locale}
            doc={docConfig} 
            onComplete={handleWizardComplete}
          />
        </div>
        <div className="lg:col-span-1">
          {/* Mobile toggle handled by PreviewPaneWithToggle, Desktop PreviewPane is direct */}
          <div className="hidden lg:block sticky top-24 h-screen max-h-[calc(100vh-8rem)] flex-col"> {/* Adjusted max-h */}
            <h3 className="text-xl font-semibold mb-4 text-center text-card-foreground shrink-0">
              {t('Live Preview', { ns: 'translation' })}
            </h3>
            <div className="flex-grow overflow-hidden">
              <PreviewPane docId={docIdFromPath} locale={locale} />
            </div>
          </div>
           {/* Mobile: PreviewPane is rendered by PreviewPaneWithToggle now passed into WizardForm */}
        </div>
      </div>
    </WizardLayout>
  );
}
