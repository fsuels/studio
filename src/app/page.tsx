
"use client"; // Mark page as client component due to state management

import { useState } from 'react';
import type { InferDocumentTypeOutput } from '@/ai/flows/infer-document-type';
import { DocumentInference } from '@/components/document-inference';
import { Questionnaire } from '@/components/questionnaire';
import { PdfPreview } from '@/components/pdf-preview';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FileText, FileSignature } from 'lucide-react';

// Landing Page Sections
import { HeroSection } from '@/components/landing/HeroSection';
import { FeatureTeaser } from '@/components/landing/FeatureTeaser';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { TestimonialCarousel } from '@/components/landing/TestimonialCarousel';
import { FeaturedLogos } from '@/components/landing/FeaturedLogos';
import { GuaranteeBadge } from '@/components/landing/GuaranteeBadge';

// Define questionnaire icon SVG inline
const QuestionnaireIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
);


export default function Home() {
  console.log('[page.tsx] Home component rendering...');

  const [inferredDocType, setInferredDocType] = useState<string | null>(null);
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState<Record<string, any> | null>(null);
  const [pdfDataUrl, setPdfDataUrl] = useState<string | undefined>(undefined); // State for PDF URL

  // Determine current step based on state
  const getCurrentStep = () => {
    if (pdfDataUrl) return 4; // Share step implicitly after PDF generation
    if (questionnaireAnswers) return 3; // Preview step after answering questions
    if (inferredDocType) return 2; // Questionnaire step after inference
    return 1; // Initial inference step
  };
  const currentStep = getCurrentStep();

  // Callback to receive inferred document type from DocumentInference
  const handleDocumentInferred = (result: InferDocumentTypeOutput | null) => {
    console.log('[page.tsx] handleDocumentInferred called with:', result);
    setInferredDocType(result ? result.documentType : null);
    // Reset downstream state when inference changes
    setQuestionnaireAnswers(null);
    setPdfDataUrl(undefined);
  };

  // Callback to receive answers from Questionnaire
  const handleAnswersSubmit = (answers: Record<string, any>) => {
    console.log('[page.tsx] handleAnswersSubmit called with:', answers);
    setQuestionnaireAnswers(answers);
    // Simulate PDF generation based on answers
    console.log("[page.tsx] Simulating PDF generation with answers:", answers);
    setTimeout(() => {
        console.log("[page.tsx] PDF simulation complete. Setting dummy URL.");
        // In a real app, this URL would come from a PDF generation service
        setPdfDataUrl("data:application/pdf;base64,JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PgplbmRvYmoKMiAwIG9iago8PC9UeXBlL1BhZ2VzL0NvdW50IDEvS2lkc1sgMyAwIFJdPj4KZW5kb2JqCjMgMCBvYmoKPDwvVHlwZS9QYWdlL1BhcmVudCAyIDAgUi9NZWRpYUJveFswIDAgNjEyIDc5Ml0vUmVzb3VyY2VzPDwvRm9udDw8L0YxIDQgMCBSPj4+Pj4vQ29udGVudHMgNSAwIFI+PgplbmRvYmoKNSAwIG9iago8PC9MZW5ndGggNDc+PgpzdHJlYW0KQkQKMSAwIDAgMSAzMCA3NDAgVG0KL0YxIDQwIFRmCihQREVQIFNpbXVsYXRpb24pIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKNCAwIG9iago8PC9UeXBlL0ZvbnQvU3VidHlwZS9UeXBlMS9CYXNlRm9udC9IZWx2ZXRpY2E+PgplbmRvYmoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEyIDAwMDAwIG4gCjAwMDAwMDAwNjIgMDAwMDAgbiAKMDAwMDAwMDAwMCAwMDAwMCBuIAowMDAwMDAwMzMzIDAwMDAwIG4gCjAwMDAwMDAxNjIgMDAwMDAgbiAKdHJhaWxlcgo8PC9Sb290IDEgMCBSL1NpemUgNj4+CnN0YXJ0eHJlZgozODUKJSVFT0YK");
    }, 500);
  };

  return (
    <div className="flex flex-col items-center w-full bg-background">
       <HeroSection />
       <FeatureTeaser />

       {/* Trust Bar Placeholder */}
       <div className="w-full bg-muted py-4 text-center text-sm text-muted-foreground">
          Trusted by 2,000+ small businesses | ⭐⭐⭐⭐⭐ 4.8/5 stars
       </div>

        {/* Main Workflow Section */}
        <div className="w-full max-w-5xl mx-auto px-4 py-12 space-y-12">
            <HowItWorks currentStep={currentStep} />

            <div className="w-full max-w-3xl mx-auto space-y-8">
                {/* Step 1: Document Inference */}
                {currentStep === 1 && (
                    <Card className="shadow-lg rounded-lg bg-card border border-border transition-all duration-500 ease-out animate-fade-in">
                        <CardHeader>
                        <div className="flex items-center space-x-2">
                            <FileText className="h-6 w-6 text-primary" />
                            <CardTitle className="text-2xl">Step 1: Describe Your Situation</CardTitle>
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
                {currentStep > 1 && <Separator className="my-8" />}

                {/* Step 2: Dynamic Questionnaire */}
                 {currentStep >= 2 && (
                     <div className={`transition-opacity duration-500 ease-out ${currentStep === 2 ? 'opacity-100 animate-fade-in' : 'opacity-50 cursor-not-allowed'}`}>
                         <Questionnaire
                             documentType={inferredDocType}
                             onAnswersSubmit={handleAnswersSubmit}
                             // Make Questionnaire read-only if answers are submitted
                             isReadOnly={currentStep > 2}
                         />
                     </div>
                 )}
                 {/* Placeholder if step 1 not complete */}
                 {currentStep < 2 && (
                     <Card className="shadow-lg rounded-lg opacity-50 cursor-not-allowed">
                         <CardHeader>
                             <div className="flex items-center space-x-2">
                                 <QuestionnaireIcon />
                                 <CardTitle className="text-2xl">Step 2: Answer Questions</CardTitle>
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
                {currentStep > 2 && <Separator className="my-8" />}


                {/* Step 3: PDF Preview & Signing */}
                 {currentStep >= 3 && (
                     <div className={`transition-opacity duration-500 ease-out ${currentStep === 3 ? 'opacity-100 animate-fade-in' : 'opacity-50 cursor-not-allowed'}`}>
                         <PdfPreview
                             documentDataUrl={pdfDataUrl}
                             documentName={`${inferredDocType || 'document'}.pdf`}
                             // Make Preview read-only if signed or moved past
                             isReadOnly={currentStep > 3}
                         />
                     </div>
                 )}
                {/* Placeholder if step 2 not complete */}
                 {currentStep < 3 && (
                      <Card className="shadow-lg rounded-lg opacity-50 cursor-not-allowed">
                         <CardHeader>
                             <div className="flex items-center space-x-2">
                                 <FileSignature className="h-6 w-6 text-primary" />
                                 <CardTitle className="text-2xl">Step 3: Preview & Sign</CardTitle>
                             </div>
                             <CardDescription>
                                 Review the generated document and sign it digitally.
                             </CardDescription>
                         </CardHeader>
                         <CardContent>
                             <p className="text-muted-foreground italic">Complete Step 2 to generate the document preview.</p>
                         </CardContent>
                     </Card>
                 )}

                 {/* Step 4: Share & Track (Placeholder) */}
                  {currentStep >= 4 && (
                     <>
                        <Separator className="my-8" />
                        <Card className="shadow-lg rounded-lg transition-opacity duration-500 ease-out opacity-100 animate-fade-in">
                            <CardHeader>
                                <div className="flex items-center space-x-2">
                                     {/* Placeholder Icon */}
                                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
                                     <CardTitle className="text-2xl">Step 4: Share & Track</CardTitle>
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


            </div>
        </div>

        <TestimonialCarousel />
        <FeaturedLogos />
        <GuaranteeBadge />

    </div>
  );
}
