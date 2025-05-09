// src/components/WizardForm.tsx
'use client';

import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useForm, FormProvider, Controller, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useRouter, useParams } from 'next/navigation';
import { z } from 'zod';
import { Loader2, Info } from 'lucide-react';

import type { LegalDocument } from '@/lib/document-library';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

import FieldRenderer from './FieldRenderer';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { prettify } from '@/lib/schema-utils';
import AuthModal from '@/components/AuthModal';
import { useAuth } from '@/hooks/useAuth';
import AddressField from '@/components/AddressField'; 
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
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const { isLoggedIn, isLoading: authIsLoading, user } = useAuth();

  const [isHydrated, setIsHydrated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false); // Initialized to false
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const liveRef = useRef<HTMLDivElement>(null);

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
    setValue,
    reset, // Added reset
    formState: { errors, isSubmitting: formIsSubmitting, isValid: isFormValid, dirtyFields },
  } = methods;

  useEffect(() => {
    setIsHydrated(true);
  }, []);
  
  // Load draft from localStorage or Firestore
  useEffect(() => {
    async function loadDraft() {
      if (!doc?.id || !isHydrated || authIsLoading) return;
      let draftData: Partial<z.infer<typeof doc.schema>> = {};
      try {
        if (isLoggedIn && user?.uid) {
          draftData = await loadFormProgress({ userId: user.uid, docType: doc.id, state: locale });
        } else {
          const lsKey = `draft-${doc.id}-${locale}`;
          const lsDraft = localStorage.getItem(lsKey);
          if (lsDraft) draftData = JSON.parse(lsDraft);
        }
      } catch (e) {
        console.warn('[WizardForm] Draft loading failed:', e);
      }
      if (Object.keys(draftData).length > 0) {
        reset(draftData); // Reset form with loaded draft data
        console.log('[WizardForm] Draft loaded:', draftData);
      } else {
        // If no draft, ensure default values from schema are applied if any
        // RHF handles this if defaultValues in useForm is set up with schema defaults
        // For now, an empty object is fine, or explicit schema defaults could be used here.
        console.log('[WizardForm] No draft found, using initial/empty values.');
      }
    }
    loadDraft();
  }, [doc?.id, locale, isHydrated, reset, authIsLoading, isLoggedIn, user]);


  const debouncedSave = useCallback(
    debounce(async (data: Record<string, any>) => {
      if (!doc?.id || authIsLoading || !isHydrated || Object.keys(data).length === 0) return;
      
      const relevantDataToSave = Object.keys(data).reduce((acc, key) => {
        if (data[key] !== undefined) { // Only save defined values
            acc[key] = data[key];
        }
        return acc;
      }, {} as Record<string,any>);

      if (Object.keys(relevantDataToSave).length === 0) return;


      if (isLoggedIn && user?.uid) {
        await saveFormProgress({ userId: user.uid, docType: doc.id, state: locale, formData: relevantDataToSave });
      } else {
         localStorage.setItem(`draft-${doc.id}-${locale}`, JSON.stringify(relevantDataToSave));
      }
      console.log('[WizardForm] Autosaved draft for:', doc.id, locale, relevantDataToSave);
    }, 1000),
    [isLoggedIn, user?.uid, doc?.id, locale, authIsLoading, isHydrated] 
  );

  useEffect(() => {
    if (!doc?.id || authIsLoading || !isHydrated) return () => {};
    
    const subscription = watch((values) => {
       debouncedSave(values as Record<string, any>);
    });
    return () => {
      subscription.unsubscribe();
      debouncedSave.cancel();
    } ;
  }, [watch, doc?.id, debouncedSave, authIsLoading, isHydrated]);


  const actualSchemaShape = useMemo(() => {
    const def = doc.schema?._def;
    if (!def) return undefined;
    return def.typeName === 'ZodEffects' ? def.schema.shape : def.typeName === 'ZodObject' ? def.shape : undefined;
  }, [doc.schema]);


  const steps = useMemo(() => {
    if (!actualSchemaShape) return [];
    return Object.keys(actualSchemaShape).map(key => {
       const fieldDef = (actualSchemaShape as any)[key]?._def;
       const labelFromDescription = fieldDef?.description ?? fieldDef?.schema?._def?.description;
       let fieldLabel = prettify(key); 

        const questionConfig = doc.questions?.find(q => q.id === key);
        if (questionConfig?.label) {
          fieldLabel = t(questionConfig.label, { defaultValue: questionConfig.label });
        } else if (labelFromDescription) { 
          fieldLabel = t(labelFromDescription, { defaultValue: labelFromDescription });
        } else { 
           fieldLabel = t(`fields.${key}.label`, { defaultValue: prettify(key) });
        }
       
       return {
         id: key,
         label: fieldLabel,
         tooltip: t((fieldDef?.tooltip || fieldDef?.schema?._def?.tooltip || ''), { defaultValue: (fieldDef?.tooltip || fieldDef?.schema?._def?.tooltip || '')}) || undefined
       };
    });
  }, [actualSchemaShape, t, doc.questions]);


  const totalSteps = steps.length;
  const currentField = !isReviewing && totalSteps > 0 && currentStepIndex < totalSteps ? steps[currentStepIndex] : null;
  const progress = totalSteps > 0 ? ((isReviewing ? totalSteps : currentStepIndex + 1) / totalSteps) * 100 : 0;


  const handlePreviousStep = useCallback(() => {
    if (isReviewing) {
      setIsReviewing(false);
       // setCurrentStepIndex is already 0-based, so ensure it doesn't go below 0
      setCurrentStepIndex(Math.max(0, totalSteps - 1)); 
    } else if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  }, [isReviewing, currentStepIndex, totalSteps]);

  const handleNextStep = useCallback(async () => {
    let isValid = false;
    const currentStepFieldKey = steps[currentStepIndex]?.id;

    if (isReviewing) {
      isValid = await trigger(); 
      if (isValid) {
        if (!isLoggedIn) {
          setShowAuthModal(true);
          return;
        }
         try {
          const response = await axios.post(`/${locale}/api/wizard/${doc.id}/submit`, { 
            values: getValues(),
            locale, 
          });
          localStorage.removeItem(`draft-${doc.id}-${locale}`);
          onComplete(response.data.checkoutUrl);
        } catch (error) {
          console.error("[WizardForm] API submission error:", error);
          if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<{ error?: string; details?: any; code?: string }>;
            const apiErrorMsg = axiosError.response?.data?.error || axiosError.message;
            const apiErrorDetails = axiosError.response?.data?.details;
            let userFriendlyMessage = `${t('API Error Occurred', { ns: 'translation', defaultValue: "API Error Occurred"})}: ${apiErrorMsg}`;
            if (apiErrorDetails && typeof apiErrorDetails === 'object') {
                 userFriendlyMessage += ` Details: ${JSON.stringify(apiErrorDetails, null, 2)}`;
            }
            toast({
              title: t('API Error Occurred', { ns: 'translation', defaultValue: "API Error Occurred"}),
              description: userFriendlyMessage,
              variant: "destructive",
            });
          } else {
            toast({
              title: t('Error', { ns: 'translation', defaultValue: "Error"}),
              description: t('An unexpected error occurred.', { ns: 'translation', defaultValue: "An unexpected error occurred."}),
              variant: "destructive",
            });
          }
        }
      } else {
        toast({ title: t('Validation Failed', { ns: 'translation'}), description: t('Please correct the errors in the form.',{ns: 'translation'}), variant: 'destructive' });
      }
      return;
    }
    
    if (steps.length === 0) { 
      const allValidForNoSteps = await trigger();
      if(allValidForNoSteps) {
        setIsReviewing(true);
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else {
        toast({ title: t('Validation Failed', { ns: 'translation'}), description: t('Please correct all errors before reviewing.', {ns: 'translation'}), variant: 'destructive' });
      }
      return;
    }


    if (currentStepFieldKey) {
      isValid = await trigger(currentStepFieldKey as any);
    } else if (totalSteps > 0 && currentStepIndex < totalSteps) {
      console.error("[WizardForm] Error: currentField.id is undefined but attempting to proceed. currentStepIndex:", currentStepIndex, "steps:", steps);
      isValid = false; 
    } else { // This case should ideally not be reached if totalSteps > 0 and currentStepIndex < totalSteps
      isValid = true; 
    }


    if (!isValid) {
      toast({ title: t('Validation Error', {ns: 'translation'}), description: t('Please correct the field before proceeding.',{ns: 'translation'}), variant: 'destructive'});
      return;
    }

    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else { // Reached the end of form fields
      const allFieldsValid = await trigger(); 
      if (allFieldsValid) {
        setIsReviewing(true);
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else {
         toast({ title: t('Validation Failed', { ns: 'translation'}), description: t('Please correct all errors before reviewing.', {ns: 'translation'}), variant: 'destructive' });
      }
    }

    if (liveRef.current && currentField) {
      liveRef.current.innerText = `${currentField.label} ${t('updated', { ns: 'translation', defaultValue: 'updated' })}`;
      setTimeout(() => {
        if (liveRef.current) liveRef.current.innerText = '';
      }, 1000);
    }
  }, [
    currentStepIndex,
    steps,
    totalSteps,
    isReviewing,
    isLoggedIn,
    trigger,
    locale,
    doc.id,
    getValues,
    onComplete,
    toast,
    t,
    currentField, // Added currentField
    doc.schema // Added doc.schema to dependency array for actualSchemaShape re-calculation
  ]);

  if (!isHydrated || authIsLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">
          {t('Loading document wizard...', { ns: 'translation' })}
        </p>
      </div>
    );
  }

  const buttonText = isReviewing
    ? t('Submit & Proceed to Payment', { ns: 'translation' })
    : (steps.length === 0 || currentStepIndex === totalSteps - 1) 
    ? t('Review Answers', { ns: 'translation' })
    : t('wizard.next', { ns: 'translation' });


  const formContent = currentField && currentField.id && actualSchemaShape && (actualSchemaShape as any)[currentField.id] ? (
            <div className="mt-6 space-y-6 min-h-[200px]">
               {(actualSchemaShape as any)?.[currentField.id] && ((actualSchemaShape as any)[currentField.id] instanceof z.ZodObject || ((actualSchemaShape as any)[currentField.id]._def && (actualSchemaShape as any)[currentField.id]._def.typeName === 'ZodObject')) && (currentField.id.includes('_address') || currentField.id.includes('Address')) ? (

                 <Controller
                   key={`${currentField.id}-controller`}
                   control={control}
                   name={currentField.id as any}
                   render={({ field: { onChange: rhfOnChange, value: rhfValue, name: rhfName } }) => (
                     <AddressField
                       name={rhfName} 
                       label={currentField.label}
                       required={(doc.questions?.find(q => q.id === currentField.id) || (actualSchemaShape as any)?.[currentField.id]?._def)?.required}
                       error={errors[currentField.id as any]?.message as string | undefined}
                       placeholder={t("Enter address...")}
                       value={rhfValue || ''} 
                       onChange={(val, parts) => { 
                         rhfOnChange(val);
                          if (parts) {
                            const prefix = currentField.id.replace(/_address$/i, '') || currentField.id.replace(/Address$/i, '');
                            if ((actualSchemaShape as any)?.[`${prefix}_city`]) setValue(`${prefix}_city`, parts.city, {shouldValidate: true, shouldDirty: true});
                            if ((actualSchemaShape as any)?.[`${prefix}_state`]) setValue(`${prefix}_state`, parts.state, {shouldValidate: true, shouldDirty: true});
                            if ((actualSchemaShape as any)?.[`${prefix}_postal_code`]) setValue(`${prefix}_postal_code`, parts.postalCode, {shouldValidate: true, shouldDirty: true});
                          }
                       }}
                       tooltip={currentField.tooltip}
                     />
                   )}
                 />
              ) : (
                <FieldRenderer key={currentField.id} fieldKey={currentField.id} locale={locale} doc={doc} />
              )}
            </div>
          ) : totalSteps === 0 && !isReviewing ? (
             <div className="mt-6 min-h-[200px] flex flex-col items-center justify-center text-center">
                <p className="text-muted-foreground mb-4">{t('dynamicForm.noQuestionsNeeded', {ns: 'translation', documentType: doc.name_es && locale==='es' ? doc.name_es : doc.name})}</p>
             </div>
          ) : null;

  return (
    <> {/* Root Fragment to wrap TooltipProvider and AuthModal */}
      <TooltipProvider>
        <div className="bg-card rounded-lg shadow-xl p-4 md:p-6 border border-border">
          <div className="mb-6">
            {totalSteps > 0 && (
              <>
                <Progress value={progress} className="w-full h-2" />
                <p className="text-xs text-muted-foreground mt-1 text-right">
                  {Math.round(progress)}% {t('Complete', {ns: 'translation'})}
                </p>
              </>
            )}
          </div>

          {isReviewing ? (
             <ReviewStep doc={doc} locale={locale} />
          ) : formContent }
          
          <div className="sr-only" aria-live="polite" ref={liveRef}></div>

          <TrustBadges />

          <div className="mt-8 flex justify-between items-center">
            {(currentStepIndex > 0 || isReviewing) && (
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
            {/* Ensure this div exists to balance flexbox when Back button isn't rendered, only if totalSteps > 0 to avoid showing it for no-step forms */}
            {!(currentStepIndex > 0 || isReviewing) && totalSteps > 0 && <div />}


            <Button
              type="button"
              onClick={handleNextStep}
              className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-[120px]"
              disabled={formIsSubmitting || authIsLoading || (isReviewing && !isFormValid && Object.keys(errors).length > 0)}
            >
              {formIsSubmitting || authIsLoading ? <Loader2 className="animate-spin h-5 w-5" /> : buttonText}
            </Button>
          </div>
        </div>
      </TooltipProvider>
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={() => {
          setShowAuthModal(false);
          if (isLoggedIn && isReviewing) { 
             handleNextStep(); 
          }
        }}
      />
    </>
  );
}
