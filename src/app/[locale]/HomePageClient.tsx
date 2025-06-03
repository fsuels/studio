// src/app/[locale]/HomePageClient.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { lazyOnView } from '@/components/LazyOnView';
import type { LegalDocument } from '@/lib/document-library';
import { documentLibrary } from '@/lib/document-library';
import HomepageHeroSteps from '@/components/landing/HomepageHeroSteps';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Loader2, ShieldCheck, Globe, Users } from 'lucide-react';
import { CATEGORY_LIST } from '@/components/Step1DocumentSelector';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import PersonalizationBlock from '@/components/PersonalizationBlock';
import AutoImage from '@/components/AutoImage';
import SmartAssistantBar from '@/components/SmartAssistantBar';
import LiveActivityFeed from '@/components/landing/LiveActivityFeed';

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
      <section
        className="relative overflow-hidden bg-gradient-to-r from-[#E0F7F5] to-[#FFFFFF] pt-20 pb-16"
        style={{
          backgroundPosition: 'left center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div id="morphBg" aria-hidden="true" />
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-8">
          <div className="flex-1 lg:pr-8 text-center lg:text-left">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight text-foreground font-sans">
              Your AI Legal Assistant. Documents Ready in Minutes.
            </h1>
            <p className="mt-4 text-xl text-muted-foreground font-medium">
              Answer a few questions and instantly receive lawyer-grade paperwork.
            </p>
            <SmartAssistantBar />
            <div className="mt-6 flex gap-4">
              <Button className="bg-primary text-white font-medium px-6 py-2 rounded-lg shadow hover:bg-primary/90 transition">
                Start for Free
              </Button>
              <Button variant="outline" className="border border-primary text-primary font-medium px-6 py-2 rounded-lg hover:bg-primary/10 transition">
                See 30-Second Demo
              </Button>
            </div>
            <div className="mt-4 flex items-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span>ISO 27001</span>
              </div>
              <div className="flex items-center gap-1">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span>SOC 2 Type II</span>
              </div>
              <div className="flex items-center gap-1">
                <Globe className="h-4 w-4 text-primary" />
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-primary" />
                <span>Trusted by 4M+ Users</span>
              </div>
            </div>
            <LiveActivityFeed />
          </div>
          <div className="flex-1 hidden lg:block h-96 relative">
            <AutoImage
              src="/images/hero-digital-docs.svg"
              alt="Illustration of AI generating legal documents"
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </section>

      <HomepageHeroSteps />
      <HowItWorks />
      <TrustAndTestimonialsSection />
      <FeaturedLogosSection />
      <GuaranteeBadge />
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
