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
import DefaultAddressField from '@/components/AddressField'; 
import { TooltipProvider } from '@/components/ui/tooltip'; 
import TrustBadges from '@/components/TrustBadges';


interface WizardFormProps {
  locale: 'en' | 'es';
  doc: LegalDocument;
  onComplete: (checkoutUrl: string) => void;
}

export default function WizardForm({ locale, doc, onComplete }: WizardFormProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const liveRef = useRef<HTMLDivElement>(null);
  const { isLoggedIn, isLoading: authIsLoading, user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const methods = useForm<z.infer<typeof doc.schema>>({
    resolver: zodResolver(doc.schema),
    defaultValues: {}, 
    mode: 'onBlur',
  });

  const {
    watch,
    getValues,
    trigger,
    reset,
    control,
    formState: { errors, isSubmitting: formIsSubmitting, dirtyFields }
  } = methods;


  useEffect(() => {
    if (typeof window !== 'undefined' && doc.id && locale) { // Ensure doc.id and locale are defined
      const draftKey = `draft-${doc.id}-${locale}`;
      const draft = localStorage.getItem(draftKey);
      let defaultValuesToSet: Partial<z.infer<typeof doc.schema>> = {};
      if (draft) {
        try {
          defaultValuesToSet = JSON.parse(draft);
        } catch (e) {
          console.error("Failed to parse draft from localStorage", e);
          localStorage.removeItem(draftKey);
        }
      } else if (doc.id === 'bill-of-sale-vehicle' && doc.schema && 'shape' in doc.schema && doc.schema.shape && (doc.schema.shape as any).sale_date) {
         const saleDateShape = (doc.schema.shape as any).sale_date;
         if (saleDateShape && (saleDateShape instanceof z.ZodDate || (saleDateShape._def && saleDateShape._def.typeName === 'ZodDate'))) {
            defaultValuesToSet = { sale_date: new Date() } as any;
         }
      }
      reset(defaultValuesToSet);
    }
  }, [doc.id, doc.schema, locale, reset]);


  const steps = React.useMemo(() => {
    if (doc.questions && doc.questions.length > 0) {
      return doc.questions.map(q => ({ id: q.id, label: q.label || prettify(q.id) }));
    }
    if (doc.schema && 'shape' in doc.schema && typeof doc.schema.shape === 'object' && doc.schema.shape !== null) {
      return Object.keys(doc.schema.shape).map(key => ({ id: key, label: prettify(key) }));
    }
    return [];
  }, [doc.questions, doc.schema]);

  const totalSteps = steps.length > 0 ? steps.length : 1;
  const [currentStepIndex, setCurrentStepIndex] = useState(0);


  useEffect(() => {
    if (typeof window !== 'undefined' && doc.id && locale) { // Ensure doc.id and locale are defined
      const draftKey = `draft-${doc.id}-${locale}`;
      const subscription = watch((values) => {
        // Only save if there are dirty fields to avoid overwriting defaults unnecessarily
        if (Object.keys(dirtyFields).length > 0 || Object.keys(values).some(k => values[k] !== undefined)) {
            localStorage.setItem(draftKey, JSON.stringify(values));
        }
      });
      return () => subscription.unsubscribe();
    }
  }, [watch, doc.id, locale, dirtyFields]);

  const proceedToApiSubmission = async () => {
    try {
      const response = await axios.post(`/${locale}/api/wizard/${doc.id}/submit`, {
        values: getValues(),
        locale,
      });
      toast({ title: t("Submission Successful", { ns: 'translation' }), description: t("Document saved, proceeding to payment.", { ns: 'translation' }) });
      if (typeof window !== 'undefined' && doc.id && locale) { // Ensure doc.id and locale are defined
        localStorage.removeItem(`draft-${doc.id}-${locale}`);
      }
      onComplete(response.data.checkoutUrl);
    } catch (error: any) {
      console.error('Submission error in WizardForm:', error);
      let title = t("Submission Failed", { ns: 'translation' });
      let description = t("An unexpected error occurred. Please try again.", { ns: 'translation' });

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<any>;
        title = t(`API Error Occurred`, { ns: 'translation', defaultValue: `API Error Occurred ${axiosError.response?.status || ''}` }).trim();
        description = axiosError.response?.data?.error || axiosError.message;
        if (axiosError.response?.data?.details && typeof axiosError.response.data.details === 'object') {
          const fieldErrors = (axiosError.response.data.details as any).fieldErrors;
          const detailsString = fieldErrors 
            ? Object.entries(fieldErrors)
                .map(([field, messages]) => `${prettify(field as string)}: ${(messages as string[]).join(', ')}`)
                .join('; ')
            : JSON.stringify(axiosError.response.data.details); 
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
    const currentStepFieldKey = totalSteps > 0 && currentStepIndex < steps.length ? steps[currentStepIndex]?.id : null;

    let isValid = true;
    if (currentStepFieldKey) {
      isValid = await trigger(currentStepFieldKey as any);
    } else if (totalSteps > 0 && currentStepIndex < totalSteps) {
       // This case implies steps[currentStepIndex] is undefined, which shouldn't happen if totalSteps > 0
       // but we ensure isValid is false to prevent proceeding.
      console.error("Error: currentStepField is undefined but totalSteps > 0. currentStepIndex:", currentStepIndex, "steps:", steps);
      isValid = false; 
    }


    if (!isValid) {
      toast({ title: t("Validation Error", { ns: 'translation' }), description: t("Please correct the errors before proceeding.", { ns: 'translation' }), variant: "destructive" });
      return;
    }

    if (liveRef.current && currentStepFieldKey) {
      const currentStepLabel = steps[currentStepIndex]?.label || currentStepFieldKey;
      setTimeout(() => {
        if (liveRef.current) liveRef.current.innerText = `${t(currentStepLabel, currentStepLabel)} updated`;
      }, 50);
    }

    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(s => s + 1);
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
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
             {currentField && currentField.id ? (() => {
                // Robustly check doc.schema and doc.schema.shape
                const shape = doc.schema && doc.schema.shape;
                const fieldSchemaDefinition = shape ? (shape as any)[currentField.id] : undefined;
                const isAddressFieldByName = currentField.id.includes('_address') || currentField.id.includes('Address');

                if (isAddressFieldByName && fieldSchemaDefinition) { // Ensure fieldSchemaDefinition exists for AddressField
                    return (
                        <Controller
                            control={control}
                            name={currentField.id as any}
                            render={({ field: { onChange: rhfOnChange, value: rhfValue, name: rhfName, ref: rhfRefInput, ...restRhfField }}) => (
                                <DefaultAddressField
                                    name={rhfName}
                                    label={t(currentField.label, currentField.label)}
                                    required={(doc.schema?.shape as any)?.[currentField.id]?._def?.typeName !== 'ZodOptional'}
                                    error={errors[currentField.id as any]?.message as string | undefined}
                                    placeholder={t('Enter address...', { ns: 'translation' })}
                                    tooltip={(doc.questions?.find(q => q.id === currentField.id)?.tooltip) || ''}
                                    value={rhfValue as string || ''} // Cast to string
                                    onChange={(val, parts) => { // DefaultAddressField onChange signature
                                        rhfOnChange(val); 
                                        if (parts && doc.schema && doc.schema.shape) { 
                                            if ((doc.schema.shape as any).city) methods.setValue('city', parts.city, {shouldValidate: true});
                                            if ((doc.schema.shape as any).state) methods.setValue('state', parts.state, {shouldValidate: true});
                                            if ((doc.schema.shape as any).postal_code) methods.setValue('postal_code', parts.postalCode, {shouldValidate: true});
                                        }
                                    }}
                                />
                            )}
                        />
                    );
                } else {
                    return ( <FieldRenderer fieldKey={currentField.id} locale={locale} doc={doc} /> );
                }
            })() : (
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
            {currentStepIndex === 0 && totalSteps > 0 && <div />} 

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
          <TrustBadges /> 
          <div ref={liveRef} className="sr-only" aria-live="polite" />
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            onAuthSuccess={() => {
              setShowAuthModal(false);
              if (user) { // Ensure user is "logged in" before proceeding
                 setTimeout(() => { // Allow state to update
                    handleNextStep(); // This will now call proceedToApiSubmission
                 }, 100);
              } else {
                 toast({ title: "Authentication Required", description: "Please sign in to continue.", variant: "destructive"});
              }
            }}
          />
        </div>
      </TooltipProvider>
    </FormProvider>
  );
}
