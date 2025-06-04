// src/app/[locale]/HomePageClient.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { lazyOnView } from '@/components/LazyOnView';
import type { LegalDocument } from '@/lib/document-library';
import { documentLibrary } from '@/lib/document-library';
import HomepageHeroSteps from '@/components/landing/HomepageHeroSteps';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Loader2, Star, Info } from 'lucide-react';
import { CATEGORY_LIST } from '@/components/Step1DocumentSelector';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import PersonalizationBlock from '@/components/PersonalizationBlock';
import AutoImage from '@/components/AutoImage';
import SmartAssistantBar from '@/components/SmartAssistantBar';
import LiveActivityFeed from '@/components/landing/LiveActivityFeed';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-32">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
    <p className="ml-2 text-muted-foreground">Loading Section...</p>
  </div>
);

const HowItWorks = lazyOnView(() => import('@/components/landing/HowItWorks'), {
  placeholder: <LoadingSpinner />,
});

const TrustAndTestimonialsSection = lazyOnView(
  () => import('@/components/landing/TrustAndTestimonialsSection'),
  {
    placeholder: <LoadingSpinner />,
  },
);

const FeaturedLogosSection = lazyOnView(
  () => import('@/components/landing/FeaturedLogos').then((m) => m.FeaturedLogos),
  { placeholder: <LoadingSpinner /> },
);

const GuaranteeBadge = lazyOnView(
  () => import('@/components/landing/GuaranteeBadge').then((mod) => mod.GuaranteeBadge),
  {
    placeholder: <LoadingSpinner />,
  },
);

const UseCasesSection = lazyOnView(
  () => import('@/components/landing/UseCasesSection').then((m) => m.UseCasesSection),
  { placeholder: <LoadingSpinner /> },
);

const TopDocsChips = lazyOnView(() => import('@/components/TopDocsChips'), {
  placeholder: <LoadingSpinner />,
});

const Step1DocumentSelector = lazyOnView(
  () => import('@/components/Step1DocumentSelector').then((m) => m.default),
  { placeholder: <LoadingSpinner /> },
);

const AnnouncementBar = lazyOnView(() => import('@/components/AnnouncementBar'), {
  placeholder: null,
});

const StickyFilterBar = lazyOnView(
  () => import('@/components/StickyFilterBar'),
  { placeholder: <div className="h-16 bg-muted" /> },
);

