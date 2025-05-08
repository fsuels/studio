// src/components/WizardForm.tsx
'use client';

import { useForm, FormProvider, Controller } from 'react-hook-form'; // Added Controller
import axios, { AxiosError } from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import ProgressSteps from './ProgressSteps'; // Corrected component name
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
import type { BillOfSaleData } from '@/schemas/billOfSale'; // For type assertion
// Removed direct import of AddressField as it's handled by FieldRenderer

interface WizardFormProps {
  locale: 'en' | 'es';
  doc: LegalDocument;
  onComplete: (checkoutUrl: string) => void;
}

export default function WizardForm({ locale, doc, onComplete }: WizardFormProps) {
  const { t } } from useTranslation();
  const { toast } = useToast();
  const liveRef = useRef<HTMLDivElement>(null);

  const methods = useForm<z.infer<typeof doc.schema>>({
    resolver: zodResolver(doc.schema),
    defaultValues: {}, // Default values will be loaded from localStorage
    mode: 'onBlur',
  });
  
  const { watch, getValues, trigger, setValue, reset } = methods; 

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const draft = localStorage.getItem(`draft-${doc.id}-${locale}`);
      if (draft) {
        try {
          reset(JSON.parse(draft)); // Use reset to update form values
        } catch (e) {
          console.error("Failed to parse draft from localStorage", e);
          localStorage.removeItem(`draft-${doc.id}-${locale}`);
          // Apply programmatic defaults if draft is invalid and no draft was loaded
          if (doc.id === 'bill-of-sale-vehicle') {
            reset({ sale_date: new Date() } as Partial<BillOfSaleData>);
          }
        }
      } else {
         // Apply programmatic defaults if no draft exists
        if (doc.id === 'bill-of-sale-vehicle') {
          reset({ sale_date: new Date() } as Partial<BillOfSaleData>);
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doc.id, locale, reset]); // Add reset to dependencies


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

  useAddressAutocomplete(watch, setValue);
  // useVinDecoder is called within FieldRenderer for the 'vin' field specifically
  // No need to call it directly here if FieldRenderer handles it.

  // Autosave to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const subscription = watch((values) => {
        localStorage.setItem(`draft-${doc.id}-${locale}`, JSON.stringify(values));
      });
      return () => subscription.unsubscribe();
    }
  }, [watch, doc.id, locale]);


  const handleNextStep = async () => {
    setIsSubmitting(true);
    const currentStepField = totalSteps > 0 ? steps[currentStepIndex] : null;

    let isValid = true;
    if (currentStepField && currentStepField.id) {
      isValid = await trigger(currentStepField.id as any);
    } else if (totalSteps > 0 && !currentStepField) {
      console.error("Error: currentStepField is undefined but totalSteps > 0. currentStepIndex:", currentStepIndex, "steps:", steps);
      isValid = false;
    }

    if (!isValid) {
      toast({ title: t("Validation Error"), description: t("Please correct the errors before proceeding."), variant: "destructive" });
      setIsSubmitting(false);
      return;
    }

    if (liveRef.current && currentStepField && currentStepField.label) {
      setTimeout(() => {
        if (liveRef.current) liveRef.current.innerText = `${t(currentStepField.label, currentStepField.label)} updated`;
      }, 50);
    }

    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(s => s + 1);
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Final step: submit
      try {
        const response = await axios.post(`/${locale}/api/wizard/${doc.id}/submit`, { 
          values: getValues(),
          locale, 
        });
        toast({ title: t("Submission Successful"), description: t("Document saved, proceeding to payment.") });
        if (typeof window !== 'undefined') localStorage.removeItem(`draft-${doc.id}-${locale}`);
        onComplete(response.data.checkoutUrl);
      } catch (error: any) {
        console.error('Submission error in WizardForm:', error);
        let title = t("Submission Failed");
        let description = t("An unexpected error occurred. Please try again.");

        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<any>;
          title = t(`API Error {{status}}`, { status: axiosError.response?.status || '' }).trim();
          description = axiosError.response?.data?.error || axiosError.message;
          if(axiosError.response?.data?.details) {
            const detailsString = typeof axiosError.response.data.details === 'string' 
              ? axiosError.response.data.details 
              : JSON.stringify(axiosError.response.data.details);
            description += ` ${t("Details")}: ${detailsString}`;
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
      }
    }
    setIsSubmitting(false);
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
      <div className="bg-card rounded-lg shadow-xl p-6 md:p-8 border border-border">
        {(totalSteps > 0 && currentField) && <ProgressSteps current={currentStepIndex + 1} total={totalSteps} stepLabels={steps.map(s => t(s.label, s.label))} />}

        <div className="mt-6 space-y-6 min-h-[200px]">
          {currentField && currentField.id ? (
            <FieldRenderer
              fieldKey={currentField.id}
              locale={locale}
              doc={doc}
            />
          ) : (
            <p className="text-muted-foreground text-center py-10">{t('dynamicForm.noQuestionsNeeded')}</p>
          )}
        </div>

        <div className="mt-8 flex justify-between items-center">
          {currentStepIndex > 0 && totalSteps > 0 && (
            <Button
              type="button"
              variant="outline"
              onClick={handlePreviousStep}
              disabled={isSubmitting}
              className="text-foreground border-border hover:bg-muted"
            >
              {t('Back')}
            </Button>
          )}
          {currentStepIndex === 0 && totalSteps > 0 && <div />} 

          {(totalSteps > 0 || (totalSteps === 0 && currentStepIndex === 0)) && (
            <Button
              type="button"
              onClick={handleNextStep}
              className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-[120px]"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> :
              (currentStepIndex === totalSteps - 1 || totalSteps === 0 ? t('dynamicForm.confirmAnswersButton') : t('Next'))}
            </Button>
          )}
        </div>
        <div ref={liveRef} className="sr-only" aria-live="polite" />
      </div>
    </FormProvider>
  );
}
