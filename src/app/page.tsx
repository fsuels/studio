// src/app/page.tsx
"use client"; 

import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { InferDocumentTypeOutput, DocumentSuggestion } from '@/ai/flows/infer-document-type'; 
import DynamicFormRenderer from '@/components/DynamicFormRenderer';
import { formSchemas } from '@/data/formSchemas';
import { DisclaimerStep } from '@/components/disclaimer-step';
import { PdfPreview } from '@/components/pdf-preview';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FileText, FileSignature, Check, Upload, AlertTriangle, Download, ListChecks, Loader2 } from 'lucide-react'; 
import HomepageHeroSteps from '@/components/landing/HomepageHeroSteps'; 
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import TrustAndTestimonialsSection from "@/components/landing/TrustAndTestimonialsSection";
import type { LegalDocument } from '@/lib/document-library';
import ProgressStepper from '@/components/ProgressStepper'; 
import Step1DocumentSelector from '@/components/Step1DocumentSelector'; 
import StickyFilterBar from '@/components/StickyFilterBar'; // Import the new filter bar


export default function Home() {
  console.log('[page.tsx] Home component rendering...');
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const [isHydrated, setIsHydrated] = useState(false);

  // --- State Management for the New Flow ---
  const [currentStep, setCurrentStep] = useState(1); 
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  // Global filters - managed here, passed to StickyFilterBar and Step1DocumentSelector
  const [globalSearchTerm, setGlobalSearchTerm] = useState<string>('');
  const [globalSelectedState, setGlobalSelectedState] = useState<string>(''); // Empty string for "All States"

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
     if (selectedCategory && globalSelectedState && selectedDoc && currentStep === 1) {
       console.log("[page.tsx] Auto-advancing to Step 2 (Customize)");
       setCurrentStep(2);
       setTimeout(() => {
          step2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
       }, 100);
     }
   }, [selectedCategory, globalSelectedState, selectedDoc, currentStep]); 


   const handleCategorySelect = (categoryKey: string | null) => { // Allow null to reset category
       console.log(`[page.tsx] Category selected: ${categoryKey}`);
       setSelectedCategory(categoryKey);
       // setGlobalSelectedState(''); // Reset state filter when category changes - OR KEEP IT? For now, keep.
       setSelectedDoc(null); 
       setQuestionnaireAnswers(null); 
       setDisclaimerAgreed(false);
       setPdfDataUrl(undefined);
       if (!categoryKey) { // If category is reset, go back to step 1
           setCurrentStep(1);
       }
   }

   // globalSelectedState is now managed by StickyFilterBar via setGlobalSelectedState

   const handleDocumentSelect = (doc: LegalDocument) => {
       console.log(`[page.tsx] Document selected: ${doc.name}`);
       if (!globalSelectedState) {
           toast({
               title: t('State Required', {defaultValue: "State Required"}),
               description: t('Please select a state from the filter bar above before choosing a document.', {defaultValue: "Please select a state from the filter bar above before choosing a document."}),
               variant: "destructive"
           });
           return;
       }
       setSelectedDoc(doc);
       setQuestionnaireAnswers(null);
       setDisclaimerAgreed(false);
       setPdfDataUrl(undefined);
       // Auto-advance to step 2 if all conditions met
        if (selectedCategory && globalSelectedState) {
            setCurrentStep(2);
            setTimeout(() => {
                step2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
   }


  const handleAnswersSubmit = (answers: Record<string, any>) => {
    console.log('[page.tsx] Step 2 Answers Submitted:', answers);
    setQuestionnaireAnswers(answers);
    setCurrentStep(3); 
    setDisclaimerAgreed(false); 
    setPdfDataUrl(undefined); 
    toast({ title: t('toasts.detailsRecordedTitle'), description: t('toasts.detailsRecordedDescription') });
     setTimeout(() => {
       step3Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
     }, 100);
  };

  const handleDisclaimerAgree = async () => {
     console.log('[page.tsx] Step 3 Disclaimer Agreed.');
     setDisclaimerAgreed(true);
     setCurrentStep(4); 
     const docId = selectedDoc?.id;
     const docName = selectedDoc?.name || 'document';

     if (!docId || questionnaireAnswers === null) {
         toast({ title: t('toasts.missingDataTitle'), description: t('toasts.missingDataDescription'), variant: "destructive"});
         setCurrentStep(3); 
         setDisclaimerAgreed(false);
         return;
     }

      const generationToast = toast({
          title: t('toasts.generatingPDFTitle'),
          description: t('toasts.generatingPDFDescription'),
          duration: 999999, 
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
                 state: globalSelectedState, // Use globalSelectedState
             }),
         });

         generationToast.dismiss();

         if (!response.ok) {
            const errorText = await response.text();
            let errorDetails = errorText;
             try { const jsonError = JSON.parse(errorText); errorDetails = jsonError.error || errorText; } catch (e) {}
             toast({ title: t('toasts.pdfGenFailedTitle'), description: `${response.status} ${response.statusText}: ${errorDetails}`, variant: "destructive"});
             setCurrentStep(3); 
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
          setCurrentStep(3); 
          setDisclaimerAgreed(false);
     }
  }

   const handleSigningComplete = () => {
       console.log('[page.tsx] Step 4 Signing Complete.');
       setCurrentStep(5); 
        setTimeout(() => {
           step5Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
   };

   const currentFormSchema = selectedDoc?.id ? (formSchemas[selectedDoc.name] || formSchemas['default']) : [];

  if (!isHydrated) {
     return <div className="min-h-screen bg-background"> 
               <div className="h-96 animate-pulse bg-muted"></div> 
               <div className="container mx-auto py-12 space-y-8">
                 <div className="h-64 animate-pulse bg-card rounded-lg shadow-lg border border-border"></div> 
               </div>
            </div>;
  }

  return (
    <div className="flex flex-col items-center w-full bg-background">
       <HomepageHeroSteps />
        
       {/* Sticky Filter Bar */}
       <StickyFilterBar
          searchTerm={globalSearchTerm}
          onSearchTermChange={setGlobalSearchTerm}
          selectedState={globalSelectedState}
          onSelectedStateChange={setGlobalSelectedState}
       />

        <div id="workflow-start" className="w-full max-w-5xl mx-auto px-4 py-12 space-y-12">
             <ProgressStepper currentStep={currentStep} />
            <div className="w-full max-w-3xl mx-auto space-y-8">

                 <div className={`transition-opacity duration-500 ease-out ${currentStep > 1 ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'opacity-100 animate-fade-in'}`}>
                     <Step1DocumentSelector
                         selectedCategory={selectedCategory}
                         // selectedState={globalSelectedState} // Step1DocumentSelector now takes globalSelectedState from props
                         onCategorySelect={handleCategorySelect}
                         // onStateSelect is now handled by StickyFilterBar
                         onDocumentSelect={handleDocumentSelect}
                         isReadOnly={currentStep > 1} 
                         globalSearchTerm={globalSearchTerm} // Pass global search term
                         globalSelectedState={globalSelectedState} // Pass global state
                     />
                 </div>


                 <div ref={step2Ref}> 
                     {currentStep >= 2 && selectedDoc?.id ? (
                         <div className={`transition-opacity duration-500 ease-out ${currentStep === 2 ? 'opacity-100 animate-fade-in' : 'opacity-50 cursor-not-allowed'}`}>
                             <DynamicFormRenderer
                                 documentType={selectedDoc.name}
                                 schema={currentFormSchema}
                                 onSubmit={handleAnswersSubmit}
                                 isReadOnly={currentStep > 2}
                             />
                         </div>
                     ) : currentStep === 1 ? ( 
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
                    ) : null} 
                 </div>


                 <div ref={step3Ref}> 
                    {currentStep >= 3 && questionnaireAnswers !== null ? (
                         <div className={`transition-opacity duration-500 ease-out ${currentStep === 3 ? 'opacity-100 animate-fade-in' : 'opacity-50 cursor-not-allowed'}`}>
                            <DisclaimerStep
                                onAgree={handleDisclaimerAgree}
                                isReadOnly={currentStep > 3}
                            />
                         </div>
                    ) : currentStep <= 2 ? ( 
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
                    ) : null} 
                 </div>


                 <div ref={step4Ref}> 
                     {currentStep >= 4 && disclaimerAgreed ? (
                         <div className={`transition-opacity duration-500 ease-out ${currentStep === 4 ? 'opacity-100 animate-fade-in' : 'opacity-50 cursor-not-allowed'}`}>
                             <PdfPreview
                                 documentDataUrl={pdfDataUrl}
                                 documentName={`${selectedDoc?.name || 'document'}.pdf`}
                                 isReadOnly={currentStep > 4}
                                 onSigningComplete={handleSigningComplete} 
                             />
                         </div>
                     ) : currentStep <= 3 ? ( 
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
                    ) : null} 
                 </div>


                  <div ref={step5Ref}> 
                      {currentStep >= 5 && pdfDataUrl ? (
                         <Card className="shadow-lg rounded-lg transition-opacity duration-500 ease-out opacity-100 animate-fade-in bg-card border border-border">
                            <CardHeader>
                                <div className="flex items-center space-x-2">
                                     <Download className="h-6 w-6 text-primary" /> 
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
                      ) : currentStep <= 4 ? ( 
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
                      ): null} 
                  </div>

            </div>
        </div>
         <TrustAndTestimonialsSection />
    </div>
  );
}
