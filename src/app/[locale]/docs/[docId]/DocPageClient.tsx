// src/app/[locale]/docs/[docId]/DocPageClient.tsx
'use client';

import { useParams, notFound, useRouter } from 'next/navigation';
import { documentLibrary, type LegalDocument } from '@/lib/document-library';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import React, { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Loader2, Star, ShieldCheck, Zap, HelpCircle, Award, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { track } from '@/lib/analytics';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DocumentDetail = dynamic(() => import('@/components/DocumentDetail'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center border rounded-lg bg-muted p-4 aspect-[8.5/11] max-h-[500px] md:max-h-[700px] w-full shadow-lg">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="ml-2 text-muted-foreground">Loading preview...</p>
    </div>
  ),
});

interface DocPageClientProps {
  params: {
    locale: string;
    docId: string;
  };
}

// Placeholder for AI dynamic highlights
const AiHighlightPlaceholder = ({ text }: { text: string }) => (
  <span className="bg-primary/10 text-primary px-1 py-0.5 rounded-sm text-xs font-medium border border-primary/30 cursor-help" title="AI Highlight: This section will be auto-customized based on your answers.">
    {text} <Zap size={12} className="inline ml-1" />
  </span>
);


export default function DocPageClient({ params: routeParams }: DocPageClientProps) {
  const params = useParams();
  const { t, i18n } = useTranslation("common");
  const router = useRouter();

  const currentLocale = (Array.isArray(params!.locale) ? params!.locale[0] : params!.locale) as 'en' | 'es' | undefined;
  const docId = Array.isArray(params!.docId) ? params!.docId[0] : params!.docId as string | undefined;

  const docConfig = useMemo(() => {
    if (!docId) return undefined;
    return documentLibrary.find(d => d.id === docId);
  }, [docId]);
  
  const [isLoading, setIsLoading] = useState(true); // isLoadingConfig might be more accurate if config fetching is async
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) { // Ensure this runs only after hydration
        if (docId) {
            const foundDoc = documentLibrary.find(d => d.id === docId);
            if (!foundDoc) {
                console.error(`[DocPageClient] Doc config not found for ID: ${docId}. Triggering 404.`);
                notFound();
            }
            // setDocConfig is implicitly handled by useMemo now
        } else {
            console.error("[DocPageClient] docId is undefined. Triggering 404.");
            notFound();
        }
        setIsLoading(false); // Config is resolved (or not found)
    }
  }, [docId, isHydrated, notFound]); // Removed docConfig from deps as it's derived


  useEffect(() => {
    if (currentLocale && i18n.language !== currentLocale && isHydrated) {
      i18n.changeLanguage(currentLocale);
    }
  }, [currentLocale, i18n, isHydrated]);

  useEffect(() => {
    if (docConfig && isHydrated) {
      track('view_item', {
        id: docConfig.id,
        name: currentLocale === 'es' && docConfig.translations?.es?.name ? docConfig.translations.es.name : docConfig.translations?.en?.name || docConfig.name,
        value: docConfig.basePrice
      });
    }
  }, [docConfig, currentLocale, isHydrated]);


  const handleStartWizard = () => {
    if (!docConfig || !currentLocale || !isHydrated) return;
    track('add_to_cart', {
      id: docConfig.id,
      name: currentLocale === 'es' && docConfig.translations?.es?.name ? docConfig.translations.es.name : docConfig.translations?.en?.name || docConfig.name,
      value: docConfig.basePrice
    });
    router.push(`/${currentLocale}/docs/${docConfig.id}/start`);
  };


  if (!isHydrated || isLoading || !docConfig || !currentLocale) {
    return (
       <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Loading document details...</p>
      </div>
    );
  }

  const documentDisplayName = currentLocale === 'es' && docConfig.translations?.es?.name ? docConfig.translations.es.name : docConfig.translations?.en?.name || docConfig.name;
  const documentDescription = currentLocale === 'es' && docConfig.translations?.es?.description ? docConfig.translations.es.description : docConfig.translations?.en?.description || docConfig.description;


  const benefits = [
    { icon: ShieldCheck, textKey: 'docDetail.benefit1', defaultText: 'Legally Sound & State-Specific' },
    { icon: Zap, textKey: 'docDetail.benefit2', defaultText: 'Quick & Easy Customization' },
    { icon: Award, textKey: 'docDetail.benefit3', defaultText: 'Instant Download & Secure Sharing' },
  ];
  
  // Placeholder for competitive pricing data
  const competitorPrice = 200; 

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

        {/* Hero Section */}
        <div className="text-center mb-10 md:mb-16">
            <div className="inline-block p-3 mb-4 bg-primary/10 rounded-full">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 text-foreground">
                {documentDisplayName}
            </h1>
             <div className="flex items-center justify-center space-x-2 mb-3">
                {Array(5).fill(0).map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                ))}
                <span className="text-sm text-muted-foreground">(4.9 stars - 200+ reviews)</span> {/* Placeholder */}
             </div>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
               {documentDescription}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 bg-card border border-border rounded-lg text-left">
                  <benefit.icon className="h-5 w-5 text-primary shrink-0" />
                  <span className="text-xs text-card-foreground">{t(benefit.textKey, benefit.defaultText)}</span>
                </div>
              ))}
            </div>
            
            <Button size="lg" className="w-full sm:w-auto text-base px-8 py-3" onClick={handleStartWizard} disabled={!isHydrated}>
              {t('docDetail.startForFree')}
            </Button>
        </div>
        
        <Separator className="my-8 md:my-12" />

        {/* Preview & Pricing Information Section */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
            {/* Document Preview Section - takes more space on larger screens */}
            <section className="md:col-span-3 bg-card shadow-xl rounded-xl p-2 md:p-4 lg:p-6 border border-border">
                <div className="text-center mb-4">
                    <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-1">
                        {t('docDetail.previewTitle', {defaultValue: 'Document Preview'})}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                        {t('docDetail.previewSubtitle', {defaultValue: "This is how your document will generally look. Specific clauses and details will be customized by your answers."})}
                    </p>
                </div>
                <DocumentDetail locale={currentLocale as 'en' | 'es'} docId={docId as string} altText={`${documentDisplayName} preview`} />
                 <p className="text-xs text-muted-foreground mt-2 text-center italic">
                    AI Highlight: <AiHighlightPlaceholder text="Key clauses" /> will be automatically tailored.
                 </p>
            </section>

            {/* Pricing & Upsell Section - takes less space */}
            <aside className="md:col-span-2 space-y-6">
                 <Card className="shadow-lg border-primary">
                    <CardHeader>
                        <CardTitle className="text-lg text-primary">{t('docDetail.pricingTitle', 'Transparent Pricing')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-baseline justify-between">
                            <span className="text-3xl font-bold text-foreground">${docConfig.basePrice.toFixed(2)}</span>
                            <span className="text-sm text-muted-foreground">{t('pricing.perDocument', {defaultValue: 'per document'})}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                             {t('docDetail.competitivePrice', { competitorPrice: competitorPrice.toFixed(2), defaultValue: `Compare to typical attorney fees of $${competitorPrice.toFixed(2)}+`})}
                        </p>
                         <Button size="lg" className="w-full mt-2" onClick={handleStartWizard} disabled={!isHydrated}>
                           {t('docDetail.startForFree')}
                         </Button>
                    </CardContent>
                 </Card>

                 {docConfig.upsellClauses && docConfig.upsellClauses.length > 0 && (
                    <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle className="text-md flex items-center gap-2">
                                <Zap size={18} className="text-accent" /> {t('docDetail.optionalAddons', 'Optional Add-ons')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {docConfig.upsellClauses.map(clause => (
                                <div key={clause.id} className="text-xs flex justify-between items-center p-2 bg-muted/50 rounded-md">
                                    <span>{currentLocale === 'es' && clause.translations?.es?.description ? clause.translations.es.description : clause.translations?.en?.description || clause.description}</span>
                                    <Badge variant="secondary">+${clause.price.toFixed(2)}</Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                 )}

                 {/* Placeholder for AI dynamic highlights (more detailed) */}
                 <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle className="text-md flex items-center gap-2">
                            <HelpCircle size={18} className="text-blue-500" /> {t('docDetail.aiAssistance', 'AI Assistance')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground">
                            Our AI will help suggest <AiHighlightPlaceholder text="relevant clauses" /> and ensure your document is tailored to the <AiHighlightPlaceholder text="specifics of your situation" /> as you answer questions in the next step.
                        </p>
                    </CardContent>
                 </Card>
            </aside>
        </div>


        {/* Sticky CTA for mobile */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t p-4 shadow-lg z-40">
          <Button size="lg" className="w-full text-base" onClick={handleStartWizard} disabled={!isHydrated}>
             {t('docDetail.startForFree')}
          </Button>
        </div>
    </main>
  );
}

