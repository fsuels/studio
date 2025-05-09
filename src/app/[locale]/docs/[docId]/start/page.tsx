// src/app/[locale]/docs/[docId]/start/page.tsx
'use client';

import { useParams, notFound, useRouter } from 'next/navigation';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { documentLibrary, type LegalDocument } from '@/lib/document-library';
import Breadcrumb from '@/components/Breadcrumb';
import WizardForm from '@/components/WizardForm';
import PreviewPane from '@/components/PreviewPane';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { FormProvider } from 'react-hook-form'; // Import FormProvider

export default function StartWizardPage() {
  const params = useParams();
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { toast } = useToast();

  const locale = params.locale as 'en' | 'es';
  const docIdFromPath = params.docId as string;

  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const docConfig = useMemo(() => {
    if (!docIdFromPath || !isHydrated) return undefined;
    // Find the document configuration from the library
    const foundDoc = documentLibrary.find(d => d.id === docIdFromPath);
    // If found, return it. WizardForm will handle cases where questions/schema might be missing.
    return foundDoc;
  }, [docIdFromPath, isHydrated]);

  useEffect(() => {
    if (isHydrated && docIdFromPath) {
      if (!docConfig) {
        console.error(`[StartWizardPage] Document config not found for docId: ${docIdFromPath}. This will lead to a 404 page.`);
        notFound(); // Trigger 404 if doc config is not found
      } else {
        // Basic check: Does it have questions or a schema?
        // This log helps confirm if the found doc has the necessary parts.
        const hasQuestions = docConfig.questions && docConfig.questions.length > 0;
        const hasSchema = !!docConfig.schema;
        console.log(`[StartWizardPage] Loaded docConfig for ${docIdFromPath}: HasQuestions=${hasQuestions}, HasSchema=${hasSchema}`);
      }
      setIsLoadingConfig(false);
    }
  }, [docConfig, docIdFromPath, isHydrated, notFound]);


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


  if (!isHydrated || isLoadingConfig || !docConfig) {
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

  // Pass methods down using FormProvider
  // WizardForm now uses useForm internally, so FormProvider is not needed here
  // unless PreviewPane also needs access to the same form context, which it does.

  // The WizardForm component initializes its own form context.
  // If PreviewPane needs to react to form changes, it must be inside the FormProvider
  // created by WizardForm, or WizardForm needs to pass `watch` down.
  // For simplicity, we'll ensure PreviewPane gets form context if WizardForm provides it.

  return (
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
             {/* WizardForm will internally create FormProvider */}
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
                {/* PreviewPane needs to be wrapped in FormProvider if it uses useFormContext */}
                {/* This will be handled if WizardForm correctly sets up its provider */}
                 <FormProvider {...{} /* This is tricky, PreviewPane needs access to WizardForm's methods */}>
                    <PreviewPane docId={docIdFromPath} locale={locale} />
                 </FormProvider>
              </div>
            </div>
          </div>
        </div>
      </main>
  );
}

