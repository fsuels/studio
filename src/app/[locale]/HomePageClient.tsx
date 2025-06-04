// src/app/[locale]/HomePageClient.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { lazyOnView } from '@/components/LazyOnView';
import type { LegalDocument } from '@/lib/document-library';
import { documentLibrary } from '@/lib/document-library';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import { CATEGORY_LIST } from '@/components/Step1DocumentSelector';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import PersonalizationBlock from '@/components/PersonalizationBlock';
import AutoImage from '@/components/AutoImage';
import SearchBar from '@/components/SearchBar';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton

// Minimal loading spinner without text
const MinimalLoadingSpinner = () => (
  <div className="flex justify-center items-center h-32">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

// Skeletons for lazy-loaded sections
const HowItWorksSkeleton = () => (
  <div className="container mx-auto px-4 py-12">
    <div className="h-8 bg-muted rounded w-1/3 mx-auto mb-8"></div>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-muted rounded-lg p-6 h-40"></div>
      ))}
    </div>
  </div>
);

const TestimonialsSkeleton = () => (
  <div className="container mx-auto px-4 py-12">
    <div className="h-8 bg-muted rounded w-1/3 mx-auto mb-8"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="bg-muted rounded-lg p-6 h-48"></div>
      ))}
    </div>
  </div>
);

const TopDocsSkeleton = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="h-8 bg-muted rounded w-1/4 mx-auto mb-6"></div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-muted rounded-lg h-16"></div>
      ))}
    </div>
  </div>
);

<<<<<<< HEAD
const StepOneExplanation = lazyOnView(
  () => import('@/components/landing/StepOneExplanation'),
  { placeholder: <LoadingSpinner /> },
);
const StepTwoExplanation = lazyOnView(
  () => import('@/components/landing/StepTwoExplanation'),
  { placeholder: <LoadingSpinner /> },
);
const StepThreeExplanation = lazyOnView(
  () => import('@/components/landing/StepThreeExplanation'),
  { placeholder: <LoadingSpinner /> },
);
=======
const HowItWorks = lazyOnView(() => import('@/components/landing/HowItWorks'), {
  placeholder: <HowItWorksSkeleton />,
});
>>>>>>> 122f303 (Just remove the sections I marked in red circle.)

const TrustAndTestimonialsSection = lazyOnView(
  () => import('@/components/landing/TrustAndTestimonialsSection'),
  {
    placeholder: <TestimonialsSkeleton />,
  },
);

const TopDocsChips = lazyOnView(() => import('@/components/TopDocsChips'), {
  placeholder: <TopDocsSkeleton />,
});

const Step1DocumentSelector = lazyOnView(
  () => import('@/components/Step1DocumentSelector').then((m) => m.default),
  { placeholder: <MinimalLoadingSpinner /> },
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
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6 lg:grid lg:grid-cols-2 lg:gap-8 items-center">
          {/* Left column */}
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 leading-tight">
              Handle Legal Documents with Confidence—in Minutes.
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Smart forms. Clear guidance. Ready-to-sign results. Just answer a few simple questions and receive lawyer-quality paperwork—no attorney required.
            </p>
            {/* Search Bar */}
            <div className="mt-8">
              <div className="relative max-w-md">
                <SearchBar />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Trusted by 4,200+ docs generated • SSL Secure Checkout • Attorney-Reviewed Templates • Trustpilot ★★★★★
              </p>
            </div>
          </div>
          {/* Right column */}
          <div className="mt-10 lg:mt-0 flex justify-center lg:justify-end">
            <AutoImage
              src="/images/hero-laptop.svg"
              alt="Contract on Laptop Illustration"
              className="w-full max-w-lg"
              data-ai-hint="legal document laptop"
            />
          </div>
        </div>
      </section>
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold text-gray-800">
            {t(
              'howItWorks.sectionTitle',
              'Create, Edit and Print Your Document in Minutes',
            )}
          </h2>
        </div>
      </section>
      <StepOneExplanation />
      <StepTwoExplanation />
      <StepThreeExplanation />
      <TrustAndTestimonialsSection />
      {/* FeaturedLogosSection removed */}
      {/* GuaranteeBadge removed */}
      {/* UseCasesSection removed */}
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
