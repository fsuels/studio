// src/app/[locale]/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import type { LegalDocument } from '@/lib/document-library'; 
import { usStates, documentLibrary } from '@/lib/document-library'; 
import DocTypeSelector from '@/components/DocumentTypeSelector'; 
import { Questionnaire } from '@/components/questionnaire';
import { DisclaimerStep } from '@/components/disclaimer-step';
import { PdfPreview } from '@/components/pdf-preview';
import { ShareDownloadStep } from '@/components/share-download-step';
import ProgressStepper from '@/components/ProgressStepper'; 
import HomepageHeroSteps from '@/components/landing/HomepageHeroSteps'; 
// import ThreeStepSection from '@/components/landing/ThreeStepSection'; // To be replaced by HowItWorks
import HowItWorks from '@/components/landing/HowItWorks'; // New import
import TrustAndTestimonialsSection from '@/components/landing/TrustAndTestimonialsSection';
import { GuaranteeBadge } from '@/components/landing/GuaranteeBadge';
import { AnnouncementBar } from '@/components/AnnouncementBar'; // Use new name
import { Button } from '@/components/ui/button'; 
import { useToast } from '@/hooks/use-toast'; 
import { Separator } from '@/components/ui/separator';
import { FileText, FileSignature, Check, Upload, AlertTriangle, Download, ListChecks, Loader2 } from 'lucide-react'; 
import Step1DocumentSelector, { CATEGORY_LIST } from '@/components/Step1DocumentSelector'; 
import StickyFilterBar from '@/components/StickyFilterBar'; 
import { useTranslation } from 'react-i18next';
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import SearchBar from '@/components/SearchBar'; // New import
import TopDocsChips from '@/components/TopDocsChips'; // New import


export default function HomePage() {
  console.log('[page.tsx] Home component rendering...');
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as 'en' | 'es';


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
    console.log('[page.tsx] Homepage document selected:', doc.name);
    
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

  const renderHomepageContent = () => {
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
      <HomepageHeroSteps /> {/* Reduced top padding is handled within this component's style potentially or its parent's */}
       <div className="container mx-auto px-4 -mt-8 sm:-mt-4 md:mt-0 mb-8 relative z-10"> {/* Search bar positioning */}
          <SearchBar />
       </div>
      <div className="text-center -mt-2 mb-8"> 
         {isHydrated && (
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/30 px-4 py-1.5 text-sm shadow-sm">
                 {t('home.hero.pricingBadge')}
            </Badge>
         )}
      </div>
      <HowItWorks /> 
      <TrustAndTestimonialsSection />
      <GuaranteeBadge />
      <TopDocsChips />

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
                {renderHomepageContent()}
            </div>
         </div>
      </section>
    </>
  );
}
