// src/components/FieldRenderer.tsx
'use client';

import React, { useEffect } from 'react'; 
import { useFormContext, Controller } from 'react-hook-form';
import SmartInput from '@/components/wizard/SmartInput';
import AddressField from '@/components/form/AddressField'; // Updated import path
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import type { LegalDocument } from '@/lib/document-library'; 
import { useNotary } from '@/hooks/useNotary';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { prettify } from '@/lib/schema-utils';
import { useVinDecoder } from '@/hooks/useVinDecoder'; 

interface FieldRendererProps {
  fieldKey: string;
  locale: 'en' | 'es';
  doc: LegalDocument;
}

export default function FieldRenderer({ fieldKey, locale, doc }: FieldRendererProps) {
  const { control, register, setValue, watch, formState: { errors } } = useFormContext();
  const { t } = useTranslation();

  const fieldSchema = doc.questions?.find(q => q.id === fieldKey) ||
    (doc.schema && typeof doc.schema.shape === 'object' && doc.schema.shape && (doc.schema.shape as any)[fieldKey] ?
      { id: fieldKey, label: prettify(fieldKey), type: 'text', ...((doc.schema.shape as any)[fieldKey]._def) } : undefined);

  const formStateCode = watch('stateCode'); // Assuming 'stateCode' is the name of your state field
  const { isRequired: notaryIsRequiredByState } = useNotary(formStateCode);
  const { decode: decodeVin, data: vinData, loading: vinLoading, error: vinError } = useVinDecoder();

  useEffect(() => {
    if (fieldKey === 'vin' && vinData) {
      if (vinData.make && (!watch('make') || watch('make') === '')) setValue('make', vinData.make, { shouldValidate: true, shouldDirty: true });
      if (vinData.model && (!watch('model') || watch('model') === '')) setValue('model', vinData.model, { shouldValidate: true, shouldDirty: true });
      if (vinData.year && (!watch('year') || watch('year') === '' || watch('year') === 0)) setValue('year', vinData.year, { shouldValidate: true, shouldDirty: true });
    }
  }, [vinData, fieldKey, setValue, watch]);


  if (!fieldSchema && fieldKey !== 'as_is' && fieldKey !== 'warranty_text' && fieldKey !== 'notarizationToggle') {
    console.warn(`Field schema not found for key: ${fieldKey} in document: ${doc.name}`);
    return <p className="text-destructive">Configuration error: Field schema for "{fieldKey}" not found.</p>;
  }

  const labelText = fieldSchema?.label ? t(fieldSchema.label, fieldSchema.label) : prettify(fieldKey);
  const placeholderText = fieldSchema?.placeholder ? t(fieldSchema.placeholder, fieldSchema.placeholder) : '';
  const fieldError = errors[fieldKey];

  let inputType: React.HTMLInputTypeAttribute = 'text';
  if (fieldSchema?.type === 'number' || fieldKey === 'year' || fieldKey === 'odometer' || fieldKey === 'price' || fieldKey === 'principalAmount' || fieldKey === 'interestRate' || fieldKey === 'durationMonths' || fieldKey === 'monthly_rent' || fieldKey === 'security_deposit' || fieldKey === 'lease_term' || fieldKey === 'termYears' || fieldKey === 'amountDue') {
    inputType = 'number';
  } else if (fieldSchema?.type === 'date') {
    inputType = 'date';
  } else if (fieldKey.endsWith('_phone') || (fieldSchema?.label && fieldSchema.label.toLowerCase().includes('phone'))) { // Updated check for phone
    inputType = 'tel';
  }

  const isAddressFieldKey = (key: string) => key.endsWith('_address') || 
                                          (fieldSchema?.label && fieldSchema.label.toLowerCase().includes('address')) ||
                                          key === 'property_address';


  if (isAddressFieldKey(fieldKey)) {
    return (
      <AddressField
        name={fieldKey}
        label={labelText}
        placeholder={placeholderText || t('Enter address...')}
        required={fieldSchema?.required}
        aria-invalid={!!fieldError}
        className={cn(fieldError && "border-destructive focus-visible:ring-destructive")}
      />
    );
  }


  return (
    <div className="space-y-2">
       <Label htmlFor={fieldKey} className={cn("font-medium", fieldError && "text-destructive")}>
          {labelText} {fieldSchema?.required && <span className="text-destructive">*</span>}
        </Label>

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
      ) : fieldKey === 'odo_status' ? (
        <Controller
          control={control}
          name="odo_status"
          defaultValue={(doc.schema.shape as any).odo_status?._def?.defaultValue || "ACTUAL"}
          render={({ field }) => (
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value as string || undefined}
              className={cn("space-y-2", fieldError && "border-destructive focus-visible:ring-destructive")}
              aria-invalid={!!fieldError}
            >
              {(doc.schema.shape as any).odo_status._def.values.map((opt: string) => (
                 <div key={opt} className="flex items-center space-x-2">
                    <RadioGroupItem value={opt} id={`odo_status_${opt.toLowerCase()}`} />
                    <Label htmlFor={`odo_status_${opt.toLowerCase()}`} className="font-normal">
                      {t(`fields.odo_status.${opt.toLowerCase()}`, opt.replace(/_/g, ' ').charAt(0).toUpperCase() + opt.replace(/_/g, ' ').slice(1))}
                    </Label>
                 </div>
              ))}
            </RadioGroup>
          )}
        />
      ) : fieldKey === 'as_is' ? (
        <Controller
          name="as_is"
          control={control}
          defaultValue={(doc.schema.shape as any).as_is?._def?.defaultValue || true}
          render={({ field }) => (
            <div className="flex items-center space-x-2">
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
            className={cn("bg-background", fieldError && "border-destructive focus-visible:ring-destructive")}
            aria-invalid={!!fieldError}
          />
        )
      ) : fieldSchema?.type === 'textarea' ? (
        <Textarea
          id={fieldKey}
          placeholder={placeholderText}
          {...register(fieldKey as any, { required: fieldSchema?.required })}
          className={cn("bg-background", fieldError && "border-destructive focus-visible:ring-destructive")}
          aria-invalid={!!fieldError}
        />
      ) : fieldSchema?.type === 'select' && (fieldSchema.options || (doc.schema.shape as any)[fieldKey]?._def?.values) ? (
        <Controller
          name={fieldKey as any}
          control={control}
          rules={{ required: fieldSchema?.required }}
          defaultValue={(doc.schema.shape as any)[fieldKey]?._def?.defaultValue}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value as string || undefined}>
              <SelectTrigger id={fieldKey} className={cn("bg-background", fieldError && "border-destructive focus:ring-destructive")} aria-invalid={!!fieldError}>
                <SelectValue placeholder={placeholderText || t("Select...")} />
              </SelectTrigger>
              <SelectContent>
                { (doc.schema.shape as any)[fieldKey]?._def?.values ? 
                   (doc.schema.shape as any)[fieldKey]._def.values.map((opt: string) => (
                    <SelectItem key={opt} value={opt}>{t(opt.replace(/_/g, ' '), opt.replace(/_/g, ' ').charAt(0).toUpperCase() + opt.replace(/_/g, ' ').slice(1))}</SelectItem>
                  ))
                  : fieldSchema.options?.map(opt => ( 
                    <SelectItem key={opt.value} value={opt.value}>{t(opt.label, opt.label)}</SelectItem>
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
          className={cn("input bg-background", fieldError && "border-destructive focus-visible:ring-destructive")}
          inputMode={inputType === 'number' || inputType === 'tel' ? 'numeric' : undefined}
          aria-invalid={!!fieldError}
          {...register(fieldKey as any, {
             required: fieldSchema?.required,
             valueAsNumber: inputType === 'number',
             onBlur: fieldKey === 'vin' ? (e) => decodeVin(e.target.value) : undefined,
          })}
        />
      )}
      {fieldKey === 'vin' && vinLoading && <p className="text-xs text-muted-foreground mt-1">Decoding VIN…</p>}
      {fieldKey === 'vin' && vinData && !vinError && (
        <p className="text-xs text-muted-foreground mt-1">
          {vinData.year} {vinData.make} {vinData.model} {vinData.bodyClass ? `(${vinData.bodyClass})` : ''}
        </p>
      )}
      {fieldKey === 'vin' && vinError && <p className="text-xs text-destructive mt-1">{vinError}</p>}
      {fieldError && <p className="text-xs text-destructive mt-1">{String(fieldError.message)}</p>}
      {fieldSchema?.helperText && !fieldError && <p className="text-xs text-muted-foreground">{t(fieldSchema.helperText, fieldSchema.helperText)}</p>}
    </div>
  );
}
