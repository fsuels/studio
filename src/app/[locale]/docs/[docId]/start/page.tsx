// src/app/[locale]/docs/[docId]/start/page.tsx
'use client';

import { useParams, notFound, useRouter } from 'next/navigation';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Edit, FileText as FileTextIcon } from 'lucide-react'; // Renamed FileText to FileTextIcon

import { documentLibrary, type LegalDocument } from '@/lib/document-library';
import Breadcrumb from '@/components/Breadcrumb';
import WizardForm from '@/components/WizardForm';
import PreviewPane from '@/components/PreviewPane';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { saveFormProgress, loadFormProgress } from '@/lib/firestore/saveFormProgress';
import { useAuth } from '@/hooks/useAuth';
import { debounce } from 'lodash-es';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
  const [mobileView, setMobileView] = useState<'form' | 'preview'>('form');


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

  const methods = useForm<z.infer<any>>({ // Use any for schema initially
    resolver: docConfig?.schema ? zodResolver(docConfig.schema) : undefined,
    defaultValues: {}, 
    mode: 'onBlur',
  });
  
  const { reset, watch } = methods;

  useEffect(() => {
    if (docConfig?.schema) {
      methods.reset({}, { resolver: zodResolver(docConfig.schema) } as any); // Re-initialize resolver when docConfig is loaded
    }
  }, [docConfig, methods]);


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
    <FormProvider {...methods}> 
      <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
         <Breadcrumb
          items={[
            { label: t('breadcrumb.home', { ns: 'translation' }), href: `/${locale}` },
            { label: documentDisplayName, href: `/${locale}/docs/${docConfig.id}` },
            { label: t('breadcrumb.start', { ns: 'translation' }) },
          ]}
        />

        {/* Mobile Tab Switcher */}
        <div className="lg:hidden sticky top-14 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2 mb-4 border-b">
          <div className="flex justify-around">
            <Button
              variant={mobileView === 'form' ? 'secondary' : 'ghost'}
              onClick={() => setMobileView('form')}
              className="w-1/2 flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              {t('Form')}
            </Button>
            <Button
              variant={mobileView === 'preview' ? 'secondary' : 'ghost'}
              onClick={() => setMobileView('preview')}
              className="w-1/2 flex items-center gap-2"
            >
              <FileTextIcon className="h-4 w-4" /> 
              {t('Preview')}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
          {/* Left Column: Form */}
          <div className={cn("lg:col-span-1", mobileView === 'preview' && 'hidden lg:block')}>
            <WizardForm
              locale={locale}
              doc={docConfig}
              onComplete={handleWizardComplete}
            />
          </div>

          {/* Right Column: Preview Pane */}
          <div className={cn("lg:col-span-1", mobileView === 'form' && 'hidden lg:block')}>
            <div className="sticky top-24 h-[calc(100vh-8rem)] max-h-[calc(100vh-8rem)] flex flex-col lg:max-h-[calc(100vh-6rem)]"> {/* Adjusted max-h for desktop */}
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
