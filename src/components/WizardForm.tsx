// src/components/WizardForm.tsx
'use client';

import { useFormContext } from 'react-hook-form'; // Changed from useForm
// Remove: import { zodResolver } from '@hookform/resolvers/zod'; // Resolver is handled by parent
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
import { z } from 'zod';
import type { BillOfSaleData } from '@/schemas/billOfSale';
import AuthModal from '@/components/AuthModal';
import { useAuth } from '@/hooks/useAuth';
// Removed useRouter as it's handled by onComplete prop

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

  const {
    watch,
    getValues,
    trigger,
    reset,
    formState: { errors, isSubmitting: formIsSubmitting }
  } = useFormContext<z.infer<typeof doc.schema>>();


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
      } else if (doc.id === 'bill-of-sale-vehicle') {
         defaultValuesToSet = { sale_date: new Date().toISOString().split('T')[0] } as Partial<BillOfSaleData> as any;
      }
      reset(defaultValuesToSet);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doc.id, locale, reset]);


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
      toast({ title: t("Submission Successful"), description: t("Document saved, proceeding to payment.") });
      if (typeof window !== 'undefined') localStorage.removeItem(`draft-${doc.id}-${locale}`);
      onComplete(response.data.checkoutUrl);
    } catch (error: any) {
      console.error('Submission error in WizardForm:', error);
      let title = t("Submission Failed");
      let description = t("An unexpected error occurred. Please try again.");

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<any>;
        title = t(`API Error Occurred`, { status: axiosError.response?.status || '' }).trim();
        description = axiosError.response?.data?.error || axiosError.message;
        if(axiosError.response?.data?.details && typeof axiosError.response.data.details === 'object') {
          const detailsString = Object.entries(axiosError.response.data.details.fieldErrors || {})
            .map(([field, messages]) => `${prettify(field)}: ${(messages as string[]).join(', ')}`)
            .join('; ');
          if (detailsString) description += ` ${t("Details")}: ${detailsString}`;
        } else if (axiosError.response?.data?.details && typeof axiosError.response.data.details === 'string') {
          description += ` ${t("Details")}: ${axiosError.response.data.details}`;
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
    } else if (totalSteps > 0 && !currentStepField) {
      console.error("Error: currentStepField is undefined but totalSteps > 0. currentStepIndex:", currentStepIndex, "steps:", steps);
      isValid = false;
    }

    if (!isValid) {
      toast({ title: t("Validation Error"), description: t("Please correct the errors before proceeding."), variant: "destructive" });
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
      if (!authIsLoading) {
        if (!isLoggedIn) {
          setShowAuthModal(true);
          return;
        }
        await proceedToApiSubmission();
      } else {
        toast({ title: "Verifying account...", description: "Please wait."});
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
              disabled={formIsSubmitting || authIsLoading}
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
              disabled={formIsSubmitting || authIsLoading}
            >
              {formIsSubmitting || authIsLoading ? <Loader2 className="animate-spin h-5 w-5" /> :
              (currentStepIndex === totalSteps - 1 || totalSteps === 0 ? t('dynamicForm.confirmAnswersButton') : t('wizard.next'))}
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
  );
}
