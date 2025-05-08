// src/app/[locale]/docs/[docId]/start/page.tsx
'use client';

import { useParams, notFound, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { documentLibrary, type LegalDocument } from '@/lib/document-library';
import Breadcrumb from '@/components/Breadcrumb';
import WizardForm from '@/components/WizardForm';
import PreviewPane from '@/components/PreviewPane';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// This component will contain the main wizard logic once docConfig is loaded
const WizardComponent = ({ docConfig, initialLocale }: { docConfig: LegalDocument, initialLocale: 'en' | 'es' }) => {
  const { docId: docIdFromPath } = useParams() as { locale: 'en' | 'es'; docId: string };
  const { t } = useTranslation();
  const router = useRouter();
  const { toast } = useToast();

  const methods = useForm<z.infer<typeof docConfig.schema>>({
    resolver: zodResolver(docConfig.schema),
    defaultValues: {}, // WizardForm will handle loading from localStorage via reset
    mode: 'onBlur',
  });

  return (
    <FormProvider {...methods}>
      <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
        <Breadcrumb
          items={[
            { label: t('breadcrumb.home'), href: `/${initialLocale}` },
            { label: initialLocale === 'es' && docConfig.name_es ? docConfig.name_es : docConfig.name, href: `/${initialLocale}/docs/${docIdFromPath}` },
            { label: t('breadcrumb.start') },
          ]}
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          <div className="lg:col-span-2">
            <WizardForm
              locale={initialLocale}
              doc={docConfig}
              onComplete={(checkoutUrl) => {
                if (checkoutUrl) {
                  toast({ title: t("Proceeding to Checkout"), description: t("Redirecting to secure payment...") });
                  router.push(checkoutUrl);
                } else {
                  console.error("[StartWizardPage] Checkout URL not provided onComplete.");
                  toast({ title: t("Checkout Error"), description: t("Could not initiate checkout. Please try again."), variant: "destructive" });
                  router.push(`/${initialLocale}/dashboard?status=checkout_error`);
                }
              }}
            />
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-24 h-screen max-h-[calc(100vh-6rem)] flex flex-col">
              <h3 className="text-xl font-semibold mb-4 text-center text-card-foreground shrink-0">{t('Live Preview')}</h3>
              <div className="flex-grow overflow-hidden">
                <PreviewPane
                  docId={docIdFromPath}
                  locale={initialLocale}
                  watch={methods.watch}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </FormProvider>
  );
};

export default function StartWizardPage() {
  const params = useParams();
  const { t } = useTranslation();
  const locale = params.locale as 'en' | 'es';
  const docIdFromPath = params.docId as string;

  const [docConfig, setDocConfig] = useState<LegalDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (docIdFromPath && isHydrated) {
      const foundDoc = documentLibrary.find(d => d.id === docIdFromPath);
      if (foundDoc) {
        setDocConfig(foundDoc);
      } else {
        console.error(`[StartWizardPage] Document config not found for docId: ${docIdFromPath}`);
        notFound();
      }
      setIsLoading(false);
    } else if (!docIdFromPath && isHydrated) { // Handle case where docIdFromPath might be undefined initially
      setIsLoading(false);
      notFound();
    }
  }, [docIdFromPath, isHydrated]);

  if (!isHydrated || isLoading || !docConfig) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">{t('Loading document wizard...')}</p>
      </div>
    );
  }

  return <WizardComponent docConfig={docConfig} initialLocale={locale} />;
}
