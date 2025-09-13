// src/components/workflow/ReviewStep/useFieldConfiguration.ts
import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { LegalDocument } from '@/types/documents';
import type { Question } from '@/types/documents';
import { usStates } from '@/lib/usStates';
import { prettify } from '@/lib/schema-utils';
import { z, type AnyZodObject } from 'zod';
import type { ReviewField, ZodDefExtras, FormValues } from './types';
import { EXCLUDED_FIELDS, SPECIAL_FIELD_CONFIGS } from './constants';

interface UseFieldConfigurationProps {
  doc: LegalDocument;
  actualSchemaShape?: Record<string, z.ZodTypeAny>;
}

export function useFieldConfiguration({
  doc,
  actualSchemaShape,
}: UseFieldConfigurationProps) {
  const { t } = useTranslation('common');
  const { getValues } = useFormContext<FormValues>();

  const fieldsToReview = useMemo<ReviewField[]>(() => {
    const currentFormData = getValues();

    // Maintain question order to match wizard flow
    const questionIds = doc.questions?.map((q) => q.id) ?? [];
    const schemaKeys = actualSchemaShape ? Object.keys(actualSchemaShape) : [];

    // Combine keys keeping the question order first
    const combinedKeys = [
      ...questionIds,
      ...schemaKeys.filter((k) => !questionIds.includes(k)),
      ...Object.keys(currentFormData).filter(
        (k) => !questionIds.includes(k) && !schemaKeys.includes(k),
      ),
    ];

    const allFieldKeys = Array.from(new Set(combinedKeys));

    return allFieldKeys
      .filter((fieldId) => {
        return !EXCLUDED_FIELDS.includes(fieldId as any);
      })
      .map((fieldId) => {
        const questionConfig = doc.questions?.find((q) => q.id === fieldId);
        const schemaField = actualSchemaShape?.[fieldId];
        const schemaFieldDef = schemaField?._def as
          | (z.ZodTypeAny['_def'] & ZodDefExtras)
          | undefined;

        const label =
          questionConfig?.label ||
          schemaFieldDef?.description ||
          (schemaFieldDef?.labelKey ? t(schemaFieldDef.labelKey) : null) ||
          prettify(fieldId);

        // Determine field type
        let fieldType: Question['type'] = questionConfig?.type || 'text';
        if (schemaFieldDef) {
          const baseType =
            schemaFieldDef.typeName === 'ZodEffects'
              ? schemaFieldDef.schema?._def?.typeName
              : schemaFieldDef.typeName;

          if (baseType === 'ZodNumber') fieldType = 'number';
          else if (baseType === 'ZodBoolean') fieldType = 'boolean';
          else if (baseType === 'ZodDate') fieldType = 'date';
          else if (
            baseType === 'ZodEnum' ||
            schemaFieldDef.innerType?._def?.typeName === 'ZodEnum'
          )
            fieldType = 'select';
          else if (
            fieldId.toLowerCase().includes('address') &&
            baseType === 'ZodString'
          )
            fieldType = 'address';
          else if (
            fieldId.toLowerCase().includes('phone') &&
            baseType === 'ZodString'
          )
            fieldType = 'tel';
          else if (
            baseType === 'ZodString' &&
            (schemaFieldDef?.uiType === 'textarea' ||
              questionConfig?.type === 'textarea')
          )
            fieldType = 'textarea';
        }

        // Get enum values for select fields
        const rawEnumValues =
          schemaFieldDef?.innerType?._def?.values ??
          schemaFieldDef?.values ??
          (schemaFieldDef?.typeName === 'ZodEffects'
            ? schemaFieldDef.schema?._def?.values
            : undefined);
        const enumOptions = Array.isArray(rawEnumValues)
          ? rawEnumValues.map((val: string) => ({
              value: val,
              label: t(`documents:fields.${fieldId}.options.${val}`, {
                defaultValue: prettify(val),
              }),
            }))
          : undefined;

        // Build options array
        const options =
          questionConfig?.options ??
          enumOptions ??
          (fieldId === 'state'
            ? usStates.map((s) => ({ value: s.value, label: s.label }))
            : undefined) ??
          (fieldId === SPECIAL_FIELD_CONFIGS.ODO_STATUS.id
            ? SPECIAL_FIELD_CONFIGS.ODO_STATUS.options.map((opt) => ({
                value: opt.value,
                label: t(opt.translationKey, {
                  defaultValue: prettify(opt.value),
                }),
              }))
            : undefined);

        const placeholder =
          questionConfig?.placeholder || schemaFieldDef?.placeholder;
        const tooltip = questionConfig?.tooltip || schemaFieldDef?.tooltip;
        const required =
          questionConfig?.required ??
          (schemaFieldDef?.typeName !== 'ZodOptional' &&
            schemaFieldDef?.innerType?._def?.typeName !== 'ZodOptional');

        return {
          id: fieldId,
          label,
          type: fieldType,
          options,
          required,
          placeholder,
          tooltip,
        };
      });
  }, [doc, actualSchemaShape, getValues, t]);

  return fieldsToReview;
}
