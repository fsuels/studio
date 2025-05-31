// src/components/WizardForm.tsx
'use client';

import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import axios, { type AxiosError } from 'axios';

import { z } from 'zod';
import { Loader2, Save } from 'lucide-react';

import type { LegalDocument } from '@/lib/document-library';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

import FieldRenderer from './FieldRenderer';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { prettify } from '@/lib/schema-utils';
import AuthModal from '@/components/AuthModal';
import { saveFormProgress } from '@/lib/firestore/saveFormProgress';
import { TooltipProvider } from '@/components/ui/tooltip';
import TrustBadges from '@/components/TrustBadges';
import ReviewStep from '@/components/ReviewStep';
import PaymentModal from '@/components/PaymentModal';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation'; // Added useRouter

interface WizardFormProps {
  locale: 'en' | 'es';
  doc: LegalDocument;
  onComplete: (_checkoutUrlOrPath: string) => void;
}

export default function WizardForm({
  locale,
  doc,
  onComplete,
}: WizardFormProps) {
  const { t } = useTranslation('common');
  const { toast } = useToast(); 
  const { isLoggedIn, isLoading: authIsLoading, user } = useAuth(); // Re-declared if needed, remove if already there
  const router = useRouter(); // Added for direct navigation

  const {
 getValues,
    trigger,
    control,
    setValue,
 formState: { errors, isSubmitting: formIsSubmitting, isValid: isFormValid },
  } = useFormContext<z.infer<typeof doc.schema>>();

  const [isHydrated, setIsHydrated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingSaveDraft, setPendingSaveDraft] = useState(false);
  const [pendingRedirect, setPendingRedirect] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentClientSecret, setPaymentClientSecret] = useState<string | null>(null,
  );
  const [isSavingDraft, setIsSavingDraft] = useState(false); // New state for save draft

  /** single source-of-truth: save → redirect → toast */
  const saveDraftAndRedirect = useCallback(
    async (uid: string) => {
      setIsSavingDraft(true);
      try {
        // keep only defined values
        const filtered = Object.fromEntries(
          Object.entries(getValues()).filter(([, v]) => v !== undefined),
        );

        console.log('[WizardForm] saving for uid →', uid);
        await saveFormProgress({
          userId: uid,
          docType: doc.id,
          state: locale,
          formData: filtered,
        });

        router.replace(`/${locale}/dashboard`);
        toast({
          title: t('Draft Saved'),
          description: t(
            'Your progress is saved. You can resume it from your dashboard.',
          ),
        });
      } catch (err) {
        console.error('[WizardForm] saveFormProgress failed:', err);
        toast({
          title: t('wizard.saveFailedTitle', { defaultValue: 'Save failed' }),
          description: t('wizard.saveFailedDesc', {
            defaultValue: 'We could not save your draft. Please try again.',
          }),
          variant: 'destructive',
        });
      } finally {
        setIsSavingDraft(false);
        setPendingSaveDraft(false);
      }
    },
      [getValues, doc.id, locale, router, toast, t],
  );

  // After a guest successfully auth’s, run save-and-redirect exactly once
  useEffect(() => {
    if (pendingRedirect && user?.uid && !authIsLoading) {
      void saveDraftAndRedirect(user.uid);
      setPendingRedirect(false);
    }
  }, [pendingRedirect, user?.uid, authIsLoading, saveDraftAndRedirect]);

  const liveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (pendingSaveDraft && !isLoggedIn && !authIsLoading) {
      setShowAuthModal(true);
    }
  }, [pendingSaveDraft, isLoggedIn, authIsLoading]);

  const actualSchemaShape = useMemo<
    Record<string, z.ZodTypeAny> | undefined
  >(() => {
    const def = doc.schema?._def;
    if (!def) return undefined;
    return def.typeName === 'ZodEffects'
      ? (def.schema.shape as Record<string, z.ZodTypeAny>)
      : def.typeName === 'ZodObject'
        ? (def.shape as Record<string, z.ZodTypeAny>)
        : undefined;
  }, [doc.schema]);

  const steps = useMemo(() => {
    if (doc.questions && doc.questions.length > 0) {
      return doc.questions.map((q) => {
        const fieldDef = actualSchemaShape?.[q.id]?._def;
        const labelFromDescription =
          fieldDef?.description ?? fieldDef?.schema?._def?.description;

        const label = q.label
          ? t(q.label, { defaultValue: q.label })
          : labelFromDescription
            ? t(labelFromDescription, { defaultValue: labelFromDescription })
            : t(`fields.${q.id}.label`, { defaultValue: prettify(q.id) });

        const tooltip = q.tooltip
          ? t(q.tooltip, { defaultValue: q.tooltip })
          : t(fieldDef?.tooltip || fieldDef?.schema?._def?.tooltip || '', {
              defaultValue:
                fieldDef?.tooltip || fieldDef?.schema?._def?.tooltip || '',
            }) || undefined;

        return { id: q.id, label, tooltip };
      });
    }

    if (!actualSchemaShape) return [];

    return Object.keys(actualSchemaShape).map((key) => {
      const fieldDef = actualSchemaShape[key]?._def;
      const labelFromDescription =
        fieldDef?.description ?? fieldDef?.schema?._def?.description;
      const fieldLabel = labelFromDescription
        ? t(labelFromDescription, { defaultValue: labelFromDescription })
        : t(`fields.${key}.label`, { defaultValue: prettify(key) });

      return {
        id: key,
        label: fieldLabel,
        tooltip:
          t(fieldDef?.tooltip || fieldDef?.schema?._def?.tooltip || '', {
            defaultValue:
              fieldDef?.tooltip || fieldDef?.schema?._def?.tooltip || '',
          }) || undefined,
      };
    });
  }, [doc.questions, actualSchemaShape, t]);

  const totalSteps = steps.length;
  const currentField =
    !isReviewing && totalSteps > 0 && currentStepIndex < totalSteps
      ? steps[currentStepIndex]
      : null;
  const progress =
    totalSteps > 0
      ? ((isReviewing ? totalSteps : currentStepIndex + 1) / totalSteps) * 100
      : 0;

  const handlePreviousStep = useCallback(() => {
    if (isReviewing) {
      setIsReviewing(false);
      // currentStepIndex remains at last step, so user can edit last question
    } else if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  }, [isReviewing, currentStepIndex]);

  const handleNextStep = useCallback(async () => {
    let isValid = false;
    const currentStepFieldKey = steps[currentStepIndex]?.id;

    if (isReviewing) {
      // Final validation of all fields before proceeding to payment/generation
      const allFieldsValid = await trigger();
      if (!allFieldsValid) {
        toast({
          title: t('Validation Failed'),
          description: t(
            'Some information is still missing or invalid. Please review all fields.',
          ),
          variant: 'destructive',
        });
        return;
      }

      if (!isLoggedIn) {
        setShowAuthModal(true);
        return;
      }
      try {
        const res = await axios.post(`/${locale}/api/wizard/${doc.id}/submit`, {
          values: getValues(),
          locale,
        });
        const secret = res.data.clientSecret as string | undefined;
        if (secret) {
          setPaymentClientSecret(secret);
          setShowPaymentModal(true);
        } else {
          toast({
            title: t('Error', { defaultValue: 'Error' }),
            description: t('Payment initiation failed', {
              defaultValue: 'Payment initiation failed',
            }),
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('[WizardForm] API submission error:', error);
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<{
            error?: string;
            details?: unknown;
            code?: string;
          }>;
          const apiErrorMsg =
            axiosError.response?.data?.error || axiosError.message;
          const apiErrorDetails = axiosError.response?.data?.details;
          let userFriendlyMessage = `${t('API Error Occurred', { defaultValue: 'API Error Occurred' })}: ${apiErrorMsg}`;
          if (apiErrorDetails && typeof apiErrorDetails === 'object') {
            userFriendlyMessage += ` Details: ${JSON.stringify(apiErrorDetails, null, 2)}`;
          }
          toast({
            title: t('API Error Occurred', {
              defaultValue: 'API Error Occurred',
            }),
            description: userFriendlyMessage,
            variant: 'destructive',
          });
        } else {
          toast({
            title: t('Error', { defaultValue: 'Error' }),
            description: t('An unexpected error occurred.', {
              defaultValue: 'An unexpected error occurred.',
            }),
            variant: 'destructive',
          });
        }
      }
      return;
    }

    if (steps.length === 0) {
      // No questions, validate the whole form (if any fields exist outside questions array)
      const allValidForNoSteps = await trigger();
      if (allValidForNoSteps) {
        setIsReviewing(true);
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else {
        toast({
          title: t('Validation Failed'),
          description: t('Please correct all errors before reviewing.'),
          variant: 'destructive',
        });
      }
      return;
    }

    // Validate current step's field if it exists
    if (currentStepFieldKey) {
      isValid = await trigger(currentStepFieldKey as string);
    } else if (totalSteps > 0 && currentStepIndex < totalSteps) {
      // This case should ideally not be hit if steps and currentStepIndex are managed correctly.
      // It means there's a step but no corresponding field key.
      console.error(
        'Error: currentStepFieldKey is undefined but totalSteps > 0. currentStepIndex:',
        currentStepIndex,
        'steps:',
        steps,
      );
      isValid = false; // Assume invalid if field key is missing
    } else {
      // If there are no steps or we are past the last step (which shouldn't happen if isReviewing handles the end)
      // Validate the whole form.
      isValid = await trigger();
    }

    if (!isValid) {
      toast({
        title: t('wizard.incompleteFieldsNotice'),
        variant: 'destructive',
      });
      // Do not proceed if the current step is invalid
      // return;
    }

    // Proceed to next step or review
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      // If on the last question, validate all fields before moving to review
      const allFieldsValid = await trigger();
      if (allFieldsValid) {
        setIsReviewing(true);
      } else {
        toast({
          title: t('Validation Failed'),
          description: t(
            'Please correct all errors before reviewing your answers.',
          ),
          variant: 'destructive',
        });
        return; // Stay on current step if overall validation fails
      }
    }
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (liveRef.current && currentField) {
      liveRef.current.innerText = `${currentField.label} ${t('updated', { defaultValue: 'updated' })}`;
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
    doc,
    getValues,
    toast,
    t,
    currentField,
  ]);

  const handlePaymentSuccess = useCallback(() => {
    localStorage.removeItem(`draft-${doc.id}-${locale}`);
    setShowPaymentModal(false);
    setPaymentClientSecret(null);
    onComplete(`/${locale}/dashboard?paymentSuccess=true&docId=${doc.id}`); // Redirect to dashboard
  }, [doc.id, locale, onComplete]);

  const handleSkipStep = useCallback(async () => {
    // Validate current field before skipping, if it's required.
    // This is optional, depends on desired UX. If strict, remove this or validate.
    // For now, let's allow skipping without validation of current field.
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      // If on last step, "skip" means "go to review".
      // Validate all fields before going to review.
      const allFieldsValid = await trigger();
      if (allFieldsValid) {
        setIsReviewing(true);
      } else {
        toast({
          title: t('Validation Failed'),
          description: t(
            'Please correct all errors before reviewing your answers.',
          ),
          variant: 'destructive',
        });
        return;
      }
    }
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStepIndex, totalSteps, trigger, toast, t]);

  const handleSaveAndFinishLater = useCallback(async () => {
    if (isSavingDraft || formIsSubmitting) return;

    if (user?.uid) {
      void saveDraftAndRedirect(user.uid);
      return;
    }

    // guest: ask for auth, then effect will save + redirect
    setPendingSaveDraft(true);
    setPendingRedirect(true);
    setShowAuthModal(true);
  }, [isSavingDraft, formIsSubmitting, user?.uid, saveDraftAndRedirect]);

  const handleAuthSuccess = useCallback(
    (_mode, uid) => {
      setShowAuthModal(false);
      // saveDraftAndRedirect will fire via the pendingRedirect effect
    },
    [],
  );

  if (!isHydrated || authIsLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">
          {t('Loading document wizard...')}
        </p>
      </div>
    );
  }

  const buttonText = isReviewing
    ? t('wizard.generateDocument')
    : t('wizard.saveContinue');

  const formContent =
    currentField &&
    currentField.id &&
    actualSchemaShape &&
    actualSchemaShape[currentField.id] ? (
      <div className="mt-6 space-y-6 min-h-[200px]">
        {actualSchemaShape[currentField.id] &&
        (actualSchemaShape[currentField.id] instanceof z.ZodObject ||
          ('_def' in actualSchemaShape[currentField.id] &&
            (actualSchemaShape[currentField.id] as z.ZodTypeAny)._def
              .typeName === 'ZodObject')) &&
        (currentField.id.includes('_address') ||
          currentField.id.includes('Address')) ? (
          <Controller
            key={`${currentField.id}-controller`}
            control={control}
            name={currentField.id as string}
            render={({
              field: { onChange: rhfOnChange, value: rhfValue, name: rhfName },
            }) => (
              <AddressField
                name={rhfName}
                label={currentField.label}
                required={
                  (
                    doc.questions?.find((q) => q.id === currentField.id) ||
                    actualSchemaShape[currentField.id]?._def
                  )?.required
                }
                error={
                  (errors as Record<string, { message?: string }>)?.[
                    currentField.id
                  ]?.message as string | undefined
                }
                placeholder={t('Enter address...')}
                value={rhfValue || ''}
                onChange={(val, parts) => {
                  rhfOnChange(val);
                  if (parts && actualSchemaShape) {
                    const prefix =
                      currentField.id.replace(/_address$/i, '') ||
                      currentField.id.replace(/Address$/i, '');
                    if (actualSchemaShape[`${prefix}_city`])
                      setValue(`${prefix}_city` as string, parts.city, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    if (actualSchemaShape[`${prefix}_state`])
                      setValue(`${prefix}_state` as string, parts.state, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    if (actualSchemaShape[`${prefix}_postal_code`])
                      setValue(
                        `${prefix}_postal_code` as string,
                        parts.postalCode,
                        {
                          shouldValidate: true,
                          shouldDirty: true,
                        },
                      );
                  }
                }}
                tooltip={currentField.tooltip}
              />
            )}
          />
        ) : (
          <FieldRenderer
            key={currentField.id}
            fieldKey={currentField.id}
            doc={doc}
          />
        )}
      </div>
    ) : (doc.questions?.length || 0) === 0 && !isReviewing ? (
      <div className="mt-6 min-h-[200px] flex flex-col items-center justify-center text-center">
        <p className="text-muted-foreground mb-4">
          {t('dynamicForm.noQuestionsNeeded', {
            documentType:
              locale === 'es'
                ? doc.translations?.es?.name ||
                  doc.translations?.en?.name ||
                  doc.name
                : doc.translations?.en?.name ||
                  doc.name ||
                  doc.translations?.es?.name,
          })}
        </p>
      </div>
    ) : null;

  return (
    <>
      <TooltipProvider>
        <div className="bg-card rounded-lg shadow-xl p-4 md:p-6 border border-border">
          <div className="mb-6">
            {totalSteps > 0 && (
              <>
                <Progress
                  value={progress}
                  className="w-full h-2"
                  aria-label="Progress"
                />
                <p className="text-xs text-muted-foreground mt-1 text-right">
                  {Math.round(progress)}% {t('Complete')}
                </p>
              </>
            )}
          </div>

          {isReviewing ? <ReviewStep doc={doc} locale={locale} /> : formContent}

          <div className="sr-only" aria-live="polite" ref={liveRef}></div>

          {!isReviewing && <TrustBadges className="mt-6" />}

          <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            {(currentStepIndex > 0 || isReviewing) && totalSteps > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={handlePreviousStep}
          disabled={formIsSubmitting || authIsLoading || isSavingDraft}
                className="text-foreground border-border hover:bg-muted w-full sm:w-auto"
              >
 {t('Back')}
              </Button>
            )}
            {!(currentStepIndex > 0 || isReviewing) && totalSteps > 0 && (
              <div className="w-full sm:w-auto" />
            )}{' '}
            {/* Placeholder for spacing when Back button is not shown */}
            {!isReviewing && totalSteps > 0 && currentStepIndex < totalSteps && (
              <Button
                type="button"
                variant="ghost"
                onClick={handleSkipStep}
            disabled={formIsSubmitting || authIsLoading || isSavingDraft}
                className="border border-dashed text-muted-foreground w-full sm:w-auto"
              >
                {t('wizard.skipQuestion')}
              </Button>
            )}
            <Button
              type="button"
              onClick={handleNextStep}
              className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-[120px] w-full sm:w-auto"
              disabled={
                formIsSubmitting ||
                authIsLoading ||
                isSavingDraft ||
                (isReviewing && !isFormValid && Object.keys(errors).length > 0)
              }
            >
              {formIsSubmitting || authIsLoading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                buttonText
              )}
            </Button>
          </div>

          {/* Save and Finish Later Button - visible on all steps */}
          <div className="mt-6 pt-4 border-t border-border text-center">
            <Button
              type="button"
              variant="ghost"
              onClick={handleSaveAndFinishLater}
              disabled={formIsSubmitting || authIsLoading || isSavingDraft}
              className="text-sm text-muted-foreground"
            >
              {isSavingDraft ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('wizard.savingDraft', { defaultValue: 'Saving Draft...' })}
                </>
              ) : (
                <>
                  {t('wizard.saveFinishLater', {
                    defaultValue: 'Save and finish later',
                  })}
                  <Save className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </TooltipProvider>
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          setPendingSaveDraft(false);
        }}
        onAuthSuccess={handleAuthSuccess}
      />
      <PaymentModal
        open={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        clientSecret={paymentClientSecret}
        documentName={
          locale === 'es'
            ? doc.translations?.es?.name || doc.translations?.en?.name || doc.name
            : doc.translations?.en?.name || doc.name || doc.translations?.es?.name
        }
        priceCents={(doc.basePrice || 35) * 100}
        onSuccess={handlePaymentSuccess}
      />
    </>
  );
}
