// src/app/[locale]/(legal)/docs/[docId]/start/StartWizardPageClient.tsx
'use client';

import { notFound, useRouter, useSearchParams } from 'next/navigation';
import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Edit, Eye } from 'lucide-react';

import { documentLibrary, type LegalDocument } from '@/lib/document-library';
import { getDocumentTitle } from '@/lib/format-utils';
import Breadcrumb from '@/components/shared/Breadcrumb';
import dynamic from 'next/dynamic';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { loadFormProgress, saveFormProgress } from '@/lib/firestore/saveFormProgress';
import { debounce } from '@/lib/debounce';
import TrustBadges from '@/components/shared/TrustBadges';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import ReEngagementTools from '@/components/reengagement/ReEngagementTools.client';
import { loadDocumentConfig, normalizeJurisdiction } from '@/lib/config-loader';
import type { Question } from '@/types/documents';

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

const StatePDFPreview = dynamic(
  () => import('@/components/document/StatePDFPreview'),
  { loading: () => <Loading /> }
);

const SmartDocumentWizard = dynamic(
  () => import('@/components/document/SmartDocumentWizard'),
  { loading: () => <Loading /> }
);

interface StartWizardPageClientProps {
  locale: 'en' | 'es';
  docId: string;
}

const STATES_WITH_OFFICIAL_FORMS = ['AL', 'CO', 'FL', 'GA', 'ID', 'KS', 'MD', 'MT', 'ND', 'WV'];

