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
import { useAuth } from '@/hooks/useAuth';
import { loadFormProgress, saveFormProgress } from '@/lib/firestore/saveFormProgress';
import { debounce } from 'lodash-es';
import TrustBadges from '@/components/TrustBadges'; // Import TrustBadges

export default function StartWizardPage() {
  const params = useParams();
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { isLoggedIn, user, isLoading: authIsLoading } = useAuth();

  const locale = params.locale as 'en' | 'es';
  const docIdFromPath = params.docId as string;

  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);
  
  const docConfig = useMemo(() => {
    if (!isHydrated) return undefined; // Ensure hydration before accessing documentLibrary
    return documentLibrary.find(d => d.id === docIdFromPath);
  }, [docIdFromPath, isHydrated]);

  const methods = useForm<z.infer<any>>({ // Schema will be set dynamically
    defaultValues: {}, 
    mode: 'onBlur',
  });
  const { reset, watch } = methods;

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated && docConfig && docConfig.schema) {
      methods.reset({}, { resolver: zodResolver(docConfig.schema) } as any);
      setIsLoadingConfig(false);
    } else if (isHydrated && !docConfig) {
      console.error(`[StartWizardPage] Document config not found for docId: ${docIdFromPath}`);
      notFound();
      setIsLoadingConfig(false);
    }
  }, [docConfig, isHydrated, methods, docIdFromPath]);

  // Load progress
  useEffect(() => {
    if (!docConfig?.id || !isHydrated || authIsLoading || !docConfig.schema || isLoadingConfig) return;
    
    async function loadDraft() {
      let draftData: Record<string, any> = {};
      try {
        if (isLoggedIn && user?.uid) {
          draftData = await loadFormProgress({ userId: user.uid, docType: docConfig.id, state: locale });
        } else {
          const lsKey = `draft-${docConfig.id}-${locale}`;
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
  }, [docConfig, locale, isHydrated, reset, authIsLoading, isLoggedIn, user, isLoadingConfig]);

  // Autosave progress
  const debouncedSave = useCallback(
    debounce(async (data: Record<string, any>) => {
      if (!docConfig?.id || authIsLoading || !isHydrated || Object.keys(data).length === 0 || isLoadingConfig) return;
      
      const relevantDataToSave = Object.keys(data).reduce((acc, key) => {
        if (data[key] !== undefined) { acc[key] = data[key]; }
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
    [isLoggedIn, user?.uid, docConfig, locale, authIsLoading, isHydrated, isLoadingConfig] 
  );

  useEffect(() => {
    if (!docConfig?.id || authIsLoading || !isHydrated || !watch || isLoadingConfig) return () => {};
    
    const subscription = watch((values) => {
       debouncedSave(values as Record<string, any>);
    });
    return () => {
      subscription.unsubscribe();
      debouncedSave.cancel();
    } ;
  }, [watch, docConfig, debouncedSave, authIsLoading, isHydrated, isLoadingConfig]);

  const handleWizardComplete = useCallback(
    (checkoutUrl: string) => {
      // This logic is now inside WizardForm's handleNextStep for final submission
      // Kept here for conceptual clarity, WizardForm will call its onComplete prop.
      console.log("[StartWizardPage] Wizard onComplete triggered with checkoutUrl:", checkoutUrl);
    },
    []
  );

  if (!isHydrated || isLoadingConfig || !docConfig || !docConfig.schema) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">
          {t('Loading document wizard...', { ns: 'translation' })}
        </p>
      </div>
    );
  }
  
  const documentDisplayName = locale === 'es' && docConfig.name_es ? docConfig.name_es : docConfig.name;

  return (
    <FormProvider {...methods}>
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
            <div className="mt-6">
              <TrustBadges />
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-24 h-[calc(100vh-8rem)] max-h-[calc(100vh-8rem)] flex flex-col lg:max-h-[calc(100vh-6rem)]">
              <h3 className="text-xl font-semibold mb-4 text-center text-card-foreground shrink-0 hidden lg:block">
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

    