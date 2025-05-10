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
import { useCart } from '@/contexts/CartProvider';
import { track } from '@/lib/analytics';
import { Separator } from '@/components/ui/separator';
import { localizations } from '@/lib/localizations';

const DocumentDetail = dynamic(() => import('@/components/DocumentDetail'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center border rounded-lg bg-muted p-4 aspect-[8.5/11] max-h-[500px] md:max-h-[700px] w-full shadow-lg">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="ml-2 text-muted-foreground">Loading preview...</p>
    </div>
  ),
});

// Add generateStaticParams for dynamic routes with static export
export async function generateStaticParams() {
  const params = [];
  for (const locale of localizations) {
    for (const doc of documentLibrary) {
      if (doc.id !== 'general-inquiry') { // Exclude general inquiry or other non-detail pages
        params.push({ locale, docId: doc.id });
      }
    }
  }
  return params;
}


export default function DocPage() {
  const params = useParams();
  const { t, i18n } = useTranslation(); 
  const router = useRouter();
  const { addItem } = useCart();

  const currentLocale = (Array.isArray(params.locale) ? params.locale[0] : params.locale) as 'en' | 'es' | undefined;
  const docId = Array.isArray(params.docId) ? params.docId[0] : params.docId as string | undefined;

  const [docConfig, setDocConfig] = useState<LegalDocument | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (docId && isHydrated) {
      const foundDoc = documentLibrary.find(d => d.id === docId);
      if (foundDoc) {
        setDocConfig(foundDoc);
      } else {
        notFound();
      }
    } else if (isHydrated && !docId) {
       notFound();
    }
    setIsLoading(false);
  }, [docId, isHydrated]);

  useEffect(() => {
    if (currentLocale && i18n.language !== currentLocale && isHydrated) {
      i18n.changeLanguage(currentLocale);
    }
  }, [currentLocale, i18n, isHydrated]);

  useEffect(() => {
    if (docConfig && isHydrated) {
      track('view_item', { 
        id: docConfig.id, 
        name: currentLocale === 'es' && docConfig.name_es ? docConfig.name_es : docConfig.name,
        value: docConfig.basePrice 
      });
    }
  }, [docConfig, currentLocale, isHydrated]);


  const handleStartWizard = () => {
    if (!docConfig || !currentLocale || !isHydrated) return;
    addItem({
      id: docConfig.id,
      type: 'doc',
      name: currentLocale === 'es' && docConfig.name_es ? docConfig.name_es : docConfig.name,
      price: docConfig.basePrice * 100, // Assuming basePrice is in dollars
    });
    track('add_to_cart', { 
      id: docConfig.id, 
      name: currentLocale === 'es' && docConfig.name_es ? docConfig.name_es : docConfig.name,
      value: docConfig.basePrice 
    });
    router.push(`/${currentLocale}/docs/${docConfig.id}/start`);
  };


  if (!isHydrated || isLoading || !docConfig || !currentLocale) {
    return (
       <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]"> {/* Adjusted min-h */}
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
        
        {/* Marketing Section */}
        <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 text-foreground">
                {documentDisplayName}
            </h1>
            <Badge variant="outline" className="mb-3 border-primary text-primary bg-primary/10">
              {t('Attorney-Drafted', {defaultValue: 'Attorney-Drafted'})}
            </Badge>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
               {currentLocale === 'es' && docConfig.description_es ? docConfig.description_es : docConfig.description}
            </p>
            <div className="flex items-baseline justify-center space-x-2 mb-6">
                <span className="text-4xl font-bold text-primary">${docConfig.basePrice.toFixed(2)}</span>
                <span className="text-md text-muted-foreground">{t('pricing.perDocument', {defaultValue: 'per document'})}</span>
            </div>
            <Button size="lg" className="w-full sm:w-auto text-base px-8 py-3" onClick={handleStartWizard} disabled={!isHydrated}>
              {t('docDetail.startForFree')}
            </Button>
        </div>

        {/* Divider Text */}
        <div className="text-center my-8 md:my-12">
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-2">
                 {t('docDetail.previewTitle', {defaultValue: 'Document Preview'})}
            </h2>
            <p className="text-sm text-muted-foreground">
                {t('docDetail.previewSubtitle', {defaultValue: "This is how your document will generally look. Specific clauses and details will be customized by your answers."})}
            </p>
            <Separator className="mt-4 mb-6 md:mb-8 w-1/4 mx-auto" />
        </div>
        
        {/* Document Preview Section */}
         <section className="bg-background shadow-xl rounded-xl p-2 md:p-4 lg:p-6 border border-border">
             <DocumentDetail locale={currentLocale as 'en' | 'es'} docId={docId} altText={`${documentDisplayName} preview`} />
        </section>

        {/* Sticky CTA for mobile */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t p-4 shadow-lg z-40">
          <Button size="lg" className="w-full text-base" onClick={handleStartWizard} disabled={!isHydrated}>
             {t('docDetail.startForFree')}
          </Button>
        </div>
    </main>
  );
}


