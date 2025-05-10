// src/app/[locale]/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import type { LegalDocument } from '@/lib/document-library'; 
import { usStates, documentLibrary } from '@/lib/document-library'; 
// Removed DocTypeSelector and document-inference imports as Step1DocumentSelector handles initial selection
import { Questionnaire } from '@/components/questionnaire';
import { DisclaimerStep } from '@/components/disclaimer-step';
import { PdfPreview } from '@/components/pdf-preview';
import { ShareDownloadStep } from '@/components/share-download-step';
import ProgressStepper from '@/components/ProgressStepper'; 
import HomepageHeroSteps from '@/components/landing/HomepageHeroSteps'; 
import HowItWorks from '@/components/landing/HowItWorks'; 
import TrustAndTestimonialsSection from '@/components/landing/TrustAndTestimonialsSection';
import { GuaranteeBadge } from '@/components/landing/GuaranteeBadge';
import { AnnouncementBar } from '@/components/AnnouncementBar'; 
import { Button } from '@/components/ui/button'; 
import { useToast } from '@/hooks/use-toast'; 
import { Separator } from '@/components/ui/separator';
import { FileText, FileSignature, Check, Upload, AlertTriangle, Download, ListChecks, Loader2 } from 'lucide-react'; 
import Step1DocumentSelector, { CATEGORY_LIST } from '@/components/Step1DocumentSelector'; 
import StickyFilterBar from '@/components/StickyFilterBar'; 
import { useTranslation } from 'react-i18next';
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import SearchBar from '@/components/SearchBar'; 
import TopDocsChips from '@/components/TopDocsChips'; 


export default function HomePage() {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as 'en' | 'es' || 'en';


  const [globalSearchTerm, setGlobalSearchTerm] = useState('');
  const [globalSelectedState, setGlobalSelectedState] = useState<string>(''); 
  const [selectedCategoryForFilter, setSelectedCategoryForFilter] = useState<string | null>(null);
  
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

  const handleDocumentSelectFromHomepage = useCallback((doc: LegalDocument) => {
    if (!isHydrated) return;
    
    router.push(`/${locale}/docs/${doc.id}/start`);
  }, [locale, router, isHydrated]);

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

    if (docIdFromQuery && !selectedCategoryForFilter) { 
      const foundDoc = documentLibrary.find(d => d.id === docIdFromQuery);
      if (foundDoc) { 
         setSelectedCategoryForFilter(foundDoc.category);
         scrollToWorkflow();
      }
    }
  }, [searchParams, globalSearchTerm, selectedCategoryForFilter, isHydrated, scrollToWorkflow]);

  const renderStep1Selector = () => {
    if (!isHydrated) { 
        return <div className="text-center py-10"><Loader2 className="h-8 w-8 animate-spin mx-auto" /> <p suppressHydrationWarning>Loading...</p></div>;
    }
    return (
      <Step1DocumentSelector
        selectedCategory={selectedCategoryForFilter}
        onCategorySelect={setSelectedCategoryForFilter}
        onDocumentSelect={handleDocumentSelectFromHomepage} 
        globalSelectedState={globalSelectedState} 
        globalSearchTerm={globalSearchTerm}     
      />
    );
  };

  return (
    <>
      <AnnouncementBar />
      <HomepageHeroSteps /> 
      {/* SearchBar is now inside HomepageHeroSteps */}
      {/* Badge is now inside HomepageHeroSteps */}
      <HowItWorks /> 
      <TrustAndTestimonialsSection />
      <GuaranteeBadge />
      <TopDocsChips /> {/* This replaces the old category grid on the homepage main section */}

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
                onSelectedStateChange={setGlobalSelectedState}
              />
            )}

            <div className="mt-8 bg-card p-4 sm:p-6 md:p-8 rounded-xl shadow-2xl border border-border/20">
                {renderStep1Selector()} {/* This now conditionally renders TopDocsChips or the full category/doc selector based on interaction */}
            </div>
         </div>
      </section>
    </>
  );
}
