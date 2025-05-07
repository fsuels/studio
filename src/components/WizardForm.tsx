
// src/components/WizardForm.tsx
'use client';

import { useFormContext, FormProvider } from 'react-hook-form'; 
import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react'; 
import ProgressSteps from './ProgressSteps';
import FieldRenderer from './FieldRenderer';
import type { LegalDocument } from '@/lib/document-library'; 
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { prettify } from '@/lib/schema-utils'; 
import { useAddressAutocomplete, useVinDecoder } from '@/hooks/useSmartDefaults'; 

interface WizardFormProps {
  locale: 'en' | 'es';
  doc: LegalDocument; 
  onComplete: (checkoutUrl: string) => void; 
}

export default function WizardForm({ locale, doc, onComplete }: WizardFormProps) {
  const methods = useFormContext(); 
  const { t } = useTranslation();
  const { toast } = useToast();
  const liveRef = useRef<HTMLDivElement>(null); 

  const steps = React.useMemo(() => {
    if (doc.questions && doc.questions.length > 0) {
      return doc.questions.map(q => ({ id: q.id, label: q.label || prettify(q.id) }));
    }
    if (doc.schema && 'shape' in doc.schema && typeof doc.schema.shape === 'object' && doc.schema.shape !== null) {
      return Object.keys(doc.schema.shape).map(key => ({ id: key, label: prettify(key) }));
    }
    return [];
  }, [doc.questions, doc.schema]);

  const totalSteps = steps.length;
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useAddressAutocomplete(methods.watch, methods.setValue);
  useVinDecoder(methods.watch, methods.setValue);

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
    const currentStepField = totalSteps > 0 ? steps[currentStepIndex] : null;
    
    let isValid = true;
    if (currentStepField) { 
        isValid = await methods.trigger(currentStepField.id as any); 
    }

    if (!isValid) {
      toast({ title: "Validation Error", description: "Please correct the errors before proceeding.", variant: "destructive" });
      setIsSubmitting(false);
      return;
    }
    
    if (liveRef.current && currentStepField) {
        setTimeout(() => {
            if (liveRef.current) liveRef.current.innerText = `${currentStepField.label} updated`;
        }, 50);
    }

    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(s => s + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsSubmitting(false);
    } else {
      try {
        const response = await axios.post(`/${locale}/api/wizard/${doc.id}/submit`, { 
          values: methods.getValues(),
          locale, 
        });
        toast({ title: "Submission Successful", description: "Document saved, proceeding to payment." });
        localStorage.removeItem(`draft-${doc.id}-${locale}`);
        onComplete(response.data.checkoutUrl); 
      } catch (error: any) {
        console.error('Submission error:', error);
        let errorMsg = error.message || 'Failed to submit document.';
        let errorDetailsString = '';

        if (error.response && error.response.data) {
          errorMsg = error.response.data.error || errorMsg;
          if (error.response.data.details) {
            // Attempt to format Zod error details if they exist
            const details = error.response.data.details;
            if (details.formErrors && details.formErrors.length > 0) {
              errorDetailsString += `Form errors: ${details.formErrors.join(', ')}. `;
            }
            if (details.fieldErrors) {
              errorDetailsString += Object.entries(details.fieldErrors)
                .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
                .join('; ');
            }
          }
        }
        
        toast({ 
          title: "Submission Failed", 
          description: `${errorMsg}${errorDetailsString ? ` Details: ${errorDetailsString}` : ''}`, 
          variant: "destructive",
          duration: 9000, // Longer duration for detailed errors
        });
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
  
  const currentField = totalSteps > 0 ? steps[currentStepIndex] : null;

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      {totalSteps > 0 && <ProgressSteps current={currentStepIndex + 1} total={totalSteps} stepLabels={steps.map(s => s.label)} />}
      
      <div className="mt-6 space-y-6">
        {currentField ? (
          <FieldRenderer
            fieldKey={currentField.id}
            locale={locale}
            doc={doc}
          />
        ) : (
          <p className="text-muted-foreground">{t('dynamicForm.noQuestionsNeeded')}</p>
        )}
      </div>

      <div className="mt-8 flex justify-between items-center">
        {currentStepIndex > 0 && (
            <Button
            type="button"
            variant="outline"
            onClick={handlePreviousStep}
            disabled={isSubmitting || totalSteps === 0}
            className="btn-secondary" 
            >
            {t('Back')}
            </Button>
        )}
        {currentStepIndex === 0 && <div />} 
        
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
      <div ref={liveRef} className="sr-only" aria-live="polite" />
    </div>
  );
}

