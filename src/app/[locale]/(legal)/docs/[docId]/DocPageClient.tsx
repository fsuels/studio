'use client';

import { notFound, useRouter, useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import React, { useEffect, useState, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { DocumentDetailProps } from '@/components/document/DocumentDetail';
import type { UpsellClause } from '@/types/documents';
import {
  Loader2,
  Star,
  ShieldCheck,
  Clock,
  RotateCcw,
  Zap,
  HelpCircle,
  Award,
  FileText,
  Edit3,
  FileSignature,
  Eye,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { track } from '@/lib/analytics';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { TooltipProvider } from '@/components/ui/tooltip';
// Load doc-specific displays on demand to avoid bloating all pages
const VehicleBillOfSaleDisplay = dynamic(
  () => import('@/components/document/docs/VehicleBillOfSaleDisplay'),
  {
    loading: () => (
      <div className="flex justify-center items-center h-24">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    ),
  },
);
const PromissoryNoteDisplay = dynamic(
  () => import('@/components/document/docs/PromissoryNoteDisplay'),
  {
    loading: () => (
      <div className="flex justify-center items-center h-24">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    ),
  },
);

// Lazy load template-specific testimonials section
const TestimonialsCarousel = dynamic(
  () => import('@/components/shared/TestimonialsCarousel'),
  {
    loading: () => (
      <div className="flex justify-center items-center h-32">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    ),
  },
);

type DocumentDetailComponent = React.ComponentType<DocumentDetailProps> & {
  preload?: () => void;
};

const DocumentDetail = dynamic(
  () => import('@/components/document/DocumentDetail'),
  {
    loading: () => (
      <div className="flex items-center justify-center border rounded-lg bg-muted p-4 aspect-[8.5/11] max-h-[500px] md:max-h-[700px] w-full shadow-lg">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Loading preview...</p>
      </div>
    ),
  },
) as DocumentDetailComponent;

interface DocMetaLite {
  id: string;
  basePrice: number;
  translations?: {
    en?: { name?: string; description?: string };
    es?: { name?: string; description?: string };
  };
  name?: string;
  description?: string;
  upsellClauses?: UpsellClause[];
}

interface DocPageClientProps {
  params: {
    locale: string;
    docId: string;
  };
  markdownContent?: string | null;
  docMeta: DocMetaLite;
  relatedDocs?: Array<{ id: string; name: string; description?: string }>;
}

// Placeholder for AI dynamic highlights
interface AiHighlightPlaceholderProps {
  text: string;
  title: string;
}
const AiHighlightPlaceholder = ({
  text,
  title,
}: AiHighlightPlaceholderProps) => (
  <span
    className="bg-primary/10 text-primary px-1 py-0.5 rounded-sm text-xs font-medium border border-primary/30 cursor-help"
    title={title}
  >
    {text} <Zap size={12} className="inline ml-1" />
  </span>
);

export default function DocPageClient({
  params: routeParams,
  markdownContent,
  docMeta,
  relatedDocs = [],
}: DocPageClientProps) {
  const { t, i18n } = useTranslation('common');
  const aiHighlightTitle = t(
    'docDetail.aiHighlightTitle',
    'AI Highlight: This section will be auto-customized based on your answers.',
  );
  const router = useRouter();
  const urlParams = (useParams() ?? {}) as Record<string, string | string[]>;

  const currentLocale = (routeParams.locale ??
    (Array.isArray(urlParams.locale)
      ? urlParams.locale[0]
      : urlParams.locale)) as 'en' | 'es';
  const docId = (routeParams.docId ??
    (Array.isArray(urlParams.docId)
      ? urlParams.docId[0]
      : urlParams.docId)) as string;

  const docConfig = useMemo(() => docMeta, [docMeta]);
  const canonicalDocId = docConfig?.id ?? docId;

  const [isLoading, setIsLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [isPricingCtaVisible, setIsPricingCtaVisible] = useState(true);
  const pricingCtaRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobileViewport(mediaQuery.matches);
    update();
    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isMobileViewport || !isPreviewOpen) {
      return;
    }
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = previous;
    };
  }, [isPreviewOpen, isMobileViewport]);

  useEffect(() => {
    const target = pricingCtaRef.current;
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsPricingCtaVisible(entry?.isIntersecting ?? false);
      },
      {
        root: null,
        threshold: 0.25,
      },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [pricingCtaRef]);

  // Preload detail + next-step route
  useEffect(() => {
    if (typeof DocumentDetail.preload === 'function') {
      DocumentDetail.preload();
    }
    if (canonicalDocId && currentLocale) {
      router.prefetch(`/${currentLocale}/docs/${canonicalDocId}/start`);
    }
  }, [router, canonicalDocId, currentLocale]);

  useEffect(() => {
    if (isHydrated) {
      if (docId) {
        if (!docConfig || docConfig.id !== docId) {
          console.error(
            `[DocPageClient] Doc config mismatch or not found for ID: ${docId}. Triggering 404.`,
          );
          notFound();
        }
      } else {
        console.error('[DocPageClient] docId is undefined. Triggering 404.');
        notFound();
      }
      setIsLoading(false);
    }
  }, [docId, docConfig, isHydrated]);

  useEffect(() => {
    if (currentLocale && i18n.language !== currentLocale && isHydrated) {
      i18n.changeLanguage(currentLocale);
    }
  }, [currentLocale, i18n, isHydrated]);

  useEffect(() => {
    if (docConfig && isHydrated) {
      track('view_item', {
        id: docConfig.id,
        name:
          currentLocale === 'es' && docConfig.translations?.es?.name
            ? docConfig.translations.es.name
            : docConfig.translations?.en?.name || docConfig.name,
        value: docConfig.basePrice || 0,
      });
    }
  }, [docConfig, currentLocale, isHydrated]);

  const handleStartWizard = () => {
    if (!docConfig || !currentLocale || !isHydrated) return;
    track('add_to_cart', {
      id: docConfig.id,
      name:
        currentLocale === 'es' && docConfig.translations?.es?.name
          ? docConfig.translations.es.name
          : docConfig.translations?.en?.name || docConfig.name,
      value: docConfig.basePrice,
    });
    router.push(`/${currentLocale}/docs/${docConfig.id}/start`);
  };

  if (!isHydrated || isLoading || !docConfig || !currentLocale) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">
          Loading document details...
        </p>
      </div>
    );
  }

  const documentDisplayName =
    currentLocale === 'es' && docConfig.translations?.es?.name
      ? docConfig.translations.es.name
      : docConfig.translations?.en?.name || docConfig.name;
  const documentDescription =
    currentLocale === 'es' && docConfig.translations?.es?.description
      ? docConfig.translations.es.description
      : docConfig.translations?.en?.description || docConfig.description;

  const benefits = [
    {
      icon: ShieldCheck,
      textKey: 'docDetail.benefit1',
      defaultText: 'Legally Sound & State-Specific',
    },
    {
      icon: Zap,
      textKey: 'docDetail.benefit2',
      defaultText: 'Quick & Easy Customization',
    },
    {
      icon: Award,
      textKey: 'docDetail.benefit3',
      defaultText: 'Instant Download & Secure Sharing',
    },
  ];

  const features = [
    {
      icon: FileText,
      titleKey: 'docDetail.feature1Title',
      descKey: 'docDetail.feature1Desc',
      defaultTitle: 'Fill your responses and complete your document',
      defaultDesc: 'Guided questions populate every field',
    },
    {
      icon: Edit3,
      titleKey: 'docDetail.feature2Title',
      descKey: 'docDetail.feature2Desc',
      defaultTitle: 'Personalize with a rich editor',
      defaultDesc: 'Make custom tweaks before finalizing',
    },
    {
      icon: FileSignature,
      titleKey: 'docDetail.feature3Title',
      descKey: 'docDetail.feature3Desc',
      defaultTitle: 'E-sign documents easily and securely',
      defaultDesc: 'Sign online and send to others',
    },
  ];

  const competitorPrice = 200;

  return (
    <TooltipProvider>
      <main className="container mx-auto px-4 pt-8 pb-12 sm:px-6 lg:px-8 lg:pt-6">
        <nav
          className="hidden text-sm mb-6 space-x-1 text-muted-foreground md:flex"
          aria-label="Breadcrumb"
        >
          <Link
            href={`/${currentLocale}`}
            className="hover:text-primary transition-colors"
          >
            {t('Home')}
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">
            {documentDisplayName}
          </span>
        </nav>

        {/* Hero Section */}
        <div className="text-center mb-10 md:mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            {documentDisplayName}
          </h1>

          <div className="mt-3 flex items-center justify-center gap-2">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Star
                  key={i}
                  className="h-5 w-5 text-yellow-400 fill-yellow-400"
                />
              ))}
            <span className="text-sm text-muted-foreground">
              (4.9 stars - 200+ reviews)
            </span>
          </div>

          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            {documentDescription}
          </p>

          <div className="mt-6 flex justify-center">
            <Button
              type="button"
              variant="outline"
              className="flex w-full max-w-xs items-center justify-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-6 py-3 text-sm font-semibold text-blue-600 shadow-sm transition-colors hover:bg-blue-100 hover:text-blue-700"
              onClick={() => {
                if (isMobileViewport) {
                  router.push(`/${currentLocale}/preview/${canonicalDocId}`);
                } else {
                  setIsPreviewOpen(true);
                }
              }}
            >
              <Eye className="h-5 w-5" />
              {t('docDetail.previewCta', {
                defaultValue: 'Preview Template',
              })}
            </Button>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3 max-w-3xl mx-auto">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-xl border border-blue-100 bg-white px-4 py-3 text-left shadow-sm"
              >
                <benefit.icon className="h-5 w-5 text-primary" />
                <span className="text-sm text-slate-700">
                  {t(benefit.textKey, benefit.defaultText)}
                </span>
              </div>
            ))}
          </div>

        </div>

        <Separator className="my-8 md:my-8" />

        <div className="space-y-6 max-w-3xl mx-auto">
          <Card className="shadow-lg border-primary" data-testid="price-sticky">
            <CardHeader>
              <CardTitle className="text-lg text-primary">
                {t('docDetail.pricingTitle', 'Transparent Pricing')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-baseline justify-between">
                <p className="text-2xl font-bold">
                  ${(docConfig?.basePrice || 0).toFixed(2)}
                </p>
                <span className="text-sm text-muted-foreground">
                  {t('pricing.perDocument', {
                    defaultValue: 'per document',
                  })}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {t('docDetail.competitivePrice', {
                  competitorPrice: competitorPrice.toFixed(2),
                  defaultValue: `Compare to typical attorney fees of $${competitorPrice.toFixed(2)}+`,
                })}
              </p>
              <ul className="mt-3 space-y-1 text-sm">
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-teal-600" />
                  {t('docDetail.attorneyApproved', 'Attorney-approved')}
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-teal-600" />
                  {t('docDetail.readyInMinutes', 'Ready in 3 minutes')}
                </li>
                <li className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4 text-teal-600" />
                  {t('docDetail.moneyBackGuarantee', '100 % money-back guarantee')}
                </li>
              </ul>
              <Button
                size="lg"
                className="w-full mt-2"
                onClick={handleStartWizard}
                disabled={!isHydrated}
                ref={pricingCtaRef}
              >
                {t('Start For Free', { defaultValue: 'Start For Free' })}
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-2 text-center">
            <p className="text-xs text-gray-500">
              <strong>104,213</strong> {t('docDetail.templatesDownloaded', 'templates downloaded this year')}
            </p>
            <div className="inline-flex items-center gap-1 text-xs text-gray-500">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              {t('docDetail.moneyBack30', '30-day money-back guarantee')}
            </div>
          </div>

          {docConfig.upsellClauses && docConfig.upsellClauses.length > 0 && (
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-md flex items-center gap-2">
                  <Zap size={18} className="text-accent" />
                  {t('docDetail.optionalAddons', 'Optional Add-ons')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {docConfig.upsellClauses.map((clause) => (
                  <div
                    key={clause.id}
                    className="text-xs flex justify-between items-center rounded-md bg-muted/50 p-2"
                  >
                    <span>
                      {currentLocale === 'es' && clause.translations?.es?.description
                        ? clause.translations.es.description
                        : clause.translations?.en?.description || clause.description}
                    </span>
                    <Badge variant="secondary">
                      +${(clause.price || 0).toFixed(2)}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-md flex items-center gap-2">
                <HelpCircle size={18} className="text-blue-500" />
                {t('docDetail.aiAssistance', 'AI Assistance')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                {t('docDetail.aiAssistP1', 'Our AI co-pilot suggests clauses, explains legal terms,')}
              </p>
              <p>
                {t('docDetail.aiAssistP2', 'and ensure your document is tailored to the')}
                <AiHighlightPlaceholder
                  text={t('docDetail.specificsOfYourSituation', 'specifics of your situation')}
                  title={aiHighlightTitle}
                /> {t('docDetail.aiAssistP3', 'as you answer questions in the next step.')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Conditional rendering */}
        {docConfig.id === 'bill-of-sale-vehicle' ? (
          <VehicleBillOfSaleDisplay locale={currentLocale as 'en' | 'es'} />
        ) : docConfig.id === 'promissory-note' ? (
          <PromissoryNoteDisplay locale={currentLocale as 'en' | 'es'} />
        ) : (
          <>
            {/* Generic features & FAQ... */}
            {/* Top features row: circular icons and concise text, on a subtle band */}
            <section className="mt-16">
              <div className="rounded-2xl bg-muted/50 p-5 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {features.map((f, i) => (
                    <div
                      key={i}
                      className="text-center"
                    >
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-background shadow ring-1 ring-black/5">
                        <f.icon className="h-5 w-5 text-primary" />
                      </div>
                      <p className="text-sm font-medium text-card-foreground">
                        {t(f.titleKey, f.defaultTitle)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* How to use: centered title with numbered pills */}
            <section className="mt-14 max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-semibold text-center text-foreground">
                {t('docDetail.howToUseTitle', 'How To Use This Template')}
              </h2>

              <ul className="mt-5 space-y-3">
                {[1, 2, 3].map((num) => (
                  <li
                    key={num}
                    className="flex items-start gap-3 text-sm text-muted-foreground"
                  >
                    <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold ring-1 ring-primary/20">
                      {num}
                    </span>
                    <span>
                      {num === 1
                        ? t(
                            'docDetail.howToStep1',
                            'Answer each question in the guided form.',
                          )
                        : num === 2
                          ? t(
                              'docDetail.howToStep2',
                              'Your document is automatically created.',
                            )
                          : t(
                              'docDetail.howToStep3',
                              'Sign and download your finished document.',
                            )}
                    </span>
                  </li>
                ))}
              </ul>

              {/* FAQ block */}
              <div className="mt-10">
                <h3 className="text-2xl font-semibold text-center text-foreground">
                  {t('docDetail.faqTitle', 'Frequently Asked Questions')}
                </h3>
                <div className="mt-4 space-y-3">
                  <Accordion type="single" collapsible className="w-full space-y-3">
                    <AccordionItem value="q1" className="rounded-xl border border-b-0 bg-card px-4 shadow-sm">
                      <AccordionTrigger className="py-4 text-left text-base hover:no-underline">
                        {t(
                          'docDetail.faq1Question',
                          'Do I need a notary for this document?',
                        )}
                      </AccordionTrigger>
                      <AccordionContent className="pt-0 text-sm text-muted-foreground">
                        {t(
                          'docDetail.faq1Answer',
                          'Requirements vary by state, but notarization can add extra authenticity.',
                        )}
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="q2" className="rounded-xl border border-b-0 bg-card px-4 shadow-sm">
                      <AccordionTrigger className="py-4 text-left text-base hover:no-underline">
                        {t(
                          'docDetail.faq2Question',
                          'Can I use it for any vehicle type?',
                        )}
                      </AccordionTrigger>
                      <AccordionContent className="pt-0 text-sm text-muted-foreground">
                        {t(
                          'docDetail.faq2Answer',
                          'Yes, simply describe the vehicle accurately in the form.',
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
                <div className="mt-4 text-center">
                  <Link
                    href={`/${currentLocale}/faq`}
                    className="text-sm text-primary hover:text-primary/80 underline"
                  >
                    {t('docDetail.moreQuestions', 'Read all our FAQ')}
                  </Link>
                </div>
              </div>
            </section>
          </>
        )}

        {/* Testimonials */}
        <div className="mt-16">
          <TestimonialsCarousel templateId={docConfig.id} />
        </div>

        {/* Related Documents Section (lightweight, server-provided) */}
        {relatedDocs.length > 0 && (
          <section className="mt-16 max-w-4xl mx-auto">
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-semibold mb-3">
                {t('Related Legal Documents', 'Related Legal Documents')}
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {relatedDocs.map((rd) => (
                  <li key={rd.id} className="border rounded-md p-3">
                    <Link
                      href={`/${currentLocale}/docs/${rd.id}`}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      {rd.name}
                    </Link>
                    {rd.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {rd.description}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Mobile CTA */}
        {isMobileViewport && !isPricingCtaVisible && (
          <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 p-4 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <Button
              size="lg"
              className="w-full text-base"
              onClick={handleStartWizard}
              disabled={!isHydrated}
            >
              {t('Start For Free', { defaultValue: 'Start For Free' })}
            </Button>
          </div>
        )}
      </main>

      {!isMobileViewport && (
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="mx-auto h-[94vh] w-[90vw] max-w-[1100px] overflow-hidden rounded-3xl border border-slate-200 bg-white px-0 pb-4 pt-6">
            <div className="flex h-full flex-col">
              <DialogHeader className="flex-shrink-0 px-8 pb-3">
                <DialogTitle className="text-lg font-semibold text-foreground text-center">
                  {t('docDetail.previewTitle', { defaultValue: 'Document Preview' })}
                </DialogTitle>
                <p className="mt-1 text-sm text-muted-foreground text-center">
                  {t('docDetail.previewSubtitleCompact', { defaultValue: 'Read-only snapshot' })}
                </p>
              </DialogHeader>
              <div className="flex-1 overflow-hidden px-6 pb-4">
                <div className="mx-auto flex h-full max-w-[820px] justify-center">
                  <div className="h-full w-full overflow-auto rounded-2xl border border-slate-200 bg-white px-6 py-6 shadow-inner">
                    <DocumentDetail
                      locale={currentLocale as 'en' | 'es'}
                      docId={canonicalDocId}
                      altText={`${documentDisplayName} preview`}
                      markdownContent={markdownContent}
                      documentDisplayName={documentDisplayName}
                      showClauseIcons={false}
                    />
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </TooltipProvider>
  );
}
