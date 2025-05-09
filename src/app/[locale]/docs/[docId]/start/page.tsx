// src/app/[locale]/docs/[docId]/start/page.tsx
'use client';

import { useParams, notFound, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Loader2, Edit, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { documentLibrary, type LegalDocument } from '@/lib/document-library';
import Breadcrumb from '@/components/Breadcrumb';
import WizardForm from '@/components/WizardForm';
import PreviewPane from '@/components/PreviewPane';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs" // For mobile view toggle

export default function StartWizardPage() {
  const params = useParams();
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const locale = params.locale as 'en' | 'es';
  const docIdFromPath = params.docId as string;

  const [docConfig, setDocConfig] = useState<LegalDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);
  const [mobileView, setMobileView] = useState<'form' | 'preview'>('form'); // For mobile tab navigation

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
    } else if (!docIdFromPath && isHydrated) {
      setIsLoading(false);
      notFound();
    }
  }, [docIdFromPath, isHydrated]);

  const handleWizardComplete = (checkoutUrl: string) => {
    if (checkoutUrl) {
      toast({ title: t("Proceeding to Checkout"), description: t("Redirecting to secure payment...") });
      router.push(checkoutUrl);
    } else {
      console.error("[StartWizardPage] Checkout URL not provided onComplete.");
      toast({ title: t("Checkout Error"), description: t("Could not initiate checkout. Please try again."), variant: "destructive" });
      router.push(`/${locale}/dashboard?status=checkout_error`);
    }
  };

  if (!isHydrated || isLoading || !docConfig) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">{t('Loading document wizard...')}</p>
      </div>
    );
  }
  
  const documentDisplayName = locale === 'es' && docConfig.name_es ? docConfig.name_es : docConfig.name;

  return (
    <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      <Breadcrumb
        items={[
          { label: t('breadcrumb.home'), href: `/${locale}` },
          { label: documentDisplayName, href: `/${locale}/docs/${docIdFromPath}` },
          { label: t('breadcrumb.start') },
        ]}
      />
      
      {/* Mobile View Toggle */}
      <div className="lg:hidden mb-4">
        <Tabs value={mobileView} onValueChange={(value) => setMobileView(value as 'form' | 'preview')} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="form" className="flex items-center gap-2">
              <Edit className="h-4 w-4" /> {t('Form')}
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" /> {t('Preview')}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Desktop Grid Layout */}
      <div className="hidden lg:grid lg:grid-cols-2 gap-8">
        <div className="lg:col-span-1">
          <WizardForm
            locale={locale}
            doc={docConfig}
            onComplete={handleWizardComplete}
          />
        </div>
        <div className="lg:col-span-1">
          <div className="sticky top-24 h-screen max-h-[calc(100vh-6rem)] flex flex-col">
             <h3 className="text-xl font-semibold mb-4 text-center text-card-foreground shrink-0">{t('Live Preview')}</h3>
             <div className="flex-grow overflow-hidden">
                <PreviewPane
                  docId={docIdFromPath}
                  locale={locale}
                  watch={undefined} // Watch function will be accessed via FormProvider context
                />
             </div>
          </div>
        </div>
      </div>

      {/* Mobile Stacked Layout */}
      <div className="lg:hidden space-y-8">
        {mobileView === 'form' && (
          <div>
            <WizardForm
              locale={locale}
              doc={docConfig}
              onComplete={handleWizardComplete}
            />
          </div>
        )}
        {mobileView === 'preview' && (
          <div>
             <h3 className="text-xl font-semibold mb-4 text-center text-card-foreground">{t('Live Preview')}</h3>
            <PreviewPane
              docId={docIdFromPath}
              locale={locale}
              watch={undefined} // Watch function will be accessed via FormProvider context
            />
          </div>
        )}
      </div>
    </main>
  );
}
