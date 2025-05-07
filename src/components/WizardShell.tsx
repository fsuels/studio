
// src/components/WizardShell.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Ensure axios is installed
import type { LegalDocument } from '@/lib/document-library'; // Using LegalDocument
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Dynamically import components that might not be needed immediately or are large
const PreviewPane = React.lazy(() => import('@/components/PreviewPane'));
const ProgressSteps = React.lazy(() => import('@/components/ProgressSteps'));
const FieldRenderer = React.lazy(() => import('@/components/FieldRenderer'));


interface WizardShellProps {
  locale: 'en' | 'es';
  doc: LegalDocument; // Changed from DocConfig to LegalDocument
  onComplete: (checkoutToken: string) => void;
}

export default function WizardShell({ locale, doc, onComplete }: WizardShellProps) {
  const { toast } = useToast();
  const formSchema = doc.schema || z.object({}); // Fallback to empty schema if not defined
  type FormData = z.infer<typeof formSchema>;

  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem(`draft-${doc.id}-${locale}`) || '{}') : {},
    mode: 'onBlur',
  });

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Assuming steps are derived from the keys of the Zod schema's shape or a predefined question order
  // For simplicity, let's use doc.questions if available, otherwise schema shape keys
  const steps: string[] = React.useMemo(() => {
    if (doc.questions && doc.questions.length > 0) {
      return doc.questions.map(q => q.id);
    }
    if (doc.schema && 'shape' in doc.schema && typeof doc.schema.shape === 'object' && doc.schema.shape !== null) {
      return Object.keys(doc.schema.shape);
    }
    return [];
  }, [doc.questions, doc.schema]);

  const totalSteps = steps.length;

  /** Autosave draft to localStorage */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const subscription = methods.watch((values) => {
        localStorage.setItem(`draft-${doc.id}-${locale}`, JSON.stringify(values));
      });
      return () => subscription.unsubscribe();
    }
  }, [methods, doc.id, locale]);

  const handleNextStep: SubmitHandler<FormData> = async (data) => {
    // This function is called by react-hook-form's handleSubmit on valid submission
    // For multi-step, we'd trigger validation for the current step's fields
    
    // Validate current step fields if applicable
    const currentStepField = steps[currentStepIndex];
    if (currentStepField) {
        const isValid = await methods.trigger(currentStepField as keyof FormData);
        if (!isValid) {
            toast({ title: "Validation Error", description: "Please correct the errors before proceeding.", variant: "destructive" });
            return;
        }
    }


    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(s => s + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // All steps valid, final submission
      setIsSubmitting(true);
      try {
        const response = await axios.post(`/api/wizard/${doc.id}/submit`, { // Using relative path, ensure API route is correctly set up
          values: methods.getValues(),
          locale,
        });
        toast({ title: "Submission Successful", description: "Document saved, proceeding to checkout." });
        onComplete(response.data.checkoutSession); // Assuming API returns checkoutSession
      } catch (error: any) {
        console.error('Submission error:', error);
        const errorMsg = error.response?.data?.error || error.message || 'Failed to submit document.';
        toast({ title: "Submission Failed", description: errorMsg, variant: "destructive" });
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(s => s - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const currentFieldKey = steps[currentStepIndex];

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleNextStep)} className="max-w-6xl mx-auto py-10 px-4">
        <div className="lg:grid lg:grid-cols-2 gap-8">
          {/* Left column: Form */}
          <div className="bg-card p-6 rounded-lg shadow-xl border border-border">
            <React.Suspense fallback={<Loader2 className="animate-spin h-8 w-8 mx-auto" />}>
              {totalSteps > 0 && <ProgressSteps current={currentStepIndex + 1} total={totalSteps} />}
            </React.Suspense>

            <div className="mt-6 space-y-6">
              <React.Suspense fallback={<div className="h-24 bg-muted rounded animate-pulse" />}>
                {currentFieldKey && (
                  <FieldRenderer
                    fieldKey={currentFieldKey}
                    locale={locale}
                    doc={doc}
                  />
                )}
                {/* Placeholder if no specific field for this step, or for general step info */}
                {!currentFieldKey && totalSteps > 0 && <p>Step {currentStepIndex + 1} content.</p>}
                {totalSteps === 0 && <p>No questions defined for this document.</p>}
              </React.Suspense>
            </div>

            <div className="mt-8 flex justify-between items-center">
              <Button
                type="button"
                variant="outline"
                onClick={handlePreviousStep}
                disabled={currentStepIndex === 0 || isSubmitting}
              >
                Previous
              </Button>
              <Button
                type="submit" // Changed to submit to trigger RHF validation
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isSubmitting || totalSteps === 0}
              >
                {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : 
                 (currentStepIndex === totalSteps - 1 ? 'Review & Pay' : 'Next')}
              </Button>
            </div>
          </div>

          {/* Right column: Live Preview */}
          <div className="mt-8 lg:mt-0 bg-card p-6 rounded-lg shadow-xl border border-border sticky top-24 self-start max-h-[calc(100vh-8rem)] overflow-y-auto">
             <h3 className="text-xl font-semibold mb-4 text-center text-card-foreground">Live Preview</h3>
            <React.Suspense fallback={<div className="h-96 bg-muted rounded animate-pulse" />}>
              <PreviewPane
                locale={locale}
                docId={doc.id}
                templatePath={locale === 'es' && doc.templatePath_es ? doc.templatePath_es : doc.templatePath}
                watch={methods.watch} // Pass watch for live updates
              />
            </React.Suspense>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
