// src/components/WizardForm.tsx
'use client';

import { useForm, FormProvider, Controller, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import React, { useEffect, useState, useRef, useCallback } from 'react';
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

  // Ensure doc and doc.schema are valid before using them
  const safeSchema = doc && doc.schema && typeof doc.schema.shape === 'object' && doc.schema.shape !== null 
    ? doc.schema 
    : z.object({}); // Fallback to an empty schema if doc.schema is invalid

  const methods = useForm<z.infer<typeof safeSchema>>({
    resolver: zodResolver(safeSchema),
    defaultValues: {}, 
    mode: 'onBlur',
  });

  const {
    watch,
    getValues,
    trigger,
    reset,
    control,
    formState: { errors, isSubmitting: formIsSubmitting, dirtyFields, isValid: isFormValid }
  } = methods;


  useEffect(() => {
    async function loadDraft() {
      // Ensure doc and doc.id are available
      if (typeof window !== 'undefined' && doc && doc.id && locale) {
        let draftData: Partial<z.infer<typeof safeSchema>> = {};
        if (isLoggedIn && user?.uid) {
          console.log(`[WizardForm] Logged in. Attempting to load draft from Firestore for user ${user.uid}, doc ${doc.id}, locale ${locale}`);
          try {
            const firestoreDraft = await loadFormProgress({ userId: user.uid, docType: doc.id, state: locale });
            if (firestoreDraft && Object.keys(firestoreDraft).length > 0) {
              draftData = firestoreDraft;
              console.log('[WizardForm] Draft loaded from Firestore:', draftData);
            } else {
              console.log('[WizardForm] No draft found in Firestore, trying localStorage.');
              const lsDraft = localStorage.getItem(`draft-${doc.id}-${locale}`);
              if (lsDraft) draftData = JSON.parse(lsDraft);
            }
          } catch (e) {
            console.error("Failed to load draft from Firestore, falling back to localStorage:", e);
            const lsDraft = localStorage.getItem(`draft-${doc.id}-${locale}`);
            if (lsDraft) draftData = JSON.parse(lsDraft);
          }
        } else {
          console.log('[WizardForm] Not logged in. Loading draft from localStorage.');
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
        
        if (doc.id === 'bill-of-sale-vehicle' && !draftData.sale_date && safeSchema && 'shape' in safeSchema && safeSchema.shape && (safeSchema.shape as any).sale_date) {
           const saleDateShape = (safeSchema.shape as any).sale_date;
           if (saleDateShape && (saleDateShape instanceof z.ZodDate || (saleDateShape._def && saleDateShape._def.typeName === 'ZodDate'))) {
              draftData = { ...draftData, sale_date: new Date() } as any;
           }
        }
        console.log('[WizardForm] Resetting form with draft data:', draftData);
        reset(draftData);
      }
    }
    if(!authIsLoading && doc) { 
        loadDraft();
    }
  }, [doc, safeSchema, locale, reset, isLoggedIn, user, authIsLoading]);


  const debouncedSaveToFirestore = useCallback(
    debounce(async (valuesToSave: Record<string, any>) => {
      if (isLoggedIn && user?.uid && doc && doc.id && locale) {
        if (Object.keys(dirtyFields).length > 0 || Object.keys(valuesToSave).some(k => valuesToSave[k] !== undefined)) {
            try {
                await saveFormProgress({
                    userId: user.uid,
                    docType: doc.id,
                    state: locale, 
                    formData: valuesToSave,
                });
                console.log('[WizardForm] Draft saved to Firestore:', valuesToSave);
            } catch (error) {
                console.error('[WizardForm] Failed to save draft to Firestore:', error);
            }
        }
      }
    }, 1000), 
    [isLoggedIn, user, doc, locale, dirtyFields] 
  );


  useEffect(() => {
    if (typeof window !== 'undefined' && doc && doc.id && locale) {
      const draftKey = `draft-${doc.id}-${locale}`;
      const subscription = watch((values) => {
        if (Object.keys(dirtyFields).length > 0 || Object.keys(values).some(k => values[k] !== undefined)) {
            localStorage.setItem(draftKey, JSON.stringify(values));
        }
        debouncedSaveToFirestore(values);
      });
      return () => {
        subscription.unsubscribe();
        debouncedSaveToFirestore.cancel();
      }
    }
  }, [watch, doc, locale, dirtyFields, debouncedSaveToFirestore]);

  const steps = React.useMemo(() => {
    if (!doc) return []; // Guard against undefined doc
    if (doc.questions && doc.questions.length > 0) {
      return doc.questions.map(q => ({ id: q.id, label: q.label || prettify(q.id) }));
    }
    // Ensure doc.schema and doc.schema.shape exist before trying to get keys
    if (doc.schema && 'shape' in doc.schema && typeof doc.schema.shape === 'object' && doc.schema.shape !== null) {
      const shape = doc.schema.shape as Record<string, any>;
      return Object.keys(shape).map(key => ({ 
        id: key, 
        label: shape[key]?.description || prettify(key) 
      }));
    }
    return [];
  }, [doc]);

  const totalSteps = steps.length > 0 ? steps.length : 1;
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const proceedToApiSubmission = async () => {
    if (!doc || !doc.id) { // Guard against undefined doc or doc.id
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
          const detailsString = fieldErrors 
            ? Object.entries(fieldErrors)
                .map(([field, messages]) => `${prettify(field as string)}: ${(messages as string[]).join(', ')}`)
                .join('; ')
            : JSON.stringify(axiosError.response.data.details); 
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
    if (!doc) return; // Guard clause

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
    } else if (totalSteps === 0 && steps.length === 0) {
      console.log("[WizardForm] No fields to validate, proceeding to review.");
      setIsReviewing(true);
      return;
    } else if (currentStepIndex >= totalSteps -1 && totalSteps > 0) {
        isValid = await trigger(); 
         if (isValid) {
            setIsReviewing(true);
            return;
        }
    } else if (!currentStepFieldKey && totalSteps > 0 && currentStepIndex < totalSteps) {
      // This condition should ideally not be met if steps are derived correctly.
      // If it is, it implies an issue with `steps` or `currentStepIndex` logic.
      console.error("Error: currentStepFieldKey is null/undefined in handleNextStep, but currentStepIndex is within totalSteps. currentStepIndex:", currentStepIndex, "steps:", steps, "totalSteps:", totalSteps);
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
      setIsReviewing(true);
       if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
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
  
  const currentField = !isReviewing && totalSteps > 0 && currentStepIndex < steps.length ? steps[currentStepIndex] : null;
  const progressValue = totalSteps > 0 ? ((isReviewing ? totalSteps : currentStepIndex + 1) / totalSteps) * 100 : (isReviewing ? 100 : 0);


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
          ) : (
            <div className="mt-6 space-y-6 min-h-[200px]">
               {currentField && currentField.id && doc && doc.schema && doc.schema.shape ? (
                 (() => {
                    const isAddressField = currentField.id.includes('_address') || currentField.id.includes('Address');
                    const fieldSchemaDefinition = (doc.schema.shape as any)[currentField.id];

                    if (isAddressField && fieldSchemaDefinition) {
                      return (
                        <Controller
                          control={control}
                          name={currentField.id as any}
                          render={({ field: { onChange: rhfOnChange, value: rhfValue, name: rhfName }}) => (
                              <AddressField
                                  name={rhfName as string}
                                  label={t((doc.questions?.find(q => q.id === currentField!.id)?.label) || fieldSchemaDefinition?.description || prettify(currentField!.id), fieldSchemaDefinition?.description || prettify(currentField!.id))}
                                  required={!(fieldSchemaDefinition?._def?.typeName === 'ZodOptional')}
                                  error={errors[currentField!.id as any]?.message as string | undefined}
                                  placeholder={t((doc.questions?.find(q => q.id === currentField!.id)?.placeholder) || "Enter address...")}
                                  tooltip={(doc.questions?.find(q => q.id === currentField!.id)?.tooltip) || fieldSchemaDefinition?.description || ''}
                              />
                          )}
                        />
                      );
                    } else if (fieldSchemaDefinition) {
                      return <FieldRenderer fieldKey={currentField.id} locale={locale} doc={doc} />;
                    } else {
                      console.warn(`Field ${currentField.id} not found in schema shape for doc ${doc.id}`);
                      return <p className="text-destructive">Configuration error: Field '{currentField.id}' not in schema.</p>;
                    }
                 })()
                ) : (
                <p className="text-muted-foreground text-center py-10">{t('dynamicForm.noQuestionsNeeded', { ns: 'translation' })}</p>
                )}
            </div>
          )}


          <div className="mt-8 flex justify-between items-center">
            {(currentStepIndex > 0 || isReviewing) && (totalSteps > 0 || isReviewing) && (
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
            {currentStepIndex === 0 && !isReviewing && totalSteps > 0 && <div />} 

             <Button
                type="button"
                onClick={handleNextStep}
                className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-[120px]"
                disabled={formIsSubmitting || authIsLoading || (isReviewing && !isFormValid)}
              >
                {formIsSubmitting || authIsLoading ? <Loader2 className="animate-spin h-5 w-5" /> :
                  isReviewing ? t('dynamicForm.confirmAnswersButton', { ns: 'translation' }) :
                  (currentStepIndex === totalSteps - 1 || (totalSteps === 0 && steps.length === 0) ? t('Review Answers', { ns: 'translation' }) : t('wizard.next', { ns: 'translation' }))}
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
                 toast({ title: "Authentication Required", description: "Please sign in to continue.", variant: "destructive"});
              }
            }}
          />
        </div>
      </TooltipProvider>
    </FormProvider>
  );
}
