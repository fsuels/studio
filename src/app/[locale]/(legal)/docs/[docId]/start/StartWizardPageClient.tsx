// src/app/[locale]/docs/[docId]/start/StartWizardPageClient.tsx
'use client';

import { useParams, notFound, useRouter } from 'next/navigation';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Edit, Eye } from 'lucide-react';

import { documentLibrary } from '@/lib/document-library';
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

export default function StartWizardPageClient() {
  const params = useParams();
  const { t, ready } = useTranslation('common');
  const router = useRouter();
  const { isLoggedIn, user, isLoading: authIsLoading } = useAuth();

  const pathLocale = Array.isArray(params?.locale)
    ? params.locale[0]
    : params?.locale;
  const locale = (pathLocale === 'es' ? 'es' : 'en') as 'en' | 'es';

  const docIdFromPath = (
    Array.isArray(params!.docId) ? params!.docId[0] : params!.docId
  ) as string;

  const [isMounted, setIsMounted] = useState(false);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const [activeMobileTab, setActiveMobileTab] = useState<'form' | 'preview'>(
    'form'
  );

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
  }, [
    authIsLoading,
    isLoadingConfig,
    isLoggedIn,
    user,
    locale,
    ready,
    reset,
  ]);

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
              JSON.stringify(relevantData)
            );
          }
        })();
      }, 1000),
    [docConfig, isMounted, authIsLoading, isLoggedIn, user, locale, ready]
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
  }, [watch, debouncedSave, authIsLoading, isMounted, isLoadingConfig, locale, ready]);

  const handleWizardComplete = useCallback(
    (redirectUrl: string) => {
      router.push(redirectUrl);
    },
    [router]
  );

  if (!isMounted || !draftLoaded) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">
          {t('Loading draft...')}
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

  if (!docConfig) {
    notFound();
    return null;
  }

  const documentDisplayName =
    locale === 'es' && docConfig.translations?.es?.name
      ? docConfig.translations.es.name
      : docConfig.translations?.en?.name || docConfig.name || docConfig.id;

  return (
    <FormProvider {...methods}>
      <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: t('breadcrumb.home'), href: `/${locale}` },
            { label: documentDisplayName, href: `/${locale}/docs/${docConfig.id}` },
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
          <div className={cn('lg:col-span-1', activeMobileTab !== 'form' && 'hidden lg:block')}>
            <WizardForm locale={locale} doc={docConfig} onComplete={handleWizardComplete} />
            <div className="mt-6 lg:mt-8">
              <TrustBadges />
            </div>
          </div>
          <div className={cn('lg:col-span-1', activeMobileTab !== 'preview' && 'hidden lg:block')}>
            <div className="sticky top-32 lg:top-24 h-[calc(100vh-14rem)] lg:h-[calc(100vh-8rem)] overflow-hidden rounded-lg border border-border bg-card">
              <PreviewPane docId={docConfig.id} locale={locale} />
            </div>
          </div>
        </div>
      </main>
      <ReEngagementTools docId={docConfig.id} totalQuestions={docConfig.questions?.length || 0} locale={locale} />
    </FormProvider>
  );
}
