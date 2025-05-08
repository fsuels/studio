// src/components/FieldRenderer.tsx
'use client';

import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import SmartInput from '@/components/wizard/SmartInput'; 
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox"; 
import type { LegalDocument, Question } from '@/lib/document-library';
import { useNotary } from '@/hooks/useNotary';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { prettify } from '@/lib/schema-utils'; // Import prettify

interface FieldRendererProps {
  fieldKey: string;
  locale: 'en' | 'es';
  doc: LegalDocument; 
}

export default function FieldRenderer({ fieldKey, locale, doc }: FieldRendererProps) {
  const { control, register, setValue, watch, formState: { errors } } = useFormContext();
  const { t } = useTranslation();
  
  const fieldSchema = doc.questions?.find(q => q.id === fieldKey) || 
                      (doc.schema && typeof doc.schema.shape === 'object' && doc.schema.shape && doc.schema.shape[fieldKey] ? 
                        { id: fieldKey, label: prettify(fieldKey) , type: 'text', ...((doc.schema.shape as any)[fieldKey]._def) } : undefined);


  const formStateCode = watch('stateCode'); 
  const { isRequired: notaryIsRequiredByState } = useNotary(formStateCode);

  if (!fieldSchema) {
    if (fieldKey === 'notarizationToggle' && doc.offerNotarization) {
      return (
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
                />
              )}
            />
            <Label htmlFor="notarization-toggle" className="text-sm font-normal">
              {notaryIsRequiredByState
                ? t('Notarization (Required by State)')
                : t('Add Notarization (Optional)')}
            </Label>
          </div>
           {notaryIsRequiredByState && <p className="text-xs text-muted-foreground">{t('Notarization is required for {{stateCode}}.', {stateCode: formStateCode})}</p>}
           {!notaryIsRequiredByState && <p className="text-xs text-muted-foreground">{t('Notarization may incur an additional fee.')}</p>}
        </div>
      );
    }
    console.warn(`Field schema not found for key: ${fieldKey} in document: ${doc.name}`);
    return <p className="text-destructive">Configuration error: Field schema for "{fieldKey}" not found.</p>;
  }
  
  const labelText = fieldSchema.label ? t(fieldSchema.label, fieldSchema.label) : prettify(fieldKey);
  const placeholderText = fieldSchema.placeholder ? t(fieldSchema.placeholder, fieldSchema.placeholder) : '';
  const fieldError = errors[fieldKey];

  let inputType: React.HTMLInputTypeAttribute = 'text';
  if (fieldSchema.type === 'number' || fieldKey === 'vehicle_year' || fieldKey === 'odometer' || fieldKey === 'payment_price' || fieldKey === 'principalAmount' || fieldKey === 'interestRate' || fieldKey === 'durationMonths' || fieldKey === 'monthly_rent' || fieldKey === 'security_deposit' || fieldKey === 'lease_term' || fieldKey === 'termYears' || fieldKey === 'amountDue') {
    inputType = 'number';
  } else if (fieldSchema.type === 'date') {
    inputType = 'date';
  } else if (fieldKey.endsWith('_phone') || name.endsWith('Phone')) {
    inputType = 'tel';
  }


  return (
    <div className="space-y-2">
      <Label htmlFor={fieldKey} className={cn("font-medium", fieldError && "text-destructive")}>
        {labelText} {fieldSchema.required && <span className="text-destructive">*</span>}
      </Label>
      
      {fieldSchema.type === 'textarea' ? (
        <Textarea
          id={fieldKey}
          placeholder={placeholderText}
          {...register(fieldKey, { required: fieldSchema.required })}
          className={cn("bg-background", fieldError && "border-destructive focus-visible:ring-destructive")}
        />
      ) : fieldSchema.type === 'select' && fieldSchema.options ? (
        <Controller
          name={fieldKey}
          control={control}
          rules={{ required: fieldSchema.required }}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value || undefined}>
              <SelectTrigger id={fieldKey} className={cn("bg-background", fieldError && "border-destructive focus:ring-destructive")}>
                <SelectValue placeholder={placeholderText || t("Select...")} />
              </SelectTrigger>
              <SelectContent>
                {fieldSchema.options?.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{t(opt.label, opt.label)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      ) : ( 
        <SmartInput
          id={fieldKey}
          name={fieldKey} 
          type={inputType}
          placeholder={placeholderText}
          className={cn("input bg-background", fieldError && "border-destructive focus-visible:ring-destructive")}
          inputMode={inputType === 'number' || inputType === 'tel' ? 'numeric' : undefined}
        />
      )}
      {fieldError && <p className="text-xs text-destructive">{String(fieldError.message)}</p>}
      {fieldSchema.helperText && <p className="text-xs text-muted-foreground">{t(fieldSchema.helperText, fieldSchema.helperText)}</p>}
    </div>
  );
}
