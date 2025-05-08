// src/components/wizard/useSmartField.ts
'use client';
import { useEffect } from 'react';
import type { UseFormWatch, UseFormSetValue } from 'react-hook-form';

type HookProps = {
  name: string;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
};

/** Autocomplete + masking for address, VIN, phone, color, year … */
export const useSmartField = ({ name, watch, setValue }: HookProps): void => {
  const currentValue = watch(name);

  // Address autocomplete (Google Places)
  useEffect(() => {
    if (name !== 'seller_address' && name !== 'buyer_address') return;

    const inputEl = document.querySelector<HTMLInputElement>(`input[name="${name}"]`);
    if (!inputEl) return;

    let autocomplete: google.maps.places.Autocomplete | undefined;

    const initAutocomplete = () => {
      if (window.google && window.google.maps && window.google.maps.places && !autocomplete && inputEl) {
        autocomplete = new google.maps.places.Autocomplete(inputEl, { types: ['address'] });
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete!.getPlace();
          setValue(name, place.formatted_address || '', { shouldValidate: true, shouldDirty: true, shouldTouch: true });
        });
      }
    };

    if (!(window as any)._googlePlacesScriptLoading && !(window as any)._googlePlaces) {
      (window as any)._googlePlacesScriptLoading = true;
      const script = document.createElement('script');
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        console.warn("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set. Address autocomplete will not work.");
        (window as any)._googlePlacesScriptLoading = false;
        return;
      }
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        (window as any)._googlePlaces = true;
        (window as any)._googlePlacesScriptLoading = false;
        initAutocomplete();
      };
      script.onerror = () => {
        console.error("Failed to load Google Maps API script.");
        (window as any)._googlePlacesScriptLoading = false;
      }
      document.head.appendChild(script);
      // No cleanup needed for script tag added this way if it's meant to be global for the session
    } else if ((window as any)._googlePlaces) {
      initAutocomplete();
    }
    // If script is already loading, initAutocomplete will be called by its onload.

  }, [name, setValue, watch]);


  // Year – numeric only, 4 digits
  useEffect(() => {
    if (name === 'vehicle_year') {
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
    if (name === 'vehicle_color') {
      const currentVal = watch(name);
      if (currentVal === undefined || currentVal === null || typeof currentVal === 'object') return;
      const sanitized = String(currentVal).replace(/[^a-zA-Z ]/gi, '');
      if (sanitized !== String(currentVal)) {
        setValue(name, sanitized, { shouldValidate: true, shouldDirty: true });
      }
    }
  }, [currentValue, name, setValue, watch]);

  // Phone – digits + basic masking (US)
  useEffect(() => {
    const phoneFieldSuffix = '_phone';
    if (name.endsWith(phoneFieldSuffix)) {
      const currentVal = watch(name);
      if (currentVal === undefined || currentVal === null || typeof currentVal === 'object') return;
      const digits = String(currentVal).replace(/\D/g, '').slice(0, 10);
      let masked = digits;
      if (digits.length === 10) {
        masked = `(${digits.substring(0, 3)}) ${digits.substring(3, 6)}-${digits.substring(6)}`;
      } else if (digits.length > 6) {
         masked = `(${digits.substring(0, 3)}) ${digits.substring(3, 6)}-${digits.substring(6)}`;
      } else if (digits.length > 3) {
        masked = `(${digits.substring(0, 3)}) ${digits.substring(3)}`;
      }

      if (masked !== String(currentVal)) {
        setValue(name, masked, { shouldValidate: true, shouldDirty: true });
      }
    }
  }, [currentValue, name, setValue, watch]);

  // VIN
  useEffect(() => {
    if (name === 'vin') {
      const vinVal = watch(name);
      if (vinVal && typeof vinVal === 'string' && vinVal.length === 17) {
        fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${vinVal}?format=json`)
          .then(r => r.ok ? r.json() : Promise.reject(new Error(`Failed to fetch VIN data: ${r.status}`)))
          .then(data => {
            const result = data.Results?.[0];
            if (result) {
              if (result.Make && (!watch('vehicle_make') || watch('vehicle_make') === '')) setValue('vehicle_make', result.Make, { shouldValidate: true, shouldDirty: true });
              if (result.Model && (!watch('vehicle_model') || watch('vehicle_model') === '')) setValue('vehicle_model', result.Model, { shouldValidate: true, shouldDirty: true });
              if (result.ModelYear && (!watch('vehicle_year') || watch('vehicle_year') === '')) setValue('vehicle_year', result.ModelYear, { shouldValidate: true, shouldDirty: true });
              // Color is not typically in standard VIN decode, so it's omitted here.
            }
          })
          .catch(error => console.error('VIN decoding error:', error));
      }
    }
  }, [currentValue, name, setValue, watch]); // Use currentValue to re-run effect when this field's value changes
};
