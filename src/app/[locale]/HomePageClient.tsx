// src/app/[locale]/HomePageClient.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import lazyOnView from '@/components/shared/media/LazyOnView';
import type { LegalDocument } from '@/lib/document-library';
import { documentLibrary } from '@/lib/document-library';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import { CATEGORY_LIST } from '@/components/workflow/Step1DocumentSelector';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import PersonalizationBlock from '@/components/PersonalizationBlock';
import { AutoImage } from '@/components/shared';
import { Skeleton } from '@/components/ui/skeleton';
import { useDiscoveryModal } from '@/contexts/DiscoveryModalContext';
import { CategoryDocumentsWidget } from '@/components/blog/InternalLinkWidget';
import { FileText, Users, Building } from 'lucide-react';
import Link from 'next/link';

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

const SearchBarSkeleton = () => (
  <div className="relative max-w-md">
    <div className="h-12 bg-muted rounded-full w-full"></div>{' '}
    {/* Input field skeleton */}
    <div className="mt-2 h-4 bg-muted rounded w-3/4"></div>{' '}
    {/* Trustline/Hint skeleton */}
  </div>
);

const SearchBar = lazyOnView(() => import('@/components/shared/SearchBar'), {
  placeholder: <SearchBarSkeleton />,
});

const HowItWorks = lazyOnView(
  () => import('@/components/layout').then((m) => ({ default: m.HowItWorks })),
  {
    placeholder: <HowItWorksSkeleton />,
  },
);

const TrustAndTestimonialsSection = lazyOnView(
  () =>
    import('@/components/layout').then((m) => ({
      default: m.TrustAndTestimonialsSection,
    })),
  {
    placeholder: <TestimonialsSkeleton />,
  },
);

const TopDocsChips = lazyOnView(
  () => import('@/components/shared/TopDocsChips'),
  {
    placeholder: <TopDocsSkeleton />,
  },
);

const AnnouncementBar = lazyOnView(
  () =>
    import('@/components/shared').then((m) => ({ default: m.AnnouncementBar })),
  {
    placeholder: null,
  },
);

