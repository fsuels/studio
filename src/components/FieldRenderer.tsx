
// src/components/FieldRenderer.tsx
'use client';

import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox"; // Assuming Checkbox is for the notary
import type { LegalDocument, Question } from '@/lib/document-library';
import { useNotary } from '@/hooks/useNotary';
import { cn } from '@/lib/utils';

interface FieldRendererProps {
  fieldKey: string;
  locale: 'en' | 'es';
  doc: LegalDocument; // Using LegalDocument type which includes schema
  // requiresNotary: boolean; // This will be determined by useNotary hook based on state
}

export default function FieldRenderer({ fieldKey, locale, doc }: FieldRendererProps) {
  const { control, register, setValue, watch, formState: { errors } } = useFormContext();
  
  const fieldSchema = doc.questions?.find(q => q.id === fieldKey);

  // Watch the stateCode field if it exists in the form
  const formStateCode = watch('stateCode'); // Assuming 'stateCode' is an ID in your form
  const { isRequired: notaryIsRequiredByState, isChecked: notaryIsChecked, setIsChecked: toggleNotary } = useNotary(formStateCode);


  if (!fieldSchema) {
    // This can happen if steps are just keys of schema but not direct questions (e.g. for grouping)
    // Or if fieldKey is for a special non-question field like the notary toggle
    if (fieldKey === 'notarizationToggle') { // Example special key for notary
      return (
        <div className="space-y-2">
          <Label htmlFor="notarization-toggle" className="font-medium">Notarization</Label>
          <div className="flex items-center space-x-2">
            <Controller
              name="notarizationPreference" // Field name in react-hook-form
              control={control}
              defaultValue={notaryIsChecked}
              render={({ field }) => (
                <Checkbox
                  id="notarization-toggle"
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    if (notaryIsRequiredByState && !checked) return; // Prevent unchecking if required
                    field.onChange(checked);
                  }}
                  disabled={notaryIsRequiredByState}
                />
              )}
            />
            <Label htmlFor="notarization-toggle" className="text-sm font-normal">
              {notaryIsRequiredByState
                ? 'Notarization (Required by State)'
                : 'Add Notarization (Optional)'}
            </Label>
          </div>
           {notaryIsRequiredByState && <p className="text-xs text-muted-foreground">Notarization is required for {formStateCode}.</p>}
        </div>
      );
    }
    return <p className="text-destructive">Field schema not found for: {fieldKey}</p>;
  }

  const labelText = fieldSchema.label; // Assuming label is already in the correct language or use t() if needed
  const placeholderText = fieldSchema.placeholder;
  const fieldError = errors[fieldKey];

  const handleZipBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const zip = e.target.value;
    if (zip.length === 5) {
      try {
        const res = await fetch(`https://api.zippopotam.us/us/${zip}`);
        if (res.ok) {
          const data = await res.json();
          setValue('city', data.places[0]['place name']); // Assuming 'city' field exists
          setValue('state', data.places[0]['state abbreviation']); // Assuming 'state' field exists
        }
      } catch (error) {
        console.error("Failed to fetch ZIP data", error);
      }
    }
  };

  const handleVinBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const vin = e.target.value;
    if (vin.length === 17) {
      try {
        const res = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`);
        if (res.ok) {
          const data = await res.json();
          // NHTSA API structure might vary. These indices are examples.
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
          onBlur={fieldKey === 'zipcode' ? handleZipBlur : fieldKey === 'vin' ? handleVinBlur : undefined}
          className={cn(fieldError && "border-destructive focus-visible:ring-destructive")}
        />
      ) : fieldSchema.type === 'select' && fieldSchema.options ? (
        <Controller
          name={fieldKey}
          control={control}
          rules={{ required: fieldSchema.required }}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger id={fieldKey} className={cn(fieldError && "border-destructive focus:ring-destructive")}>
                <SelectValue placeholder={placeholderText || "Select..."} />
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
            validate: fieldKey === 'vin' ? (value) => value.length === 17 || 'VIN must be 17 characters' : undefined
          })}
          onBlur={fieldKey === 'zipcode' ? handleZipBlur : fieldKey === 'vin' ? handleVinBlur : undefined}
          className={cn(fieldError && "border-destructive focus-visible:ring-destructive")}
        />
      )}
      {fieldError && <p className="text-xs text-destructive">{String(fieldError.message)}</p>}
      {fieldSchema.helperText && <p className="text-xs text-muted-foreground">{fieldSchema.helperText}</p>}
    </div>
  );
}
