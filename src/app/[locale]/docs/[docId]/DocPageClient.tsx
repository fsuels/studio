// src/app/[locale]/docs/[docId]/DocPageClient.tsx
'use client';

import { notFound, useRouter, useParams } from 'next/navigation';
import { documentLibrary } from '@/lib/document-library';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import React, { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import type { DocumentDetailProps } from '@/components/DocumentDetail';
import { Loader2, Star, ShieldCheck, Zap, HelpCircle, Award, FileText, Edit3, FileSignature, Info } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { track } from '@/lib/analytics';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import VehicleBillOfSaleDisplay from '@/components/docs/VehicleBillOfSaleDisplay'; // Import the specific display component
import PromissoryNoteDisplay from '@/components/docs/PromissoryNoteDisplay';

// Lazy load testimonials section so it's only fetched when this page is viewed
const TrustAndTestimonialsSection = dynamic(
  () => import('@/components/landing/TrustAndTestimonialsSection'),
  {
    loading: () => (
      <div className="flex justify-center items-center h-32">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    ),
  }
);

type DocumentDetailComponent = React.ComponentType<DocumentDetailProps> & {
  preload?: () => void;
};

const DocumentDetail = dynamic(() => import('@/components/DocumentDetail'), {
  loading: () => (
    <div className="flex items-center justify-center border rounded-lg bg-muted p-4 aspect-[8.5/11] max-h-[500px] md:max-h-[700px] w-full shadow-lg">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="ml-2 text-muted-foreground">Loading preview...</p>
    </div>
  ),
}) as DocumentDetailComponent;

interface DocPageClientProps {
  params: {
    locale: string;
    docId: string;
  };
  markdownContent?: string | null; // Add this line
}

// Placeholder for AI dynamic highlights
const AiHighlightPlaceholder = ({ text }: { text: string }) => (
  <span className="bg-primary/10 text-primary px-1 py-0.5 rounded-sm text-xs font-medium border border-primary/30 cursor-help" title="AI Highlight: This section will be auto-customized based on your answers.">
    {text} <Zap size={12} className="inline ml-1" />
  </span>
);


export default function DocPageClient({ params: routeParams, markdownContent }: DocPageClientProps) {
  const { t, i18n } = useTranslation("common");
  const router = useRouter();
  const urlParams = (useParams() ?? {}) as Record<string, string | string[]>;

  const currentLocale = (routeParams.locale ?? (Array.isArray(urlParams.locale) ? urlParams.locale[0] : urlParams.locale)) as 'en' | 'es';
  const docId = (routeParams.docId ?? (Array.isArray(urlParams.docId) ? urlParams.docId[0] : urlParams.docId)) as string;

  const docConfig = useMemo(() => {
    if (!docId) return undefined;
    return documentLibrary.find(d => d.id === docId);
  }, [docId]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Preload detail component and next step route for quicker interactions
  useEffect(() => {
    if (typeof DocumentDetail.preload === 'function') {
      DocumentDetail.preload();
    }
    if (docId && currentLocale) {
      router.prefetch(`/${currentLocale}/docs/${docId}/start`);
    }
  }, [router, docId, currentLocale]);

  useEffect(() => {
    if (isHydrated) {
        if (docId) {
            const foundDoc = documentLibrary.find(d => d.id === docId);
            if (!foundDoc) {
                console.error(`[DocPageClient] Doc config not found for ID: ${docId}. Triggering 404.`);
                notFound();
            }
        } else {
            console.error("[DocPageClient] docId is undefined. Triggering 404.");
            notFound();
        }
        setIsLoading(false);
    }
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
        name: currentLocale === 'es' && docConfig.translations?.es?.name ? docConfig.translations.es.name : docConfig.translations?.en?.name || docConfig.name,
        value: docConfig.basePrice
      });
    }
  }, [docConfig, currentLocale, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    if (typeof DocumentDetail.preload === 'function') {
      DocumentDetail.preload();
    }
    if (docId && currentLocale) {
      router.prefetch(`/${currentLocale}/docs/${docId}/start`);
    }
  }, [docId, currentLocale, isHydrated, router]);


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

  const features = [
    { icon: FileText, title: 'Fill your responses and complete your document', desc: 'Guided questions populate every field' },
    { icon: Edit3, title: 'Personalize with a rich editor', desc: 'Make custom tweaks before finalizing' },
    { icon: FileSignature, title: 'E-sign documents easily and securely', desc: 'Sign online and send to others' },
  ];
  
  const competitorPrice = 200; 

  return (
    <main className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
       <nav className="text-sm mb-6 space-x-1 text-muted-foreground">
          <Link href={`/${currentLocale}`} className="hover:text-primary transition-colors">
            {t('Home')}
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
                <span className="text-sm text-muted-foreground">(4.9 stars - 200+ reviews)</span>
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
              {t('Start For Free', {defaultValue: 'Start For Free'})}
            </Button>
            <div className="mt-4">
              <Link href={`/${currentLocale}#workflow-start`} className="text-sm text-primary underline">
                {t('Browse Templates', {defaultValue: 'Browse Templates'})}
              </Link>
            </div>
        </div>
        
        <Separator className="my-8 md:my-12" />

        {/* Preview & Pricing Information Section */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
            <section className="md:col-span-3 bg-card shadow-xl rounded-xl p-2 md:p-4 lg:p-6 border border-border">
                <div className="text-center mb-4">
                    <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-1 flex items-center justify-center gap-1">
                        {t('docDetail.previewTitle', {defaultValue: 'Document Preview'})}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent side="top" className="text-xs">This shows a sample layout of your completed form.</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                    </h2>
                    <p className="text-xs text-muted-foreground">
                        {t('docDetail.previewSubtitle', {defaultValue: "This is how your document will generally look. Specific clauses and details will be customized by your answers."})}
                    </p>
                </div>
                <DocumentDetail
                  locale={currentLocale as 'en' | 'es'}
                  docId={docId as string}
                  altText={`${documentDisplayName} preview`}
                  markdownContent={markdownContent} // Add this prop
                />
                 <p className="text-xs text-muted-foreground mt-2 text-center italic">
                    AI Highlight: <AiHighlightPlaceholder text="Key clauses" /> will be automatically tailored.
                 </p>
            </section>

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
                           {t('Start For Free', {defaultValue: 'Start For Free'})}
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

        {/* Conditional rendering for document-specific content vs generic content */}
        {docConfig.id === 'bill-of-sale-vehicle' ? (
          <VehicleBillOfSaleDisplay locale={currentLocale as 'en' | 'es'} />
        ) : docConfig.id === 'promissory-note' ? (
          <PromissoryNoteDisplay locale={currentLocale as 'en' | 'es'} />
        ) : (
          <>
            {/* Feature Highlights */}
            <section className="mt-16 grid md:grid-cols-3 gap-6">
              {features.map((f, i) => (
                <div key={i} className="text-center p-4 bg-card border border-border rounded-lg shadow-md">
                  <f.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium text-card-foreground mb-1">{f.title}</p>
                  <p className="text-xs text-muted-foreground">{f.desc}</p>
                </div>
              ))}
            </section>

            {/* How-to Guide & FAQ */}
            <section className="mt-16 max-w-3xl mx-auto space-y-6">
              <h2 className="text-2xl font-semibold text-center text-foreground">How to Use This Template</h2>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>Answer each question in the guided form.</li>
                <li>Make any tweaks using the built-in editor.</li>
                <li>E-sign and download your completed document.</li>
              </ol>

              <div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">Frequently Asked Questions</h3>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="q1">
                    <AccordionTrigger>Do I need a notary for this document?</AccordionTrigger>
                    <AccordionContent>Requirements vary by state, but notarization can add extra authenticity.</AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="q2">
                    <AccordionTrigger>Can I use it for any vehicle type?</AccordionTrigger>
                    <AccordionContent>Yes, simply describe the vehicle accurately in the form.</AccordionContent>
                  </AccordionItem>
                </Accordion>
                <div className="mt-4 text-center">
                  <Link href={`/${currentLocale}/faq`} className="text-sm text-primary underline">More questions? Visit our FAQ</Link>
                </div>
              </div>
            </section>
          </>
        )}

        {/* Testimonials - Rendered for all documents */}
        <div className="mt-16">
          <TrustAndTestimonialsSection />
        </div>

        {/* Sticky CTA for mobile */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t p-4 shadow-lg z-40">
          <Button size="lg" className="w-full text-base" onClick={handleStartWizard} disabled={!isHydrated}>
             {t('Start For Free', {defaultValue: 'Start For Free'})}
          </Button>
        </div>
    </main>
  );
}
