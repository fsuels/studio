'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { useCurrentSearchParams } from '@/hooks/useCurrentSearchParams';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Edit, Eye } from 'lucide-react';
import dynamic from 'next/dynamic';

import type { LegalDocument } from '@/types/documents';
import { getDocumentTitle } from '@/lib/format-utils';
import Breadcrumb from '@/components/shared/Breadcrumb';
import { loadFormProgress, saveFormProgress } from '@/lib/firestore/saveFormProgress';
import { debounce } from '@/lib/debounce';
import TrustBadges from '@/components/shared/TrustBadges';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import ReEngagementTools from '@/components/reengagement/ReEngagementTools.client';
import { loadDocumentConfig, normalizeJurisdiction } from '@/lib/config-loader';
import type { OverlayConfig } from '@/lib/config-loader';
import { generateQuestions } from '@/lib/question-generator';
import { buildOverlayFromAcro } from '@/lib/pdf/acro-introspect';
import type { Question } from '@/types/documents';
import { loadDocumentDefinition } from '@/lib/document-loader';

const Loading = () => (
  <div className="flex justify-center items-center h-32">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

// Heavy components loaded on demand
const WizardForm = dynamic(() => import('@/components/forms/WizardForm'), {
  loading: () => <Loading />,
  ssr: false
});

const PreviewPane = dynamic(() => import('@/components/document/PreviewPane'), {
  loading: () => <Loading />,
  ssr: false
});

const StatePDFPreview = dynamic(
  () => import('@/components/document/StatePDFPreview'),
  { loading: () => <Loading />, ssr: false }
);

const SmartDocumentWizard = dynamic(
  () => import('@/components/document/SmartDocumentWizard'),
  { loading: () => <Loading />, ssr: false }
);

interface WizardCoreProps {
  locale: 'en' | 'es';
  docId: string;
  docMeta?: any;
}

export default function WizardCore({ locale, docId, docMeta }: WizardCoreProps) {
  const { t, ready } = useTranslation('common');
  const router = useRouter();
  const searchParams = useCurrentSearchParams();
  const { isLoggedIn, user, isLoading: authIsLoading } = useAuth();

  const resumeId = searchParams.get('resumeId');
  const stateFromUrl = searchParams.get('state')?.toUpperCase();

  const [isMounted, setIsMounted] = useState(false);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const [activeMobileTab, setActiveMobileTab] = useState<'form' | 'preview'>('form');
  const [currentFieldId, setCurrentFieldId] = useState<string | undefined>();
  const [wizardFormRef, setWizardFormRef] = useState<{
    navigateToField: (fieldId: string) => void;
  } | null>(null);
  const [selectedState, setSelectedState] = useState<string>(stateFromUrl || '');
  const [useDirectFormFilling, setUseDirectFormFilling] = useState(false);
  const [dynamicQuestions, setDynamicQuestions] = useState<Question[] | null>(null);
  const [questionsLoaded, setQuestionsLoaded] = useState(false);
  const [overlayConfig, setOverlayConfig] = useState<OverlayConfig | null>(null);
  const [hasOverlay, setHasOverlay] = useState(false);
  const [docDef, setDocDef] = useState<LegalDocument | null>(null);

  // Load document definition safely using the document loader service
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await loadDocumentDefinition(docId);
        if (!cancelled && result.document) {
          setDocDef(result.document);
          console.log(`📄 Loaded document ${docId} from ${result.source} source`);
        }
      } catch (error) {
        console.warn(`Failed to load document definition for ${docId}:`, error);
        // Create a minimal fallback document
        if (!cancelled) {
          const fallbackDoc: LegalDocument = {
            id: docId,
            name: docMeta?.name || docId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            description: docMeta?.description || `Document template for ${docId}`,
            category: docMeta?.category || 'General',
            schema: null as any,
            questions: [],
            basePrice: docMeta?.basePrice || 0,
            requiresNotarization: false,
            canBeRecorded: false,
            offerNotarization: false,
            offerRecordingHelp: false,
            languageSupport: ['en', 'es']
          };
          setDocDef(fallbackDoc);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [docId, docMeta]);

  // Initialize form methods with default configuration
  const methods = useForm<z.infer<z.ZodTypeAny>>({
    defaultValues: {},
    mode: 'onBlur',
    resolver: docDef?.schema ? zodResolver(docDef.schema) : undefined,
  });

  const { reset, watch } = methods;
  const formData = watch();

  const docType = docDef?.id || docMeta?.id || docId;
  // Build a minimal LegalDocument-like object for downstream components
  const docStrict: LegalDocument = (docDef || {
    id: docType,
    category: docMeta?.category || 'general',
    schema: (z.object({}) as unknown) as any,
    questions: [],
    translations: docMeta?.translations,
    name: docMeta?.name,
    description: docMeta?.description,
    basePrice: docMeta?.basePrice || 0,
    requiresNotarization: false,
    canBeRecorded: false,
    offerNotarization: false,
    offerRecordingHelp: false,
    languageSupport: ['en', 'es'],
  }) as LegalDocument;

  useEffect(() => setIsMounted(true), []);

  const loadDynamicQuestions = useCallback(
    async (state?: string) => {
    if (!docType) return;

      const wantedState = (state || '').toUpperCase();
      if (!wantedState) {
        setDynamicQuestions(null);
        setOverlayConfig(null);
        setHasOverlay(false);
        setQuestionsLoaded(true);
        return;
      }

      try {
        const jurisdiction = normalizeJurisdiction(wantedState);
        console.log(`📍 Loading config for ${docType} in ${jurisdiction}`);
        const cfg = await loadDocumentConfig(docType, jurisdiction);

        // Keep overlay in local state for preview
        setOverlayConfig(cfg.overlayConfig || null);
        setHasOverlay(!!cfg.overlayConfig);

        // 1) If JSON already provides questions, use them
        if (cfg.questions?.length) {
          console.log(`✅ Using ${cfg.questions.length} questions from JSON config`);
          setDynamicQuestions(cfg.questions);
          setQuestionsLoaded(true);
          return;
        }

        // 2) No questions; overlay exists → if overlay has few/no mappings, introspect PDF AcroForm
        if (cfg.overlayConfig) {
          const hasMappings = !!cfg.overlayConfig.fieldMapping && Object.keys(cfg.overlayConfig.fieldMapping!).length > 8;
          let overlayToUse: OverlayConfig = cfg.overlayConfig;

          if (!hasMappings && cfg.overlayConfig.pdfPath) {
            try {
              console.log('🧭 Overlay has no/limited mappings; introspecting AcroForm…');
              overlayToUse = await buildOverlayFromAcro(cfg.overlayConfig.pdfPath);
              setOverlayConfig(overlayToUse);
              setHasOverlay(true);
            } catch (e) {
              console.warn('Acro introspection failed; falling back to provided overlay config', e);
            }
          }

          console.log(`🔧 Generating questions directly from form overlay`);
          const generated = generateQuestions(overlayToUse);
          setDynamicQuestions(generated);
          setQuestionsLoaded(true);
          return;
        }

        // 3) Neither questions nor overlay → fallback to generic
        console.log(`⚠️ No questions or overlay found, using generic`);
        setDynamicQuestions(null);
        setQuestionsLoaded(true);
      } catch (e) {
        console.warn('Failed to load dynamic config/questions:', e);
        setDynamicQuestions(null);
        setOverlayConfig(null);
        setHasOverlay(false);
        setQuestionsLoaded(true);
      }
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
  }, [docStrict.id, isMounted, methods]);

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
          console.error('[WizardCore] Draft loading failed:', e);
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
    const keys = Object.keys(formData || {}).sort().join('|');
    return `${selectedState}-${keys}`;
  }, [selectedState, formData]);

  // ---- Guards ----------------------------------------------------

  if (!docDef && !docMeta && !docId) {
    notFound();
    return null;
  }

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
    (locale === 'es' && (docStrict.translations?.es?.name || docMeta?.translations?.es?.name)) ||
    docStrict.translations?.en?.name ||
    docMeta?.translations?.en?.name ||
    docStrict.name ||
    docMeta?.name ||
    getDocumentTitle(docStrict, 'en');

  if (useDirectFormFilling && selectedState) {
    return (
      <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[{ label: t('breadcrumb.home'), href: `/${locale}` },
            { label: documentDisplayName, href: `/${locale}/docs/${docType}` },
            { label: t('breadcrumb.start') }]}
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

  const showOfficialFormPreview = hasOverlay;

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
              overrideQuestions={questionsLoaded && dynamicQuestions ? dynamicQuestions : undefined}
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
                  overlayConfig={overlayConfig}
                />
              ) : (
                <PreviewPane
                  docId={docType}
                  locale={locale}
                  docConfig={docStrict}
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
        totalQuestions={(dynamicQuestions?.length || docStrict.questions?.length || 0)}
        locale={locale}
      />
    </FormProvider>
  );
}