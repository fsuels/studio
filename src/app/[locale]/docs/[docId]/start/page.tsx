// src/app/[locale]/docs/[docId]/start/page.tsx
'use client';

import { useParams, notFound, useRouter } from 'next/navigation';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useForm, FormProvider } from 'react-hook-form'; // Import useForm and FormProvider
import { zodResolver } from '@hookform/resolvers/zod'; // Import zodResolver
import { z } from 'zod'; // Import z
import { Loader2 } from 'lucide-react';

import { documentLibrary, type LegalDocument } from '@/lib/document-library';
import Breadcrumb from '@/components/Breadcrumb';
import WizardForm from '@/components/WizardForm';
import PreviewPane from '@/components/PreviewPane';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { saveFormProgress, loadFormProgress } from '@/lib/firestore/saveFormProgress'; // Import save/load functions
import { useAuth } from '@/hooks/useAuth'; // Import useAuth
import { debounce } from 'lodash-es'; // Import debounce


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
  const [docConfig, setDocConfig] = useState<LegalDocument | undefined>(undefined);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (docIdFromPath && isHydrated) {
      const foundDoc = documentLibrary.find(d => d.id === docIdFromPath);
      if (foundDoc && foundDoc.schema) {
        setDocConfig(foundDoc);
      } else {
        console.error(`[StartWizardPage] Document config not found or schema invalid for docId: ${docIdFromPath}`);
        notFound();
      }
      setIsLoadingConfig(false);
    }
  }, [docIdFromPath, isHydrated]);

  // Initialize useForm here
  const methods = useForm<z.infer<typeof docConfigSchema>>({
    resolver: docConfig?.schema ? zodResolver(docConfig.schema) : undefined,
    defaultValues: {}, // Will be loaded from localStorage/Firestore
    mode: 'onBlur',
  });
  
  const { reset, watch } = methods;
  const docConfigSchema = docConfig?.schema || z.object({}); // Fallback to empty schema if docConfig is not ready

  // Load draft data
  useEffect(() => {
    async function loadDraft() {
      if (!docConfig || !isHydrated || authIsLoading) return;
      const currentLocale = params.locale as 'en' | 'es' || locale;
      let draftData: Partial<z.infer<typeof docConfig.schema>> = {};
      try {
        if (isLoggedIn && user?.uid) {
          draftData = await loadFormProgress({ userId: user.uid, docType: docConfig.id, state: currentLocale });
        } else {
          const lsDraft = localStorage.getItem(`draft-${docConfig.id}-${currentLocale}`);
          if (lsDraft) draftData = JSON.parse(lsDraft);
        }
      } catch (e) {
        console.warn('[StartWizardPage] Draft loading failed:', e);
      }
      reset(draftData); // Reset form with loaded draft data
    }
    loadDraft();
  }, [docConfig, locale, isHydrated, reset, authIsLoading, isLoggedIn, user, params.locale]);


  // Autosave draft data
  const debouncedSave = useCallback(
    debounce(async (data: Record<string, any>) => {
      if (!docConfig || authIsLoading) return;
      const currentLocale = params.locale as 'en' | 'es' || locale;
      if (isLoggedIn && user?.uid) {
        await saveFormProgress({ userId: user.uid, docType: docConfig.id, state: currentLocale, formData: data });
      }
    }, 1000),
    [isLoggedIn, user, docConfig, locale, params.locale, authIsLoading]
  );

  useEffect(() => {
    if (!docConfig || authIsLoading) return () => {};
    const currentLocale = params.locale as 'en' | 'es' || locale;
    const storageKey = `draft-${docConfig.id}-${currentLocale}`;
    
    const subscription = watch((values) => {
      localStorage.setItem(storageKey, JSON.stringify(values));
      debouncedSave(values);
    });
    return () => {
      subscription.unsubscribe();
      debouncedSave.cancel();
    } ;
  }, [watch, docConfig, locale, debouncedSave, params.locale, authIsLoading]);


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
    <FormProvider {...methods}> {/* Wrap WizardForm and PreviewPane with FormProvider */}
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