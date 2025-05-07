// src/components/WizardForm.tsx
'use client';

import { useFormContext } from 'react-hook-form';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ProgressSteps from './ProgressSteps';
import FieldRenderer from './FieldRenderer';
import type { LegalDocument } from '@/lib/document-library';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

interface WizardFormProps {
  locale: 'en' | 'es';
  doc: LegalDocument;
  onComplete: (checkoutUrl: string) => void; // Expects Stripe Checkout URL
}

export default function WizardForm({ locale, doc, onComplete }: WizardFormProps) {
  const methods = useFormContext(); // Get methods from FormProvider in WizardLayout
  const { t } = useTranslation();
  const { toast } = useToast();

  const steps: string[] = React.useMemo(() => {
    if (doc.questions && doc.questions.length > 0) {
      return doc.questions.map(q => q.id);
    }
    if (doc.schema && 'shape' in doc.schema && typeof doc.schema.shape === 'object' && doc.schema.shape !== null) {
      // Ensure schema.shape is not null before accessing keys
      return Object.keys(doc.schema.shape);
    }
    return [];
  }, [doc.questions, doc.schema]);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = steps.length;

  // Autosave draft to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const subscription = methods.watch((values) => {
        localStorage.setItem(`draft-${doc.id}-${locale}`, JSON.stringify(values));
      });
      return () => subscription.unsubscribe();
    }
  }, [methods, doc.id, locale]);

  const handleNextStep = async () => {
    setIsSubmitting(true); // Indicate loading for validation/submission
    const currentStepFieldKey = steps[currentStepIndex] as any; // Or provide a more specific type
    
    let isValid = true;
    if (totalSteps > 0 && currentStepFieldKey) { // Only trigger validation if there are steps/fields
        isValid = await methods.trigger(currentStepFieldKey);
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
      // Final submission logic
      try {
        const response = await axios.post(`/api/wizard/${doc.id}/submit`, {
          values: methods.getValues(),
          locale,
        });
        toast({ title: "Submission Successful", description: "Document saved, proceeding to payment." });
        localStorage.removeItem(`draft-${doc.id}-${locale}`);
        onComplete(response.data.checkoutUrl); // Pass Stripe checkout URL
      } catch (error: any) {
        console.error('Submission error:', error);
        const errorMsg = error.response?.data?.error || error.message || 'Failed to submit document.';
        toast({ title: "Submission Failed", description: errorMsg, variant: "destructive" });
        setIsSubmitting(false);
      }
      // Note: setIsSubmitting(false) is handled in the finally block of the try/catch if submission fails,
      // or after onComplete if it succeeds and redirects. If no redirect, set it here.
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
    <div>
      {totalSteps > 0 && <ProgressSteps current={currentStepIndex + 1} total={totalSteps} />}
      
      <div className="mt-6 space-y-6">
        {currentFieldKey ? (
          <FieldRenderer
            fieldKey={currentFieldKey}
            locale={locale}
            doc={doc}
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
          disabled={isSubmitting || (totalSteps === 0 && currentStepIndex > 0) } // Disable if no steps but not on first "imaginary" step
        >
          {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : 
           (currentStepIndex === totalSteps - 1 || totalSteps === 0 ? t('dynamicForm.confirmAnswersButton', 'Confirm & Pay') : t('Next'))}
        </Button>
      </div>
    </div>
  );
}
