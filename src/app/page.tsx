// src/app/page.tsx
"use client"; // Mark page as client component due to state management and client children

import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { InferDocumentTypeOutput, DocumentSuggestion } from '@/ai/flows/infer-document-type'; // Keep if used elsewhere, otherwise remove
import DynamicFormRenderer from '@/components/DynamicFormRenderer';
import { formSchemas } from '@/data/formSchemas';
import { DisclaimerStep } from '@/components/disclaimer-step';
import { PdfPreview } from '@/components/pdf-preview';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FileText, FileSignature, Check, Upload, AlertTriangle, Download, ListChecks, Loader2 } from 'lucide-react';
import HomepageHeroSteps from '@/components/landing/HomepageHeroSteps'; // Corrected import path to landing
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import TrustAndTestimonialsSection from "@/components/landing/TrustAndTestimonialsSection";
import type { LegalDocument } from '@/lib/document-library';
import ProgressStepper from '@/components/ProgressStepper'; // Import the new stepper
import Step1DocumentSelector from '@/components/Step1DocumentSelector'; // Corrected import for Step1DocumentSelector

// Define share icon SVG inline (Removed - assuming Download/Upload icons suffice for now)

export default function Home() {
  console.log('[page.tsx] Home component rendering...');
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const [isHydrated, setIsHydrated] = useState(false);

  // --- State Management for the New Flow ---
  const [currentStep, setCurrentStep] = useState(1); // 1: Select, 2: Customize, 3: Pay/Download
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string>(''); // Mandatory after category selection
  const [selectedDoc, setSelectedDoc] = useState<LegalDocument | null>(null);
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState<Record<string, any> | null>(null);
  const [disclaimerAgreed, setDisclaimerAgreed] = useState<boolean>(false);
  const [pdfDataUrl, setPdfDataUrl] = useState<string | undefined>(undefined);

  // Refs for scrolling
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  const step4Ref = useRef<HTMLDivElement>(null);
  const step5Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

   // --- Auto-advance Logic ---
   useEffect(() => {
     if (selectedCategory && selectedState && selectedDoc && currentStep === 1) {
       console.log("[page.tsx] Auto-advancing to Step 2 (Customize)");
       setCurrentStep(2);
       // Scroll to Step 2 section after a short delay to allow rendering
       setTimeout(() => {
          step2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
       }, 100);
     }
   }, [selectedCategory, selectedState, selectedDoc, currentStep]); // Dependencies for auto-advance


   const handleCategorySelect = (categoryKey: string) => {
       console.log(`[page.tsx] Category selected: ${categoryKey}`);
       setSelectedCategory(categoryKey);
       setSelectedState(''); // Reset state when category changes
       setSelectedDoc(null); // Reset doc when category changes
       setQuestionnaireAnswers(null); // Reset subsequent steps
       setDisclaimerAgreed(false);
       setPdfDataUrl(undefined);
       // Don't change currentStep here, wait for state and doc selection
   }

   const handleStateSelect = (stateCode: string) => {
        console.log(`[page.tsx] State selected: ${stateCode}`);
        setSelectedState(stateCode);
        setSelectedDoc(null); // Reset doc if state changes after category
        setQuestionnaireAnswers(null); // Reset subsequent steps
        setDisclaimerAgreed(false);
        setPdfDataUrl(undefined);
        // Don't change currentStep here, wait for doc selection
   }

   const handleDocumentSelect = (doc: LegalDocument) => {
       console.log(`[page.tsx] Document selected: ${doc.name}`);
       setSelectedDoc(doc);
       // Auto-advance is handled by the useEffect hook
       // Reset subsequent steps (redundant if already done in category/state change, but safe)
       setQuestionnaireAnswers(null);
       setDisclaimerAgreed(false);
       setPdfDataUrl(undefined);
   }


  // --- Submission Handlers for Subsequent Steps ---

  const handleAnswersSubmit = (answers: Record<string, any>) => {
    console.log('[page.tsx] Step 2 Answers Submitted:', answers);
    setQuestionnaireAnswers(answers);
    setCurrentStep(3); // Advance to Disclaimer step
    setDisclaimerAgreed(false); // Ensure disclaimer needs re-agreement
    setPdfDataUrl(undefined); // Clear any previous PDF
    toast({ title: t('toasts.detailsRecordedTitle'), description: t('toasts.detailsRecordedDescription') });
     setTimeout(() => {
       step3Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
     }, 100);
  };

  const handleDisclaimerAgree = async () => {
     console.log('[page.tsx] Step 3 Disclaimer Agreed.');
     setDisclaimerAgreed(true);
     setCurrentStep(4); // Advance to PDF Preview step
     const docId = selectedDoc?.id;
     const docName = selectedDoc?.name || 'document';

     if (!docId || questionnaireAnswers === null) {
         toast({ title: t('toasts.missingDataTitle'), description: t('toasts.missingDataDescription'), variant: "destructive"});
         setCurrentStep(3); // Revert step
         setDisclaimerAgreed(false);
         return;
     }

      const generationToast = toast({
          title: t('toasts.generatingPDFTitle'),
          description: t('toasts.generatingPDFDescription'),
          duration: 999999, // Keep open until dismissed
      });

      setTimeout(() => {
       step4Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
     }, 100);

     try {
         const response = await fetch('/api/generate-pdf', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({
                 documentType: docName,
                 answers: questionnaireAnswers,
                 state: selectedState,
             }),
         });

         generationToast.dismiss();

         if (!response.ok) {
            const errorText = await response.text();
            let errorDetails = errorText;
             try { const jsonError = JSON.parse(errorText); errorDetails = jsonError.error || errorText; } catch (e) {}
             toast({ title: t('toasts.pdfGenFailedTitle'), description: `${response.status} ${response.statusText}: ${errorDetails}`, variant: "destructive"});
             setCurrentStep(3); // Revert step
             setDisclaimerAgreed(false);
             return;
         }

         const blob = await response.blob();
         const dataUrl = await new Promise<string>((resolve, reject) => {
             const reader = new FileReader();
             reader.onloadend = () => resolve(reader.result as string);
             reader.onerror = reject;
             reader.readAsDataURL(blob);
         });

         setPdfDataUrl(dataUrl);
         toast({ title: t('toasts.pdfGenSuccessTitle'), description: t('toasts.pdfGenSuccessDescription') });

     } catch (error: any) {
          generationToast.dismiss();
          console.error("[page.tsx] Error during PDF generation fetch:", error);
          toast({ title: t('toasts.pdfGenErrorTitle'), description: `An unexpected error occurred: ${error.message || error}`, variant: "destructive"});
          setCurrentStep(3); // Revert step
          setDisclaimerAgreed(false);
     }
  }

   // Handler for PDF signing completion (moves to Step 5)
   const handleSigningComplete = () => {
       console.log('[page.tsx] Step 4 Signing Complete.');
       setCurrentStep(5); // Advance to Share/Download step
        setTimeout(() => {
           step5Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
   };

  // Get the relevant form schema for the selected document
   const currentFormSchema = selectedDoc?.id ? (formSchemas[selectedDoc.name] || formSchemas['default']) : [];

  // Render placeholder or null during SSR and initial client render
  if (!isHydrated) {
     return <div className="min-h-screen bg-background"> {/* Basic layout structure */}
               <div className="h-96 animate-pulse bg-muted"></div> {/* Hero placeholder */}
               <div className="container mx-auto py-12 space-y-8">
                 <div className="h-64 animate-pulse bg-card rounded-lg shadow-lg border border-border"></div> {/* Step 1 placeholder */}
               </div>
            </div>;
  }

  return (
    <div className="flex flex-col items-center w-full bg-background">
       <HomepageHeroSteps />

        {/* Main Workflow Section */}
        <div id="workflow-start" className="w-full max-w-5xl mx-auto px-4 py-12 space-y-12">

             {/* Progress Stepper */}
             <ProgressStepper currentStep={currentStep} />

            {/* Step Panels Wrapper */}
            <div className="w-full max-w-3xl mx-auto space-y-8">

                {/* --- Step 1: Category / State / Document Selection --- */}
                 {/* Step 1 is always potentially visible, but gets overlaid/disabled */}
                 <div className={`transition-opacity duration-500 ease-out ${currentStep > 1 ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'opacity-100 animate-fade-in'}`}>
                     <Step1DocumentSelector
                         selectedCategory={selectedCategory}
                         selectedState={selectedState}
                         onCategorySelect={handleCategorySelect}
                         onStateSelect={handleStateSelect}
                         onDocumentSelect={handleDocumentSelect}
                         isReadOnly={currentStep > 1} // Make read-only if past step 1
                     />
                 </div>


                {/* --- Step 2: Dynamic Form Renderer --- */}
                 <div ref={step2Ref}> {/* Add ref for scrolling */}
                     {currentStep >= 2 && selectedDoc?.id ? (
                         <div className={`transition-opacity duration-500 ease-out ${currentStep === 2 ? 'opacity-100 animate-fade-in' : 'opacity-50 cursor-not-allowed'}`}>
                             <DynamicFormRenderer
                                 documentType={selectedDoc.name}
                                 schema={currentFormSchema}
                                 onSubmit={handleAnswersSubmit}
                                 isReadOnly={currentStep > 2}
                             />
                         </div>
                     ) : currentStep === 1 ? ( // Show placeholder only if step 1 is active but doc not selected
                        <Card className="shadow-lg rounded-lg opacity-50 cursor-not-allowed bg-card border border-border">
                             <CardHeader>
                                 <div className="flex items-center space-x-2">
                                     <ListChecks className="h-6 w-6 text-muted-foreground" />
                                     <CardTitle className="text-2xl text-muted-foreground">{t('Step 2: Provide Details')}</CardTitle>
                                 </div>
                                 <CardDescription className="text-muted-foreground">
                                     {t('Confirm a document type in Step 1 to see the questions.')}
                                 </CardDescription>
                             </CardHeader>
                             <CardContent>
                                 <p className="text-muted-foreground italic">{t('Waiting for document confirmation from Step 1...')}</p>
                             </CardContent>
                         </Card>
                    ) : null} {/* Don't show placeholder if past step 2 */}
                 </div>


                {/* --- Step 3: Disclaimer --- */}
                 <div ref={step3Ref}> {/* Add ref for scrolling */}
                    {currentStep >= 3 && questionnaireAnswers !== null ? (
                         <div className={`transition-opacity duration-500 ease-out ${currentStep === 3 ? 'opacity-100 animate-fade-in' : 'opacity-50 cursor-not-allowed'}`}>
                            <DisclaimerStep
                                onAgree={handleDisclaimerAgree}
                                isReadOnly={currentStep > 3}
                            />
                         </div>
                    ) : currentStep <= 2 ? ( // Show placeholder only if before step 3
                        <Card className="shadow-lg rounded-lg opacity-50 cursor-not-allowed bg-card border border-border">
                             <CardHeader>
                                 <div className="flex items-center space-x-2">
                                     <AlertTriangle className="h-6 w-6 text-muted-foreground" />
                                     <CardTitle className="text-2xl text-muted-foreground">{t('disclaimerStep.stepTitle')}</CardTitle>
                                 </div>
                                 <CardDescription className="text-muted-foreground">
                                     {t('Read and agree to the disclaimer before proceeding.')}
                                 </CardDescription>
                             </CardHeader>
                             <CardContent>
                                 <p className="text-muted-foreground italic">{t('Complete the questions above to view the disclaimer.')}</p>
                             </CardContent>
                         </Card>
                    ) : null} {/* Don't show placeholder if past step 3 */}
                 </div>


                 {/* --- Step 4: PDF Preview & Signing --- */}
                 <div ref={step4Ref}> {/* Add ref for scrolling */}
                     {currentStep >= 4 && disclaimerAgreed ? (
                         <div className={`transition-opacity duration-500 ease-out ${currentStep === 4 ? 'opacity-100 animate-fade-in' : 'opacity-50 cursor-not-allowed'}`}>
                             <PdfPreview
                                 documentDataUrl={pdfDataUrl}
                                 documentName={`${selectedDoc?.name || 'document'}.pdf`}
                                 isReadOnly={currentStep > 4}
                                 onSigningComplete={handleSigningComplete} // Pass the handler
                             />
                         </div>
                     ) : currentStep <= 3 ? ( // Show placeholder only if before step 4
                          <Card className="shadow-lg rounded-lg opacity-50 cursor-not-allowed bg-card border border-border">
                             <CardHeader>
                                 <div className="flex items-center space-x-2">
                                     <FileSignature className="h-6 w-6 text-muted-foreground" />
                                     <CardTitle className="text-2xl text-muted-foreground">{t('pdfPreview.stepTitle')}</CardTitle>
                                 </div>
                                 <CardDescription className="text-muted-foreground">
                                     {t('Review the generated document and sign it digitally.')}
                                 </CardDescription>
                             </CardHeader>
                             <CardContent>
                                 <p className="text-muted-foreground italic">{t('Agree to the disclaimer above to generate the document preview.')}</p>
                             </CardContent>
                         </Card>
                    ) : null} {/* Don't show placeholder if past step 4 */}
                 </div>


                 {/* --- Step 5: Share & Download --- */}
                  <div ref={step5Ref}> {/* Add ref for scrolling */}
                      {currentStep >= 5 && pdfDataUrl ? (
                         <Card className="shadow-lg rounded-lg transition-opacity duration-500 ease-out opacity-100 animate-fade-in bg-card border border-border">
                            <CardHeader>
                                <div className="flex items-center space-x-2">
                                     <Download className="h-6 w-6 text-primary" /> {/* Changed icon */}
                                     <CardTitle className="text-2xl">{t('shareDownloadStep.stepTitle')}</CardTitle>
                                </div>
                                <CardDescription>
                                   {t('shareDownloadStep.description')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground mb-4">{t('shareDownloadStep.actionsPlaceholder')}</p>
                                <div className="flex space-x-4">
                                    <Button disabled variant="outline"> <Upload className="mr-2 h-4 w-4" /> {t('shareDownloadStep.shareButton')}</Button>
                                    <Button
                                      onClick={() => {
                                           if (pdfDataUrl) {
                                               const link = document.createElement('a');
                                               link.href = pdfDataUrl;
                                               link.download = `${selectedDoc?.name || 'document'}_signed.pdf`;
                                               document.body.appendChild(link);
                                               link.click();
                                               document.body.removeChild(link);
                                           }
                                       }}
                                       disabled={!pdfDataUrl}
                                    >
                                        <Download className="mr-2 h-4 w-4" /> {t('shareDownloadStep.downloadButton')}
                                     </Button>
                                </div>
                            </CardContent>
                        </Card>
                      ) : currentStep <= 4 ? ( // Show placeholder only if before step 5
                         <Card className="shadow-lg rounded-lg opacity-50 cursor-not-allowed bg-card border border-border">
                               <CardHeader>
                                   <div className="flex items-center space-x-2">
                                       <Download className="h-6 w-6 text-muted-foreground" />
                                       <CardTitle className="text-2xl text-muted-foreground">{t('shareDownloadStep.stepTitle')}</CardTitle>
                                   </div>
                                   <CardDescription className="text-muted-foreground">
                                      {t('Securely share your document or download it after signing.')}
                                   </CardDescription>
                               </CardHeader>
                               <CardContent>
                                   <p className="text-muted-foreground italic">{t('shareDownloadStep.disabledDescription')}</p>
                               </CardContent>
                           </Card>
                      ): null} {/* Don't show placeholder if past step 5 */}
                  </div>

            </div>
        </div>

        {/* Footer Sections */}
         <TrustAndTestimonialsSection />
    </div>
  );
}


// Define SpeechRecognition types if not available globally (common issue)
// Removed - No longer needed as StepOneInput is gone
// declare global { ... }

