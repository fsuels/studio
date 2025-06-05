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

const HowItWorks = lazyOnView(() => import('@/components/landing/HowItWorks'), {
  placeholder: <HowItWorksSkeleton />,
});

const TrustAndTestimonialsSection = lazyOnView(
  () => import('@/components/landing/TrustAndTestimonialsSection'),
  {
    placeholder: <TestimonialsSkeleton />,
  },
);

const TopDocsChips = lazyOnView(() => import('@/components/TopDocsChips'), {
  placeholder: <TopDocsSkeleton />,
});

const AnnouncementBar = lazyOnView(() => import('@/components/AnnouncementBar'), {
  placeholder: null,
});

export default function HomePageClient() {
  const { t } = useTranslation('common');
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useParams();
  const locale = (params!.locale as 'en' | 'es') || 'en';

  const [globalSearchTerm, setGlobalSearchTerm] = useState('');
  const [selectedCategoryForFilter, setSelectedCategoryForFilter] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<LegalDocument | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

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
      const isValidCategory = CATEGORY_LIST.some((cat) => cat.key === categoryFromQuery);
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
            <h1 className="text-4xl lg:text-5xl font-bold text-[#1F2937] leading-tight">
            Your Legal Forms. Expertly Crafted.
            </h1>
            <p className="mt-6 text-lg text-gray-700 tracking-wide leading-relaxed">
            Eliminate guesswork. Create fully customized, professional legal documents in minutes.
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
          <div className="mt-10 lg:mt-0 flex justify-center lg:justify-end mx-auto lg:ml-auto lg:mr-8">
            <AutoImage
              src="/images/hero-main.png"
              alt="Hero image illustrating legal document generation"
              className="w-full max-w-lg rounded-xl shadow-lg"
              data-ai-hint="team collaboration"
              priority
            />
          </div>
        </div>
      </section>

      {/* "Popular Legal Documents" section */}
      <TopDocsChips />
      
      {/* "Generate and Personalize Legal Forms" section (formerly "How It Works") */}
      <HowItWorks />

      {/* "Trust and Testimonials" section */}
      <TrustAndTestimonialsSection />
      
      <Separator className="my-12" />

      {/* The "What do you want to accomplish?" section and its contents have been removed. */}
      {/* The PersonalizationBlock that was inside it is also removed. If it's needed elsewhere, it can be re-added. */}
    </>
  );
}