export default function HomePageClient() {
  const { t } = useTranslation('common');
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useParams();
  const locale = (params!.locale as 'en' | 'es') || 'en';

  const [globalSearchTerm, setGlobalSearchTerm] = useState('');
  const [globalSelectedState, setGlobalSelectedState] = useState<string>('');
  const [selectedCategoryForFilter, setSelectedCategoryForFilter] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<LegalDocument | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const workflowSectionId = 'workflow-start';

  const scrollToWorkflow = useCallback(() => {
    const section = document.getElementById(workflowSectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const docIdFromQuery = searchParams!.get('docId');
    const categoryFromQuery = searchParams!.get('category');
    const searchFromQuery = searchParams!.get('search');

    if (searchFromQuery && !globalSearchTerm) {
      setGlobalSearchTerm(searchFromQuery);
      scrollToWorkflow();
    }

    if (categoryFromQuery && !selectedCategoryForFilter) {
      const isValidCategory = CATEGORY_LIST.some((cat) => cat.key === categoryFromQuery);
      if (isValidCategory) {
        setSelectedCategoryForFilter(categoryFromQuery);
        scrollToWorkflow();
      }
    }

    if (docIdFromQuery && !selectedCategoryForFilter && !selectedDocument) {
      const foundDoc = documentLibrary.find((d) => d.id === docIdFromQuery);
      if (foundDoc) {
        setSelectedCategoryForFilter(foundDoc.category);
        scrollToWorkflow();
      }
    }
  }, [searchParams, globalSearchTerm, selectedCategoryForFilter, selectedDocument, isHydrated, scrollToWorkflow]);

  const handleDocumentTypeSelect = useCallback(
    (doc: LegalDocument) => {
      if (!isHydrated) return;
      if (doc) {
        setSelectedDocument(doc);
        toast({
          title: t('toasts.docTypeConfirmedTitle'),
          description: t('toasts.docTypeConfirmedDescription', {
            docName:
              locale === 'es'
                ? doc.translations?.es?.name || doc.translations?.en?.name || doc.name
                : doc.translations?.en?.name || doc.name || doc.translations?.es?.name,
          }),
        });
        router.push(`/${locale}/docs/${doc.id}/start`);
      } else {
        console.warn('[HomePageClient] Document selection received null or undefined doc.');
      }
    },
    [toast, t, locale, isHydrated, router],
  );


  const renderMainInteraction = () => {
    if (!isHydrated) {
      return (
        <div className="text-center py-10">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p suppressHydrationWarning>{t('Loading...', { ns: 'common' })}</p>
        </div>
      );
    }
    return (
      <Step1DocumentSelector
        selectedCategory={selectedCategoryForFilter}
        onCategorySelect={setSelectedCategoryForFilter}
        onDocumentSelect={handleDocumentTypeSelect}
        globalSelectedState={globalSelectedState}
        globalSearchTerm={globalSearchTerm}
      />
    );
  };

  return (
    <>
      <AnnouncementBar />

      {/* HERO SECTION */}
      <section className="bg-white py-12 md:py-20">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          {/* Left column: Text */}
          <div className="max-w-xl mb-4">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight text-gray-900 mb-2">
              Handle Legal Documents with Confidence. In Minutes.
            </h1>
            <p className="mt-3 mb-3 text-lg text-gray-700 max-w-md">
              <span>Smart forms. Clear guidance.</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="inline h-4 w-4 ml-1 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs text-sm">
                    Our AI wizard asks you simple prompts—no legal jargon.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>{' '}
              Ready-to-sign results. Just answer a few simple questions. We'll generate ready-to-sign legal documents—no lawyer required.
            </p>
            <p className="mt-1 mb-1 text-sm text-gray-600">Trusted by startups, landlords, families</p>
            <p className="mt-1 mb-4 text-sm text-gray-600">Over 420,000 documents created and counting</p>
            <div className="mt-4 flex gap-4">
              <Button size="lg" className="bg-primary text-white">Start Free</Button>
              <Button variant="outline" size="lg">See 30-Second Demo</Button>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              <span className="inline-flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400" />
              </span>
              ·
              Over 40,000 users
              ·
              SSL Secure Checkout
            </div>
          </div>

          {/* Right column: Image */}
          <div className="flex justify-center lg:-mt-6">
            <AutoImage
              src="/images/hero-homepage.png"
              alt="People using AI legal assistant"
              width={500}
              height={400}
              className="rounded-xl shadow-md"
              priority
            />
          </div>
        </div>
      </section>

      <div className="pt-8 md:pt-12">
        <HomepageHeroSteps />
      </div>
      <HowItWorks />
      <TrustAndTestimonialsSection />
      <FeaturedLogosSection />
      <GuaranteeBadge />
      <UseCasesSection />
      <TopDocsChips />

      <Separator className="my-12" />

      <section
        id={workflowSectionId}
        className="container mx-auto px-4 py-8 md:py-12 scroll-mt-20"
      >
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground"
            suppressHydrationWarning
          >
            {t('What do you want to accomplish?', { ns: 'common' })}
          </h2>
          <p
            className="text-lg md:text-xl text-muted-foreground text-center mb-10"
            suppressHydrationWarning
          >
            {t('stepOne.categoryDescription', { ns: 'common' })}
          </p>

          {isHydrated ? (
            <StickyFilterBar
              searchTerm={globalSearchTerm}
              onSearchTermChange={(term) => {
                setGlobalSearchTerm(term);
                if (term.trim() !== '' && selectedCategoryForFilter) {
                  setSelectedCategoryForFilter(null);
                }
              }}
              selectedState={globalSelectedState}
              onSelectedStateChange={(state) => {
                setGlobalSelectedState(state);
              }}
            />
          ) : (
            <div className="h-16 bg-muted" />
          )}

          <div className="mt-8 bg-card p-4 sm:p-6 md:p-8 rounded-xl shadow-2xl border border-border/20">
            <div className="mt-6">{renderMainInteraction()}</div>
            <PersonalizationBlock />
          </div>
        </div>
      </section>
    </>
  );
}
