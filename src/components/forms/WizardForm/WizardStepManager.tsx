// src/components/forms/WizardForm/WizardStepManager.tsx
'use client';

import React, { useMemo } from 'react';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import type { LegalDocument } from '@/lib/document-library';
import { prettify } from '@/lib/schema-utils';

interface WizardStep {
  id: string;
  label: string;
  tooltip?: string;
  type: string;
  required: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

interface WizardStepManagerProps {
  doc: LegalDocument;
  currentStepIndex: number;
  isReviewing: boolean;
}

export function useWizardSteps(doc: LegalDocument) {
  const { t } = useTranslation('common');

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

  const steps = useMemo((): WizardStep[] => {
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
          : fieldDef?.description
            ? t(fieldDef.description, { defaultValue: fieldDef.description })
            : undefined;

        return {
          id: q.id,
          label,
          tooltip,
          type: q.type,
          required: q.required || false,
          placeholder: q.placeholder,
          options: q.options,
        };
      });
    }
    return [];
  }, [doc.questions, actualSchemaShape, t]);

  const totalSteps = steps.length;
  
  return {
    steps,
    totalSteps,
    actualSchemaShape,
  };
}

export function calculateProgress(
  currentStepIndex: number,
  totalSteps: number,
  isReviewing: boolean
): number {
  if (totalSteps === 0) return 100;
  if (isReviewing) return 100;
  return Math.round(((currentStepIndex + 1) / totalSteps) * 100);
}

export type { WizardStep };