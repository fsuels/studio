// src/hooks/useSmartField.ts
'use client';
import { useEffect } from 'react';
import type { UseFormWatch, UseFormSetValue, UseFormGetValues } from 'react-hook-form';

type HookProps<T> = {
  name: keyof T & string
  watch: UseFormWatch<T>
  setValue: UseFormSetValue<T>
  getValues: UseFormGetValues<T>
}

/** Autocomplete + masking for VIN, color, year … 
 * Phone masking is handled directly in SmartInput.
*/
export const useSmartField = <T extends Record<string, unknown>>({
  name,
  watch,
  setValue,
  getValues,
}: HookProps<T>): void => {
  const fieldValue = watch(name)

  // Year – numeric only, 4 digits
  useEffect(() => {
    if (name === 'vehicle_year' || name === 'year') {
      const currentVal = watch(name);
      // Ensure currentVal is a string or number before processing
      if (typeof currentVal !== 'string' && typeof currentVal !== 'number') return;
      const stringVal = String(currentVal);
      const sanitized = stringVal.replace(/\D/g, '').slice(0, 4);
      if (sanitized !== stringVal) {
        setValue(name, sanitized, { shouldValidate: true, shouldDirty: true });
      }
    }
  }, [fieldValue, name, setValue, watch]);

  // Color – alphabetic only
  useEffect(() => {
    if (name === 'vehicle_color' || name === 'color') { 
      const currentVal = watch(name);
      if (typeof currentVal !== 'string') return; // Only process if it's a string
      const sanitized = currentVal.replace(/[^a-zA-Z\s]/gi, ''); 
      if (sanitized !== currentVal) {
        setValue(name, sanitized, { shouldValidate: true, shouldDirty: true });
      }
    }
  }, [fieldValue, name, setValue, watch]);

  // VIN - auto-populates make, model, year if these fields are empty
  const vinVal = watch(name)
  useEffect(() => {
    if (name === 'vin') {
      if (vinVal && typeof vinVal === 'string' && vinVal.length === 17) {
        // Ensure form fields like 'vehicle_make', 'vehicle_model', 'vehicle_year' exist if you're setting them.
        // Assuming they are part of the Zod schema and RHF form.
        fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${vinVal}?format=json`)
          .then(r => r.ok ? r.json() : Promise.reject(new Error(`Failed to fetch VIN data: ${r.status}`)))
          .then(data => {
            const result = data.Results?.[0];
            if (result) {
              const formValues = getValues(); 

              const makeField = 'make'; // Use 'make' if schema field is 'make', or 'vehicle_make'
              const modelField = 'model'; // Use 'model' or 'vehicle_model'
              const yearField = 'year';   // Use 'year' or 'vehicle_year'


              if (result.Make && (formValues[makeField] === undefined || formValues[makeField] === '')) {
                setValue(makeField, result.Make, { shouldValidate: true, shouldDirty: true });
              }
              if (result.Model && (formValues[modelField] === undefined || formValues[modelField] === '')) {
                setValue(modelField, result.Model, { shouldValidate: true, shouldDirty: true });
              }
              if (result.ModelYear && (formValues[yearField] === undefined || formValues[yearField] === '' || formValues[yearField] === 0 || isNaN(parseInt(formValues[yearField])) ) ) {
                setValue(yearField, Number(result.ModelYear), { shouldValidate: true, shouldDirty: true });
              }
            }
          })
          .catch(error => console.error('VIN decoding error for auto-fill:', error));
      }
    }
  // Ensure dependencies are correct. `fieldValue` for `vin` is `vinVal`.
  }, [vinVal, name, setValue, getValues, watch]);
};
