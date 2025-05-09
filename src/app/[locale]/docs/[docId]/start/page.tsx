// src/app/[locale]/docs/[docId]/start/page.tsx
'use client';

import { useParams, notFound, useRouter } from 'next/navigation';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { documentLibrary, type LegalDocument } from '@/lib/document-library';
import Breadcrumb from '@/components/Breadcrumb';
import WizardForm from '@/components/WizardForm';
// WizardLayout is no longer used here, page structure is handled directly
import PreviewPane from '@/components/PreviewPane'; 
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

export default function StartWizardPage() {
  const params = useParams();
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const locale = params.locale as 'en' | 'es';
  const docIdFromPath = params.docId as string;

  const [docConfig, setDocConfig] = useState<LegalDocument | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
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
      setIsLoading(false);
    } else if (!docIdFromPath && isHydrated) {
      setIsLoading(false);
      notFound();
    }
  }, [docIdFromPath, isHydrated, notFound]);


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

  if (!isHydrated || isLoading || !docConfig) {
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
    <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Breadcrumb
        items={[
          { label: t('breadcrumb.home', { ns: 'translation' }), href: `/${locale}` },
          { label: documentDisplayName, href: `/${locale}/docs/${docConfig.id}` },
          { label: t('breadcrumb.start', { ns: 'translation' }) },
        ]}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
        <div className="lg:col-span-1"> {/* Adjusted from lg:col-span-2 for 50/50 split */}
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
            {/* This div now controls the visual appearance and overflow of the preview area */}
            <div className="flex-grow overflow-hidden rounded-lg shadow-md border border-border bg-background">
              <PreviewPane docId={docIdFromPath} locale={locale} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
