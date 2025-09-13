// src/components/forms/WizardForm/WizardFormContent.tsx
'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import FieldRenderer from '../FieldRenderer';
import ReviewStep from '@/components/workflow/ReviewStep';
// If TrustBadges is a default export, change this line accordingly:
// import TrustBadges from '@/components/shared/TrustBadges';
import { TrustBadges } from '@/components/shared';
import type { LegalDocument } from '@/types/documents';
import type { WizardStep } from './WizardStepManager';

interface WizardFormContentProps {
  doc: LegalDocument;
  locale: 'en' | 'es';
  currentStepIndex: number;
  isReviewing: boolean;
  steps: WizardStep[];
  isHydrated: boolean;
  onFieldFocus?: (fieldId: string | undefined) => void;
}

export default function WizardFormContent({
  doc,
  locale,
  currentStepIndex,
  isReviewing,
  steps,
  isHydrated,
  onFieldFocus,
}: WizardFormContentProps) {
  const { t } = useTranslation('common');

  if (isReviewing) {
    return <ReviewStep doc={doc} locale={locale} />;
  }

  const currentField = steps[currentStepIndex];

  const formContent =
    isHydrated && currentField ? (
      <div className="space-y-8">
        <div className="text-center mb-6">
          {currentField.section && (
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
            {currentField.section}
          </div>
          )}
        </div>

        <div className="max-w-md mx-auto">
          <FieldRenderer
            fieldKey={currentField.id}
            doc={doc}
            onFocus={() => onFieldFocus?.(currentField.id)}
          />
        </div>
      </div>
    ) : steps.length === 0 ? (
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
      {formContent}
      {!isReviewing && <TrustBadges className="mt-6" />}
    </>
  );
}
