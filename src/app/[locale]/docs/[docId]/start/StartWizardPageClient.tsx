// src/app/[locale]/docs/[docId]/start/StartWizardPageClient.tsx
'use client';

import { useParams, notFound, useRouter } from 'next/navigation';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Edit, Eye } from 'lucide-react';

import { documentLibrary, type LegalDocument } from '@/lib/document-library';
import Breadcrumb from '@/components/Breadcrumb';
import WizardForm from '@/components/WizardForm';
import PreviewPane from '@/components/PreviewPane';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { loadFormProgress, saveFormProgress } from '@/lib/firestore/saveFormProgress';
import { debounce } from 'lodash-es';
import TrustBadges from '@/components/TrustBadges';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';

export default function StartWizardPageClient() {
  const params = useParams();
  const { t, i18n, ready } = useTranslation("common"); 
  const router = useRouter();
  const { isLoggedIn, user, isLoading: authIsLoading } = useAuth();

  const locale = (Array.isArray(params!.locale) ? params!.locale[0] : params!.locale) as 'en' | 'es';
  const docIdFromPath = (Array.isArray(params!.docId) ? params!.docId[0] : params!.docId) as string;

  const [isMounted, setIsMounted] = useState(false); // <-- New state for mounted status
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false); // Retained for clarity, though isMounted covers initial client render
  const [activeMobileTab, setActiveMobileTab] = useState<'form' | 'preview'>('form');
  
  useEffect(() => {
    setIsMounted(true); // <-- Set mounted to true on client
    setIsHydrated(true); // Keep for consistency if other logic depends on it
  }, []);

  const docConfig = useMemo(() => {
    if (!isMounted || !docIdFromPath) return undefined; // Depend on isMounted
    return documentLibrary.find(d => d.id === docIdFromPath);
  }, [docIdFromPath, isMounted]);

  const methods = useForm<z.infer<any>>({
    defaultValues: {}, 
    mode: 'onBlur', 
  });
  const { reset, watch } = methods;

  useEffect(() => {
    if (!isMounted) {
      return; 
    }
    if (docConfig) {
      if (docConfig!.schema && typeof docConfig!.schema.safeParse === 'function') {
        methods.reset({}, { resolver: zodResolver(docConfig!.schema) } as any);
      } else {
        console.warn(`[StartWizardPageClient] No valid Zod schema for doc ID: ${docIdFromPath}. Validation might not work.`);
        methods.reset({}); 
      }
      setIsLoadingConfig(false);
    } else if (isMounted && docIdFromPath) {
      console.log(`[StartWizardPageClient] docConfig not found for ${docIdFromPath} after mount. Setting isLoadingConfig to false.`);
      setIsLoadingConfig(false);
    } else if (!docIdFromPath && isMounted) {
      console.error(`[StartWizardPageClient] docIdFromPath is missing after mount.`);
      setIsLoadingConfig(false);
    }
  }, [docConfig, isMounted, methods, docIdFromPath, reset]);

  useEffect(() => {
    if (!docConfig?.id || !isMounted || authIsLoading || isLoadingConfig || !locale || !ready) return;
    
    async function loadDraft() {
      let draftData: Record<string, any> = {};
      try {
        if (isLoggedIn && user?.uid) {
          draftData = await loadFormProgress({ userId: user.uid, docType: docConfig!.id, state: locale });
        } else {
          const lsKey = `draft-${docConfig!.id}-${locale}`;
          const lsDraft = localStorage.getItem(lsKey);
          if (lsDraft) draftData = JSON.parse(lsDraft);
        }
      } catch (e) {
        console.warn('[StartWizardPageClient] Draft loading failed:', e);
      }
      if (Object.keys(draftData).length > 0) {
        reset(draftData, { keepValues: true });
        console.log('[StartWizardPageClient] Draft loaded:', draftData);
      } else {
        console.log('[StartWizardPageClient] No draft found, using initial/empty values.');
      }
    }
    loadDraft();
  }, [docConfig, locale, isMounted, reset, authIsLoading, isLoggedIn, user, isLoadingConfig, ready]);

  const debouncedSave = useCallback(
    debounce(async (data: Record<string, any>) => {
      if (!docConfig?.id || authIsLoading || !isMounted || Object.keys(data).length === 0 || isLoadingConfig || !locale || !ready) return;
      
      const relevantDataToSave = Object.keys(data).reduce((acc, key) => {
        if (data[key] !== undefined) { acc[key] = data[key]; }
        return acc;
      }, {} as Record<string,any>);

      if (Object.keys(relevantDataToSave).length === 0) return;

      if (isLoggedIn && user?.uid) {
        await saveFormProgress({ userId: user.uid, docType: docConfig!.id, state: locale, formData: relevantDataToSave });
      } else {
         localStorage.setItem(`draft-${docConfig!.id}-${locale}`, JSON.stringify(relevantDataToSave));
      }
      console.log('[WizardForm] Autosaved draft for:', docConfig!.id, locale, relevantDataToSave);
    }, 1000),
    [isLoggedIn, user?.uid, docConfig, locale, authIsLoading, isMounted, isLoadingConfig, ready] 
  );

  useEffect(() => {
    if (!docConfig?.id || authIsLoading || !isMounted || !watch || isLoadingConfig || !locale || !ready) return () => {};
    
    const subscription = watch((values) => {
       debouncedSave(values as Record<string, any>);
    });
    return () => {
      subscription.unsubscribe();
      debouncedSave.cancel();
    } ;
  }, [watch, docConfig, debouncedSave, authIsLoading, isMounted, isLoadingConfig, locale, ready]);

  const handleWizardComplete = useCallback(
    (checkoutUrl: string) => {
      console.log("[StartWizardPageClient] Wizard onComplete triggered with checkoutUrl:", checkoutUrl);
      router.push(checkoutUrl);
    },
    [router]
  );

  // Primary loading state: waits for client mount, i18next readiness, and initial config/param check.
  if (!isMounted) {
    // Render a minimal, static placeholder or null on initial client render to match SSR
    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="ml-2 text-muted-foreground">Loading...</p> {/* Non-translated, static text */}
        </div>
    );
  }

  if (!ready || isLoadingConfig) { 
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">
          {ready ? t('Loading document wizard...', { ns: 'translation' }) : 'Preparing interface...'}
        </p>
      </div>
    );
  }
  
  if (!docIdFromPath || !docConfig) {
    console.error(`[StartWizardPageClient] Critical failure: docIdFromPath (${docIdFromPath}) or docConfig is missing. Calling notFound().`);
    notFound();
    return null; 
  }
  
  const documentDisplayName = locale === 'es' && docConfig!.name_es ? docConfig!.name_es : docConfig!.name;

  return (
    <FormProvider {...methods}>
      <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
         <Breadcrumb
          items={[
            { label: t('breadcrumb.home', { ns: 'translation' }), href: `/${locale}` },
            { label: documentDisplayName, href: `/${locale}/docs/${docConfig!.id}` },
            { label: t('breadcrumb.start', { ns: 'translation' }) },
          ]}
        />
        
        <div className="lg:hidden mb-4 sticky top-14 z-30 bg-background/90 backdrop-blur-sm py-2 -mx-4 px-4 border-b">
          <Tabs value={activeMobileTab} onValueChange={(value) => setActiveMobileTab(value as 'form' | 'preview')} className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-10">
              <TabsTrigger value="form" className="text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Edit className="w-4 h-4 mr-1.5" /> {t('Form', {ns: 'translation'})}
              </TabsTrigger>
              <TabsTrigger value="preview" className="text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Eye className="w-4 h-4 mr-1.5" /> {t('Preview', {ns: 'translation'})}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-2 lg:mt-6">
          <div className={cn("lg:col-span-1", activeMobileTab !== 'form' && 'hidden lg:block')}>
            <WizardForm
              locale={locale}
              doc={docConfig}
              onComplete={handleWizardComplete}
            />
            <div className="mt-6 lg:mt-8">
              <TrustBadges />
            </div>
          </div>
          <div className={cn("lg:col-span-1", activeMobileTab !== 'preview' && 'hidden lg:block')}>
             <div className="sticky top-32 lg:top-24 h-[calc(100vh-14rem)] lg:h-[calc(100vh-8rem)] max-h-[calc(100vh-14rem)] lg:max-h-[calc(100vh-6rem)] flex flex-col">
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
