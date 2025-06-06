// src/app/[locale]/docs/[docId]/start/StartWizardPageClient.tsx
'use client';

import { useParams, notFound, useRouter } from 'next/navigation';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Edit, Eye } from 'lucide-react';

import { documentLibrary } from '@/lib/document-library';
import Breadcrumb from '@/components/Breadcrumb';
import dynamic from 'next/dynamic';

const Loading = () => (
  <div className="flex justify-center items-center h-32">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const WizardForm = dynamic(() => import('@/components/WizardForm'), {
  loading: () => <Loading />,
});

const PreviewPane = dynamic(() => import('@/components/PreviewPane'), {
  loading: () => <Loading />,
});
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import {
  loadFormProgress,
  saveFormProgress,
} from '@/lib/firestore/saveFormProgress';
import { debounce } from '@/lib/debounce';
import TrustBadges from '@/components/TrustBadges';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import ReEngagementTools from '@/components/reengagement/ReEngagementTools.client';

export default function StartWizardPageClient() {
  const params = useParams();
  const { t, ready } = useTranslation('common');
  const router = useRouter();
  const { isLoggedIn, user, isLoading: authIsLoading } = useAuth();

  // Robust locale derivation, defaulting to 'en'
  const pathLocale = Array.isArray(params?.locale) ? params.locale[0] : params?.locale;
  const locale = (pathLocale === 'es' ? 'es' : 'en') as 'en' | 'es';

  const docIdFromPath = (
    Array.isArray(params!.docId) ? params!.docId[0] : params!.docId
  ) as string;

  const [isMounted, setIsMounted] = useState(false);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const [activeMobileTab, setActiveMobileTab] = useState<'form' | 'preview'>(
    'form',
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const docConfig = useMemo(() => {
    if (!docIdFromPath) return undefined;
    return documentLibrary.find((d) => d.id === docIdFromPath);
  }, [docIdFromPath]);

  const methods = useForm<z.infer<z.ZodTypeAny>>({
    defaultValues: {},
    mode: 'onBlur',
    resolver: docConfig?.schema ? zodResolver(docConfig.schema) : undefined,
  });
  const { reset, watch } = methods;

  useEffect(() => {
    if (!isMounted) {
      return;
    }
    if (docConfig) {
      if (
        docConfig!.schema &&
        typeof docConfig!.schema.safeParse === 'function'
      ) {
        methods.reset({});
      } else {
        console.warn(
          `[StartWizardPageClient] No valid Zod schema for doc ID: ${docIdFromPath}. Validation might not work.`,
        );
        methods.reset({});
      }
      setIsLoadingConfig(false);
    } else if (isMounted && docIdFromPath) {
      setIsLoadingConfig(false);
    } else if (!docIdFromPath && isMounted) {
      console.error(
        `[StartWizardPageClient] docIdFromPath is missing after mount.`,
      );
      setIsLoadingConfig(false);
    }
  }, [docConfig, isMounted, methods, docIdFromPath, reset]);

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
            docType: docConfig!.id,
            state: locale,
          });
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
      } else {
      }
    }
    loadDraft();
  }, [
    docConfig,
    locale,
    isMounted,
    reset,
    authIsLoading,
    isLoggedIn,
    user,
    isLoadingConfig,
    ready,
  ]);

  const debouncedSave = useMemo(
    () =>
      debounce((data: Record<string, unknown>) => {
        // Wrap async logic to satisfy debounce's void return type
        void (async () => {
          if (
            !docConfig?.id ||
            authIsLoading ||
            !isMounted ||
            Object.keys(data).length === 0 ||
            isLoadingConfig ||
            !locale ||
            !ready
          )
            return;

          const relevantDataToSave = Object.keys(data).reduce(
            (acc, key) => {
              if (data[key] !== undefined) {
                acc[key] = data[key];
              }
              return acc;
            },
            {} as Record<string, unknown>,
          );

          if (Object.keys(relevantDataToSave).length === 0) return;

          if (isLoggedIn && user?.uid) {
            await saveFormProgress({
              userId: user.uid,
              docType: docConfig!.id,
              state: locale,
              formData: relevantDataToSave,
            });
          } else {
            localStorage.setItem(
              `draft-${docConfig!.id}-${locale}`,
              JSON.stringify(relevantDataToSave),
            );
          }
        })();
      }, 1000),
    [
      isLoggedIn,
      user?.uid,
      docConfig,
      locale,
      authIsLoading,
      isMounted,
      isLoadingConfig,
      ready,
    ],
  );

  useEffect(() => {
    if (
      !docConfig?.id ||
      authIsLoading ||
      !isMounted ||
      !watch ||
      isLoadingConfig ||
      !locale ||
      !ready
    )
      return () => {};

    const subscription = watch((values) => {
      debouncedSave(values as Record<string, unknown>);
    });
    return () => {
      subscription.unsubscribe();
      debouncedSave.cancel();
    };
  }, [
    watch,
    docConfig,
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

  // Primary loading state: waits for client mount, i18next readiness, and initial config/param check.
  if (!isMounted) {
    // Render a minimal, static placeholder or null on initial client render to match SSR
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Loading...</p>{' '}
        {/* Non-translated, static text */}
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

  if (!docIdFromPath || !docConfig) {
    console.error(
      `[StartWizardPageClient] Critical failure: docIdFromPath (${docIdFromPath}) or docConfig is missing. Calling notFound(). Locale derived as: ${locale}`,
    );
    notFound();
    return null;
  }

  const documentDisplayName =
    locale === 'es' && docConfig?.translations?.es?.name
      ? docConfig.translations.es.name
      : docConfig?.translations?.en?.name || docConfig?.name || docConfig.id;

  return (
    <FormProvider {...methods}>
      <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: t('breadcrumb.home'), href: `/${locale}` },
            {
              label: documentDisplayName,
              href: `/${locale}/docs/${docConfig!.id}`,
            },
            { label: t('breadcrumb.start') },
          ]}
        />

        <div className="lg:hidden mb-4 sticky top-14 z-30 bg-background/90 backdrop-blur-sm py-2 -mx-4 px-4 border-b">
          <Tabs
            value={activeMobileTab}
            onValueChange={(value) =>
              setActiveMobileTab(value as 'form' | 'preview')
            }
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 h-10">
              <TabsTrigger
                value="form"
                className="text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Edit className="w-4 h-4 mr-1.5" /> {t('Form')}
              </TabsTrigger>
              <TabsTrigger
                value="preview"
                className="text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
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
            <div className="sticky top-32 lg:top-24 h-[calc(100vh-14rem)] lg:h-[calc(100vh-8rem)] max-h-[calc(100vh-14rem)] lg:max-h-[calc(100vh-6rem)] flex flex-col">
              <h3 className="text-xl font-semibold mb-4 text-center text-card-foreground shrink-0 hidden lg:block">
                {t('Live Preview')}
              </h3>
              <div className="flex-grow overflow-hidden rounded-lg shadow-md border border-border bg-card">
                <PreviewPane docId={docIdFromPath} locale={locale} />
              </div>
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
