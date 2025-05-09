// src/components/WizardForm.tsx
'use client';

import { useFormContext, Controller } from 'react-hook-form';
// zodResolver is no longer needed here as form is initialized in parent
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
// saveFormProgress, loadFormProgress, and debounce are no longer needed here

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

  // Get methods from FormProvider context
  const methods = useFormContext<z.infer<typeof doc.schema>>();
  
  const {
    getValues,
    trigger,
    control,
    formState: { errors, isSubmitting: formIsSubmitting, isValid: isFormValid }
  } = methods;


  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Draft loading and saving logic is now handled by StartWizardPage

  const steps = useMemo(() => {
    if (!doc || !doc.schema) {
        console.warn("[WizardForm] Steps calc: Document or schema is missing for doc:", doc?.name);
        return [];
    }

    let shapeObject: Record<string, any> | undefined;
    const schemaDef = doc.schema._def;

    if (schemaDef?.typeName === 'ZodObject') {
        shapeObject = doc.schema.shape;
    } else if (schemaDef?.typeName === 'ZodEffects' && schemaDef.schema?._def?.typeName === 'ZodObject') {
        shapeObject = schemaDef.schema.shape;
    } else {
        console.warn("[WizardForm] Steps calc: Schema is not a ZodObject or ZodEffects wrapping ZodObject. Type:", schemaDef?.typeName, "Doc:", doc.name);
        return [];
    }
    
    if (!shapeObject || typeof shapeObject !== 'object' || Object.keys(shapeObject).length === 0) {
        console.warn("[WizardForm] Steps calc: Derived shape is invalid or empty for doc:", doc.name, "Shape Object:", shapeObject);
        return [];
    }

    return Object.keys(shapeObject).map(key => ({ 
      id: key, 
      label: (shapeObject![key] && (shapeObject![key] as any)._def && typeof (shapeObject![key] as any)._def.description === 'string' && (shapeObject![key] as any)._def.description) ? (shapeObject![key] as any)._def.description : prettify(key) 
    }));
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
      return;
    } else if (currentStepIndex >= totalSteps -1 && totalSteps > 0) {
        isValid = await trigger();
         if (isValid) {
            setIsReviewing(true);
            return;
        }
    } else if (!currentStepFieldKey && totalSteps > 0 && currentStepIndex < totalSteps) {
       console.error("Error: currentStepField is undefined but totalSteps > 0. currentStepIndex:", currentStepIndex, "totalSteps:", totalSteps, "steps:", steps);
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
  
  const currentField = !isReviewing && steps.length > 0 && currentStepIndex < steps.length ? steps[currentStepIndex] : null;
  const progressValue = totalSteps > 0 ? ((isReviewing ? totalSteps : currentStepIndex) / totalSteps) * 100 : (isReviewing ? 100 : 0);

  let currentFieldSchemaDefinition: z.ZodTypeAny | undefined;
  if (currentField && currentField.id && doc.schema && doc.schema._def) {
      let shapeObjForCurrentField: Record<string, any> | undefined;
      if (doc.schema._def.typeName === 'ZodObject') {
          shapeObjForCurrentField = doc.schema.shape;
      } else if (doc.schema._def.typeName === 'ZodEffects' && doc.schema._def.schema?._def?.typeName === 'ZodObject') {
          shapeObjForCurrentField = doc.schema._def.schema.shape;
      }
      if (shapeObjForCurrentField && currentField.id in shapeObjForCurrentField) {
          currentFieldSchemaDefinition = shapeObjForCurrentField[currentField.id];
      } else if(shapeObjForCurrentField) {
        console.warn(`Field key "${currentField.id}" not found in schema shape for doc "${doc.name}". Available keys:`, Object.keys(shapeObjForCurrentField));
      }
  }


  if (!isHydrated) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="bg-card rounded-lg shadow-xl p-4 md:p-6 border border-border">
        
        <div className="lg:hidden mb-4 flex justify-center">
          <Button variant="outline" onClick={() => setShowMobilePreview(!showMobilePreview)}>
            {showMobilePreview ? t('Hide Preview') : t('Show Preview')}
          </Button>
        </div>

        {showMobilePreview && (
          <div className="lg:hidden mb-6 h-96">
             {/* PreviewPane needs to be wrapped in FormProvider or receive watch directly */}
             {/* This will be fixed when PreviewPane is lifted */}
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
             {currentFieldSchemaDefinition && (currentFieldSchemaDefinition._def?.typeName === 'ZodObject' || (currentFieldSchemaDefinition._def as any)?.innerType?._def?.typeName === 'ZodObject') && (currentField.id.includes('_address') || currentField.id.includes('Address')) ? (
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
  );
}
