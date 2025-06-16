// src/components/forms/WizardForm/WizardNavigation.tsx
'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { TouchButton } from '@/components/ui/TouchInteractions';
import { Loader2, Save } from 'lucide-react';

interface WizardNavigationProps {
  currentStepIndex: number;
  totalSteps: number;
  isReviewing: boolean;
  formIsSubmitting: boolean;
  authIsLoading: boolean;
  isSavingDraft: boolean;
  onPreviousStep: () => void;
  onNextStep: () => void;
  onSaveAndFinishLater: () => void;
}

export default function WizardNavigation({
  currentStepIndex,
  totalSteps,
  isReviewing,
  formIsSubmitting,
  authIsLoading,
  isSavingDraft,
  onPreviousStep,
  onNextStep,
  onSaveAndFinishLater,
}: WizardNavigationProps) {
  const { t } = useTranslation('common');

  const isLastStep = currentStepIndex === totalSteps - 1;
  const canGoBack = (currentStepIndex > 0 || isReviewing) && totalSteps > 0;
  const isDisabled = formIsSubmitting || authIsLoading || isSavingDraft;

  const getButtonText = () => {
    if (isReviewing) {
      return t('wizard.generateDocument', { defaultValue: 'Generate Document' });
    }
    if (isLastStep && totalSteps > 0) {
      return t('wizard.reviewAnswers', { defaultValue: 'Review Answers' });
    }
    if (totalSteps === 0) {
      return t('wizard.generateDocument', { defaultValue: 'Generate Document' });
    }
    return t('wizard.continue', { defaultValue: 'Continue' });
  };

  return (
    <>
      {/* Main Navigation - Touch Optimized */}
      <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        {canGoBack && (
          <TouchButton
            variant="outline"
            size="lg"
            onClick={onPreviousStep}
            disabled={isDisabled}
            className="w-full sm:w-auto"
          >
            {t('wizard.previous', { defaultValue: 'Previous' })}
          </TouchButton>
        )}

        <TouchButton
          variant="default"
          size="lg"
          onClick={onNextStep}
          disabled={isDisabled}
          className="w-full sm:w-auto sm:ml-auto"
        >
          {formIsSubmitting || authIsLoading ? (
            <Loader2 className="animate-spin h-5 w-5" />
          ) : (
            getButtonText()
          )}
        </TouchButton>
      </div>

      {/* Save and Finish Later - Touch Optimized */}
      <div className="mt-6 pt-4 border-t border-border text-center">
        <TouchButton
          variant="ghost"
          size="md"
          onClick={onSaveAndFinishLater}
          disabled={isDisabled}
          className="text-sm text-muted-foreground min-h-[44px]"
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
        </TouchButton>
      </div>
    </>
  );
}