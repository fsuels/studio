// src/components/workflow/ReviewStep/ReviewStepContainer.tsx
'use client';

import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import type { LegalDocument } from '@/lib/document-library';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { z, type AnyZodObject } from 'zod';
import ReviewFieldItem from './ReviewFieldItem';
import { useFieldConfiguration } from './useFieldConfiguration';
import type { FormValues } from './types';

interface ReviewStepContainerProps {
  doc: LegalDocument;
  locale: 'en' | 'es';
}

export default function ReviewStepContainer({
  doc,
  locale,
}: ReviewStepContainerProps) {
  const { t } = useTranslation('common');
  const { getValues, setValue, trigger, watch } = useFormContext<FormValues>();
  const { toast } = useToast();

  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [originalFieldValue, setOriginalFieldValue] = useState<unknown>(null);

  // Subscribe to form value changes to trigger re-renders
  watch();

  // Focus management for editing fields
  useEffect(() => {
    if (editingFieldId) {
      const el = document.getElementById(`review-${editingFieldId}`);
      if (el) {
        setTimeout(() => {
          (el as HTMLElement).focus();
        }, 0);
      }
    }
  }, [editingFieldId]);

  // Extract schema shape for field configuration
  const actualSchemaShape = useMemo<
    Record<string, z.ZodTypeAny> | undefined
  >(() => {
    const schemaDef = doc?.schema?._def;
    if (!schemaDef) return undefined;
    if (schemaDef.typeName === 'ZodObject')
      return (doc.schema as unknown as AnyZodObject).shape as Record<
        string,
        z.ZodTypeAny
      >;
    if (
      schemaDef.typeName === 'ZodEffects' &&
      schemaDef.schema?._def?.typeName === 'ZodObject'
    ) {
      return (schemaDef.schema as unknown as AnyZodObject).shape as Record<
        string,
        z.ZodTypeAny
      >;
    }
    return undefined;
  }, [doc.schema]);

  // Get configured fields for review
  const fieldsToReview = useFieldConfiguration({ doc, actualSchemaShape });

  // Edit handlers
  const handleEdit = useCallback(
    (fieldId: string) => {
      const currentValue = getValues(fieldId);
      setOriginalFieldValue(currentValue);
      setEditingFieldId(fieldId);
    },
    [getValues],
  );

  const handleSave = useCallback(
    async (fieldId: string) => {
      const isValid = await trigger(fieldId);
      if (isValid) {
        setEditingFieldId(null);
        setOriginalFieldValue(null);
        toast({
          title: t('Changes Saved'),
          description: `${t(fieldsToReview.find((f) => f.id === fieldId)?.label || fieldId, { ns: 'documents', defaultValue: fieldsToReview.find((f) => f.id === fieldId)?.label || fieldId })} ${t('updated.')}`,
        });
      } else {
        toast({
          title: t('Validation Error'),
          description: t('Please correct the field.'),
          variant: 'destructive',
        });
      }
    },
    [trigger, toast, t, fieldsToReview],
  );

  const handleCancel = useCallback(() => {
    if (editingFieldId && originalFieldValue !== undefined) {
      setValue(editingFieldId as keyof FormValues, originalFieldValue, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
    setEditingFieldId(null);
    setOriginalFieldValue(null);
  }, [editingFieldId, originalFieldValue, setValue]);

  return (
    <Card className="bg-card border-border shadow-lg">
      <CardHeader>
        <CardTitle>{t('Review Your Information')}</CardTitle>
        <CardDescription>
          {t('Please confirm the details below are correct before proceeding.')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {fieldsToReview.map((field) => (
          <ReviewFieldItem
            key={field.id}
            field={field}
            locale={locale}
            isEditing={editingFieldId === field.id}
            actualSchemaShape={actualSchemaShape}
            onEdit={handleEdit}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        ))}
      </CardContent>
    </Card>
  );
}
