// src/app/[locale]/docs/[docId]/start/StartWizardPageClient.tsx
'use client';

import { useParams, notFound, useRouter } from 'next/navigation';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Edit, Eye } from 'lucide-react';

import { documentLibrary } from '@/lib/document-library';
import { getDocumentTitle } from '@/lib/format-utils';
import Breadcrumb from '@/components/shared/Breadcrumb';
import dynamic from 'next/dynamic';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import {
  loadFormProgress,
  saveFormProgress,
} from '@/lib/firestore/saveFormProgress';
import { debounce } from '@/lib/debounce';
import TrustBadges from '@/components/shared/TrustBadges';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import ReEngagementTools from '@/components/reengagement/ReEngagementTools.client';

const Loading = () => (
  <div className="flex justify-center items-center h-32">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const WizardForm = dynamic(() => import('@/components/forms/WizardForm'), {
  loading: () => <Loading />,
});

const PreviewPane = dynamic(() => import('@/components/document/PreviewPane'), {
  loading: () => <Loading />,
});

const SmartDocumentWizard = dynamic(() => import('@/components/document/SmartDocumentWizard'), {
  loading: () => <Loading />,
});

interface StartWizardPageClientProps {
  locale: 'en' | 'es';
  docId: string;
}

export default function StartWizardPageClient({
  locale,
  docId,
}: StartWizardPageClientProps) {
  const { t, ready } = useTranslation('common');
  const router = useRouter();
  const { isLoggedIn, user, isLoading: authIsLoading } = useAuth();

  const docIdFromPath = docId;

  const [isMounted, setIsMounted] = useState(false);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const [activeMobileTab, setActiveMobileTab] = useState<'form' | 'preview'>(
    'form',
  );
  const [currentFieldId, setCurrentFieldId] = useState<string | undefined>();
  const [wizardFormRef, setWizardFormRef] = useState<{
    navigateToField: (fieldId: string) => void;
  } | null>(null);
  const [selectedState, setSelectedState] = useState<string>('');
  const [useDirectFormFilling, setUseDirectFormFilling] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const docConfig = useMemo(() => {
    return documentLibrary.find((d) => d.id === docIdFromPath);
  }, [docIdFromPath]);

  const methods = useForm<z.infer<z.ZodTypeAny>>({
    defaultValues: {},
    mode: 'onBlur',
    resolver: docConfig?.schema ? zodResolver(docConfig.schema) : undefined,
  });
  const { reset, watch } = methods;

  // States with mandatory official forms
  const STATES_WITH_OFFICIAL_FORMS = ['AL', 'CO', 'FL', 'GA', 'ID', 'KS', 'MD', 'MT', 'ND', 'WV'];

  // Watch for state selection in form data - IMMEDIATE SWITCH
  const formData = watch();
  useEffect(() => {
    if (formData?.state && formData.state !== selectedState) {
      console.log('🎯 State selected:', formData.state);
      setSelectedState(formData.state);
      
      // IMMEDIATE SWITCH: If state has official form, switch to direct form filling RIGHT NOW
      if (docConfig?.id === 'vehicle-bill-of-sale' && STATES_WITH_OFFICIAL_FORMS.includes(formData.state)) {
        console.log('🚀 Switching to direct form filling for state:', formData.state);
        setUseDirectFormFilling(true);
      } else {
        console.log('📝 Continuing with question wizard for state:', formData.state);
        setUseDirectFormFilling(false);
      }
    }
  }, [formData?.state, selectedState, docConfig?.id]);

  // ALSO watch for immediate state detection from URL or initial load
  useEffect(() => {
    if (docConfig?.id === 'vehicle-bill-of-sale' && formData?.state && STATES_WITH_OFFICIAL_FORMS.includes(formData.state)) {
      setUseDirectFormFilling(true);
      setSelectedState(formData.state);
    }
  }, [formData?.state, docConfig?.id]);

  useEffect(() => {
    if (!isMounted) return;
    setIsLoadingConfig(false);
    methods.reset({});
  }, [docConfig, isMounted, methods]);

  useEffect(() => {
    if (
      !docConfig?.id ||
      !isMounted ||
      authIsLoading ||
      isLoadingConfig ||
      !locale ||
      !ready
    )
      return;

    async function loadDraft() {
      let draftData: Record<string, unknown> = {};
      try {
        if (isLoggedIn && user?.uid) {
          draftData = await loadFormProgress({
            userId: user.uid,
            docType: docConfig.id,
            state: locale,
          });
        } else {
          const lsKey = `draft-${docConfig.id}-${locale}`;
          const lsDraft = localStorage.getItem(lsKey);
          if (lsDraft) draftData = JSON.parse(lsDraft);
        }
      } catch (e: any) {
        // Suppress benign transport errors
        const msg = e?.message || '';
        if (!msg.includes('transport errored')) {
          console.error('[StartWizardPageClient] Draft loading failed:', e);
        }
      }
      if (Object.keys(draftData).length > 0) {
        reset(draftData, { keepValues: true });
        setDraftLoaded(true);
      } else {
        // even an empty draft counts as "loaded"
        setDraftLoaded(true);
      }
    }
    if (ready) {
      void loadDraft();
    }
  }, [authIsLoading, isLoadingConfig, isLoggedIn, user, locale, ready, reset]);

  const debouncedSave = useMemo(
    () =>
      debounce((data: Record<string, unknown>) => {
        void (async () => {
          if (
            !docConfig?.id ||
            authIsLoading ||
            !isMounted ||
            !locale ||
            !ready
          )
            return;
          const relevantData: Record<string, unknown> = {};
          Object.entries(data).forEach(([k, v]) => {
            if (v !== undefined) relevantData[k] = v;
          });
          if (Object.keys(relevantData).length === 0) return;

          if (isLoggedIn && user?.uid) {
            await saveFormProgress({
              userId: user.uid,
              docType: docConfig.id,
              state: locale,
              formData: relevantData,
            });
          } else {
            localStorage.setItem(
              `draft-${docConfig.id}-${locale}`,
              JSON.stringify(relevantData),
            );
          }
        })();
      }, 1000),
    [docConfig, isMounted, authIsLoading, isLoggedIn, user, locale, ready],
  );

  useEffect(() => {
    if (
      !docConfig?.id ||
      authIsLoading ||
      !isMounted ||
      isLoadingConfig ||
      !locale ||
      !ready
    )
      return;
    const sub = watch((values) => {
      debouncedSave(values as Record<string, unknown>);
    });
    return () => {
      sub.unsubscribe();
      debouncedSave.cancel();
    };
  }, [
    watch,
    debouncedSave,
    authIsLoading,
    isMounted,
    isLoadingConfig,
    locale,
    ready,
  ]);

  const handleWizardComplete = useCallback(
    (redirectUrl: string) => {
      router.push(redirectUrl);
    },
    [router],
  );

  const handleFieldClick = useCallback(
    (fieldId: string) => {
      if (wizardFormRef?.navigateToField) {
        wizardFormRef.navigateToField(fieldId);
        // Switch to form tab on mobile when navigating to a field
        if (window.innerWidth < 1024) {
          // lg breakpoint
          setActiveMobileTab('form');
        }
      }
    },
    [wizardFormRef],
  );

  const handlePaymentRequired = useCallback((formData: Record<string, any>, price: number, state: string) => {
    // Integrate with your existing payment system
    const paymentUrl = `/${locale}/checkout?amount=${price}&state=${state}&document=${docConfig?.id}&formData=${encodeURIComponent(JSON.stringify(formData))}`;
    router.push(paymentUrl);
  }, [locale, docConfig?.id, router]);

  const handleDocumentComplete = useCallback((document: ArrayBuffer) => {
    // Handle successful document generation
    // This could trigger download or redirect to completion page
    const completionUrl = `/${locale}/docs/${docConfig?.id}/complete`;
    router.push(completionUrl);
  }, [locale, docConfig?.id, router]);

  if (!isMounted || !draftLoaded) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">{t('Loading draft...')}</p>
      </div>
    );
  }

  if (!ready || isLoadingConfig) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">
          {ready ? t('Loading document wizard...') : 'Preparing interface...'}
        </p>
      </div>
    );
  }

  if (!docConfig) {
    notFound();
    return null;
  }

  const documentDisplayName =
    locale === 'es' && docConfig.translations?.es?.name
      ? docConfig.translations.es.name
      : getDocumentTitle(docConfig, 'en');

  // If we should use direct form filling for this state + document combination
  if (useDirectFormFilling && selectedState) {
    return (
      <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: t('breadcrumb.home'), href: `/${locale}` },
            {
              label: documentDisplayName,
              href: `/${locale}/docs/${docConfig.id}`,
            },
            { label: t('breadcrumb.start') },
          ]}
        />
        
        <div className="mt-6">
          <SmartDocumentWizard
            documentType={docConfig.id as 'vehicle-bill-of-sale'}
            selectedState={selectedState}
            onPaymentRequired={handlePaymentRequired}
            onComplete={handleDocumentComplete}
            initialFormData={formData}
            isLoggedIn={isLoggedIn}
            locale={locale}
          />
        </div>
      </main>
    );
  }

  // Default: Use existing question wizard system
  return (
    <FormProvider {...methods}>
      <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: t('breadcrumb.home'), href: `/${locale}` },
            {
              label: documentDisplayName,
              href: `/${locale}/docs/${docConfig.id}`,
            },
            { label: t('breadcrumb.start') },
          ]}
        />
        <div className="lg:hidden mb-4 sticky top-14 z-30 bg-background/90 backdrop-blur-sm py-2 -mx-4 px-4 border-b">
          <Tabs
            value={activeMobileTab}
            onValueChange={(value) => setActiveMobileTab(value as any)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 h-10">
              <TabsTrigger value="form">
                <Edit className="w-4 h-4 mr-1.5" /> {t('Form')}
              </TabsTrigger>
              <TabsTrigger value="preview">
                <Eye className="w-4 h-4 mr-1.5" /> {t('Preview')}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-2 lg:mt-6">
          <div
            className={cn(
              'lg:col-span-1',
              activeMobileTab !== 'form' && 'hidden lg:block',
            )}
          >
            <WizardForm
              locale={locale}
              doc={docConfig}
              onComplete={handleWizardComplete}
              onFieldFocus={setCurrentFieldId}
              ref={setWizardFormRef}
            />
            <div className="mt-6 lg:mt-8">
              <TrustBadges />
            </div>
          </div>
          <div
            className={cn(
              'lg:col-span-1',
              activeMobileTab !== 'preview' && 'hidden lg:block',
            )}
          >
            <div className="sticky top-32 lg:top-24 h-[calc(100vh-14rem)] lg:h-[calc(100vh-8rem)] overflow-hidden rounded-lg border border-border bg-card">
              <PreviewPane
                docId={docConfig.id}
                locale={locale}
                currentFieldId={currentFieldId}
                onFieldClick={handleFieldClick}
              />
            </div>
          </div>
        </div>
      </main>
      <ReEngagementTools
        docId={docConfig.id}
        totalQuestions={docConfig.questions?.length || 0}
        locale={locale}
      />
    </FormProvider>
  );
}
