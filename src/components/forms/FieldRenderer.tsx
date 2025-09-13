// src/components/FieldRenderer.tsx
'use client';

import React, { useEffect } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import SmartInput from '@/components/forms/wizard/SmartInput';
import AddressField from './AddressField';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/RadioGroup';
import { Switch } from '@/components/ui/switch';
import type { LegalDocument, Question } from '@/types/documents';
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
import { createPortal } from 'react-dom';

interface FieldRendererProps {
  fieldKey: string;
  doc: LegalDocument;
  onFocus?: () => void;
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
  onFocus,
}: FieldRendererProps) {
  const {
    control,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<FormValues>();
  const { t } = useTranslation('common');
  const [isMounted, setIsMounted] = React.useState(false);
  const [showTooltip, setShowTooltip] = React.useState(false);

  // Move hooks before early returns
  const formStateCode = watch('state') as string | undefined;
  const { isRequired: notaryIsRequiredByState } = useNotary(formStateCode);

  const {
    decode,
    data: vinData,
    loading: vinLoading,
    error: vinError,
  } = useVinDecoder();

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

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

  if (!doc) {
    console.error('FieldRenderer: doc prop is undefined');
    return null;
  }

  const fieldSchemaFromQuestions = doc.questions?.find(
    (q) => q.id === fieldKey,
  );

  const zodSchema = doc.schema as unknown as {
    _def?: {
      typeName?: string;
      schema?: { shape: Record<string, ZodTypeAny> };
    };
    shape?: Record<string, ZodTypeAny>;
  };

  const actualSchemaShape =
    zodSchema._def?.typeName === 'ZodEffects'
      ? zodSchema._def.schema?.shape
      : zodSchema.shape;
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
            onFocus={onFocus}
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

  // Handle button types (like +ADD buttons)
  if (fieldSchema?.type === 'button') {
    const handleButtonClick = () => {
      if (fieldSchema.buttonAction === 'toggle_show_seller2') {
        setValue('show_seller2', true, { shouldValidate: true, shouldDirty: true });
      } else if (fieldSchema.buttonAction === 'toggle_show_buyer2') {
        setValue('show_buyer2', true, { shouldValidate: true, shouldDirty: true });
      }
    };

    return (
      <div className="space-y-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleButtonClick}
          className="w-full text-left border-dashed border-2 border-primary/30 hover:border-primary/50 text-primary hover:text-primary"
        >
          {labelText}
        </Button>
        {tooltipText && (
          <p className="text-sm text-muted-foreground">
            {tooltipText}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2">
        <Label
          htmlFor={fieldKey}
          className={cn(
            'font-semibold text-lg leading-relaxed',
            fieldError && 'text-destructive',
          )}
        >
          {labelText}{' '}
          {fieldSchema?.required && (
            <span className="text-destructive text-sm">*</span>
          )}
        </Label>
        {tooltipText && (
          <div className="relative">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-7 w-7 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 touch-manipulation"
              aria-label={`Help for ${labelText}`}
              onClick={() => setShowTooltip(!showTooltip)}
              onBlur={() => setTimeout(() => setShowTooltip(false), 150)}
            >
              <Info className="h-4 w-4" />
            </Button>
            {showTooltip && isMounted && (
              <div
                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-80 max-w-[90vw] text-sm bg-blue-50 text-blue-900 border-blue-200 border shadow-xl rounded-lg p-4 z-[999999]"
                style={{
                  position: 'fixed',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  top: 'auto',
                  bottom: '50%',
                }}
              >
                <p className="leading-relaxed font-medium whitespace-normal">
                  {tooltipText}
                </p>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-blue-200"></div>
              </div>
            )}
            {showTooltip && (
              <div
                className="fixed inset-0 z-[999998]"
                onClick={() => setShowTooltip(false)}
              />
            )}
          </div>
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
          onFocus={onFocus}
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
                onFocus={onFocus}
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
            'input bg-background h-12 text-base transition-all duration-200 focus:ring-2 focus:ring-primary focus:border-primary',
            fieldError && 'border-destructive focus-visible:ring-destructive',
          )}
          inputMode={
            inputType === 'number' || inputType === 'tel'
              ? 'numeric'
              : undefined
          }
          aria-invalid={!!fieldError}
          onFocus={onFocus}
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
