// src/components/forms/WizardForm/WizardStepManager.ts
import { useMemo } from 'react';
import type { LegalDocument } from '@/lib/document-library';
import type { Question } from '@/types/documents';

export type WizardStep = Question & { section?: string };

export function useWizardSteps(
  doc: LegalDocument,
  overrideQuestions?: Question[] | null
): { steps: WizardStep[]; totalSteps: number } {
  const questions: Question[] = (
    overrideQuestions && overrideQuestions.length > 0
      ? overrideQuestions
      : doc.questions ?? []
  );

  const steps = useMemo<WizardStep[]>(
    () => questions.map((q) => ({ ...q })),
    [questions]
  );

  return {
    steps,
    totalSteps: steps.length,
  };
}

export function calculateProgress(
  currentStepIndex: number,
  totalSteps: number,
  isReviewing: boolean
) {
  if (!totalSteps) return 0;
  if (isReviewing) return 100;
  return Math.round(((currentStepIndex + 1) / totalSteps) * 100);
}
