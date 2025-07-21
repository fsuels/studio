// src/components/workflow/ReviewStep/FieldValueRenderer.tsx
'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { ReviewField, FormValues } from './types';

interface FieldValueRendererProps {
  field: ReviewField;
  locale: 'en' | 'es';
}

export default function FieldValueRenderer({
  field,
  locale,
}: FieldValueRendererProps) {
  const { t } = useTranslation('common');
  const { getValues } = useFormContext<FormValues>();

  const value = getValues(field.id);
  const isMissing =
    field.required &&
    (value === undefined || value === null || String(value).trim() === '');

  if (field.type === 'boolean') return <>{value ? t('Yes') : t('No')}</>;

  if (
    field.type === 'select' &&
    field.options &&
    value !== undefined &&
    value !== null
  ) {
    const opt = field.options.find((o) => String(o.value) === String(value));
    return <>{opt?.label || String(value)}</>;
  }

  if (value instanceof Date) return <>{value.toLocaleDateString(locale)}</>;

  if (isMissing)
    return (
      <span className="italic text-destructive">
        {t('wizard.fieldRequired')}
      </span>
    );

  return (
    <>
      {value !== undefined && value !== null && String(value).trim() !== '' ? (
        String(value)
      ) : (
        <span className="italic text-muted-foreground/70">
          {t('Not Provided')}
        </span>
      )}
    </>
  );
}
