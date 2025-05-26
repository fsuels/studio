// src/components/wizard/useSmartField.ts
'use client';
import { useEffect } from 'react';
import type { UseFormWatch, UseFormSetValue, UseFormGetValues, FieldValues, Path } from 'react-hook-form';

type HookProps<TFieldValues extends FieldValues = FieldValues> = {
  name: Path<TFieldValues>;
  watch: UseFormWatch<TFieldValues>;
  setValue: UseFormSetValue<TFieldValues>;
  getValues: UseFormGetValues<TFieldValues>;
};

/** Autocomplete + masking for VIN, color, year … 
 * Phone masking is handled directly in SmartInput.
*/
export const useSmartField = <TFieldValues extends FieldValues = FieldValues>(
  { name, watch, setValue, getValues }: HookProps<TFieldValues>,
): void => {
  const currentValue = watch(name); 

  // Year – numeric only, 4 digits
  useEffect(() => {
    if (name === 'vehicle_year' || name === 'year') {
      const currentVal = watch(name);
      if (currentVal === undefined || currentVal === null || typeof currentVal === 'object') return;
      const sanitized = String(currentVal).replace(/\D/g, '').slice(0, 4);
      if (sanitized !== String(currentVal)) {
        setValue(name, sanitized, { shouldValidate: true, shouldDirty: true });
      }
    }
  }, [currentValue, name, setValue, watch]);

  // Color – alphabetic only
  useEffect(() => {
    if (name === 'vehicle_color' || name === 'color') { 
      const currentVal = watch(name);
      if (currentVal === undefined || currentVal === null || typeof currentVal === 'object') return;
      const sanitized = String(currentVal).replace(/[^a-zA-Z\s]/gi, ''); 
      if (sanitized !== String(currentVal)) {
        setValue(name, sanitized, { shouldValidate: true, shouldDirty: true });
      }
    }
  }, [currentValue, name, setValue, watch]);

  // VIN - auto-populates make, model, year if these fields are empty
  useEffect(() => {
    if (name === 'vin') {
      const vinVal = watch(name);
      if (vinVal && typeof vinVal === 'string' && vinVal.length === 17) {
        fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${vinVal}?format=json`)
          .then(r => r.ok ? r.json() : Promise.reject(new Error(`Failed to fetch VIN data: ${r.status}`)))
          .then(data => {
            const result = data.Results?.[0];
            if (result) {
              const formValues = getValues(); // Get current form values

              if (result.Make && (formValues.vehicle_make === undefined || formValues.vehicle_make === '')) {
                setValue('vehicle_make', result.Make, { shouldValidate: true, shouldDirty: true });
              }
              if (result.Model && (formValues.vehicle_model === undefined || formValues.vehicle_model === '')) {
                setValue('vehicle_model', result.Model, { shouldValidate: true, shouldDirty: true });
              }
              if (result.ModelYear && (formValues.vehicle_year === undefined || formValues.vehicle_year === '' || formValues.vehicle_year === 0)) {
                setValue('vehicle_year', Number(result.ModelYear), { shouldValidate: true, shouldDirty: true });
              }
            }
          })
          .catch(error => console.error('VIN decoding error for auto-fill:', error));
      }
    }
  }, [currentValue, name, setValue, watch, getValues]); 
};