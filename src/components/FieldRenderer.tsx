// src/components/FieldRenderer.tsx
'use client';

import React, { useEffect } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import SmartInput from '@/components/wizard/SmartInput';
import AddressField from '@/components/AddressField';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import type { LegalDocument, Question } from '@/lib/document-library';
import { useNotary } from '@/hooks/useNotary';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { prettify } from '@/lib/schema-utils';
import { useVinDecoder } from '@/hooks/useVinDecoder';
import { Info, Loader2 } from 'lucide-react';
import type { ZodTypeAny } from 'zod';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

interface FieldRendererProps {
  fieldKey: string;
  doc: LegalDocument;
}

type FormValues = Record<string, unknown>;

interface ZodDefExtras {
  tooltip?: string;
  helperText?: string;
  placeholder?: string;
  schema?: { _def?: { tooltip?: string } };
}

const FieldRenderer = React.memo(function FieldRenderer({
  fieldKey,
  doc,
}: FieldRendererProps) {
  const {
    control,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<FormValues>();
  const { t } = useTranslation('common');

  const fieldSchemaFromQuestions = doc.questions?.find(
    (q) => q.id === fieldKey,
  );

  const actualSchemaShape =
    (doc.schema as any)?._def?.typeName === 'ZodEffects'
      ? (doc.schema as any)._def.schema.shape
      : (doc.schema as any)?.shape;
  const fieldSchemaFromZod = (
    actualSchemaShape as Record<string, ZodTypeAny> | undefined
  )?.[fieldKey];

  const fieldSchema: Question | undefined =
    fieldSchemaFromQuestions ||
    (fieldSchemaFromZod
      ? {
          id: fieldKey,
          label:
            fieldSchemaFromZod._def?.description ||
            fieldSchemaFromZod._def?.schema?._def?.description ||
            prettify(fieldKey),
          type:
            fieldSchemaFromZod._def?.typeName === 'ZodNumber'
              ? 'number'
              : fieldSchemaFromZod._def?.typeName === 'ZodDate'
                ? 'date'
                : fieldSchemaFromZod._def?.typeName === 'ZodBoolean'
                  ? 'boolean'
                  : fieldSchemaFromZod._def?.innerType?._def?.typeName ===
                        'ZodEnum' ||
                      fieldSchemaFromZod._def?.typeName === 'ZodEnum'
                    ? 'select'
                    : fieldKey.toLowerCase().includes('address')
                      ? 'address'
                      : 'text',
          options: (
            fieldSchemaFromZod._def?.innerType?._def?.values ||
            fieldSchemaFromZod._def?.values
          )?.map((val: string) => ({ value: val, label: prettify(val) })),
          required:
            fieldSchemaFromZod._def?.typeName !== 'ZodOptional' &&
            fieldSchemaFromZod._def?.innerType?._def?.typeName !==
              'ZodOptional',
          tooltip:
            (fieldSchemaFromZod._def as ZodDefExtras)?.tooltip ||
            (fieldSchemaFromZod._def?.schema?._def as ZodDefExtras | undefined)
              ?.tooltip ||
            undefined,
          helperText:
            (fieldSchemaFromZod._def as ZodDefExtras)?.helperText || undefined,
          placeholder:
            (fieldSchemaFromZod._def as ZodDefExtras)?.placeholder || undefined,
        }
      : undefined);

  const formStateCode = watch('state') as string | undefined;
  const { isRequired: notaryIsRequiredByState } = useNotary(formStateCode);

  const {
    decode,
    data: vinData,
    loading: vinLoading,
    error: vinError,
  } = useVinDecoder();

  useEffect(() => {
    if (fieldKey === 'vin' && vinData && setValue) {
      const currentMake = watch('make');
      const currentModel = watch('model');
      const currentYear = watch('year');

      if (vinData.make && (currentMake === undefined || currentMake === '')) {
        setValue('make', vinData.make, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
      if (
        vinData.model &&
        (currentModel === undefined || currentModel === '')
      ) {
        setValue('model', vinData.model, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
      if (
        vinData.year &&
        (currentYear === undefined || currentYear === '' || currentYear === 0)
      ) {
        setValue('year', Number(vinData.year), {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    }
  }, [vinData, fieldKey, setValue, watch]);

  if (
    !fieldSchema &&
    !['as_is', 'warranty_text', 'notarizationToggle'].includes(fieldKey)
  ) {
    console.warn(
      `[FieldRenderer] Field schema not found for key: ${fieldKey} in document: ${doc.name}. This field will not be rendered.`,
    );
    return null;
  }

  const labelText = fieldSchema?.label
    ? t(fieldSchema.label, { defaultValue: fieldSchema.label })
    : prettify(fieldKey);
  const placeholderText = fieldSchema?.placeholder
    ? t(fieldSchema.placeholder, { defaultValue: fieldSchema.placeholder })
    : '';
  const tooltipText = fieldSchema?.tooltip
    ? t(fieldSchema.tooltip, { defaultValue: fieldSchema.tooltip })
    : '';
  const fieldError = errors[fieldKey];

  let inputType: React.HTMLInputTypeAttribute = 'text';
  if (
    fieldSchema?.type === 'number' ||
    [
      'year',
      'odometer',
      'price',
      'principalAmount',
      'interestRate',
      'durationMonths',
      'monthly_rent',
      'security_deposit',
      'lease_term',
      'termYears',
      'amountDue',
    ].includes(fieldKey)
  ) {
    inputType = 'number';
  } else if (fieldSchema?.type === 'date') {
    inputType = 'date';
  } else if (
    fieldKey.endsWith('_phone') ||
    (fieldSchema?.label &&
      (fieldSchema.label.toLowerCase().includes('phone') ||
        fieldSchema.label.toLowerCase().includes('teléfono')))
  ) {
    inputType = 'tel';
  }

  if (fieldSchema?.type === 'address') {
    return (
      <Controller
        control={control}
        name={fieldKey}
        rules={{ required: fieldSchema?.required }}
        render={({ field }) => (
          <AddressField
            name={field.name}
            label={labelText}
            required={fieldSchema?.required}
            error={
              errors[fieldKey as keyof FormValues]?.message as
                | string
                | undefined
            }
            placeholder={placeholderText || t('Enter address...')}
            className="max-w-sm"
            tooltip={tooltipText}
            value={(field.value as string) || ''}
            onChange={(val: string, parts?: Record<string, string>) => {
              field.onChange(val);
              if (parts && actualSchemaShape) {
                const prefix =
                  fieldKey.replace(/_address$/i, '') ||
                  fieldKey.replace(/Address$/i, '');
                if (
                  (actualSchemaShape as Record<string, ZodTypeAny>)?.[
                    `${prefix}_city`
                  ]
                )
                  setValue(`${prefix}_city`, parts.city, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                if (
                  (actualSchemaShape as Record<string, ZodTypeAny>)?.[
                    `${prefix}_state`
                  ]
                )
                  setValue(`${prefix}_state`, parts.state, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                if (
                  (actualSchemaShape as Record<string, ZodTypeAny>)?.[
                    `${prefix}_postal_code`
                  ]
                )
                  setValue(`${prefix}_postal_code`, parts.postalCode, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
              }
            }}
          />
        )}
      />
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1">
        <Label
          htmlFor={fieldKey}
          className={cn('font-medium', fieldError && 'text-destructive')}
        >
          {labelText}{' '}
          {fieldSchema?.required && <span className="text-destructive">*</span>}
        </Label>
        {tooltipText && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-5 w-5 p-0 text-muted-foreground hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring" // Ensure focus ring is subtle if needed
                aria-label={`Info for ${labelText}`}
              >
                <Info className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              align="start"
              className="max-w-xs text-sm bg-popover text-popover-foreground border shadow-md rounded-md p-2 z-50"
            >
              <p>{tooltipText}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      {fieldKey === 'notarizationToggle' && doc.offerNotarization ? (
        <div className="space-y-2 pt-4 border-t mt-4">
          <div className="flex items-center space-x-2">
            <Controller
              name="notarizationPreference"
              control={control}
              defaultValue={notaryIsRequiredByState || false}
              render={({ field }) => (
                <Checkbox
                  id="notarization-toggle"
                  checked={notaryIsRequiredByState || (field.value as boolean)}
                  onCheckedChange={(checked) => {
                    if (notaryIsRequiredByState && !checked) return;
                    field.onChange(checked);
                  }}
                  disabled={notaryIsRequiredByState}
                  aria-invalid={!!errors.notarizationPreference}
                />
              )}
            />
            <Label
              htmlFor="notarization-toggle"
              className="text-sm font-normal"
            >
              {notaryIsRequiredByState
                ? t('Notarization (Required by State)')
                : t('Add Notarization (Optional)')}
            </Label>
          </div>
          {notaryIsRequiredByState && (
            <p className="text-xs text-muted-foreground">
              {t('Notarization is required for {{stateCode}}.', {
                stateCode: formStateCode,
              })}
            </p>
          )}
          {!notaryIsRequiredByState && (
            <p className="text-xs text-muted-foreground">
              {t('Notarization may incur an additional fee.')}
            </p>
          )}
          {errors.notarizationPreference && (
            <p className="text-xs text-destructive mt-1">
              {String(errors.notarizationPreference.message)}
            </p>
          )}
        </div>
      ) : fieldKey === 'odo_status' &&
        fieldSchema?.type === 'select' &&
        fieldSchema?.options ? (
        <Controller
          control={control}
          name="odo_status"
          defaultValue={
            fieldSchemaFromZod?._def?.defaultValue ||
            fieldSchema?.options?.[0]?.value
          }
          render={({ field }) => (
            <RadioGroup
              onValueChange={field.onChange}
              value={(field.value as string) || undefined}
              className={cn(
                'space-y-2 max-w-sm',
                fieldError &&
                  'border-destructive focus-visible:ring-destructive',
              )}
              aria-invalid={!!fieldError}
            >
              {fieldSchema.options?.map((opt) => (
                <div key={opt.value} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={opt.value}
                    id={`odo_status_${opt.value.toLowerCase()}`}
                  />
                  <Label
                    htmlFor={`odo_status_${opt.value.toLowerCase()}`}
                    className="font-normal"
                  >
                    {t(`fields.odo_status.${opt.value.toLowerCase()}`, {
                      defaultValue: opt.label,
                    })}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
        />
      ) : fieldKey === 'as_is' &&
        (fieldSchema?.type === 'boolean' || fieldSchema?.type === 'select') ? (
        <Controller
          name="as_is"
          control={control}
          defaultValue={
            fieldSchemaFromZod?._def?.defaultValue !== undefined
              ? fieldSchemaFromZod._def.defaultValue
              : true
          }
          render={({ field }) => (
            <div className="flex items-center space-x-2 max-w-sm">
              <Switch
                id={field.name}
                checked={field.value as boolean}
                onCheckedChange={field.onChange}
                aria-labelledby="as_is_label"
                aria-invalid={!!errors.as_is}
              />
              <span id="as_is_label" className="text-sm">
                {field.value ? t('Sold As-Is') : t('Warranty Included')}
              </span>
            </div>
          )}
        />
      ) : fieldKey === 'warranty_text' ? (
        !watch('as_is') && (
          <Textarea
            id={fieldKey}
            placeholder={placeholderText || t('Describe warranty…')}
            {...register(fieldKey as keyof FormValues, {
              required: fieldSchema?.required && !watch('as_is'),
            })}
            className={cn(
              'bg-background max-w-sm',
              fieldError && 'border-destructive focus-visible:ring-destructive',
            )}
            aria-invalid={!!fieldError}
          />
        )
      ) : fieldSchema?.type === 'textarea' ? (
        <Textarea
          id={fieldKey}
          placeholder={placeholderText}
          {...register(fieldKey as keyof FormValues, {
            required: fieldSchema?.required,
          })}
          className={cn(
            'bg-background max-w-sm',
            fieldError && 'border-destructive focus-visible:ring-destructive',
          )}
          aria-invalid={!!fieldError}
        />
      ) : fieldSchema?.type === 'select' && fieldSchema.options ? (
        <Controller
          name={fieldKey}
          control={control}
          rules={{ required: fieldSchema?.required }}
          defaultValue={fieldSchemaFromZod?._def?.defaultValue}
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              value={(field.value as string) || undefined}
            >
              <SelectTrigger
                id={fieldKey}
                className={cn(
                  'bg-background max-w-sm',
                  fieldError && 'border-destructive focus:ring-destructive',
                )}
                aria-invalid={!!fieldError}
                aria-label={placeholderText || t('Select...')}
              >
                <SelectValue placeholder={placeholderText || t('Select...')} />
              </SelectTrigger>
              <SelectContent>
                {fieldSchema.options?.map((opt) => (
                  <SelectItem key={opt.value} value={String(opt.value)}>
                    {t(opt.label, { defaultValue: opt.label })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      ) : (
        <SmartInput
          id={fieldKey}
          type={inputType}
          placeholder={placeholderText}
          className={cn(
            'input bg-background',
            fieldError && 'border-destructive focus-visible:ring-destructive',
          )}
          inputMode={
            inputType === 'number' || inputType === 'tel'
              ? 'numeric'
              : undefined
          }
          aria-invalid={!!fieldError}
          rhfProps={register(fieldKey as keyof FormValues, {
            required: fieldSchema?.required,
            onBlur:
              fieldKey === 'vin' ? (e) => decode(e.target.value) : undefined,
          })}
        />
      )}
      {fieldKey === 'vin' && vinLoading && (
        <p className="text-xs text-muted-foreground mt-1 flex items-center">
          <Loader2 className="h-3 w-3 animate-spin mr-1" /> {t('Decoding VIN…')}
        </p>
      )}
      {fieldKey === 'vin' && vinData && !vinError && (
        <p className="text-xs text-muted-foreground mt-1">
          {t('Decoded')}: {vinData.year} {vinData.make} {vinData.model}{' '}
          {vinData.bodyClass ? `(${vinData.bodyClass})` : ''}
        </p>
      )}
      {fieldKey === 'vin' && vinError && (
        <p className="block text-xs text-destructive mt-1">{vinError}</p>
      )}
      {fieldError && (
        <p className="block text-xs text-destructive mt-1">
          {String(fieldError.message)}
        </p>
      )}
      {fieldSchema?.helperText && !fieldError && (
        <p className="text-xs text-muted-foreground">
          {t(fieldSchema.helperText, { defaultValue: fieldSchema.helperText })}
        </p>
      )}
    </div>
  );
});
export default FieldRenderer;
