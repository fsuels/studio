// src/app/[locale]/HomePageClient.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import type { LegalDocument } from '@/lib/document-library';
import { usStates, documentLibrary } from '@/lib/document-library';
import HomepageHeroSteps from '@/components/landing/HomepageHeroSteps';
import { AnnouncementBar } from '@/components/AnnouncementBar';
// import { Button } from '@/components/ui/button'; // No longer used directly
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react'; // Only Loader2 is used from lucide-react now
import Step1DocumentSelector, { CATEGORY_LIST } from '@/components/Step1DocumentSelector';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useRouter, useParams } from 'next/navigation';
// import { Badge } from '@/components/ui/badge'; // No longer used directly

// Basic loading component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-32">
    <Loader2 className="h-8 w-8 animate-spin" />
  </div>
);

// Dynamically import components
const HowItWorks = dynamic(() => import('@/components/landing/HowItWorks'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

const TrustAndTestimonialsSection = dynamic(() => import('@/components/landing/TrustAndTestimonialsSection'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

const GuaranteeBadge = dynamic(() => import('@/components/landing/GuaranteeBadge').then(mod => mod.GuaranteeBadge), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

const TopDocsChips = dynamic(() => import('@/components/TopDocsChips'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

const StickyFilterBar = dynamic(() => import('@/components/StickyFilterBar'), {
  loading: () => <div className="h-12" />, // Placeholder for filter bar height
  ssr: false
});

export default function HomePageClient() {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as 'en' | 'es' || 'en';

  const [globalSearchTerm, setGlobalSearchTerm] = useState('');
  const [globalSelectedState, setGlobalSelectedState] = useState<string>('');
  const [selectedCategoryForFilter, setSelectedCategoryForFilter] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<LegalDocument | null>(null);

  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const workflowSectionId = "workflow-start";

  const scrollToWorkflow = useCallback(() => {
    const section = document.getElementById(workflowSectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const docIdFromQuery = searchParams.get('docId');
    const categoryFromQuery = searchParams.get('category');
    const searchFromQuery = searchParams.get('search');

    if (searchFromQuery && !globalSearchTerm) {
        setGlobalSearchTerm(searchFromQuery);
        scrollToWorkflow();
    }

    if (categoryFromQuery && !selectedCategoryForFilter) {
        const isValidCategory = CATEGORY_LIST.some(cat => cat.key === categoryFromQuery);
        if (isValidCategory) {
            setSelectedCategoryForFilter(categoryFromQuery);
            scrollToWorkflow();
        }
    }

    if (docIdFromQuery && !selectedCategoryForFilter && !selectedDocument) {
      const foundDoc = documentLibrary.find(d => d.id === docIdFromQuery);
      if (foundDoc) {
         setSelectedCategoryForFilter(foundDoc.category);
         scrollToWorkflow();
      }
    }
  }, [searchParams, globalSearchTerm, selectedCategoryForFilter, selectedDocument, isHydrated, scrollToWorkflow]);

  const handleDocumentTypeSelect = useCallback((doc: LegalDocument) => {
    if (!isHydrated) return;
    if (doc) {
      console.log('[HomePageClient] Document type selected:', doc.name);
      setSelectedDocument(doc);
      toast({ title: t('toasts.docTypeConfirmedTitle'), description: t('toasts.docTypeConfirmedDescription', { docName: doc.name_es && locale === 'es' ? doc.name_es : doc.name }) });
      router.push(`/${locale}/docs/${doc.id}/start`);
    } else {
      console.warn(`[HomePageClient] Document selection received null or undefined doc.`);
    }
  }, [toast, t, locale, isHydrated, router]);

  const handleStartOver = useCallback(() => {
    if (!isHydrated) return;
    console.log('[HomePageClient] Starting over / resetting filters.');
    setGlobalSearchTerm('');
    setGlobalSelectedState('');
    setSelectedCategoryForFilter(null);
    setSelectedDocument(null);
    // No API error or AI suggestions to reset anymore
    scrollToWorkflow(); 
  }, [isHydrated, scrollToWorkflow]);

  const renderMainInteraction = () => {
    if (!isHydrated) {
        return <div className="text-center py-10"><Loader2 className="h-8 w-8 animate-spin mx-auto" /> <p suppressHydrationWarning>Loading...</p></div>;
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
      <HomepageHeroSteps />
      {isHydrated && <HowItWorks />}
      {isHydrated && <TrustAndTestimonialsSection />}
      {isHydrated && <GuaranteeBadge />}
      {isHydrated && <TopDocsChips />}

      <Separator className="my-12" />

      <section id={workflowSectionId} className="container mx-auto px-4 py-8 md:py-12 scroll-mt-20">
         <div className="max-w-4xl mx-auto">
            {isHydrated && <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
                {t('headline')}
            </h2>}
            {isHydrated && <p className="text-lg md:text-xl text-muted-foreground text-center mb-10">
                {t('subhead')}
            </p>}

            {isHydrated && (
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
            )}

            <div className="mt-8 bg-card p-4 sm:p-6 md:p-8 rounded-xl shadow-2xl border border-border/20">
                 <div className="mt-6">
                    {renderMainInteraction()}
                 </div>
            </div>
         </div>
      </section>
    </>
  );
}
