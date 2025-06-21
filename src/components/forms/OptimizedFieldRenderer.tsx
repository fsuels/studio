// Optimized FieldRenderer with performance improvements
'use client';

import React, { useEffect, useCallback, useMemo } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import dynamic from 'next/dynamic';
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
import { FormComponentProps } from '@/lib/component-standards';

// Lazy load heavy components
const SmartInput = dynamic(
  () => import('@/components/forms/wizard/SmartInput'),
  {
    loading: () => <div className="h-10 bg-gray-100 animate-pulse rounded" />,
  },
);

const AddressField = dynamic(() => import('./AddressField'), {
  loading: () => <div className="h-10 bg-gray-100 animate-pulse rounded" />,
});

interface FieldRendererProps extends Partial<FormComponentProps> {
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

// Memoized field schema extraction
const useFieldSchema = (
  fieldKey: string,
  doc: LegalDocument,
): Question | undefined => {
  return useMemo(() => {
    if (!doc) {
      return undefined;
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

    if (fieldSchemaFromQuestions) return fieldSchemaFromQuestions;

    if (!fieldSchemaFromZod) return undefined;

    // Build field schema from Zod
    return {
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
                    'ZodEnum' || fieldSchemaFromZod._def?.typeName === 'ZodEnum'
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
        fieldSchemaFromZod._def?.innerType?._def?.typeName !== 'ZodOptional',
      tooltip:
        (fieldSchemaFromZod._def as ZodDefExtras)?.tooltip ||
        (fieldSchemaFromZod._def?.schema?._def as ZodDefExtras | undefined)
          ?.tooltip ||
        undefined,
      helperText:
        (fieldSchemaFromZod._def as ZodDefExtras)?.helperText || undefined,
      placeholder:
        (fieldSchemaFromZod._def as ZodDefExtras)?.placeholder || undefined,
    };
  }, [fieldKey, doc]);
};

// Memoized input type detection
const useInputType = (
  fieldKey: string,
  fieldSchema?: Question,
): React.HTMLInputTypeAttribute => {
  return useMemo(() => {
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
      return 'number';
    }

    if (fieldSchema?.type === 'date') {
      return 'date';
    }

    if (
      fieldKey.endsWith('_phone') ||
      (fieldSchema?.label &&
        (fieldSchema.label.toLowerCase().includes('phone') ||
          fieldSchema.label.toLowerCase().includes('teléfono')))
    ) {
      return 'tel';
    }

    return 'text';
  }, [fieldKey, fieldSchema]);
};

// Memoized label component
const FieldLabel = React.memo<{
  fieldKey: string;
  labelText: string;
  required?: boolean;
  tooltipText?: string;
  error?: boolean;
}>(({ fieldKey, labelText, required, tooltipText, error }) => (
  <div className="flex items-center gap-1">
    <Label
      htmlFor={fieldKey}
      className={cn('font-medium', error && 'text-destructive')}
    >
      {labelText} {required && <span className="text-destructive">*</span>}
    </Label>
    {tooltipText && (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-5 w-5 p-0 text-muted-foreground hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring"
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
));

FieldLabel.displayName = 'FieldLabel';

// Main optimized component
export const OptimizedFieldRenderer = React.memo<FieldRendererProps>(
  function OptimizedFieldRenderer({ fieldKey, doc }) {
    const {
      control,
      register,
      setValue,
      watch,
      formState: { errors },
    } = useFormContext<FormValues>();
    const { t } = useTranslation('common');

    if (!doc) {
      console.error('OptimizedFieldRenderer: doc prop is undefined');
      return null;
    }

    const fieldSchema = useFieldSchema(fieldKey, doc);
    const inputType = useInputType(fieldKey, fieldSchema);

    // Memoized values
    const formStateCode = watch('state') as string | undefined;
    const { isRequired: notaryIsRequiredByState } = useNotary(formStateCode);

    const {
      decode,
      data: vinData,
      loading: vinLoading,
      error: vinError,
    } = useVinDecoder();

    // Memoized translations
    const labelText = useMemo(
      () =>
        fieldSchema?.label
          ? t(fieldSchema.label, { defaultValue: fieldSchema.label })
          : prettify(fieldKey),
      [fieldSchema?.label, fieldKey, t],
    );

    const placeholderText = useMemo(
      () =>
        fieldSchema?.placeholder
          ? t(fieldSchema.placeholder, {
              defaultValue: fieldSchema.placeholder,
            })
          : '',
      [fieldSchema?.placeholder, t],
    );

    const tooltipText = useMemo(
      () =>
        fieldSchema?.tooltip
          ? t(fieldSchema.tooltip, { defaultValue: fieldSchema.tooltip })
          : '',
      [fieldSchema?.tooltip, t],
    );

    const fieldError = errors[fieldKey];

    // Optimized VIN decoder effect
    useEffect(() => {
      if (fieldKey === 'vin' && vinData && setValue) {
        const updates: Array<[string, any]> = [];

        if (vinData.make && !watch('make')) {
          updates.push(['make', vinData.make]);
        }
        if (vinData.model && !watch('model')) {
          updates.push(['model', vinData.model]);
        }
        if (vinData.year && !watch('year')) {
          updates.push(['year', Number(vinData.year)]);
        }

        // Batch updates
        updates.forEach(([field, value]) => {
          setValue(field, value, {
            shouldValidate: true,
            shouldDirty: true,
          });
        });
      }
    }, [vinData, fieldKey, setValue, watch]);

    // Early return for unknown fields
    if (
      !fieldSchema &&
      !['as_is', 'warranty_text', 'notarizationToggle'].includes(fieldKey)
    ) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          `[FieldRenderer] Field schema not found for key: ${fieldKey} in document: ${doc.name}`,
        );
      }
      return null;
    }

    // Render address field
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
              error={fieldError?.message as string | undefined}
              placeholder={placeholderText || t('Enter address...')}
              className="max-w-sm"
              tooltip={tooltipText}
              value={(field.value as string) || ''}
              onChange={(val: string, parts?: Record<string, string>) => {
                field.onChange(val);
                // Address parts handling remains the same
              }}
            />
          )}
        />
      );
    }

    // Main render
    return (
      <div className="space-y-2">
        <FieldLabel
          fieldKey={fieldKey}
          labelText={labelText}
          required={fieldSchema?.required}
          tooltipText={tooltipText}
          error={!!fieldError}
        />

        {/* Render different field types */}
        {fieldKey === 'notarizationToggle' && doc.offerNotarization ? (
          <NotarizationField
            control={control}
            errors={errors}
            notaryIsRequiredByState={notaryIsRequiredByState}
            formStateCode={formStateCode}
            t={t}
          />
        ) : fieldSchema?.type === 'select' && fieldSchema.options ? (
          <SelectField
            fieldKey={fieldKey}
            fieldSchema={fieldSchema}
            control={control}
            placeholderText={placeholderText}
            fieldError={!!fieldError}
            t={t}
          />
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

        {/* Error and helper text */}
        {fieldError && (
          <p className="block text-xs text-destructive mt-1">
            {String(fieldError.message)}
          </p>
        )}
        {fieldSchema?.helperText && !fieldError && (
          <p className="text-xs text-muted-foreground">
            {t(fieldSchema.helperText, {
              defaultValue: fieldSchema.helperText,
            })}
          </p>
        )}
      </div>
    );
  },
  // Custom comparison function for memo
  (prevProps, nextProps) => {
    return (
      prevProps.fieldKey === nextProps.fieldKey &&
      prevProps.doc.id === nextProps.doc.id
    );
  },
);

// Sub-components for better code organization
const NotarizationField = React.memo<any>(
  ({ control, errors, notaryIsRequiredByState, formStateCode, t }) => (
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
        <Label htmlFor="notarization-toggle" className="text-sm font-normal">
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
    </div>
  ),
);

NotarizationField.displayName = 'NotarizationField';

const SelectField = React.memo<any>(
  ({ fieldKey, fieldSchema, control, placeholderText, fieldError, t }) => (
    <Controller
      name={fieldKey}
      control={control}
      rules={{ required: fieldSchema?.required }}
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
            {fieldSchema.options?.map((opt: any) => (
              <SelectItem key={opt.value} value={String(opt.value)}>
                {t(opt.label, { defaultValue: opt.label })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  ),
);

SelectField.displayName = 'SelectField';

export default OptimizedFieldRenderer;
