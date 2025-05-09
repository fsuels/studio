// src/components/wizard/useSmartField.ts
'use client';
import { useEffect } from 'react';
import type { UseFormWatch, UseFormSetValue } from 'react-hook-form';

type HookProps = {
  name: string;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
  // onChange was part of a previous iteration, not directly used in the current RHF context
  // value was part of a previous iteration
};

/** Autocomplete + masking for VIN, color, year … 
 * Phone masking is now handled directly in SmartInput.
*/
export const useSmartField = ({ name, watch, setValue }: HookProps): void => {
  const currentValue = watch(name); // Watch the value from React Hook Form

  // Address autocomplete logic has been moved to the AddressField component.

  // Year – numeric only, 4 digits
  useEffect(() => {
    if (name === 'vehicle_year' || name === 'year') { // Added 'year' for broader matching
      const currentVal = watch(name);
      if (currentVal === undefined || currentVal === null || typeof currentVal === 'object') return;
      const sanitized = String(currentVal).replace(/\D/g, '').slice(0, 4);
      if (sanitized !== String(currentVal)) {
        setValue(name, sanitized, { shouldValidate: true, shouldDirty: true });
      }
    }
  }, [currentValue, name, setValue, watch]); // Depend on currentValue

  // Color – alphabetic only
  useEffect(() => {
    if (name === 'vehicle_color' || name === 'color') { // Added 'color'
      const currentVal = watch(name);
      if (currentVal === undefined || currentVal === null || typeof currentVal === 'object') return;
      const sanitized = String(currentVal).replace(/[^a-zA-Z\s]/gi, ''); // Allow spaces
      if (sanitized !== String(currentVal)) {
        setValue(name, sanitized, { shouldValidate: true, shouldDirty: true });
      }
    }
  }, [currentValue, name, setValue, watch]); // Depend on currentValue

  // Phone number formatting is removed from here and handled in SmartInput.tsx

  // VIN - auto-populates make, model, year if these fields are empty
  // This logic was previously in useSmartField and is maintained here.
  // FieldRenderer now uses useVinDecoder hook directly for VIN display,
  // but this part is for auto-filling other fields based on VIN.
  useEffect(() => {
    if (name === 'vin') {
      const vinVal = watch(name);
      if (vinVal && typeof vinVal === 'string' && vinVal.length === 17) {
        // This fetch should ideally be debounced or handled more carefully to avoid excessive API calls
        // For now, keeping the existing logic from the prompt
        fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${vinVal}?format=json`)
          .then(r => r.ok ? r.json() : Promise.reject(new Error(`Failed to fetch VIN data: ${r.status}`)))
          .then(data => {
            const result = data.Results?.[0];
            if (result) {
              // Check if fields exist and are empty before setting them
              const currentMake = watch('vehicle_make');
              const currentModel = watch('vehicle_model');
              const currentYear = watch('vehicle_year'); // or 'year'

              if (result.Make && (currentMake === undefined || currentMake === '')) {
                setValue('vehicle_make', result.Make, { shouldValidate: true, shouldDirty: true });
              }
              if (result.Model && (currentModel === undefined || currentModel === '')) {
                setValue('vehicle_model', result.Model, { shouldValidate: true, shouldDirty: true });
              }
              if (result.ModelYear && (currentYear === undefined || currentYear === '' || currentYear === 0)) {
                setValue('vehicle_year', Number(result.ModelYear), { shouldValidate: true, shouldDirty: true });
              }
            }
          })
          .catch(error => console.error('VIN decoding error for auto-fill:', error));
      }
    }
  }, [currentValue, name, setValue, watch]); // Depend on currentValue for VIN
};
