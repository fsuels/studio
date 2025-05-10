// src/app/[locale]/HomePageClient.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import type { LegalDocument } from '@/lib/document-library';
import { usStates, documentLibrary } from '@/lib/document-library';
// import { Questionnaire } from '@/components/questionnaire'; // Questionnaire seems unused
// import { DisclaimerStep } from '@/components/disclaimer-step'; // DisclaimerStep seems unused
// import { PdfPreview } from '@/components/pdf-preview'; // PdfPreview seems unused
// import { ShareDownloadStep } from '@/components/share-download-step'; // ShareDownloadStep seems unused
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

    if (docIdFromQuery && !selectedCategoryForFilter && !selectedDocument) {
      const foundDoc = documentLibrary.find(d => d.id === docIdFromQuery);
      if (foundDoc) {
         setSelectedCategoryForFilter(foundDoc.category);
         scrollToWorkflow();
      }
    }
  }, [searchParams, globalSearchTerm, selectedCategoryForFilter, isHydrated, scrollToWorkflow]);



  // State variables for the wizard flow (potentially unused if flow is on separate pages)
  const [currentStep, setCurrentStep] = useState(1);
  // const [userInput, setUserInput] = useState<UserInput>({ description: '', state: 'CA', language: locale }); // UserInput type might be from removed document-inference
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]); // AISuggestion type might be from removed doc-type-selector
  const [selectedDocument, setSelectedDocument] = useState<LegalDocument | null>(null);
  const [formAnswers, setFormAnswers] = useState<Record<string, any>>({});
  const [disclaimerAgreed, setDisclaimerAgreed] = useState(false);
  const [pdfDataUrl, setPdfDataUrl] = useState<string | null>(null);
  const [signedPdfBlob, setSignedPdfBlob] = useState<Blob | null>(null);

  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);


  const handleAnalyze = useCallback(async (input: any /* UserInput */) => { // Replace any with UserInput if re-introduced
    if (!isHydrated) return;
    console.log('[page.tsx] handleAnalyze called with input:', input);
    // setUserInput(input);
    setIsLoadingAi(true);
    setApiError(null);
    setAiSuggestions([]);
    setSelectedDocument(null);

    try {
      const response = await fetch(`/api/infer-document-type`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg = `API Error ${response.status} (${errorData.code || 'UNKNOWN_ERROR'}): ${errorData.error || response.statusText}. ${errorData.details ? JSON.stringify(errorData.details) : ''}`;
        console.error('[handleAnalyze] API Error:', errorMsg, 'Input was:', input);
        setApiError(errorMsg);
        toast({ title: t('toasts.analysisFailedTitle'), description: errorData.error || t('toasts.analysisFailedDefault'), variant: 'destructive' });
        setAiSuggestions([{ documentType: "General Inquiry", confidence: 0, reasoning: "AI analysis failed." }]);
        setIsLoadingAi(false);
        return;
      }

      const data: { suggestions: any[] /* AISuggestion[] */ } = await response.json(); // Replace any with AISuggestion
      console.log('[page.tsx] AI suggestions received:', data.suggestions);

      if (data.suggestions && data.suggestions.length > 0) {
        setAiSuggestions(data.suggestions);
        toast({ title: t('toasts.analysisCompleteTitle'), description: t('toasts.analysisCompleteDescription') });
      } else {
        setAiSuggestions([{ documentType: "General Inquiry", confidence: 0, reasoning: "No specific suggestions found." }]);
        toast({ title: t('toasts.analysisInconclusiveTitle'), description: t('toasts.analysisInconclusiveDescription') });
      }
    } catch (error) {
      console.error('[handleAnalyze] Fetch/Network Error:', error);
      const errorMsg = `An unexpected error occurred during analysis: ${error instanceof Error ? error.message : String(error)}. Original Description: "${input.description}"`;
      setApiError(errorMsg);
      toast({ title: t('toasts.analysisFailedTitle'), description: t('toasts.networkErrorDescription'), variant: 'destructive'});
      setAiSuggestions([{ documentType: "General Inquiry", confidence: 0, reasoning: "Network or unexpected error during analysis." }]);
    } finally {
      setIsLoadingAi(false);
      setCurrentStep(1);
    }
  }, [toast, t, isHydrated]);


  const handleDocumentTypeSelect = useCallback((doc: LegalDocument) => { // Changed to accept LegalDocument object
    if (!isHydrated) return;
    if (doc) {
      console.log('[page.tsx] Document type selected:', doc.name);
      setSelectedDocument(doc);
      setFormAnswers({});
      // setCurrentStep(2); // This logic might move to router.push if wizard is on a new page
      toast({ title: t('toasts.docTypeConfirmedTitle'), description: t('toasts.docTypeConfirmedDescription', { docName: doc.name_es && locale === 'es' ? doc.name_es : doc.name }) });
      router.push(`/${locale}/docs/${doc.id}/start`); // Navigate to the wizard start page
    } else {
      console.warn(`[page.tsx] Document selection received null or undefined doc.`);
    }
  }, [toast, t, locale, isHydrated, router]);

  const handleAnswersSubmit = useCallback((answers: Record<string, any>) => {
    if (!isHydrated) return;
    console.log('[page.tsx] Answers submitted:', answers);
    setFormAnswers(answers);
    setCurrentStep(3);
    toast({ title: t('toasts.detailsRecordedTitle'), description: t('toasts.detailsRecordedDescription')});
  }, [toast, t, isHydrated]);

  const handleDisclaimerAgree = useCallback(async () => {
    if (!isHydrated) return;
    console.log('[page.tsx] Disclaimer agreed.');
    setDisclaimerAgreed(true);
    setCurrentStep(4);
    setIsLoadingPdf(true);
    setPdfDataUrl(null);

    if (!selectedDocument) {
      toast({ title: t('toasts.missingDataTitle'), description: t('toasts.missingDataDescription'), variant: "destructive" });
      setIsLoadingPdf(false);
      return;
    }

    toast({ title: t('toasts.generatingPDFTitle'), description: t('toasts.generatingPDFDescription') });
    try {
      const response = await fetch(`/api/generate-pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentType: selectedDocument.name,
          answers: formAnswers,
          // state: userInput.state, // userInput is not defined here
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `PDF Generation API Error: ${response.status}`);
      }

      const pdfBlob = await response.blob();
      const dataUrl = URL.createObjectURL(pdfBlob);
      setPdfDataUrl(dataUrl);
      setSignedPdfBlob(null);
      toast({ title: t('toasts.pdfGenSuccessTitle'), description: t('toasts.pdfGenSuccessDescription') });
    } catch (error) {
      console.error('[page.tsx] Error generating PDF:', error);
      toast({ title: t('toasts.pdfGenErrorTitle'), description: error instanceof Error ? error.message : String(error), variant: "destructive" });
    } finally {
      setIsLoadingPdf(false);
    }
  // }, [selectedDocument, formAnswers, userInput.state, toast, t, isHydrated]); // userInput.state removed
}, [selectedDocument, formAnswers, toast, t, isHydrated]);


  const handleSignSuccess = useCallback(async () => {
    if (!isHydrated) return;
    console.log('[page.tsx] PDF signing successful.');
    if (pdfDataUrl) {
        const response = await fetch(pdfDataUrl);
        const blob = await response.blob();
        setSignedPdfBlob(blob);
    }
    setCurrentStep(5);
  }, [pdfDataUrl, isHydrated]);

  const handleStartOver = useCallback(() => {
    if (!isHydrated) return;
    console.log('[page.tsx] Starting over.');
    setCurrentStep(1);
    // setUserInput({ description: '', state: 'CA', language: locale }); // UserInput not defined
    setAiSuggestions([]);
    setSelectedDocument(null);
    setFormAnswers({});
    setDisclaimerAgreed(false);
    setPdfDataUrl(null);
    setSignedPdfBlob(null);
    setIsLoadingAi(false);
    setIsLoadingPdf(false);
    setApiError(null);
    router.push(`/${locale}/#workflow-start`);
  }, [locale, router, isHydrated]);


  const renderStepContent = () => {
    if (!isHydrated) {
        return <div className="text-center py-10"><Loader2 className="h-8 w-8 animate-spin mx-auto" /> <p suppressHydrationWarning>Loading...</p></div>;
    }
    // Since the wizard flow is now primarily on /docs/[docId]/start,
    // this section might not render steps 2-5 anymore.
    // Step 1 is the main content for the homepage's interactive part.
    // return ( // Original switch commented out as flow moves to dedicated pages
    //   <Step1DocumentSelector
    //     selectedCategory={selectedCategoryForFilter}
    //     onCategorySelect={setSelectedCategoryForFilter}
    //     onDocumentSelect={handleDocumentTypeSelect}
    //     globalSelectedState={globalSelectedState}
    //     globalSearchTerm={globalSearchTerm}
    //   />
    // );
    switch (currentStep) { // Keeping for potential direct homepage interaction model, though less likely now
      case 1:
        return (
          <Step1DocumentSelector
            selectedCategory={selectedCategoryForFilter}
            onCategorySelect={setSelectedCategoryForFilter}
            onDocumentSelect={handleDocumentTypeSelect} // Changed to pass full doc object
            globalSelectedState={globalSelectedState}
            globalSearchTerm={globalSearchTerm}
          />
        );
      // Cases 2-5 would typically be on their dedicated pages now.
      // If some part of the wizard is still intended for homepage, it can be added here.
      // For example, if AI suggestions were shown directly on homepage:
      // case 1.5 (conceptual): return <DocTypeSelector suggestions={aiSuggestions} onSelect={handleDocumentTypeSelect} />;
      default:
        // Default to Step1 selector if currentStep is unexpected for homepage context
         return (
          <Step1DocumentSelector
            selectedCategory={selectedCategoryForFilter}
            onCategorySelect={setSelectedCategoryForFilter}
            onDocumentSelect={handleDocumentTypeSelect}
            globalSelectedState={globalSelectedState}
            globalSearchTerm={globalSearchTerm}
          />
        );
    }
  };

  return (
    <>
      <AnnouncementBar />
      <HomepageHeroSteps />
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
                    if (term.trim() !== '' && currentStep !== 1) {
                        handleStartOver();
                    } else if (term.trim() === '' && globalSearchTerm.trim() !== '' && currentStep !==1) {
                        handleStartOver();
                    }
                }}
                selectedState={globalSelectedState}
                onSelectedStateChange={(state) => {
                    setGlobalSelectedState(state);
                }}
              />
            )}

            <div className="mt-8 bg-card p-4 sm:p-6 md:p-8 rounded-xl shadow-2xl border border-border/20">
                 {/* ProgressStepper might be less relevant here if wizard steps are on different pages */}
                 {/* <ProgressStepper currentStep={currentStep} /> */}
                 <div className="mt-6">
                    {renderStepContent()}
                 </div>
            </div>
         </div>
      </section>
    </>
  );
}
