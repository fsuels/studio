// src/app/[locale]/docs/[docId]/page.tsx
'use client';

import { useParams, notFound, useRouter } from 'next/navigation'; 
import { documentLibrary, type LegalDocument } from '@/lib/document-library'; 
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react'; 
import dynamic from 'next/dynamic'; 
import { Loader2 } from 'lucide-react'; 
import { Badge } from '@/components/ui/badge'; 


const DocumentDetail = dynamic(() => import('@/components/DocumentDetail'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center border rounded-lg bg-muted p-4 aspect-[8.5/11] max-h-[500px] md:max-h-[700px] w-full shadow-lg">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="ml-2 text-muted-foreground">Loading preview...</p>
    </div>
  ),
});


export default function DocPage() {
  const params = useParams();
  const { t, i18n } = useTranslation(); // Added i18n for current language access
  const router = useRouter(); 

  const currentLocale = (Array.isArray(params.locale) ? params.locale[0] : params.locale) as 'en' | 'es' | undefined;
  const docId = Array.isArray(params.docId) ? params.docId[0] : params.docId as string | undefined;

  const [docConfig, setDocConfig] = useState<LegalDocument | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (docId) {
      const foundDoc = documentLibrary.find(d => d.id === docId);
      if (foundDoc) {
        setDocConfig(foundDoc);
      } else {
        notFound();
      }
    } else {
      notFound(); 
    }
    setIsLoading(false);
  }, [docId]);

  // Effect to sync i18next language with URL locale, if they differ
  useEffect(() => {
    if (currentLocale && i18n.language !== currentLocale) {
      i18n.changeLanguage(currentLocale);
    }
  }, [currentLocale, i18n]);


  if (isLoading || !docConfig || !currentLocale) {
    return (
       <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Loading document details...</p>
      </div>
    );
  }
  
  const documentDisplayName = currentLocale === 'es' && docConfig.name_es ? docConfig.name_es : docConfig.name;


  return (
    <main className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
       <nav className="text-sm mb-6 space-x-1 text-muted-foreground">
          <Link href={`/${currentLocale}`} className="hover:text-primary transition-colors">
            {t('Home', { ns: 'translation' })} 
          </Link>
          <span>/</span>
           <span className="text-foreground font-medium">
            {documentDisplayName}
          </span>
        </nav>
        
        <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="lg:order-2">
                <h1 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
                    {documentDisplayName}
                </h1>
                <Badge variant="outline" className="mb-3 border-primary text-primary bg-primary/10">
                   {t('Attorney-Drafted', {defaultValue: 'Attorney-Drafted'})}
                </Badge>
                <p className="text-lg text-muted-foreground mb-6">
                   {currentLocale === 'es' && docConfig.description_es ? docConfig.description_es : docConfig.description}
                </p>
                <div className="flex items-baseline space-x-2 mb-6">
                    <span className="text-3xl font-bold text-primary">${docConfig.basePrice.toFixed(2)}</span>
                    <span className="text-sm text-muted-foreground">{t('pricing.perDocument', {defaultValue: 'per document'})}</span>
                </div>
                <Button size="lg" className="w-full sm:w-auto text-base" asChild>
                  <Link href={`/${currentLocale}/docs/${docId}/start`}>
                     {t('Start for Free', {defaultValue: 'Start for Free'})}
                  </Link>
                </Button>
            </div>
            <div className="lg:order-1">
                 <DocumentDetail locale={currentLocale as 'en' | 'es'} docId={docId} />
            </div>
        </div>
    </main>
  );
}
