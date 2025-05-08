// src/components/FieldRenderer.tsx
'use client';

import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
// import { Input } from '@/components/ui/input'; // Replaced by SmartInput for relevant types
import SmartInput from '@/components/wizard/SmartInput'; // Import SmartInput
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox"; 
import type { LegalDocument, Question } from '@/lib/document-library';
import { useNotary } from '@/hooks/useNotary';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface FieldRendererProps {
  fieldKey: string;
  locale: 'en' | 'es';
  doc: LegalDocument; 
}

export default function FieldRenderer({ fieldKey, locale, doc }: FieldRendererProps) {
  const { control, register, setValue, watch, formState: { errors } } = useFormContext();
  const { t } = useTranslation();
  
  const fieldSchema = doc.questions?.find(q => q.id === fieldKey) || 
                      (doc.schema.shape && doc.schema.shape[fieldKey] ? 
                        { id: fieldKey, label: fieldKey, type: 'text', ...doc.schema.shape[fieldKey]._def } : undefined);


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
  
  const labelText = fieldSchema.label || t(fieldKey); // Use label from schema or translate fieldKey
  const placeholderText = fieldSchema.placeholder || '';
  const fieldError = errors[fieldKey];

  // Determine input type for SmartInput or specific components
  let inputType: React.HTMLInputTypeAttribute = 'text';
  if (fieldSchema.type === 'number' || fieldKey === 'vehicle_year' || fieldKey === 'odometer' || fieldKey === 'payment_price') {
    inputType = 'number';
  } else if (fieldSchema.type === 'date') {
    inputType = 'date';
  } else if (fieldKey.endsWith('_phone')) {
    inputType = 'tel';
  }


  return (
    <div className="space-y-2">
      <Label htmlFor={fieldKey} className={cn("font-medium", fieldError && "text-destructive")}>
        {labelText} {fieldSchema.required && <span className="text-destructive">*</span>}
      </Label>
      
      {fieldKey === 'payment_method' && fieldSchema.type === 'select' && doc.id === 'bill-of-sale-vehicle' ? ( // Specific handling for payment_method
         <Controller
          name={fieldKey}
          control={control}
          rules={{ required: fieldSchema.required }}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger id={fieldKey} className={cn("bg-background", fieldError && "border-destructive focus:ring-destructive")}>
                <SelectValue placeholder={placeholderText || t("Select Payment Method")} />
              </SelectTrigger>
              <SelectContent>
                {/* Options from Zod enum in schema */}
                {(doc.schema.shape as any).payment_method._def.values.map((opt: string) => (
                   <SelectItem key={opt} value={opt}>{t(opt.replace(/_/g, ' '), opt.replace(/_/g, ' ').charAt(0).toUpperCase() + opt.replace(/_/g, ' ').slice(1))}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      ) : fieldSchema.type === 'textarea' ? (
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
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger id={fieldKey} className={cn("bg-background", fieldError && "border-destructive focus:ring-destructive")}>
                <SelectValue placeholder={placeholderText || t("Select...")} />
              </SelectTrigger>
              <SelectContent>
                {fieldSchema.options?.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      ) : ( // Default to SmartInput for text, number, date, tel
        <SmartInput
          id={fieldKey}
          name={fieldKey} // Pass name to SmartInput
          type={inputType}
          placeholder={placeholderText}
          // RHF register is handled inside SmartInput now
          // required={fieldSchema.required} // RHF handles required via schema in useForm
          className={cn("input bg-background", fieldError && "border-destructive focus-visible:ring-destructive")}
          inputMode={inputType === 'number' || inputType === 'tel' ? 'numeric' : undefined}
        />
      )}
      {fieldError && <p className="text-xs text-destructive">{String(fieldError.message)}</p>}
      {fieldSchema.helperText && <p className="text-xs text-muted-foreground">{fieldSchema.helperText}</p>}
    </div>
  );
}
