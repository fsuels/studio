
// src/components/WizardForm.tsx
'use client';

import { useFormContext, FormProvider } from 'react-hook-form'; // FormProvider is not needed if methods are passed down
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ProgressSteps from './ProgressSteps';
import FieldRenderer from './FieldRenderer';
import type { LegalDocument } from '@/lib/document-library'; // Changed to LegalDocument
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

interface WizardFormProps {
  locale: 'en' | 'es';
  doc: LegalDocument; // Changed to LegalDocument
  onComplete: (checkoutUrl: string) => void; // Renamed from onDone to onComplete
}

export default function WizardForm({ locale, doc, onComplete }: WizardFormProps) {
  const methods = useFormContext(); 
  const { t } = useTranslation();
  const { toast } = useToast();

  const steps: string[] = React.useMemo(() => {
    // Prioritize 'questions' array if available, otherwise fallback to Zod schema keys
    if (doc.questions && doc.questions.length > 0) {
      return doc.questions.map(q => q.id);
    }
    // Fallback to Zod schema keys if no 'questions' array
    if (doc.schema && 'shape' in doc.schema && typeof doc.schema.shape === 'object' && doc.schema.shape !== null) {
      return Object.keys(doc.schema.shape);
    }
    return []; // Return empty array if no questions or schema shape found
  }, [doc.questions, doc.schema]);


  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = steps.length;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const subscription = methods.watch((values) => {
        localStorage.setItem(`draft-${doc.id}-${locale}`, JSON.stringify(values));
      });
      return () => subscription.unsubscribe();
    }
  }, [methods, doc.id, locale]);

  const handleNextStep = async () => {
    setIsSubmitting(true); 
    const currentStepFieldKey = totalSteps > 0 ? steps[currentStepIndex] : null;
    
    let isValid = true;
    if (currentStepFieldKey) { // Only trigger validation if there's a field for the current step
        isValid = await methods.trigger(currentStepFieldKey as any); // Cast to any if type issues
    }

    if (!isValid) {
      toast({ title: "Validation Error", description: "Please correct the errors before proceeding.", variant: "destructive" });
      setIsSubmitting(false);
      return;
    }

    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(s => s + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsSubmitting(false);
    } else {
      try {
        const response = await axios.post(`/${locale}/api/wizard/${doc.id}/submit`, { // Ensure locale is in API path
          values: methods.getValues(),
          locale, // Pass locale in body too, if needed by API
        });
        toast({ title: "Submission Successful", description: "Document saved, proceeding to payment." });
        localStorage.removeItem(`draft-${doc.id}-${locale}`);
        onComplete(response.data.checkoutUrl); 
      } catch (error: any) {
        console.error('Submission error:', error);
        const errorMsg = error.response?.data?.error || error.message || 'Failed to submit document.';
        toast({ title: "Submission Failed", description: errorMsg, variant: "destructive" });
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
  
  const currentFieldKey = totalSteps > 0 ? steps[currentStepIndex] : null;

  return (
    // FormProvider is in WizardLayout, no need to wrap again here
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      {totalSteps > 0 && <ProgressSteps current={currentStepIndex + 1} total={totalSteps} stepLabels={steps.map(s => doc.questions?.find(q=>q.id === s)?.label || s)} />}
      
      <div className="mt-6 space-y-6">
        {currentFieldKey ? (
          <FieldRenderer
            fieldKey={currentFieldKey}
            locale={locale}
            doc={doc}
            // requiresNotary is handled by useNotary hook within FieldRenderer based on stateCode
          />
        ) : (
          <p className="text-muted-foreground">{t('dynamicForm.noQuestionsNeeded')}</p>
        )}
      </div>

      <div className="mt-8 flex justify-between items-center">
        <Button
          type="button"
          variant="outline"
          onClick={handlePreviousStep}
          disabled={currentStepIndex === 0 || isSubmitting || totalSteps === 0}
        >
          {t('Back')}
        </Button>
        <Button
          type="button"
          onClick={handleNextStep}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          disabled={isSubmitting || (totalSteps === 0 && currentStepIndex > 0) }
        >
          {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : 
           (currentStepIndex === totalSteps - 1 || totalSteps === 0 ? t('dynamicForm.confirmAnswersButton', 'Confirm & Continue') : t('Next'))}
        </Button>
      </div>
    </div>
  );
}