export default function StartWizardPageClient({
  locale,
  docId,
}: StartWizardPageClientProps) {
  const { t, ready } = useTranslation('common');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoggedIn, user, isLoading: authIsLoading } = useAuth();

  const resumeId = searchParams.get('resumeId');
  const stateFromUrl = searchParams.get('state')?.toUpperCase();

  const [isMounted, setIsMounted] = useState(false);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const [activeMobileTab, setActiveMobileTab] =
    useState<'form' | 'preview'>('form');
  const [currentFieldId, setCurrentFieldId] = useState<string | undefined>();
  const [wizardFormRef, setWizardFormRef] = useState<{
    navigateToField: (fieldId: string) => void;
  } | null>(null);
  const [selectedState, setSelectedState] = useState<string>(stateFromUrl || '');
  const [useDirectFormFilling, setUseDirectFormFilling] = useState(false);
  const [dynamicQuestions, setDynamicQuestions] = useState<Question[] | null>(null);
  const [questionsLoaded, setQuestionsLoaded] = useState(false);

  useEffect(() => setIsMounted(true), []);

  const docConfig = useMemo(
    () => documentLibrary.find((d) => d.id === docId),
    [docId]
  );

  // Guard ASAP so TS can narrow types safely
  if (!docConfig) {
    notFound();
    return null;
  }

  const docType = docConfig.id;
  const docStrict = docConfig as LegalDocument;

  const methods = useForm<z.infer<z.ZodTypeAny>>({
    defaultValues: {},
    mode: 'onBlur',
    resolver: docStrict.schema ? zodResolver(docStrict.schema) : undefined,
  });

  const { reset, watch } = methods;
  const formData = watch();

  // ---- Helpers ----------------------------------------------------

  const loadDynamicQuestions = useCallback(
    async (state?: string) => {
      const wantedState = state?.toUpperCase();
      if (wantedState && STATES_WITH_OFFICIAL_FORMS.includes(wantedState)) {
        try {
          const jurisdiction = normalizeJurisdiction(wantedState);
          const config = await loadDocumentConfig(docType, jurisdiction);

          if (config.questions?.length) {
            setDynamicQuestions(config.questions);
            setQuestionsLoaded(true);
            return;
          }

          if (config.overlayConfig) {
          // build from overlay.json
            const { generateQuestions } = await import('@/lib/question-generator');
            const generated = generateQuestions(config.overlayConfig);
            setDynamicQuestions(generated);
            setQuestionsLoaded(true);
            return;
          }
        } catch (error) {
          console.warn(
            `Failed to load dynamic questions for ${docType}/${wantedState}`,
            error
          );
        }
      }

      // Fallback to static questions
      setDynamicQuestions(null);
      setQuestionsLoaded(true);
    },
    [docType]
  );

  // When the state field inside the form changes, reload the questions
  useEffect(() => {
    const st: string | undefined = formData?.state?.toUpperCase?.();
    if (st && st !== selectedState) {
      setSelectedState(st);
      // reset so we show the spinner correctly & don't reuse last state's questions
      setQuestionsLoaded(false);
      setDynamicQuestions(null);
      setUseDirectFormFilling(false);
      void loadDynamicQuestions(st);
    }
  }, [formData?.state, selectedState, docType, loadDynamicQuestions]);

  // Initial questions loading (once)
  useEffect(() => {
    setUseDirectFormFilling(false);
    if (!questionsLoaded) {
      const s = selectedState || formData?.state || stateFromUrl;
      void loadDynamicQuestions(s);
    }
  }, [
    formData?.state,
    questionsLoaded,
    loadDynamicQuestions,
    selectedState,
    stateFromUrl,
  ]);

  // Reset form on mount / doc change
  useEffect(() => {
    if (!isMounted) return;
    setIsLoadingConfig(false);
    methods.reset({});
  }, [docStrict, isMounted, methods]);

  // Draft loading
  useEffect(() => {
    if (
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
        if (resumeId && isLoggedIn && user?.uid) {
          const { getDb } = await import('@/lib/firebase');
          const { doc, getDoc } = await import('firebase/firestore');

          const db = await getDb();
          const docRef = doc(db, 'users', user.uid, 'documents', resumeId);
          const snap = await getDoc(docRef);

          if (snap.exists()) {
            const data = snap.data();
            draftData = data.formData || data.data || {};
            if (stateFromUrl) {
              setSelectedState(stateFromUrl);
              draftData.state = stateFromUrl;
            }
          }
        } else if (isLoggedIn && user?.uid) {
          draftData = await loadFormProgress({
            userId: user.uid,
            docType: docType,
            state: locale,
          });
        } else {
          const lsKey = `draft-${docType}-${locale}`;
          const lsDraft = localStorage.getItem(lsKey);
          if (lsDraft) draftData = JSON.parse(lsDraft);
        }
      } catch (e: any) {
        const msg = e?.message || '';
        if (!msg.includes('transport errored')) {
          console.error('[StartWizardPageClient] Draft loading failed:', e);
        }
      }

      if (Object.keys(draftData).length > 0) {
        reset(draftData, { keepValues: true });
        setDraftLoaded(true);
      } else {
        setDraftLoaded(true);
      }
    }

    if (ready) {
      void loadDraft();
    }
  }, [
    authIsLoading,
    isLoadingConfig,
    isLoggedIn,
    user,
    locale,
    ready,
    reset,
    resumeId,
    stateFromUrl,
    isMounted,
    docType,
  ]);

  // Debounced autosave
  const debouncedSave = useMemo(
    () =>
      debounce((data: Record<string, unknown>) => {
        void (async () => {
          if (authIsLoading || !isMounted || !locale || !ready) return;

          const relevantData: Record<string, unknown> = {};
          Object.entries(data).forEach(([k, v]) => {
            if (v !== undefined) relevantData[k] = v;
          });
          if (Object.keys(relevantData).length === 0) return;

          if (isLoggedIn && user?.uid) {
            await saveFormProgress({
              userId: user.uid,
              docType: docType,
              state: locale,
              formData: relevantData,
            });
          } else {
            localStorage.setItem(
              `draft-${docType}-${locale}`,
              JSON.stringify(relevantData)
            );
          }
        })();
      }, 1000),
    [isMounted, authIsLoading, isLoggedIn, user, locale, ready, docType]
  );

  useEffect(() => {
    if (authIsLoading || !isMounted || isLoadingConfig || !locale || !ready)
      return;
    const sub = watch((values) => {
      debouncedSave(values as Record<string, unknown>);
    });
    return () => {
      sub.unsubscribe();
      debouncedSave.cancel();
    };
  }, [watch, debouncedSave, authIsLoading, isMounted, isLoadingConfig, locale, ready]);

  const handleWizardComplete = useCallback(
    (redirectUrl: string) => {
      router.push(redirectUrl);
    },
    [router]
  );

  const handleFieldClick = useCallback(
    (fieldId: string) => {
      if (wizardFormRef?.navigateToField) {
        wizardFormRef.navigateToField(fieldId);
        if (window.innerWidth < 1024) {
          setActiveMobileTab('form');
        }
      }
    },
    [wizardFormRef]
  );

  const handlePaymentRequired = useCallback(
    (formData: Record<string, any>, price: number, state: string) => {
      const paymentUrl = `/${locale}/checkout?amount=${price}&state=${state}&document=${docType}&formData=${encodeURIComponent(
        JSON.stringify(formData)
      )}`;
      router.push(paymentUrl);
    },
    [locale, router, docType]
  );

  const handleDocumentComplete = useCallback(
    (_document: ArrayBuffer) => {
      const completionUrl = `/${locale}/docs/${docType}/complete`;
      router.push(completionUrl);
    },
    [locale, router, docType]
  );

  // Force a re-render of the PDF preview when data/state changes
  const previewKey = useMemo(() => {
    // shallow-ish: state + list of keys present
    const keys = Object.keys(formData || {}).sort().join('|');
    return `${selectedState}-${keys}`;
  }, [selectedState, formData]);

  // ---- Render guards ------------------------------------------------

  if (!isMounted || !draftLoaded || !questionsLoaded) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">
          {!isMounted
            ? t('Loading interface...')
            : !draftLoaded
              ? t('Loading draft...')
              : t('Loading questions...')}
        </p>
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

  const documentDisplayName =
    locale === 'es' && docStrict.translations?.es?.name
      ? docStrict.translations.es.name
      : getDocumentTitle(docStrict, 'en');

  if (useDirectFormFilling && selectedState) {
    return (
      <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: t('breadcrumb.home'), href: `/${locale}` },
            { label: documentDisplayName, href: `/${locale}/docs/${docType}` },
            { label: t('breadcrumb.start') },
          ]}
        />

        <div className="mt-6">
          <SmartDocumentWizard
            documentType={docType as 'vehicle-bill-of-sale'}
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

  const showOfficialFormPreview =
    !!selectedState && STATES_WITH_OFFICIAL_FORMS.includes(selectedState);

  return (
    <FormProvider {...methods}>
      <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: t('breadcrumb.home'), href: `/${locale}` },
            { label: documentDisplayName, href: `/${locale}/docs/${docType}` },
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
              activeMobileTab !== 'form' && 'hidden lg:block'
            )}
          >
            <WizardForm
              locale={locale}
              doc={docStrict}
              onComplete={handleWizardComplete}
              onFieldFocus={setCurrentFieldId}
              ref={setWizardFormRef}
              // Make the wizard strictly use the dynamically loaded / generated questions
              questions={dynamicQuestions ?? undefined}
            />
            <div className="mt-6 lg:mt-8">
              <TrustBadges />
            </div>
          </div>

          <div
            className={cn(
              'lg:col-span-1',
              activeMobileTab !== 'preview' && 'hidden lg:block'
            )}
          >
            <div className="sticky top-32 lg:top-24 h-[calc(100vh-10rem)] lg:h-[calc(100vh-6rem)] overflow-hidden rounded-lg border border-border bg-card">
              {showOfficialFormPreview ? (
                <StatePDFPreview
                  key={previewKey}
                  state={selectedState}
                  formData={formData}
                  documentType={docType}
                />
              ) : (
                <PreviewPane
                  docId={docType}
                  locale={locale}
                  currentFieldId={currentFieldId}
                  onFieldClick={handleFieldClick}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      <ReEngagementTools
        docId={docType}
        totalQuestions={docStrict.questions?.length || 0}
        locale={locale}
      />
    </FormProvider>
  );
}
