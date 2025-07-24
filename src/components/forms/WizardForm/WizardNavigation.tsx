// src/components/forms/WizardForm/WizardNavigation.tsx
'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
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
      return t('wizard.generateDocument', {
        defaultValue: 'Generate Document',
      });
    }
    if (isLastStep && totalSteps > 0) {
      return t('wizard.reviewAnswers', { defaultValue: 'Review Answers' });
    }
    if (totalSteps === 0) {
      return t('wizard.generateDocument', {
        defaultValue: 'Generate Document',
      });
    }
    return t('wizard.continue', { defaultValue: 'Continue' });
  };

  return (
    <>
      {/* Main Navigation - Enhanced Professional Design */}
      <div className="mt-12 pt-8 border-t border-border">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {canGoBack && (
            <Button
              variant="outline"
              size="lg"
              onClick={onPreviousStep}
              disabled={isDisabled}
              aria-label={t('wizard.previous.aria', { defaultValue: 'Go to previous step' })}
              className="w-full sm:w-auto h-12 px-8 text-base font-medium border-2 hover:bg-muted transition-all duration-200"
            >
              {t('wizard.previous', { defaultValue: 'Previous' })}
            </Button>
          )}

          <Button
            variant="default"
            size="lg"
            onClick={onNextStep}
            disabled={isDisabled}
            aria-label={
              isReviewing 
                ? t('wizard.generateDocument.aria', { defaultValue: 'Generate and download document' })
                : isLastStep 
                  ? t('wizard.reviewAnswers.aria', { defaultValue: 'Review all answers before generating document' })
                  : t('wizard.continue.aria', { defaultValue: 'Continue to next step' })
            }
            className="w-full sm:w-auto sm:ml-auto h-12 px-8 text-base font-semibold bg-primary hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {formIsSubmitting || authIsLoading ? (
              <Loader2 className="animate-spin h-5 w-5" aria-hidden="true" />
            ) : (
              getButtonText()
            )}
          </Button>
        </div>

        {/* Save and Finish Later - Enhanced Design */}
        <div className="mt-8 text-center">
          <Button
            variant="ghost"
            size="default"
            onClick={onSaveAndFinishLater}
            disabled={isDisabled}
            aria-label={
              isSavingDraft 
                ? t('wizard.savingDraft.aria', { defaultValue: 'Saving draft in progress' })
                : t('wizard.saveFinishLater.aria', { defaultValue: 'Save current progress and finish later' })
            }
            className="text-sm text-muted-foreground hover:text-foreground min-h-[44px] transition-colors duration-200"
          >
            {isSavingDraft ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                {t('wizard.savingDraft', { defaultValue: 'Saving Draft...' })}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" aria-hidden="true" />
                {t('wizard.saveFinishLater', {
                  defaultValue: 'Save and finish later',
                })}
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  );
}
