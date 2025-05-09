// src/app/[locale]/docs/[docId]/start/page.tsx
'use client';

import { useParams, notFound, useRouter } from 'next/navigation';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { documentLibrary, type LegalDocument } from '@/lib/document-library';
import Breadcrumb from '@/components/Breadcrumb';
import WizardForm from '@/components/WizardForm';
import PreviewPane from '@/components/PreviewPane';
import { useTranslation } from 'react-i18next';
import { saveFormProgress, loadFormProgress } from '@/lib/firestore/saveFormProgress';
import { debounce } from 'lodash-es';
import { useAuth } from '@/hooks/useAuth';


export default function StartWizardPage() {
  const params = useParams();
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { user, isLoggedIn, isLoading: authIsLoading } = useAuth();

  const locale = params.locale as 'en' | 'es';
  const docIdFromPath = params.docId as string;

  const [docConfig, setDocConfig] = useState<LegalDocument | undefined>(undefined);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (docIdFromPath && isHydrated) {
      const foundDoc = documentLibrary.find(d => d.id === docIdFromPath);
      if (foundDoc && foundDoc.schema) {
        setDocConfig(foundDoc);
      } else {
        console.error(`[StartWizardPage] Document config not found or schema invalid for docId: ${docIdFromPath}. Doc found: ${!!foundDoc}, Schema valid: ${!!foundDoc?.schema}`);
        notFound();
      }
      setIsLoadingConfig(false);
    } else if (!docIdFromPath && isHydrated) {
      setIsLoadingConfig(false);
      notFound();
    }
  }, [docIdFromPath, isHydrated]);

  const methods = useForm({
    resolver: docConfig ? zodResolver(docConfig.schema) : undefined,
    defaultValues: {},
    mode: 'onBlur',
  });

  const { reset, watch } = methods;

  useEffect(() => {
    async function loadDraftData() {
      if (typeof window !== 'undefined' && docConfig && docConfig.id && locale && isHydrated && !authIsLoading) {
        let draftData: Partial<z.infer<typeof docConfig.schema>> = {};
        if (isLoggedIn && user?.uid) {
          try {
            const firestoreDraft = await loadFormProgress({ userId: user.uid, docType: docConfig.id, state: locale });
            if (firestoreDraft && Object.keys(firestoreDraft).length > 0) {
              draftData = firestoreDraft;
            } else {
              const lsDraft = localStorage.getItem(`draft-${docConfig.id}-${locale}`);
              if (lsDraft) draftData = JSON.parse(lsDraft);
            }
          } catch (e) {
            console.error("Failed to load draft from Firestore, falling back to localStorage:", e);
            const lsDraft = localStorage.getItem(`draft-${docConfig.id}-${locale}`);
            if (lsDraft) draftData = JSON.parse(lsDraft);
          }
        } else {
          const lsDraft = localStorage.getItem(`draft-${docConfig.id}-${locale}`);
          if (lsDraft) {
            try {
              draftData = JSON.parse(lsDraft);
            } catch (e) {
              console.error("Failed to parse draft from localStorage", e);
              localStorage.removeItem(`draft-${docConfig.id}-${locale}`);
            }
          }
        }
        
        if (docConfig.id === 'bill-of-sale-vehicle' && !draftData.sale_date && docConfig.schema && docConfig.schema.shape && (docConfig.schema.shape as any).sale_date) {
           const saleDateShape = (docConfig.schema.shape as any).sale_date;
           if (saleDateShape?._def?.typeName === 'ZodDate' || saleDateShape?._def?.innerType?._def?.typeName === 'ZodDate' ) {
              draftData = { ...draftData, sale_date: new Date() } as any;
           }
        }
        reset(draftData);
      }
    }
    if(docConfig && isHydrated) { 
        loadDraftData();
    }
  }, [docConfig, locale, reset, isLoggedIn, user, authIsLoading, isHydrated]);

  const debouncedSaveToFirestore = useCallback(
    debounce(async (valuesToSave: Record<string, any>) => {
      const currentFormState = methods.formState;
      if (isLoggedIn && user?.uid && docConfig && docConfig.id && locale) {
        if (Object.keys(currentFormState.dirtyFields).length > 0 || Object.keys(valuesToSave).some(k => valuesToSave[k] !== undefined)) {
            try {
                await saveFormProgress({
                    userId: user.uid,
                    docType: docConfig.id,
                    state: locale, 
                    formData: valuesToSave,
                });
            } catch (error) {
                console.error('[StartWizardPage] Failed to save draft to Firestore:', error);
            }
        }
      }
    }, 1000), 
    [isLoggedIn, user?.uid, docConfig?.id, locale, methods.formState, saveFormProgress] 
  );

  useEffect(() => {
    if (typeof window !== 'undefined' && docConfig && docConfig.id && locale && isHydrated) {
      const draftKey = `draft-${docConfig.id}-${locale}`;
      const subscription = watch((values) => { 
        if (Object.keys(methods.formState.dirtyFields).length > 0 || Object.keys(values).some(k => values[k] !== undefined)) {
             localStorage.setItem(draftKey, JSON.stringify(values));
        }
        debouncedSaveToFirestore(values);
      });
      return () => {
        subscription.unsubscribe();
        debouncedSaveToFirestore.cancel();
      }
    }
  }, [watch, docConfig, locale, isHydrated, debouncedSaveToFirestore, methods.formState.dirtyFields]);

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

  if (!isHydrated || isLoadingConfig || !docConfig) {
    return (
      <div className="flex justify-center items-center min-h-screen">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
          <div className="lg:col-span-1">
            <WizardForm
              locale={locale}
              doc={docConfig}
              onComplete={handleWizardComplete}
            />
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-24 h-screen max-h-[calc(100vh-8rem)] flex flex-col">
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
