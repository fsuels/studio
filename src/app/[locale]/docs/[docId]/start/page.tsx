// src/app/[locale]/docs/[docId]/start/page.tsx
'use client';

import { useParams, notFound, useRouter } from 'next/navigation';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { documentLibrary, type LegalDocument } from '@/lib/document-library';
import Breadcrumb from '@/components/Breadcrumb';
import WizardForm from '@/components/WizardForm';
import WizardLayout from '@/components/WizardLayout';
import PreviewPane from '@/components/PreviewPane'; // For WizardLayout structure
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

export default function StartWizardPage() {
  const params = useParams();
  const { t, i18n } = useTranslation(); // i18n instance for locale
  const router = useRouter();

  const locale = params.locale as 'en' | 'es';
  const docIdFromPath = params.docId as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);
  const { toast } = useToast();

  const docConfig = useMemo(() => {
    if (!docIdFromPath) {
        console.warn("[StartWizardPage] docIdFromPath is missing in params.");
        return null;
    }
    const foundDoc = documentLibrary.find(d => d.id === docIdFromPath);
    
    if (!foundDoc) {
        console.error(`[StartWizardPage] Document config not found in library for docId: ${docIdFromPath}.`);
        return null;
    }
    
    console.log(`[StartWizardPage] Found doc: ${foundDoc.name}. Validating its schema...`);

    if (!foundDoc.schema) {
        console.error(`[StartWizardPage] Schema is missing for document: ${foundDoc.name} (ID: ${docIdFromPath}).`);
        return null;
    }
    
    // Basic check: is it a Zod schema and does it have a shape property (for ZodObject)?
    // More complex Zod types like ZodEffects might need different handling if they are top-level.
    // For BillOfSaleSchema, it's a ZodObject, so .shape should exist.
    if (foundDoc.schema._def?.typeName === 'ZodObject' && foundDoc.schema.shape && typeof foundDoc.schema.shape === 'object' && Object.keys(foundDoc.schema.shape).length > 0) {
        console.log(`[StartWizardPage] Schema for ${foundDoc.name} appears valid with ${Object.keys(foundDoc.schema.shape).length} keys.`);
        return foundDoc;
    } else if (foundDoc.schema._def?.typeName === 'ZodEffects' && foundDoc.schema._def.schema?._def?.typeName === 'ZodObject' && foundDoc.schema._def.schema.shape && typeof foundDoc.schema._def.schema.shape === 'object' && Object.keys(foundDoc.schema._def.schema.shape).length > 0) {
        console.log(`[StartWizardPage] Schema for ${foundDoc.name} (ZodEffects wrapping ZodObject) appears valid with ${Object.keys(foundDoc.schema._def.schema.shape).length} keys.`);
        return foundDoc;
    } else {
        console.error(`[StartWizardPage] Schema for docId '${docIdFromPath}' ('${foundDoc.name}') is invalid or does not have a usable shape for questions. Schema type: ${foundDoc.schema?._def?.typeName}. Shape:`, foundDoc.schema?.shape);
        return null; 
    }
  }, [docIdFromPath]);

  useEffect(() => {
    setIsHydrated(true);
    if (docIdFromPath) {
      if (docConfig) {
        setIsLoading(false);
      } else {
        // Error logged in useMemo, trigger notFound
        setIsLoading(false);
        notFound();
      }
    } else if (isHydrated) {
      setIsLoading(false);
      notFound();
    }
  }, [docIdFromPath, docConfig, isHydrated, notFound]);

  const handleWizardComplete = useCallback(
    (checkoutUrl: string) => {
      toast({
        title: t('Proceeding to Checkout', { ns: 'translation' }),
        description: t('Redirecting to secure payment...', { ns: 'translation' }),
      });
      router.push(checkoutUrl);
    },
    [toast, t, router]
  );

  if (!isHydrated || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">
          {t('Loading document wizard...', { ns: 'translation' })}
        </p>
      </div>
    );
  }

  if (!docConfig) {
    // This should ideally be caught by notFound() in useEffect,
    // but as a fallback rendering an error message.
    return (
      <div className="text-center py-10 text-destructive">
        {t('Document configuration error or document not found.', { ns: 'translation' })}
      </div>
    );
  }
  
  const documentDisplayName =
    locale === 'es' && docConfig.name_es ? docConfig.name_es : docConfig.name;

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
          <div className="hidden lg:block sticky top-24 h-screen max-h-[calc(100vh-8rem)] flex-col">
            <h3 className="text-xl font-semibold mb-4 text-center text-card-foreground shrink-0">
              {t('Live Preview', { ns: 'translation' })}
            </h3>
            <div className="flex-grow overflow-hidden">
              <PreviewPane docId={docIdFromPath} locale={locale} />
            </div>
          </div>
        </div>
      </div>
    </WizardLayout>
  );
}
