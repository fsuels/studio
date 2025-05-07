
// src/components/FieldRenderer.tsx
'use client';

import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox"; 
import type { LegalDocument, Question } from '@/lib/document-library';
import { useNotary } from '@/hooks/useNotary';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next'; // Import useTranslation

interface FieldRendererProps {
  fieldKey: string;
  locale: 'en' | 'es';
  doc: LegalDocument; 
}

export default function FieldRenderer({ fieldKey, locale, doc }: FieldRendererProps) {
  const { control, register, setValue, watch, formState: { errors } } = useFormContext();
  const { t } = useTranslation(); // For translating labels/placeholders if needed from i18n
  
  // Find the field schema from doc.questions array
  const fieldSchema = doc.questions?.find(q => q.id === fieldKey);

  // Watch the stateCode field (assuming it's named 'stateCode' in your form)
  const formStateCode = watch('stateCode'); 
  const { isRequired: notaryIsRequiredByState, isChecked: notaryIsChecked, setChecked: setNotaryChecked } = useNotary(formStateCode);


  if (!fieldSchema) {
    // Handle special non-question fields or error if schema not found
    if (fieldKey === 'notarizationToggle' && doc.offerNotarization) { // Check if doc offers notarization
      return (
        <div className="space-y-2 pt-4 border-t mt-4">
          <div className="flex items-center space-x-2">
            <Controller
              name="notarizationPreference" 
              control={control}
              defaultValue={notaryIsRequiredByState || false} // Default to true if required by state
              render={({ field }) => (
                <Checkbox
                  id="notarization-toggle"
                  checked={notaryIsRequiredByState || field.value} // Always checked if required by state
                  onCheckedChange={(checked) => {
                    if (notaryIsRequiredByState && !checked) return; 
                    setNotaryChecked(checked as boolean); // Update hook state
                    field.onChange(checked); // Update form state
                  }}
                  disabled={notaryIsRequiredByState} // Disable if required by state (always checked)
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

  const labelText = fieldSchema.label; // Assuming label is already in the correct language or use t() if needed
  const placeholderText = fieldSchema.placeholder;
  const fieldError = errors[fieldKey];

  // ZIP code auto-fill (example)
  const handleZipBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const zip = e.target.value;
    if (zip.length === 5 && fieldSchema.id === 'zip_code') { // Example ID
      try {
        const res = await fetch(`https://api.zippopotam.us/us/${zip}`);
        if (res.ok) {
          const data = await res.json();
          setValue('city', data.places[0]['place name']); 
          setValue('stateCode', data.places[0]['state abbreviation']); // Ensure this matches your state field ID
        }
      } catch (error) {
        console.error("Failed to fetch ZIP data", error);
      }
    }
  };

  // VIN auto-fill (example)
  const handleVinBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const vin = e.target.value;
    if (vin.length === 17 && fieldSchema.id === 'vehicle_vin') { // Example ID
      try {
        const res = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`);
        if (res.ok) {
          const data = await res.json();
          const yearResult = data.Results.find((r: any) => r.Variable === 'Model Year');
          const makeResult = data.Results.find((r: any) => r.Variable === 'Make');
          const modelResult = data.Results.find((r: any) => r.Variable === 'Model');
          
          if (yearResult) setValue('vehicle_year', yearResult.Value);
          if (makeResult) setValue('vehicle_make', makeResult.Value);
          if (modelResult) setValue('vehicle_model', modelResult.Value);
        }
      } catch (error) {
        console.error("Failed to fetch VIN data", error);
      }
    }
  };

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
          onBlur={fieldSchema.id === 'zip_code' ? handleZipBlur : fieldSchema.id === 'vehicle_vin' ? handleVinBlur : undefined}
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
      ) : (
        <Input
          id={fieldKey}
          type={fieldSchema.type}
          placeholder={placeholderText}
          {...register(fieldKey, { 
            required: fieldSchema.required,
            validate: fieldSchema.id === 'vehicle_vin' ? (value) => value.length === 17 || 'VIN must be 17 characters' : undefined
          })}
          onBlur={fieldSchema.id === 'zip_code' ? handleZipBlur : fieldSchema.id === 'vehicle_vin' ? handleVinBlur : undefined}
          className={cn("bg-background", fieldError && "border-destructive focus-visible:ring-destructive")}
        />
      )}
      {fieldError && <p className="text-xs text-destructive">{String(fieldError.message)}</p>}
      {fieldSchema.helperText && <p className="text-xs text-muted-foreground">{fieldSchema.helperText}</p>}
    </div>
  );
}