export default function HomePageClient() {
  const { t } = useTranslation('common');
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useParams();
  const locale = (params!.locale as 'en' | 'es') || 'en';

  const [globalSearchTerm, setGlobalSearchTerm] = useState('');
  const [selectedCategoryForFilter, setSelectedCategoryForFilter] = useState<
    string | null
  >(null);
  const [selectedDocument, setSelectedDocument] =
    useState<LegalDocument | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [ctaVariant, setCtaVariant] = useState<'A' | 'B' | 'C'>('A');
  
  // Use global discovery modal context
  const { setShowDiscoveryModal } = useDiscoveryModal();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    // A/B Test CTA variants - only after hydration to avoid SSR mismatch
    if (!isHydrated) return;
    
    const stored = localStorage.getItem('ctaVariant');
    if (stored === 'A' || stored === 'B' || stored === 'C') {
      setCtaVariant(stored as 'A' | 'B' | 'C');
    } else {
      const variants: ('A' | 'B' | 'C')[] = ['A', 'B', 'C'];
      const chosen = variants[Math.floor(Math.random() * variants.length)];
      localStorage.setItem('ctaVariant', chosen);
      setCtaVariant(chosen);
    }
  }, [isHydrated]);

  const workflowSectionId = 'workflow-start'; // This ID is now unused as the section is removed

  const scrollToWorkflow = useCallback(() => {
    // Since the section is removed, this function might not be needed
    // or could be repurposed if there's another target section.
    // For now, it will do nothing if the element is not found.
    const section = document.getElementById(workflowSectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [workflowSectionId]);

  useEffect(() => {
    if (!isHydrated) return;

    const docIdFromQuery = searchParams!.get('docId');
    const categoryFromQuery = searchParams!.get('category');
    const searchFromQuery = searchParams!.get('search');

    if (searchFromQuery && !globalSearchTerm) {
      setGlobalSearchTerm(searchFromQuery);
      // scrollToWorkflow(); // May not be needed as section is removed
    }

    if (categoryFromQuery && !selectedCategoryForFilter) {
      const isValidCategory = CATEGORY_LIST.some(
        (cat) => cat.key === categoryFromQuery,
      );
      if (isValidCategory) {
        setSelectedCategoryForFilter(categoryFromQuery);
        // scrollToWorkflow(); // May not be needed
      }
    }

    if (docIdFromQuery && !selectedCategoryForFilter && !selectedDocument) {
      const foundDoc = documentLibrary.find((d) => d.id === docIdFromQuery);
      if (foundDoc) {
        setSelectedCategoryForFilter(foundDoc.category);
        // scrollToWorkflow(); // May not be needed
      }
    }
  }, [
    searchParams,
    globalSearchTerm,
    selectedCategoryForFilter,
    selectedDocument,
    isHydrated,
    scrollToWorkflow,
  ]);

  return (
    <>
      <AnnouncementBar />

      {/* HERO SECTION */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6 lg:grid lg:grid-cols-2 lg:gap-8 items-center">
          {/* Left column */}
          <div>
            <div className="space-y-3">
              <h1 className="text-4xl lg:text-5xl font-bold text-[#1F2937] leading-tight">
                {t('home.hero2.title', {
                  defaultValue: 'Legal Documents Made Easy:',
                })}
              </h1>
              <div className="relative inline-block">
                <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                  {t('home.hero2.subtitle2', {
                    defaultValue: 'Generate Any Form in Minutes.',
                  })}
                </h2>
                <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10 rounded-xl blur-lg -z-10"></div>
              </div>
              {isHydrated && (
                <div className="flex items-center gap-2 mt-4">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-emerald-700">Save Thousands</span>
                  </div>
                  <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-blue-700">No Legal Experience</span>
                  </div>
                  <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-purple-700">Instant Results</span>
                  </div>
                </div>
              )}
            </div>
            <p className="mt-6 text-lg text-gray-800 tracking-wide leading-relaxed">
              {t('home.hero2.subtitle', {
                defaultValue:
                  'Choose from 400+ professionally drafted templates. Save $500+ per document. Create legally binding forms in under 5 minutes—no lawyer required.',
              })}
            </p>
            
            {/* Prominent CTA Section */}
            <div className="mt-8 space-y-4">
              <div className="space-y-3">
                {/* 30-Day Money-Back Guarantee Badge */}
                <div className="flex items-center justify-start mb-2">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full shadow-sm">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="text-sm font-semibold text-green-800">
                      30-Day Money-Back Guarantee
                    </span>
                    <span className="text-xs text-green-700">
                      • No Questions Asked
                    </span>
                  </div>
                </div>
                
                {/* Main CTA Button */}
                <div className="flex justify-start">
                  <button 
                    onClick={() => setShowDiscoveryModal(true)}
                    className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden" 
                    suppressHydrationWarning
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10 flex items-center gap-2" suppressHydrationWarning>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      {!isHydrated 
                        ? t('home.hero2.cta.primary', { defaultValue: 'Generate Your First Form Free' })
                        : ctaVariant === 'A' 
                        ? t('home.hero2.cta.primary', { defaultValue: 'Generate Your First Form Free' })
                        : ctaVariant === 'B'
                        ? t('home.hero2.cta.primaryB', { defaultValue: 'Start Creating Documents' })
                        : t('home.hero2.cta.primaryC', { defaultValue: 'Create Legal Forms Now' })
                      }
                    </span>
                    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-emerald-500/20 to-blue-600/20 blur-xl"></div>
                  </button>
                </div>
              </div>
              
              {/* Trust indicators under CTA */}
              <div className="flex items-center justify-start gap-6 text-sm text-gray-700 pt-2">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Instant download</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>SSL secure</span>
                </div>
              </div>
            </div>
            {/* Trust Line */}
            <div className="mt-6">
              <p className="text-sm text-gray-700 flex items-center gap-1 flex-wrap">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Smart Legal Templates</span>
                <span className="mx-2">•</span>
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Fast & Secure</span>
                <span className="mx-2">•</span>
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Editable in Real Time</span>
              </p>
            </div>
          </div>
          {/* Right column */}
          <div className="mt-10 lg:mt-0 flex justify-center lg:justify-end mx-auto lg:ml-auto lg:mr-8">
            <AutoImage
              src={
                locale === 'es'
                  ? '/images/hero-main-es.png'
                  : '/images/hero-main.png'
              }
              alt="Hero image illustrating legal document generation"
              className="w-full max-w-lg rounded-xl shadow-lg"
              data-ai-hint="team collaboration"
              priority
            />
          </div>
        </div>
      </section>

      {/* "Generate and Personalize Legal Forms" section (formerly "How It Works") */}
      <HowItWorks />

      {/* Popular Documents by Category */}
      <TopDocsChips />


      {/* "Trust and Testimonials" section */}
      <TrustAndTestimonialsSection />

      <Separator className="my-12" />

      {/* The "What do you want to accomplish?" section and its contents have been removed. */}
      {/* The PersonalizationBlock that was inside it is also removed. If it's needed elsewhere, it can be re-added. */}
    </>
  );
}