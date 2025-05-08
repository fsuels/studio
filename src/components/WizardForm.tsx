
// src/components/WizardForm.tsx
'use client';

import { useForm, FormProvider } from 'react-hook-form'; 
import axios, { AxiosError } from 'axios'; 
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
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';


interface WizardFormProps {
  locale: 'en' | 'es';
  doc: LegalDocument; 
  onComplete: (checkoutUrl: string) => void; 
}

export default function WizardForm({ locale, doc, onComplete }: WizardFormProps) {
  const methods = useForm({
    resolver: zodResolver(doc.schema || z.object({})), // Ensure a default schema if doc.schema is undefined
    defaultValues: {}, // Default values will be loaded from localStorage
    mode: 'onBlur',
  });
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
      const draft = localStorage.getItem(`draft-${doc.id}-${locale}`);
      if (draft) {
        try {
          methods.reset(JSON.parse(draft));
        } catch (e) {
          console.error("Failed to parse draft from localStorage", e);
          localStorage.removeItem(`draft-${doc.id}-${locale}`); 
        }
      }
    }
  }, [doc.id, locale, methods]); // methods added to dependency array as it's used in reset

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
    if (currentStepField && currentStepField.id) {
        isValid = await methods.trigger(currentStepField.id as any); 
    } else if (totalSteps > 0 && !currentStepField) {
        console.error("Error: currentStepField is undefined but totalSteps > 0. currentStepIndex:", currentStepIndex, "steps:", steps);
        isValid = false; 
    }


    if (!isValid) {
      toast({ title: "Validation Error", description: "Please correct the errors before proceeding.", variant: "destructive" });
      setIsSubmitting(false);
      return;
    }
    
    if (liveRef.current && currentStepField && currentStepField.label) { 
        setTimeout(() => {
            if (liveRef.current) liveRef.current.innerText = `${currentStepField.label} updated`;
        }, 50);
    }

    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(s => s + 1);
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsSubmitting(false);
    } else {
      // Final step: submit
      try {
        const response = await axios.post(`/${locale}/api/wizard/${doc.id}/submit`, { 
          values: methods.getValues(),
          locale, 
        });
        toast({ title: "Submission Successful", description: "Document saved, proceeding to payment." });
        if (typeof window !== 'undefined') localStorage.removeItem(`draft-${doc.id}-${locale}`);
        onComplete(response.data.checkoutUrl); 
      } catch (error: any) {
        console.error('Submission error in WizardForm:', error);
        let title = "Submission Failed";
        let description = "An unexpected error occurred. Please try again.";
        
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<any>;
          title = `API Error ${axiosError.response?.status || ''}`.trim();
          description = axiosError.response?.data?.error || axiosError.message;
          if(axiosError.response?.data?.details) {
            description += ` Details: ${typeof axiosError.response.data.details === 'string' ? axiosError.response.data.details : JSON.stringify(axiosError.response.data.details)}`;
          }
        } else if (error instanceof Error) {
          description = error.message;
        }
        
        toast({ 
          title: title, 
          description: description, 
          variant: "destructive",
          duration: 9000, 
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(s => s - 1);
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const currentField = totalSteps > 0 && currentStepIndex < totalSteps ? steps[currentStepIndex] : null;

  return (
    <FormProvider {...methods}>
      <div className="bg-white rounded-lg shadow p-8"> {/* Ensure this is styled as a card */}
        {totalSteps > 0 && <ProgressSteps current={currentStepIndex + 1} total={totalSteps} stepLabels={steps.map(s => s.label)} />}
        
        <div className="mt-6 space-y-6">
          {currentField && currentField.id ? ( 
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
          {currentStepIndex === 0 && totalSteps > 0 && <div />} 
          
          {(totalSteps > 0 || (totalSteps === 0 && currentStepIndex === 0)) && ( 
              <Button
              type="button"
              onClick={handleNextStep}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isSubmitting} 
              >
              {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : 
              (currentStepIndex === totalSteps - 1 || totalSteps === 0 ? t('dynamicForm.confirmAnswersButton', 'Confirm & Continue') : t('Next'))}
              </Button>
          )}
        </div>
        <div ref={liveRef} className="sr-only" aria-live="polite" />
      </div>
    </FormProvider>
  );
}
