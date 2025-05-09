// src/components/WizardForm.tsx
'use client';

import { useForm, FormProvider, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { Progress } from '@/components/ui/progress';
import FieldRenderer from './FieldRenderer';
import type { LegalDocument } from '@/lib/document-library';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { prettify } from '@/lib/schema-utils';
import { z } from 'zod';
import AuthModal from '@/components/AuthModal';
import { useAuth } from '@/hooks/useAuth';
import DefaultAddressField from '@/components/AddressField'; // Corrected import path for default export
import { TooltipProvider } from '@/components/ui/tooltip'; 


interface WizardFormProps {
  locale: 'en' | 'es';
  doc: LegalDocument;
  onComplete: (checkoutUrl: string) => void;
}

export default function WizardForm({ locale, doc, onComplete }: WizardFormProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const liveRef = useRef<HTMLDivElement>(null);
  const { isLoggedIn, isLoading: authIsLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const methods = useForm<z.infer<typeof doc.schema>>({
    resolver: zodResolver(doc.schema),
    defaultValues: {}, // Default values will be loaded from localStorage
    mode: 'onBlur',
  });

  const {
    watch,
    getValues,
    trigger,
    reset,
    control,
    formState: { errors, isSubmitting: formIsSubmitting }
  } = methods;


  useEffect(() => {
    if (typeof window !== 'undefined') {
      const draft = localStorage.getItem(`draft-${doc.id}-${locale}`);
      let defaultValuesToSet: Partial<z.infer<typeof doc.schema>> = {};
      if (draft) {
        try {
          defaultValuesToSet = JSON.parse(draft);
        } catch (e) {
          console.error("Failed to parse draft from localStorage", e);
          localStorage.removeItem(`draft-${doc.id}-${locale}`);
        }
      } else if (doc.id === 'bill-of-sale-vehicle' && doc.schema && 'shape' in doc.schema && (doc.schema.shape as any).sale_date) {
        const saleDateShape = (doc.schema.shape as any).sale_date;
        if (saleDateShape && (saleDateShape instanceof z.ZodDate || (saleDateShape._def && saleDateShape._def.typeName === 'ZodDate'))) {
          defaultValuesToSet = { sale_date: new Date() } as any;
        }
      }
      reset(defaultValuesToSet);
    }
  }, [doc.id, locale, reset, doc.schema]);


  const steps = React.useMemo(() => {
    if (doc.questions && doc.questions.length > 0) {
      return doc.questions.map(q => ({ id: q.id, label: q.label || prettify(q.id) }));
    }
    // Ensure doc.schema and doc.schema.shape exist before trying to map keys
    if (doc.schema && 'shape' in doc.schema && typeof doc.schema.shape === 'object' && doc.schema.shape !== null) {
      return Object.keys(doc.schema.shape).map(key => ({ id: key, label: prettify(key) }));
    }
    return [];
  }, [doc.questions, doc.schema]);

  const totalSteps = steps.length > 0 ? steps.length : 1;
  const [currentStepIndex, setCurrentStepIndex] = useState(0);


  useEffect(() => {
    if (typeof window !== 'undefined') {
      const subscription = watch((values) => {
        localStorage.setItem(`draft-${doc.id}-${locale}`, JSON.stringify(values));
      });
      return () => subscription.unsubscribe();
    }
  }, [watch, doc.id, locale]);

  const proceedToApiSubmission = async () => {
    try {
      const response = await axios.post(`/${locale}/api/wizard/${doc.id}/submit`, {
        values: getValues(),
        locale,
      });
      toast({ title: t("Submission Successful", { ns: 'translation' }), description: t("Document saved, proceeding to payment.", { ns: 'translation' }) });
      if (typeof window !== 'undefined') localStorage.removeItem(`draft-${doc.id}-${locale}`);
      onComplete(response.data.checkoutUrl);
    } catch (error: any) {
      console.error('Submission error in WizardForm:', error);
      let title = t("Submission Failed", { ns: 'translation' });
      let description = t("An unexpected error occurred. Please try again.", { ns: 'translation' });

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<any>;
        title = t(`API Error Occurred`, { ns: 'translation', defaultValue: "API Error Occurred {{status}}", status: axiosError.response?.status || '' }).trim();
        description = axiosError.response?.data?.error || axiosError.message;
        if (axiosError.response?.data?.details && typeof axiosError.response.data.details === 'object') {
          const detailsString = Object.entries(axiosError.response.data.details.fieldErrors || {})
            .map(([field, messages]) => `${prettify(field as string)}: ${(messages as string[]).join(', ')}`)
            .join('; ');
          if (detailsString) description += ` ${t("Details", { ns: 'translation' })}: ${detailsString}`;
        } else if (axiosError.response?.data?.details && typeof axiosError.response.data.details === 'string') {
          description += ` ${t("Details", { ns: 'translation' })}: ${axiosError.response.data.details}`;
        }
      } else if (error instanceof Error) {
        description = error.message;
      }
      toast({ title: title, description: description, variant: "destructive", duration: 9000 });
    }
  };

  const handleNextStep = async () => {
    const currentStepField = totalSteps > 0 ? steps[currentStepIndex] : null;

    let isValid = true;
    if (currentStepField && currentStepField.id) {
      isValid = await trigger(currentStepField.id as any);
    } else if (totalSteps > 0 && !currentStepField && currentStepIndex < totalSteps) {
      console.error("Error: currentStepField is undefined but totalSteps > 0. currentStepIndex:", currentStepIndex, "steps:", steps);
      isValid = false;
    }


    if (!isValid) {
      toast({ title: t("Validation Error", { ns: 'translation' }), description: t("Please correct the errors before proceeding.", { ns: 'translation' }), variant: "destructive" });
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
      if (!authIsLoading) {
        if (!isLoggedIn) {
          setShowAuthModal(true);
          return;
        }
        await proceedToApiSubmission();
      } else {
        toast({ title: t("Verifying account...", { ns: 'translation' }), description: t("Please wait.", { ns: 'translation' }) });
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
  const progressValue = totalSteps > 0 ? ((currentStepIndex + 1) / totalSteps) * 100 : 0;

  const fieldSchemaDefinition = currentField && doc.schema && doc.schema.shape ? doc.schema.shape[currentField.id] : undefined;

  return (
    <FormProvider {...methods}>
      <TooltipProvider>
        <div className="bg-card rounded-lg shadow-xl p-6 md:p-8 border border-border">
          <div className="mb-6">
            <Progress value={progressValue} className="w-full h-2" />
            <p className="text-xs text-muted-foreground mt-1 text-right">
              {Math.round(progressValue)}% {t('Complete', { ns: 'translation' })}
            </p>
          </div>


          <div className="mt-6 space-y-6 min-h-[200px]">
            {currentField && currentField.id ? (
               fieldSchemaDefinition && (fieldSchemaDefinition instanceof z.ZodObject || (fieldSchemaDefinition._def && fieldSchemaDefinition._def.typeName === 'ZodObject')) && (currentField.id.includes('_address') || currentField.id.includes('Address')) ? (
                <Controller
                  control={control}
                  name={currentField.id as any}
                  render={({ field: { onChange: rhfOnChange, value: rhfValue, name: rhfName, ref: rhfRef, ...restRhfField }}) => (
                    <DefaultAddressField
                      name={rhfName}
                      label={t(currentField.label, currentField.label)}
                      required={(doc.schema?.shape as any)?.[currentField.id]?._def?.typeName !== 'ZodOptional'}
                      error={errors[currentField.id as any]?.message as string | undefined}
                      placeholder={t('Enter address...', { ns: 'translation' })}
                      tooltip={(doc.questions?.find(q => q.id === currentField.id)?.tooltip) || ''}
                      // Pass RHF's value and onChange to AddressField
                      value={rhfValue || ''}
                      onChange={(val, parts) => {
                        rhfOnChange(val); // Update RHF's internal state for the raw address string
                        if (parts) { // If Google Places returns structured parts, update related fields
                            if ((doc.schema.shape as any).city) setValue('city', parts.city, {shouldValidate: true});
                            if ((doc.schema.shape as any).state) setValue('state', parts.state, {shouldValidate: true});
                            if ((doc.schema.shape as any).postal_code) setValue('postal_code', parts.postalCode, {shouldValidate: true});
                        }
                      }}
                    />
                  )}
                />
              ) : (
                <FieldRenderer
                  fieldKey={currentField.id}
                  locale={locale}
                  doc={doc}
                />
              )
            ) : (
              <p className="text-muted-foreground text-center py-10">{t('dynamicForm.noQuestionsNeeded', { ns: 'translation' })}</p>
            )}
          </div>

          <div className="mt-8 flex justify-between items-center">
            {currentStepIndex > 0 && totalSteps > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={handlePreviousStep}
                disabled={formIsSubmitting || authIsLoading}
                className="text-foreground border-border hover:bg-muted"
              >
                {t('Back', { ns: 'translation' })}
              </Button>
            )}
            {currentStepIndex === 0 && totalSteps > 0 && <div />} {/* Spacer */}

            {(totalSteps > 0 || (totalSteps === 0 && currentStepIndex === 0)) && (
              <Button
                type="button"
                onClick={handleNextStep}
                className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-[120px]"
                disabled={formIsSubmitting || authIsLoading}
              >
                {formIsSubmitting || authIsLoading ? <Loader2 className="animate-spin h-5 w-5" /> :
                  (currentStepIndex === totalSteps - 1 || totalSteps === 0 ? t('dynamicForm.confirmAnswersButton', { ns: 'translation' }) : t('wizard.next', { ns: 'translation' }))}
              </Button>
            )}
          </div>
          <div ref={liveRef} className="sr-only" aria-live="polite" />
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            onAuthSuccess={() => {
              setShowAuthModal(false);
              setTimeout(() => {
                handleNextStep(); 
              }, 100); 
            }}
          />
        </div>
      </TooltipProvider>
    </FormProvider>
  );
}
