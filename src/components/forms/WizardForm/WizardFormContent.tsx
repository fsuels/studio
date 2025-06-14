// src/components/forms/WizardForm/WizardFormContent.tsx
'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import FieldRenderer from '../FieldRenderer';
import ReviewStep from '@/components/workflow/ReviewStep';
import TrustBadges from '@/components/TrustBadges';
import type { LegalDocument } from '@/lib/document-library';
import type { WizardStep } from './WizardStepManager';

interface WizardFormContentProps {
  doc: LegalDocument;
  locale: 'en' | 'es';
  currentStepIndex: number;
  isReviewing: boolean;
  steps: WizardStep[];
  isHydrated: boolean;
}

export default function WizardFormContent({
  doc,
  locale,
  currentStepIndex,
  isReviewing,
  steps,
  isHydrated,
}: WizardFormContentProps) {
  const { t } = useTranslation('common');

  if (isReviewing) {
    return <ReviewStep doc={doc} locale={locale} />;
  }

  // Render current step content
  const currentField = steps[currentStepIndex];
  
  const formContent = isHydrated && currentField ? (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-2">
          {currentField.label}
        </h2>
        {currentField.tooltip && (
          <p className="text-sm text-muted-foreground">
            {currentField.tooltip}
          </p>
        )}
      </div>
      
      <FieldRenderer
        question={currentField}
        actualSchemaShape={{}}
        className="max-w-md mx-auto"
      />
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