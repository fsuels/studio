// src/components/forms/WizardForm/WizardProgress.tsx
'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Progress } from '@/components/ui/progress';

interface WizardProgressProps {
  progress: number;
  totalSteps: number;
}

export default function WizardProgress({
  progress,
  totalSteps,
}: WizardProgressProps) {
  const { t } = useTranslation('common');

  if (totalSteps === 0) return null;

  return (
    <div className="mb-6">
      <Progress value={progress} className="w-full h-2" aria-label="Progress" />
      <p className="text-xs text-muted-foreground mt-1 text-right">
        {Math.round(progress)}% {t('Complete')}
      </p>
    </div>
  );
}
