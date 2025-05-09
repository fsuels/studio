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
import AddressField from '@/components/AddressField'; 
import { TooltipProvider } from '@/components/ui/tooltip'; 
import TrustBadges from '@/components/TrustBadges';
import ReviewStep from '@/components/ReviewStep'; 
import { saveFormProgress, loadFormProgress } from '@/lib/firestore/saveFormProgress';
import { debounce } from 'lodash-es';
import { useRouter, useParams } from 'next/navigation';


interface WizardFormProps {
  locale: 'en' | 'es';
  doc: LegalDocument; 
  onComplete: (checkoutUrl: string) => void;
}

export default function WizardForm({ locale, doc, onComplete }: WizardFormProps) {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const liveRef = useRef<HTMLDivElement>(null);
  const { isLoggedIn, isLoading: authIsLoading, user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const router = useRouter();
  const params = useParams(); 


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
    setValue, 
    formState: { errors, isSubmitting: formIsSubmitting, isValid: isFormValid, dirtyFields }
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
            const currentLocaleForDraft = params.locale as 'en' | 'es' || locale;
            const firestoreDraft = await loadFormProgress({ userId: user.uid, docType: doc.id, state: currentLocaleForDraft });
            if (firestoreDraft && Object.keys(firestoreDraft).length > 0) {
              draftData = firestoreDraft;
              console.log(`[WizardForm] Loaded draft from Firestore for ${doc.id}-${currentLocaleForDraft}:`, draftData);
            } else {
              const lsDraft = localStorage.getItem(`draft-${doc.id}-${currentLocaleForDraft}`);
              if (lsDraft) {
                draftData = JSON.parse(lsDraft);
                console.log(`[WizardForm] Loaded draft from localStorage for ${doc.id}-${currentLocaleForDraft}:`, draftData);
              } else {
                console.log(`[WizardForm] No draft found in Firestore or localStorage for ${doc.id}-${currentLocaleForDraft}.`);
              }
            }
          } catch (e) {
            console.error("[WizardForm] Failed to load draft from Firestore, falling back to localStorage:", e);
            const currentLocaleForDraft = params.locale as 'en' | 'es' || locale;
            const lsDraft = localStorage.getItem(`draft-${doc.id}-${currentLocaleForDraft}`);
            if (lsDraft) {
              draftData = JSON.parse(lsDraft);
              console.log(`[WizardForm] Loaded draft from localStorage (fallback) for ${doc.id}-${currentLocaleForDraft}:`, draftData);
            } else {
               console.log(`[WizardForm] No draft found in localStorage (fallback) for ${doc.id}-${currentLocaleForDraft}.`);
            }
          }
        } else if (!isLoggedIn && !authIsLoading) { 
          const currentLocaleForDraft = params.locale as 'en' | 'es' || locale;
          const lsDraft = localStorage.getItem(`draft-${doc.id}-${currentLocaleForDraft}`);
          if (lsDraft) {
            try {
              draftData = JSON.parse(lsDraft);
              console.log(`[WizardForm] Loaded draft from localStorage (anonymous user) for ${doc.id}-${currentLocaleForDraft}:`, draftData);
            } catch (e) {
              console.error("[WizardForm] Failed to parse draft from localStorage (anonymous user)", e);
              localStorage.removeItem(`draft-${doc.id}-${currentLocaleForDraft}`);
            }
          } else {
             console.log(`[WizardForm] No draft found in localStorage (anonymous user) for ${doc.id}-${currentLocaleForDraft}.`);
          }
        }
        
        const schemaForDefaults = doc.schema._def.typeName === 'ZodEffects' ? doc.schema._def.schema : doc.schema;

        if (doc.id === 'bill-of-sale-vehicle' && !draftData.sale_date && schemaForDefaults && (schemaForDefaults.shape as any)?.sale_date) {
           const saleDateShape = (schemaForDefaults.shape as any).sale_date;
           if (saleDateShape?._def?.typeName === 'ZodDate' || saleDateShape?._def?.innerType?._def?.typeName === 'ZodDate' ) {
              draftData = { ...draftData, sale_date: new Date() } as any; 
              console.log(`[WizardForm] Defaulted sale_date for ${doc.id}-${locale}.`);
           }
        }
        reset(draftData); 
      }
    }
    if(doc && isHydrated && methods) { 
        loadDraft();
    }
  }, [doc, locale, reset, isLoggedIn, user, authIsLoading, isHydrated, methods, params.locale]); 


  const debouncedSaveToFirestore = useCallback(
    debounce(async (valuesToSave: Record<string, any>) => {
      const currentLocaleForSave = params.locale as 'en' | 'es' || locale;
      if (isLoggedIn && user?.uid && doc && doc.id && currentLocaleForSave) {
        if (methods && methods.formState && (Object.keys(dirtyFields).length > 0 || Object.keys(valuesToSave).some(k => valuesToSave[k] !== undefined))) {
             try {
                await saveFormProgress({
                    userId: user.uid,
                    docType: doc.id,
                    state: currentLocaleForSave, 
                    formData: valuesToSave,
                });
            } catch (error) {
                console.error('[WizardForm] Failed to save draft to Firestore:', error);
                toast({ title: "Autosave Failed", description: "Could not save draft to cloud.", variant: "destructive" });
            }
        }
      }
    }, 1000), 
    [isLoggedIn, user?.uid, doc?.id, locale, methods, dirtyFields, toast, params.locale] 
  );

  useEffect(() => {
    const currentLocaleForDraft = params.locale as 'en' | 'es' || locale;
    if (typeof window !== 'undefined' && doc && doc.id && currentLocaleForDraft && isHydrated && methods && methods.watch && methods.formState) {
      const draftKey = `draft-${doc.id}-${currentLocaleForDraft}`;
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
  }, [watch, doc, locale, isHydrated, debouncedSaveToFirestore, methods, dirtyFields, params.locale]);


 const actualSchemaShape = useMemo(() => {
    if (!doc || !doc.schema) {
      console.warn(`[WizardForm actualSchemaShape] Doc or doc.schema is undefined for docId: ${doc?.id}`);
      return undefined;
    }
    const schemaDef = doc.schema._def;
    if (schemaDef?.typeName === 'ZodObject') {
      return doc.schema.shape;
    } else if (schemaDef?.typeName === 'ZodEffects' && schemaDef.schema?._def?.typeName === 'ZodObject') {
      return schemaDef.schema.shape;
    }
    console.warn(`[WizardForm actualSchemaShape] Unhandled Zod schema type for ${doc.id}: ${schemaDef?.typeName}. Cannot derive shape for steps.`);
    return undefined;
  }, [doc]);

 const steps = useMemo(() => {
    if (!isHydrated || !doc) { 
        console.log('[WizardForm steps.useMemo] Not hydrated or no doc, returning [].');
        return [];
    }

    if (doc.questions && doc.questions.length > 0) {
        const mappedQuestions = doc.questions.map(q => ({
            id: q.id,
            label: q.label ? t(q.label, { defaultValue: prettify(q.id) }) : prettify(q.id),
            tooltip: q.tooltip ? t(q.tooltip, { defaultValue: q.tooltip }) : undefined
        }));
        console.log('[WizardForm steps.useMemo] Derived from doc.questions:', mappedQuestions.length, 'steps.');
        return mappedQuestions;
    }

    if (actualSchemaShape && typeof actualSchemaShape === 'object') {
        const shapeKeys = Object.keys(actualSchemaShape);
        if (shapeKeys.length > 0) {
            const schemaDerivedSteps = shapeKeys.map(key => {
                const fieldDef = (actualSchemaShape as any)[key]?._def;
                const questionConfig = doc.questions?.find(q => q.id === key);
                const zodDescription = fieldDef?.description ?? fieldDef?.schema?._def?.description;
                const zodTooltip = (fieldDef as any)?.tooltip ?? (fieldDef?.schema?._def as any)?.tooltip;
                
                let label = prettify(key);
                if (questionConfig?.label) {
                     label = t(questionConfig.label, { defaultValue: questionConfig.label });
                } else if (zodDescription) {
                     label = t(zodDescription, {defaultValue: zodDescription});
                } else {
                    const translationKey = `fields.${key}.label`;
                    const defaultLabel = prettify(key);
                    // Check if translation exists, if not, use prettify
                    // Note: i18n.exists might not be reliable for all backends or might need specific config
                    // A safer approach is to rely on the defaultValue of t()
                    label = t(translationKey, {defaultValue: defaultLabel});
                }

                const tooltip = questionConfig?.tooltip ? t(questionConfig.tooltip, { defaultValue: questionConfig.tooltip })
                              : (zodTooltip ? t(zodTooltip, { defaultValue: zodTooltip })
                              : (zodDescription && zodDescription !== label ? t(zodDescription, { defaultValue: zodDescription }) : undefined));
                return { id: key, label: label, tooltip: tooltip };
            });
            console.log('[WizardForm steps.useMemo] Derived from schema shape:', schemaDerivedSteps.length, 'steps.');
            return schemaDerivedSteps;
        }
    }
    console.warn(`[WizardForm steps.useMemo] No questions derived for doc: ${doc.id}. Returning [].`);
    return [];
  }, [actualSchemaShape, doc, t, i18n.language, isHydrated]);


  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const totalFieldsToFill = steps.length;


  const proceedToApiSubmission = async () => {
    if (!doc || !doc.id) {
      toast({ title: "Error", description: "Document configuration is missing.", variant: "destructive"});
      return;
    }
    const currentApiLocale = params.locale as 'en' | 'es' || locale;
    try {
      const response = await axios.post(`/${currentApiLocale}/api/wizard/${doc.id}/submit`, {
        values: getValues(),
        locale: currentApiLocale,
      });
      toast({ title: t("Submission Successful", { ns: 'translation' }), description: t("Document saved, proceeding to payment.", { ns: 'translation' }) });
      if (typeof window !== 'undefined' && doc.id && currentApiLocale) {
        localStorage.removeItem(`draft-${doc.id}-${currentApiLocale}`);
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
    if (!doc || formIsSubmitting || authIsLoading) return;

    if (isReviewing) {
      if (!authIsLoading) {
        if (!isLoggedIn) {
          setShowAuthModal(true);
          return;
        }
        const allFieldsValidOnReview = await trigger();
        if (!allFieldsValidOnReview) {
            toast({ title: t("Validation Error", { ns: 'translation' }), description: t("Please correct the errors before proceeding.", { ns: 'translation' }), variant: "destructive" });
            return;
        }
        await proceedToApiSubmission();
      } else {
        toast({ title: t("Verifying account...", { ns: 'translation' }), description: t("Please wait.", { ns: 'translation' }) });
      }
      return;
    }
    
    // If there are no steps (schema-only form with no 'questions' array), go directly to review.
    if (totalFieldsToFill === 0) {
      setIsReviewing(true);
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
      if (liveRef.current) setTimeout(() => { if(liveRef.current) liveRef.current.innerText = t('Reviewing answers', { ns: 'translation' }); }, 50);
      return;
    }

    const isLastFieldStep = currentStepIndex === totalFieldsToFill - 1;
    let isValid = false;
    const currentStepFieldKey = steps[currentStepIndex]?.id;

    if (currentStepFieldKey) {
       isValid = await trigger(currentStepFieldKey as any);
    } else if (isLastFieldStep) { // Fallback for last step if currentStepFieldKey is somehow undefined but we are at the last step index
       isValid = await trigger();
    } else {
       console.error("[WizardForm] Error: currentStepFieldKey is undefined in an intermediate step. currentStepIndex:", currentStepIndex, "totalFieldsToFill:", totalFieldsToFill, "steps:", steps);
       isValid = false;
    }


    if (!isValid) {
      toast({
        title: t("Validation Error", { ns: 'translation' }),
        description: t("Please correct the errors on the current step before proceeding.", { ns: 'translation' }),
        variant: "destructive"
      });
      return;
    }

    if (isLastFieldStep) {
      setIsReviewing(true);
      if (liveRef.current) setTimeout(() => { if(liveRef.current) liveRef.current.innerText = t('Reviewing answers', { ns: 'translation' }); }, 50);
    } else {
      setCurrentStepIndex(s => s + 1);
      if (liveRef.current) {
        const nextStepLabel = steps[currentStepIndex + 1]?.label || steps[currentStepIndex + 1]?.id;
        setTimeout(() => {
          if (liveRef.current && nextStepLabel) liveRef.current.innerText = `${t('Moved to step', {ns: 'translation'})} ${t(nextStepLabel, {defaultValue: nextStepLabel})}`;
        }, 50);
      }
    }
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  const handlePreviousStep = () => {
    if (isReviewing) {
      setIsReviewing(false); 
      setCurrentStepIndex(Math.max(0, totalFieldsToFill - 1)); 
       if (liveRef.current) {
        const prevStepLabel = steps[Math.max(0, totalFieldsToFill - 1)]?.label || steps[Math.max(0, totalFieldsToFill - 1)]?.id;
        setTimeout(() => {
          if (liveRef.current && prevStepLabel) liveRef.current.innerText = `${t('Editing field', {ns: 'translation'})} ${t(prevStepLabel, {defaultValue: prevStepLabel})}`;
        }, 50);
      }
    } else if (currentStepIndex > 0) {
      setCurrentStepIndex(s => s - 1);
      if (liveRef.current) {
        const prevStepLabel = steps[currentStepIndex -1]?.label || steps[currentStepIndex -1]?.id;
         setTimeout(() => {
          if (liveRef.current && prevStepLabel) liveRef.current.innerText = `${t('Moved to step', {ns: 'translation'})} ${t(prevStepLabel, {defaultValue: prevStepLabel})}`;
        }, 50);
      }
    }
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleEditFieldFromReview = (fieldIdToEdit: string) => {
    const stepIndex = steps.findIndex(s => s.id === fieldIdToEdit);
    if (stepIndex !== -1) {
        setCurrentStepIndex(stepIndex);
        setIsReviewing(false); 
        if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        toast({ title: "Navigation Error", description: `Could not find field "${prettify(fieldIdToEdit)}" to edit.`, variant: "destructive" });
    }
  };


  const currentField = !isReviewing && totalFieldsToFill > 0 && currentStepIndex < totalFieldsToFill ? steps[currentStepIndex] : null;
  
  const reviewStepIsEffectivelyTheLast = totalFieldsToFill > 0;
  const totalUiSteps = reviewStepIsEffectivelyTheLast ? totalFieldsToFill + 1 : (totalFieldsToFill === 0 ? 1 : 0) ;
  const currentUiStep = isReviewing ? totalUiSteps : (totalFieldsToFill === 0 ? 1 : currentStepIndex + 1);
  const progressValue = totalUiSteps > 0 ? (currentUiStep / totalUiSteps) * 100 : (isReviewing ? 100 :0) ;


  if (!isHydrated || !doc) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">{t('Loading form...', {ns: 'translation'})}</p>
      </div>
    );
  }

  const buttonText = isReviewing
    ? t('dynamicForm.confirmAnswersButton', { ns: 'translation' })
    : totalFieldsToFill === 0 || currentStepIndex === totalFieldsToFill - 1
    ? t('Review Answers', { ns: 'translation' })
    : t('wizard.next', { ns: 'translation' });


  if (totalFieldsToFill === 0 && !isReviewing) {
    return (
        <div className="bg-card rounded-lg shadow-xl p-4 md:p-6 border border-border">
            <p className="text-muted-foreground text-center py-10 min-h-[200px] flex flex-col items-center justify-center">
                {t('dynamicForm.noQuestionsNeeded', { ns: 'translation', documentType: doc.name })}
                 <Button
                    type="button"
                    onClick={handleNextStep} 
                    className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90 min-w-[120px]"
                    disabled={formIsSubmitting || authIsLoading}
                >
                     {buttonText}
                 </Button>
            </p>
            <TrustBadges />
        </div>
    );
  }

 const formContent = currentField && currentField.id ? (
            <div className="mt-6 space-y-6 min-h-[200px]">
               {(doc.schema.shape as any)?.[currentField.id] && (((doc.schema.shape as any)[currentField.id] instanceof z.ZodObject) || (((doc.schema.shape as any)[currentField.id]?._def) && ((doc.schema.shape as any)[currentField.id]._def.typeName === 'ZodObject'))) && (currentField.id.includes('_address') || currentField.id.includes('Address'))) ? (

                <Controller
                  key={`${currentField.id}-controller-address`}
                  control={control}
                  name={currentField.id as any}
                  render={({ field: { onChange: rhfOnChange, value: rhfValue, name: rhfName }}) => (
                      <AddressField
                          name={rhfName as string}
                          label={currentField.label}
                          required={!((doc.schema.shape as any)?.[currentField!.id]?._def?.typeName?.startsWith('ZodOptional'))}
                          error={errors[currentField!.id as any]?.message as string | undefined}
                          placeholder={t("Enter address...", {ns: "translation"})}
                          tooltip={currentField.tooltip || currentField.label}
                          // value={rhfValue || ''} // Value prop is handled by usePlacesAutocomplete internal state
                          // onChange={(val, parts) => { // onChange prop expects (val: string, parts?: ParsedAddress) => void
                          //     rhfOnChange(val); // Update RHF with the raw address string
                          //      if (parts && typeof setValue === 'function') { // Check if setValue is a function
                          //         const prefix = rhfName.replace(/_address$/i, '') || rhfName.replace(/Address$/i, '');
                          //         // Dynamically set related fields if they exist in the schema for this prefix
                          //         if ((actualSchemaShape as any)?.[`${prefix}_city`]) setValue(`${prefix}_city`, parts.city, {shouldValidate: true, shouldDirty: true});
                          //         if ((actualSchemaShape as any)?.[`${prefix}_state`]) setValue(`${prefix}_state`, parts.state, {shouldValidate: true, shouldDirty: true});
                          //         if ((actualSchemaShape as any)?.[`${prefix}_postal_code`]) setValue(`${prefix}_postal_code`, parts.postalCode, {shouldValidate: true, shouldDirty: true});
                          //      }
                          // }}
                      />
                  )}
                />
              ) : (
                <FieldRenderer
                  key={currentField.id}
                  fieldKey={currentField.id}
                  locale={locale}
                  doc={doc} />
              )
            }
            </div>
  ) : null; 


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
             {/* PreviewPane rendered by parent, WizardForm is inside FormProvider */}
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
           />
        ) : formContent }


        <div className="mt-8 flex justify-between items-center">
           { (currentStepIndex > 0 || isReviewing) && (totalFieldsToFill > 0 || (isReviewing && totalFieldsToFill === 0) ) && (
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
          {currentStepIndex === 0 && !isReviewing && totalFieldsToFill > 0 && <div />}


           <Button
              type="button"
              onClick={handleNextStep}
              className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-[120px]"
              disabled={formIsSubmitting || authIsLoading || (isReviewing && !isFormValid && totalFieldsToFill > 0 && Object.keys(errors).length > 0)}
            >
              {formIsSubmitting || authIsLoading ? <Loader2 className="animate-spin h-5 w-5" /> : buttonText}
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

