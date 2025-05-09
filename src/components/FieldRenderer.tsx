// src/components/FieldRenderer.tsx
'use client';

import React, { useEffect } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import SmartInput from '@/components/wizard/SmartInput'; // Using SmartInput for standard text/number/tel
import AddressField from '@/components/AddressField';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import type { LegalDocument, Question } from '@/lib/document-library';
import { useNotary } from '@/hooks/useNotary';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { prettify } from '@/lib/schema-utils';
import { useVinDecoder } from '@/hooks/useVinDecoder'; // For displaying decoded VIN info
import { Info, Loader2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from '@/components/ui/button';

interface FieldRendererProps {
  fieldKey: string;
  locale: 'en' | 'es';
  doc: LegalDocument;
}

export default function FieldRenderer({ fieldKey, locale, doc }: FieldRendererProps) {
  const { control, register, setValue, watch, formState: { errors } } = useFormContext();
  const { t } = useTranslation();

  const fieldSchemaFromQuestions = doc.questions?.find(q => q.id === fieldKey);
  
  const actualSchemaShape = doc.schema?._def?.typeName === 'ZodEffects' 
    ? doc.schema._def.schema.shape 
    : doc.schema?.shape;
  const fieldSchemaFromZod = (actualSchemaShape as any)?.[fieldKey];
  
  const fieldSchema: Question | undefined = fieldSchemaFromQuestions || (fieldSchemaFromZod ? {
    id: fieldKey,
    label: (fieldSchemaFromZod._def?.description || fieldSchemaFromZod._def?.schema?._def?.description) || prettify(fieldKey),
    type: fieldSchemaFromZod._def?.typeName === 'ZodNumber' ? 'number' :
          fieldSchemaFromZod._def?.typeName === 'ZodDate' ? 'date' :
          fieldSchemaFromZod._def?.typeName === 'ZodBoolean' ? 'boolean' :
          (fieldSchemaFromZod._def?.innerType?._def?.typeName === 'ZodEnum' || fieldSchemaFromZod._def?.typeName === 'ZodEnum') ? 'select' :
          'text',
    options: (fieldSchemaFromZod._def?.innerType?._def?.values || fieldSchemaFromZod._def?.values)?.map((val: string) => ({ value: val, label: prettify(val) })),
    required: fieldSchemaFromZod._def?.typeName !== 'ZodOptional' && fieldSchemaFromZod._def?.innerType?._def?.typeName !== 'ZodOptional',
    tooltip: (fieldSchemaFromZod._def as any)?.tooltip || (fieldSchemaFromZod._def?.schema?._def as any)?.tooltip || undefined, // Ensure undefined if not present
    helperText: (fieldSchemaFromZod._def as any)?.helperText || undefined,
    placeholder: (fieldSchemaFromZod._def as any)?.placeholder || undefined,
  } : undefined);

  const formStateCode = watch('state'); // Assuming 'state' is the name of your state field in the form
  const { isRequired: notaryIsRequiredByState } = useNotary(formStateCode);
  const { decode: decodeVin, data: vinData, loading: vinLoading, error: vinError } = useVinDecoder();


  useEffect(() => {
    if (fieldKey === 'vin' && vinData && setValue) { 
      if (vinData.make && (!watch('make') || watch('make') === '')) setValue('make', vinData.make, { shouldValidate: true, shouldDirty: true });
      if (vinData.model && (!watch('model') || watch('model') === '')) setValue('model', vinData.model, { shouldValidate: true, shouldDirty: true });
      if (vinData.year && (!watch('year') || watch('year') === '' || watch('year') === 0)) setValue('year', Number(vinData.year), { shouldValidate: true, shouldDirty: true });
    }
  }, [vinData, fieldKey, setValue, watch]);


  if (!fieldSchema && !['as_is', 'warranty_text', 'notarizationToggle'].includes(fieldKey)) {
    console.warn(`[FieldRenderer] Field schema not found for key: ${fieldKey} in document: ${doc.name}. This field will not be rendered.`);
    return null;
  }

  const labelText = fieldSchema?.label ? t(fieldSchema.label, { defaultValue: fieldSchema.label }) : prettify(fieldKey);
  const placeholderText = fieldSchema?.placeholder ? t(fieldSchema.placeholder, { defaultValue: fieldSchema.placeholder }) : '';
  const tooltipText = fieldSchema?.tooltip ? t(fieldSchema.tooltip, { defaultValue: fieldSchema.tooltip }) : '';
  const fieldError = errors[fieldKey];

  let inputType: React.HTMLInputTypeAttribute = 'text';
  if (fieldSchema?.type === 'number' || ['year', 'odometer', 'price', 'principalAmount', 'interestRate', 'durationMonths', 'monthly_rent', 'security_deposit', 'lease_term', 'termYears', 'amountDue'].includes(fieldKey)) {
    inputType = 'number';
  } else if (fieldSchema?.type === 'date') {
    inputType = 'date';
  } else if (fieldKey.endsWith('_phone') || (fieldSchema?.label && (fieldSchema.label.toLowerCase().includes('phone') || fieldSchema.label.toLowerCase().includes('teléfono')))) {
    inputType = 'tel';
  }


  const isAddressFieldKey = (key: string) =>
    key.endsWith('_address') ||
    (fieldSchema?.label && (fieldSchema.label.toLowerCase().includes('address') || fieldSchema.label.toLowerCase().includes('dirección'))) ||
    key === 'property_address';

  if (isAddressFieldKey(fieldKey)) {
    return (
      <Controller
        control={control}
        name={fieldKey as any}
        rules={{ required: fieldSchema?.required }}
        render={({ field: { onChange: rhfOnChange, value: rhfValue, name: rhfName } }) => (
          <AddressField
            name={rhfName}
            label={labelText}
            required={fieldSchema?.required}
            error={errors[fieldKey as any]?.message as string | undefined}
            placeholder={placeholderText || t('Enter address...', { ns: 'translation' })}
            className="max-w-sm" // Applied max-w-sm
            tooltip={tooltipText}
            value={rhfValue || ''}
            onChange={(val, parts) => { // AddressField's onChange provides raw and parsed parts
                rhfOnChange(val); // Update RHF with the raw address string
                 if (parts) {
                    const prefix = fieldKey.replace(/_address$/i, '') || fieldKey.replace(/Address$/i, '');
                    // Dynamically set related fields if they exist in the schema for this prefix
                    if ((actualSchemaShape as any)?.[`${prefix}_city`]) setValue(`${prefix}_city`, parts.city, {shouldValidate: true, shouldDirty: true});
                    if ((actualSchemaShape as any)?.[`${prefix}_state`]) setValue(`${prefix}_state`, parts.state, {shouldValidate: true, shouldDirty: true});
                    if ((actualSchemaShape as any)?.[`${prefix}_postal_code`]) setValue(`${prefix}_postal_code`, parts.postalCode, {shouldValidate: true, shouldDirty: true});
                    // For full address field, parts.street can be set back to name if that's desired
                    // rhfOnChange(parts.street); // Or set the structured street part if a separate field exists
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
        <Label htmlFor={fieldKey} className={cn("font-medium", fieldError && "text-destructive")}>
          {labelText} {fieldSchema?.required && <span className="text-destructive">*</span>}
        </Label>
        {tooltipText && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-5 w-5 p-0 text-muted-foreground hover:text-foreground">
                <Info className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" align="start" className="max-w-xs text-sm bg-popover text-popover-foreground border shadow-md rounded-md p-2">
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
                  checked={notaryIsRequiredByState || field.value}
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
          {notaryIsRequiredByState && <p className="text-xs text-muted-foreground">{t('Notarization is required for {{stateCode}}.', { stateCode: formStateCode })}</p>}
          {!notaryIsRequiredByState && <p className="text-xs text-muted-foreground">{t('Notarization may incur an additional fee.')}</p>}
          {errors.notarizationPreference && <p className="text-xs text-destructive mt-1">{String(errors.notarizationPreference.message)}</p>}
        </div>
      ) : fieldKey === 'odo_status' && fieldSchema?.type === 'select' && fieldSchema?.options ? (
        <Controller
          control={control}
          name="odo_status"
          defaultValue={(fieldSchemaFromZod?._def?.defaultValue || fieldSchema?.options?.[0]?.value)}
          render={({ field }) => (
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value as string || undefined}
              className={cn("space-y-2 max-w-sm", fieldError && "border-destructive focus-visible:ring-destructive")}
              aria-invalid={!!fieldError}
            >
              {fieldSchema.options?.map((opt) => (
                <div key={opt.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={opt.value} id={`odo_status_${opt.value.toLowerCase()}`} />
                  <Label htmlFor={`odo_status_${opt.value.toLowerCase()}`} className="font-normal">
                    {t(`fields.odo_status.${opt.value.toLowerCase()}`, {defaultValue: opt.label})}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
        />
      ) : fieldKey === 'as_is' && (fieldSchema?.type === 'boolean' || fieldSchema?.type === 'select') ? (
        <Controller
          name="as_is"
          control={control}
          defaultValue={fieldSchemaFromZod?._def?.defaultValue !== undefined ? fieldSchemaFromZod._def.defaultValue : true}
          render={({ field }) => (
            <div className="flex items-center space-x-2 max-w-sm">
              <Switch
                id={field.name}
                checked={field.value}
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
            {...register(fieldKey as any, { required: fieldSchema?.required && !watch('as_is') })}
            className={cn("bg-background max-w-sm", fieldError && "border-destructive focus-visible:ring-destructive")}
            aria-invalid={!!fieldError}
          />
        )
      ) : fieldSchema?.type === 'textarea' ? (
        <Textarea
          id={fieldKey}
          placeholder={placeholderText}
          {...register(fieldKey as any, { required: fieldSchema?.required })}
          className={cn("bg-background max-w-sm", fieldError && "border-destructive focus-visible:ring-destructive")}
          aria-invalid={!!fieldError}
        />
      ) : fieldSchema?.type === 'select' && fieldSchema.options ? (
        <Controller
          name={fieldKey as any}
          control={control}
          rules={{ required: fieldSchema?.required }}
          defaultValue={fieldSchemaFromZod?._def?.defaultValue}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value as string || undefined}>
              <SelectTrigger id={fieldKey} className={cn("bg-background max-w-sm", fieldError && "border-destructive focus:ring-destructive")} aria-invalid={!!fieldError}>
                <SelectValue placeholder={placeholderText || t("Select...", {ns: 'translation'})} />
              </SelectTrigger>
              <SelectContent>
                {fieldSchema.options?.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{t(opt.label, {defaultValue: opt.label})}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      ) : ( // Default to SmartInput for text, number, tel
        <SmartInput
          id={fieldKey}
          type={inputType}
          placeholder={placeholderText}
          className={cn("input bg-background", fieldError && "border-destructive focus-visible:ring-destructive")}
          inputMode={inputType === 'number' || inputType === 'tel' ? 'numeric' : undefined}
          aria-invalid={!!fieldError}
          rhfProps={register(fieldKey as any, { 
            required: fieldSchema?.required,
            onBlur: fieldKey === 'vin' ? (e) => decode(e.target.value) : undefined,
           })}
        />
      )}
      {fieldKey === 'vin' && vinLoading && <p className="text-xs text-muted-foreground mt-1 flex items-center"><Loader2 className="h-3 w-3 animate-spin mr-1" /> {t("Decoding VIN…")}</p>}
      {fieldKey === 'vin' && vinData && !vinError && (
        <p className="text-xs text-muted-foreground mt-1">
          {t("Decoded")}: {vinData.year} {vinData.make} {vinData.model} {vinData.bodyClass ? `(${vinData.bodyClass})` : ''}
        </p>
      )}
      {fieldKey === 'vin' && vinError && <p className="text-xs text-destructive mt-1">{vinError}</p>}
      {fieldError && <p className="text-xs text-destructive mt-1">{String(fieldError.message)}</p>}
      {fieldSchema?.helperText && !fieldError && <p className="text-xs text-muted-foreground">{t(fieldSchema.helperText, {defaultValue: fieldSchema.helperText})}</p>}
    </div>
  );
}
