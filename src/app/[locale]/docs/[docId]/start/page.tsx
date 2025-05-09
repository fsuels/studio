// src/app/[locale]/docs/[docId]/start/page.tsx
'use client';

import { useParams, notFound, useRouter } from 'next/navigation';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';

import { documentLibrary, type LegalDocument } from '@/lib/document-library';
import Breadcrumb from '@/components/Breadcrumb';
import WizardForm from '@/components/WizardForm';
import PreviewPane from '@/components/PreviewPane';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { saveFormProgress, loadFormProgress } from '@/lib/firestore/saveFormProgress';
import { useAuth } from '@/hooks/useAuth';
import { debounce } from 'lodash-es';

export default function StartWizardPage() {
  const params = useParams();
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { toast } = useToast();
  const { isLoggedIn, user, isLoading: authIsLoading } = useAuth();

  const locale = params.locale as 'en' | 'es';
  const docIdFromPath = params.docId as string;

  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);
  
  // Synchronously derive docConfig
  const docConfig = useMemo(
    () => documentLibrary.find(d => d.id === docIdFromPath),
    [docIdFromPath]
  );

  // Single RHF instance creation
  const methods = useForm<z.infer<typeof docConfigSchema>>({
    resolver: docConfig?.schema ? zodResolver(docConfig.schema) : undefined,
    defaultValues: {}, // Will be loaded from localStorage/Firestore
    mode: 'onBlur',
  });
  
  const { reset, watch } = methods;
  // Fallback to empty schema if docConfig or its schema is not ready, to prevent errors.
  const docConfigSchema = docConfig?.schema || z.object({}); 

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Effect for initial loading and validation
  useEffect(() => {
    if (docIdFromPath && isHydrated) {
      if (docConfig && docConfig.schema) {
        // docConfig is valid and has a schema
      } else {
        console.error(`[StartWizardPage] Document config not found or schema invalid for docId: ${docIdFromPath}`);
        notFound(); // Trigger 404 if doc or its schema is not valid
      }
      setIsLoadingConfig(false);
    }
  }, [docIdFromPath, isHydrated, docConfig]);


  // Load draft data
  useEffect(() => {
    async function loadDraft() {
      if (!docConfig?.id || !isHydrated || authIsLoading) return;
      const currentLocale = params.locale as 'en' | 'es' || locale;
      let draftData: Partial<z.infer<typeof docConfig.schema>> = {};
      try {
        if (isLoggedIn && user?.uid) {
          draftData = await loadFormProgress({ userId: user.uid, docType: docConfig.id, state: currentLocale });
        } else {
          const lsKey = `draft-${docConfig.id}-${currentLocale}`;
          const lsDraft = localStorage.getItem(lsKey);
          if (lsDraft) draftData = JSON.parse(lsDraft);
        }
      } catch (e) {
        console.warn('[StartWizardPage] Draft loading failed:', e);
      }
      if (Object.keys(draftData).length > 0) {
        reset(draftData);
        console.log('[StartWizardPage] Draft loaded:', draftData);
      } else {
        console.log('[StartWizardPage] No draft found, using initial/empty values.');
      }
    }
    loadDraft();
  }, [docConfig, locale, isHydrated, reset, authIsLoading, isLoggedIn, user, params.locale]);


  // Autosave draft data
  const debouncedSave = useCallback(
    debounce(async (data: Record<string, any>) => {
      if (!docConfig?.id || authIsLoading || !isHydrated || Object.keys(data).length === 0) return;
      
      const relevantDataToSave = Object.keys(data).reduce((acc, key) => {
        if (data[key] !== undefined) {
            acc[key] = data[key];
        }
        return acc;
      }, {} as Record<string,any>);

      if (Object.keys(relevantDataToSave).length === 0) return;

      if (isLoggedIn && user?.uid) {
        await saveFormProgress({ userId: user.uid, docType: docConfig.id, state: locale, formData: relevantDataToSave });
      } else {
         localStorage.setItem(`draft-${docConfig.id}-${locale}`, JSON.stringify(relevantDataToSave));
      }
      console.log('[WizardForm] Autosaved draft for:', docConfig.id, locale, relevantDataToSave);
    }, 1000),
    [isLoggedIn, user?.uid, docConfig, locale, authIsLoading, isHydrated] 
  );

  useEffect(() => {
    if (!docConfig?.id || authIsLoading || !isHydrated) return () => {};
    
    const subscription = watch((values) => {
       debouncedSave(values as Record<string, any>);
    });
    return () => {
      subscription.unsubscribe();
      debouncedSave.cancel();
    } ;
  }, [watch, docConfig, debouncedSave, authIsLoading, isHydrated]);


  const handleWizardComplete = useCallback(
    (checkoutUrl: string) => {
      toast({
        title: t('Proceeding to Checkout', { ns: 'translation' }),
        description: t('Redirecting to secure payment...', { ns: 'translation' }),
      });
      if (typeof window !== 'undefined' && docConfig?.id && locale) {
        localStorage.removeItem(`draft-${docConfig.id}-${locale}`);
      }
      router.push(checkoutUrl);
    },
    [toast, t, router, docConfig?.id, locale]
  );


  if (!isHydrated || isLoadingConfig || !docConfig || authIsLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">
          {t('Loading document wizard...', { ns: 'translation' })}
        </p>
      </div>
    );
  }
  
  const documentDisplayName =
  locale === 'es' && docConfig.name_es ? docConfig.name_es : docConfig.name;


  return (
    <FormProvider {...methods}> {/* Wizard and Preview share the SAME form context */}
      <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
         <Breadcrumb
          items={[
            { label: t('breadcrumb.home', { ns: 'translation' }), href: `/${locale}` },
            { label: documentDisplayName, href: `/${locale}/docs/${docConfig.id}` },
            { label: t('breadcrumb.start', { ns: 'translation' }) },
          ]}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
          <div className="lg:col-span-1">
            <WizardForm
              locale={locale}
              doc={docConfig}
              onComplete={handleWizardComplete}
            />
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-24 h-[calc(100vh-8rem)] max-h-[calc(100vh-8rem)] flex flex-col">
              <h3 className="text-xl font-semibold mb-4 text-center text-card-foreground shrink-0">
                {t('Live Preview', { ns: 'translation' })}
              </h3>
              <div className="flex-grow overflow-hidden rounded-lg shadow-md border border-border bg-background">
                 <PreviewPane docId={docIdFromPath} locale={locale} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </FormProvider>
  );
}
