// src/components/WizardForm.tsx
'use client';

import { useForm, Controller, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
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
import AddressField from '@/components/AddressField'; // Corrected import path
import { TooltipProvider } from '@/components/ui/tooltip'; 
import TrustBadges from '@/components/TrustBadges';
import ReviewStep from '@/components/ReviewStep'; 
import { saveFormProgress, loadFormProgress } from '@/lib/firestore/saveFormProgress';
import { debounce } from 'lodash-es';


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
  const [isReviewing, setIsReviewing] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  const methods = useForm<z.infer<typeof doc.schema>>({
    resolver: zodResolver(doc.schema),
    defaultValues: {}, 
    mode: 'onBlur',
  });
  
  const {
    getValues,
    trigger,
    control,
    watch,
    reset, 
    formState: { errors, isSubmitting: formIsSubmitting, isValid: isFormValid }
  } = methods;


  useEffect(() => {
    setIsHydrated(true);
  }, []);

  
  useEffect(() => {
    async function loadDraft() {
      if (typeof window !== 'undefined' && doc && doc.id && locale && isHydrated && !authIsLoading) {
        let draftData: Partial<z.infer<typeof doc.schema>> = {};
        if (isLoggedIn && user?.uid) {
          try {
            const firestoreDraft = await loadFormProgress({ userId: user.uid, docType: doc.id, state: locale });
            if (firestoreDraft && Object.keys(firestoreDraft).length > 0) {
              draftData = firestoreDraft;
            } else {
              const lsDraft = localStorage.getItem(`draft-${doc.id}-${locale}`);
              if (lsDraft) draftData = JSON.parse(lsDraft);
            }
          } catch (e) {
            console.error("Failed to load draft from Firestore, falling back to localStorage:", e);
            const lsDraft = localStorage.getItem(`draft-${doc.id}-${locale}`);
            if (lsDraft) draftData = JSON.parse(lsDraft);
          }
        } else {
          const lsDraft = localStorage.getItem(`draft-${doc.id}-${locale}`);
          if (lsDraft) {
            try {
              draftData = JSON.parse(lsDraft);
            } catch (e) {
              console.error("Failed to parse draft from localStorage", e);
              localStorage.removeItem(`draft-${doc.id}-${locale}`);
            }
          }
        }
        
        if (doc.id === 'bill-of-sale-vehicle' && !draftData.sale_date && doc.schema && doc.schema.shape && (doc.schema.shape as any).sale_date) {
           const saleDateShape = (doc.schema.shape as any).sale_date;
           if (saleDateShape?._def?.typeName === 'ZodDate' || saleDateShape?._def?.innerType?._def?.typeName === 'ZodDate' ) {
              draftData = { ...draftData, sale_date: new Date() } as any; 
           }
        }
        reset(draftData); 
      }
    }
    if(doc && isHydrated && methods) { 
        loadDraft();
    }
  }, [doc, locale, reset, isLoggedIn, user, authIsLoading, isHydrated, methods]); 


  const debouncedSaveToFirestore = useCallback(
    debounce(async (valuesToSave: Record<string, any>) => {
      if (isLoggedIn && user?.uid && doc && doc.id && locale) {
        if (methods && methods.formState && (Object.keys(methods.formState.dirtyFields).length > 0 || Object.keys(valuesToSave).some(k => valuesToSave[k] !== undefined))) {
             try {
                await saveFormProgress({
                    userId: user.uid,
                    docType: doc.id,
                    state: locale, 
                    formData: valuesToSave,
                });
            } catch (error) {
                console.error('[WizardForm] Failed to save draft to Firestore:', error);
            }
        }
      }
    }, 1000), 
    [isLoggedIn, user?.uid, doc?.id, locale, methods?.formState, saveFormProgress] 
  );

  useEffect(() => {
    if (typeof window !== 'undefined' && doc && doc.id && locale && isHydrated && methods && methods.watch && methods.formState) {
      const draftKey = `draft-${doc.id}-${locale}`;
      const subscription = watch((values) => { 
        if (Object.keys(methods.formState.dirtyFields).length > 0 || Object.keys(values).some(k => values[k] !== undefined)) {
             localStorage.setItem(draftKey, JSON.stringify(values));
        }
        debouncedSaveToFirestore(values);
      });
      return () => {
        subscription.unsubscribe();
        debouncedSaveToFirestore.cancel(); 
      }
    }
  }, [watch, doc, locale, isHydrated, debouncedSaveToFirestore, methods?.formState?.dirtyFields, methods]);


  const steps = useMemo(() => {
    if (!doc) {
        console.warn("[WizardForm] Steps calc: Document config is missing.");
        return [];
    }

    if (doc.questions && doc.questions.length > 0) {
        return doc.questions.map(q => ({ 
            id: q.id, 
            label: q.label, 
            tooltip: q.tooltip 
        }));
    } else if (doc.schema) {
        let shapeObject: Record<string, any> | undefined;
        const schemaDef = doc.schema._def;

        if (schemaDef?.typeName === 'ZodObject') {
            shapeObject = doc.schema.shape;
        } else if (schemaDef?.typeName === 'ZodEffects' && schemaDef.schema?._def?.typeName === 'ZodObject') {
            shapeObject = schemaDef.schema.shape;
        }

        if (shapeObject && typeof shapeObject === 'object' && Object.keys(shapeObject).length > 0) {
            return Object.keys(shapeObject).map(key => ({
                id: key,
                label: (shapeObject![key] && (shapeObject![key] as any)._def && typeof (shapeObject![key] as any)._def.description === 'string' && (shapeObject![key] as any)._def.description) 
                       ? (shapeObject![key] as any)._def.description 
                       : prettify(key),
                tooltip: (shapeObject![key] && (shapeObject![key] as any)._def && typeof (shapeObject![key] as any)._def.tooltip === 'string') 
                         ? (shapeObject![key] as any)._def.tooltip 
                         : undefined
            }));
        }
    }

    console.warn("[WizardForm] Steps calc: No questions defined in doc.questions and Zod schema shape is invalid or empty for doc:", doc.name);
    return [];
  }, [doc]);


  const totalSteps = steps.length > 0 ? steps.length : 1; 
  const [currentStepIndex, setCurrentStepIndex] = useState(0);


  const proceedToApiSubmission = async () => {
    if (!doc || !doc.id) {
      toast({ title: "Error", description: "Document configuration is missing.", variant: "destructive"});
      return;
    }
    try {
      const response = await axios.post(`/${locale}/api/wizard/${doc.id}/submit`, {
        values: getValues(),
        locale,
      });
      toast({ title: t("Submission Successful", { ns: 'translation' }), description: t("Document saved, proceeding to payment.", { ns: 'translation' }) });
      if (typeof window !== 'undefined' && doc.id && locale) {
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
          const formErrors = (axiosError.response.data.details as any).formErrors;
          let detailsString = '';
          if (fieldErrors) {
             detailsString = Object.entries(fieldErrors)
                .map(([field, messages]) => `${prettify(field as string)}: ${(messages as string[]).join(', ')}`)
                .join('; ');
          }
          if (formErrors && formErrors.length > 0) {
             detailsString += (detailsString ? '; ' : '') + `Form Errors: ${formErrors.join(', ')}`;
          }
          if (detailsString) description += ` Details: ${detailsString}`;
        } else if (axiosError.response?.data?.details && typeof axiosError.response.data.details === 'string') {
          description += ` Details: ${axiosError.response.data.details}`;
        }
      } else if (error instanceof Error) {
        description = error.message;
      }
      toast({ title: title, description: description, variant: "destructive", duration: 9000 });
    }
  };

  const handleNextStep = async () => {
    if (!doc) return;

    if (isReviewing) {
      if (!authIsLoading) {
        if (!isLoggedIn) {
          setShowAuthModal(true);
          return;
        }
        await proceedToApiSubmission();
      } else {
        toast({ title: t("Verifying account...", { ns: 'translation' }), description: t("Please wait.", { ns: 'translation' }) });
      }
      return;
    }

    const currentStepFieldKey = totalSteps > 0 && currentStepIndex < steps.length ? steps[currentStepIndex]?.id : null;
    let isValid = true;

    if (currentStepFieldKey) {
      isValid = await trigger(currentStepFieldKey as any);
    } else if (steps.length === 0) {
      console.log("[WizardForm] No fields/steps to validate, proceeding to review.");
      setIsReviewing(true);
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    } else if (currentStepIndex >= totalSteps -1 && totalSteps > 0) {
        isValid = await trigger(); 
         if (isValid) {
            setIsReviewing(true);
            if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
    } else if (!currentStepFieldKey && totalSteps > 0 && currentStepIndex < totalSteps) {
       console.error("Error: currentStepFieldKey is undefined but totalSteps > 0 and currentStepIndex is within bounds. currentStepIndex:", currentStepIndex, "totalSteps:", totalSteps, "steps:", steps);
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
      const allFieldsValid = await trigger();
      if(allFieldsValid) {
        setIsReviewing(true);
        if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        toast({ title: t("Validation Error", { ns: 'translation' }), description: t("Please correct the errors on the final step before proceeding.", { ns: 'translation' }), variant: "destructive" });
      }
    }
  };

  const handlePreviousStep = () => {
    if (isReviewing) {
      setIsReviewing(false);
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (currentStepIndex > 0) {
      setCurrentStepIndex(s => s - 1);
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const currentField = !isReviewing && steps.length > 0 && currentStepIndex < steps.length ? steps[currentStepIndex] : null;
  const progressValue = totalSteps > 0 ? ((isReviewing ? totalSteps : currentStepIndex) / totalSteps) * 100 : (isReviewing ? 100 : 0);

  let currentFieldSchemaDefinition: z.ZodTypeAny | undefined;
  if (currentField && currentField.id && doc?.schema?._def) {
      let shapeObjForCurrentField: Record<string, any> | undefined;
      if (doc.schema._def.typeName === 'ZodObject') {
          shapeObjForCurrentField = doc.schema.shape;
      } else if (doc.schema._def.typeName === 'ZodEffects' && doc.schema._def.schema?._def?.typeName === 'ZodObject') {
          shapeObjForCurrentField = doc.schema._def.schema.shape;
      }
      if (shapeObjForCurrentField && currentField.id in shapeObjForCurrentField) {
          currentFieldSchemaDefinition = shapeObjForCurrentField[currentField.id];
      } else if(shapeObjForCurrentField) {
        console.warn(`[WizardForm] Field key "${currentField.id}" not found in schema shape for doc "${doc.name}". Available keys:`, Object.keys(shapeObjForCurrentField));
      } else {
         console.warn(`[WizardForm] Schema shape is undefined for doc "${doc.name}"`);
      }
  }


  if (!isHydrated || !doc) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
    <TooltipProvider>
      <div className="bg-card rounded-lg shadow-xl p-4 md:p-6 border border-border">
        
        <div className="lg:hidden mb-4 flex justify-center">
          <Button variant="outline" onClick={() => setShowMobilePreview(!showMobilePreview)}>
            {showMobilePreview ? t('Hide Preview') : t('Show Preview')}
          </Button>
        </div>

        {showMobilePreview && (
          <div className="lg:hidden mb-6 h-96">
             {/* PreviewPane needs FormProvider, ensure it's correctly wrapped in StartWizardPage */}
          </div>
        )}

        <div className="mb-6">
          <Progress value={progressValue} className="w-full h-2" />
          <p className="text-xs text-muted-foreground mt-1 text-right">
            {Math.round(progressValue)}% {t('Complete', { ns: 'translation' })}
          </p>
        </div>

        {isReviewing ? (
           <ReviewStep
              doc={doc}
              locale={locale}
              onEdit={(fieldIdToEdit) => {
                  const stepIndex = steps.findIndex(s => s.id === fieldIdToEdit);
                  if (stepIndex !== -1) {
                      setCurrentStepIndex(stepIndex);
                  }
                  setIsReviewing(false);
                  if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
           />
        ) : currentField && currentField.id ? (
            <div className="mt-6 space-y-6 min-h-[200px]">
               {(doc.schema.shape as any)?.[currentField.id] && ((doc.schema.shape as any)[currentField.id] instanceof z.ZodObject || ((doc.schema.shape as any)[currentField.id]._def && (doc.schema.shape as any)[currentField.id]._def.typeName === 'ZodObject')) && (currentField.id.includes('_address') || currentField.id.includes('Address')) ? (

                <Controller
                  control={control}
                  name={currentField.id as any}
                  render={({ field: { onChange: rhfOnChange, value: rhfValue, name: rhfName }}) => (
                      <AddressField
                          name={rhfName as string}
                          label={currentField.label}
                          required={!(currentFieldSchemaDefinition?._def?.typeName?.startsWith('ZodOptional'))}
                          error={errors[currentField!.id as any]?.message as string | undefined}
                          placeholder={t("Enter address...", {ns: "translation"})}
                          tooltip={(currentFieldSchemaDefinition?._def?.description as string | undefined) || currentField.label}
                      />
                  )}
                />
              ) : (
                <FieldRenderer fieldKey={currentField.id} locale={locale} doc={doc} />
              )
            }
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-10">
            {t('dynamicForm.noQuestionsNeeded', { ns: 'translation' })}
          </p>
        )}


        <div className="mt-8 flex justify-between items-center">
          {(currentStepIndex > 0 || isReviewing) && (steps.length > 0 || isReviewing) && (
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
          {currentStepIndex === 0 && !isReviewing && steps.length > 0 && <div />}


           <Button
              type="button"
              onClick={handleNextStep}
              className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-[120px]"
              disabled={formIsSubmitting || authIsLoading || (isReviewing && !isFormValid && steps.length > 0)}
            >
              {formIsSubmitting || authIsLoading ? <Loader2 className="animate-spin h-5 w-5" /> :
                isReviewing ? t('dynamicForm.confirmAnswersButton', { ns: 'translation' }) :
                (currentStepIndex === totalSteps - 1 || (steps.length === 0) ? t('Review Answers', { ns: 'translation' }) : t('wizard.next', { ns: 'translation' }))}
            </Button>
        </div>
        <TrustBadges />
        <div ref={liveRef} className="sr-only" aria-live="polite" />
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={async () => {
            setShowAuthModal(false);
            if (user || isLoggedIn) { 
               await new Promise(resolve => setTimeout(resolve, 100));
               await proceedToApiSubmission();
            } else {
               toast({ title: t("Authentication Required", { ns: 'translation' }), description: t("Please sign in to continue.", { ns: 'translation' }), variant: "destructive"});
            }
          }}
        />
      </div>
    </TooltipProvider>
    </FormProvider>
  );
}
