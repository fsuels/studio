
"use client"; // Mark page as client component due to state management and client children

import { useState, useEffect } from 'react'; // Ensure useEffect is imported if used elsewhere
import type { InferDocumentTypeOutput } from '@/ai/flows/infer-document-type';
import { DocumentInference } from '@/components/document-inference';
import { Questionnaire } from '@/components/questionnaire';
import { PdfPreview } from '@/components/pdf-preview';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FileText, FileSignature, Check, Upload } from 'lucide-react'; // Added Check, Upload icons

// Landing Page Sections
import { HeroSection } from '@/components/landing/HeroSection';
import { FeatureTeaser } from '@/components/landing/FeatureTeaser';
import ThreeStepSection from '@/components/ThreeStepSection';
import { TestimonialCarousel } from '@/components/landing/TestimonialCarousel';
import { FeaturedLogos } from '@/components/landing/FeaturedLogos';
import { GuaranteeBadge } from '@/components/landing/GuaranteeBadge';


// Define questionnaire icon SVG inline
const QuestionnaireIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
);

// Define share icon SVG inline
const ShareIcon = () => (
   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
);


export default function Home() {
  console.log('[page.tsx] Home component rendering...');

  const [inferredDocType, setInferredDocType] = useState<string | null>(null);
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState<Record<string, any> | null>(null);
  const [pdfDataUrl, setPdfDataUrl] = useState<string | undefined>(undefined);

  // Determine current step based on state
  const getCurrentStep = () => {
    if (pdfDataUrl) return 4;
    if (questionnaireAnswers) return 3;
    if (inferredDocType) return 2;
    return 1;
  };
  const currentStep = getCurrentStep();

  const handleDocumentInferred = (result: InferDocumentTypeOutput | null) => {
    console.log('[page.tsx] handleDocumentInferred called with:', result);
    setInferredDocType(result ? result.documentType : null);
    setQuestionnaireAnswers(null);
    setPdfDataUrl(undefined);
  };

  const handleAnswersSubmit = (answers: Record<string, any>) => {
    console.log('[page.tsx] handleAnswersSubmit called with:', answers);
    setQuestionnaireAnswers(answers);
    console.log("[page.tsx] Simulating PDF generation with answers:", answers);
    setTimeout(() => {
        console.log("[page.tsx] PDF simulation complete. Setting dummy URL.");
        setPdfDataUrl("data:application/pdf;base64,JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PgplbmRvYmoKMiAwIG9iago8PC9UeXBlL1BhZ2VzL0NvdW50IDEvS2lkc1sgMyAwIFJdPj4KZW5kb2JqCjMgMCBvYmoKPDwvVHlwZS9QYWdlL1BhcmVudCAyIDAgUi9NZWRpYUJveFswIDAgNjEyIDc5Ml0vUmVzb3VyY2VzPDwvRm9udDw8L0YxIDQgMCBSPj4+Pj4vQ29udGVudHMgNSAwIFI+PgplbmRvYmoKNSAwIG9iago8PC9MZW5ndGggNDc+PgpzdHJlYW0KQkQKMSAwIDAgMSAzMCA3NDAgVG0KL0YxIDQwIFRmCihQREVQIFNpbXVsYXRpb24pIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKNCAwIG9iago8PC9UeXBlL0ZvbnQvU3VidHlwZS9UeXBlMS9CYXNlRm9udC9IZWx2ZXRpY2E+PgplbmRvYmoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEyIDAwMDAwIG4gCjAwMDAwMDAwNjIgMDAwMDAgbiAKMDAwMDAwMDAwMCAwMDAwMCBuIAowMDAwMDAwMzMzIDAwMDAwIG4gCjAwMDAwMDAxNjIgMDAwMDAgbiAKdHJhaWxlcgo8PC9Sb290IDEgMCBSL1NpemUgNj4KCnN0YXJ0eHJlZgozODUKJSVFT0YK");
    }, 500);
  };

  return (
    <div className="flex flex-col items-center w-full bg-background">
       <HeroSection />
       <FeatureTeaser />
       {/* Render How It Works section with numbered circles */}
       <ThreeStepSection />

        {/* Main Workflow Section - Wrapper with padding */}
        <div className="w-full max-w-5xl mx-auto px-4 py-12 space-y-12">
            {/* Horizontal Progress Bar (Optional visual aid) */}
             {/* Removed the horizontal progress bar to rely solely on ThreeStepSection */}
             {/* <HowItWorks currentStep={currentStep} /> */}

            {/* Step Panels Wrapper - Use max-w-3xl for better focus */}
            <div className="w-full max-w-3xl mx-auto space-y-8">
                {/* Step 1: Document Inference */}
                {currentStep === 1 && (
                    <Card className="shadow-lg rounded-lg bg-card border border-border transition-all duration-500 ease-out animate-fade-in">
                        <CardHeader>
                        <div className="flex items-center space-x-2">
                            <FileText className="h-6 w-6 text-primary" />
                            <CardTitle className="text-2xl">Start Here: Describe Your Situation</CardTitle>
                        </div>
                        <CardDescription>
                           Use the text box or microphone below. Our AI will suggest the best document type.
                        </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DocumentInference onInferenceResult={handleDocumentInferred} />
                        </CardContent>
                    </Card>
                )}

                {/* Separator between steps */}
                {currentStep > 1 && inferredDocType && (
                     <Separator className="my-8" />
                 )}

                {/* Step 2: Dynamic Questionnaire */}
                 {currentStep >= 2 && inferredDocType && (
                     <div className={`transition-opacity duration-500 ease-out ${currentStep === 2 ? 'opacity-100 animate-fade-in' : 'opacity-50 cursor-not-allowed'}`}>
                         <Questionnaire
                             documentType={inferredDocType}
                             onAnswersSubmit={handleAnswersSubmit}
                             isReadOnly={currentStep > 2}
                         />
                     </div>
                 )}
                 {currentStep < 2 && (
                     <Card className="shadow-lg rounded-lg opacity-50 cursor-not-allowed bg-card border border-border">
                         <CardHeader>
                             <div className="flex items-center space-x-2">
                                 <QuestionnaireIcon />
                                 <CardTitle className="text-2xl">Next: Answer Questions</CardTitle>
                             </div>
                             <CardDescription>
                                 Once a document type is inferred, answer questions here.
                             </CardDescription>
                         </CardHeader>
                         <CardContent>
                             <p className="text-muted-foreground italic">Waiting for document type from Step 1...</p>
                         </CardContent>
                     </Card>
                 )}

                {/* Separator between steps */}
                 {currentStep > 2 && questionnaireAnswers && (
                    <Separator className="my-8" />
                 )}


                {/* Step 3: PDF Preview & Signing */}
                 {currentStep >= 3 && questionnaireAnswers && (
                     <div className={`transition-opacity duration-500 ease-out ${currentStep === 3 ? 'opacity-100 animate-fade-in' : 'opacity-50 cursor-not-allowed'}`}>
                         <PdfPreview
                             documentDataUrl={pdfDataUrl}
                             documentName={`${inferredDocType || 'document'}.pdf`}
                             isReadOnly={currentStep > 3}
                         />
                     </div>
                 )}
                 {currentStep < 3 && (
                      <Card className="shadow-lg rounded-lg opacity-50 cursor-not-allowed bg-card border border-border">
                         <CardHeader>
                             <div className="flex items-center space-x-2">
                                 <FileSignature className="h-6 w-6 text-primary" />
                                 <CardTitle className="text-2xl">Then: Preview & Sign</CardTitle>
                             </div>
                             <CardDescription>
                                 Review the generated document and sign it digitally.
                             </CardDescription>
                         </CardHeader>
                         <CardContent>
                             <p className="text-muted-foreground italic">Complete the questions above to generate the document preview.</p>
                         </CardContent>
                     </Card>
                 )}

                 {/* Step 4: Share & Track */}
                  {currentStep >= 4 && pdfDataUrl && (
                     <>
                        <Separator className="my-8" />
                        <Card className="shadow-lg rounded-lg transition-opacity duration-500 ease-out opacity-100 animate-fade-in bg-card border border-border">
                            <CardHeader>
                                <div className="flex items-center space-x-2">
                                     <ShareIcon />
                                     <CardTitle className="text-2xl">Finally: Share & Track</CardTitle>
                                </div>
                                <CardDescription>
                                   Your document is ready! Share it securely or download it.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground italic">Sharing and tracking features coming soon...</p>
                                {/* Add download/sharing buttons here */}
                            </CardContent>
                        </Card>
                     </>
                  )}
                  {currentStep < 4 && (
                     <Card className="shadow-lg rounded-lg opacity-50 cursor-not-allowed bg-card border border-border">
                           <CardHeader>
                               <div className="flex items-center space-x-2">
                                   <ShareIcon />
                                   <CardTitle className="text-2xl">Finally: Share & Track</CardTitle>
                               </div>
                               <CardDescription>
                                  Securely share your document or track its status.
                               </CardDescription>
                           </CardHeader>
                           <CardContent>
                               <p className="text-muted-foreground italic">Sign the document above to enable sharing.</p>
                           </CardContent>
                       </Card>
                  )}


            </div>
        </div>

        {/* Footer Sections */}
        <TestimonialCarousel />
        <FeaturedLogos />
        <GuaranteeBadge />

    </div>
  );
}
