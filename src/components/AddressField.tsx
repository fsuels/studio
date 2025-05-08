// src/components/AddressField.tsx
'use client';
import { useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { APILoader } from '@googlemaps/extended-component-library';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface AddressFieldProps {
  inputNamePrefix?: string;
  label?: string;
  required?: boolean;
  error?: string;
  name?: string; 
  value?: string; 
  onChange?: (raw: string, parts?: any) => void; 
  placeholder?: string; 
}


export function AddressField({ inputNamePrefix = "", label, required, error, name: propName, value: propValue, onChange: propOnChange, placeholder }: AddressFieldProps) {
  const { register, setValue, formState: { errors: formErrors } } = useFormContext();
  const inputRef = useRef<HTMLInputElement>(null);

  const baseFieldName = propName || (inputNamePrefix ? `${inputNamePrefix}_address` : "address");
  const streetFieldName = inputNamePrefix ? `${inputNamePrefix}_street` : "street";
  const cityFieldName = inputNamePrefix ? `${inputNamePrefix}_city` : "city";
  const stateFieldName = inputNamePrefix ? `${inputNamePrefix}_state` : "state";
  const postalCodeFieldName = inputNamePrefix ? `${inputNamePrefix}_postalCode` : "postalCode";
  const countryFieldName = inputNamePrefix ? `${inputNamePrefix}_country` : "country";

  useEffect(() => {
    let autocomplete: google.maps.places.Autocomplete | undefined;

    const initializeAutocomplete = async () => {
      if (!(window as any).google?.maps?.places) {
        console.warn("AddressField: Google Maps API not loaded. Attempting to load via APILoader.");
        try {
          // Ensure APILoader is available before calling importLibrary
          if (typeof APILoader === 'undefined' || !APILoader.importLibrary) {
            console.error("AddressField: APILoader is not available. Google Maps Places library cannot be loaded dynamically here. Ensure GooglePlacesLoader component is used in the layout.");
            return;
          }
          await APILoader.importLibrary('places');
          console.log("AddressField: Google Maps Places library loaded via APILoader.");
        } catch (e) {
          console.error("AddressField: Failed to load Google Maps Places library via APILoader:", e);
          return;
        }
      }

      if (!inputRef.current) {
        console.error("AddressField: inputRef is null, cannot initialize Autocomplete.");
        return;
      }

      // Check again if google.maps.places is available after potential dynamic load
      if (!(window as any).google?.maps?.places?.Autocomplete) {
        console.error("AddressField: google.maps.places.Autocomplete is still not available after APILoader attempt.");
        return;
      }

      autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
        fields: ['address_components', 'formatted_address', 'name'],
        types: ['address'],
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete!.getPlace();
        if (!place.address_components) {
          if (!inputRef.current?.value && propOnChange) {
            propOnChange(inputRef.current?.value || '');
            // Clear dependent fields if using setValue for them
            setValue(streetFieldName, '');
            setValue(cityFieldName, '');
            setValue(stateFieldName, '');
            setValue(postalCodeFieldName, '');
            setValue(countryFieldName, '');
            setValue(baseFieldName, ''); // Also clear the main field RHF value
          }
          return;
        }

        const wanted = new Set([
          'street_number',
          'route',
          'locality', // City
          'administrative_area_level_1', // State
          'postal_code',
          'postal_code_suffix',
          'country',
        ]);

        const parts: Record<string, string> = {};
        place.address_components.forEach(c => {
          const type = c.types[0];
          if (wanted.has(type)) parts[type] = c.short_name;
        });

        const streetValue = `${parts.street_number ?? ''} ${parts.route ?? ''}`.trim() || place.name || '';
        const fullPostalCode = [parts.postal_code, parts.postal_code_suffix].filter(Boolean).join('-');
        
        const parsedAddressForOnChange = {
            street: streetValue,
            city: parts.locality ?? '',
            state: parts.administrative_area_level_1 ?? '',
            postalCode: fullPostalCode,
            country: parts.country ?? ''
        };

        setValue(streetFieldName, streetValue, { shouldValidate: true, shouldDirty: true });
        setValue(cityFieldName, parts.locality ?? '', { shouldValidate: true, shouldDirty: true });
        setValue(stateFieldName, parts.administrative_area_level_1 ?? '', { shouldValidate: true, shouldDirty: true });
        setValue(postalCodeFieldName, fullPostalCode, { shouldValidate: true, shouldDirty: true });
        setValue(countryFieldName, parts.country ?? '', { shouldValidate: true, shouldDirty: true });

        const formattedOrStreet = place.formatted_address || streetValue;
        setValue(baseFieldName, formattedOrStreet, { shouldValidate: true, shouldDirty: true });
        
        if (inputRef.current) { // Update the input field's visual value directly
          inputRef.current.value = formattedOrStreet;
        }

        if (propOnChange) { // Call the passed onChange for external state update
            propOnChange(formattedOrStreet, parsedAddressForOnChange);
        }
      });
    };

    initializeAutocomplete();

    return () => {
      if (autocomplete) {
        autocomplete.unbindAll();
        const pacContainers = document.querySelectorAll('.pac-container');
        pacContainers.forEach(container => container.remove());
      }
    };
  // Ensure all dependencies that could change and affect the effect are listed.
  // RHF's setValue and register are generally stable.
  }, [baseFieldName, streetFieldName, cityFieldName, stateFieldName, postalCodeFieldName, countryFieldName, setValue, propOnChange]);

  const { ref: rhfRef, ...restOfRegister } = register(baseFieldName);
  const fieldErrorActual = formErrors[baseFieldName]?.message || error;

  return (
    <div>
      {label && <Label htmlFor={baseFieldName} className={cn(fieldErrorActual && "text-destructive")}>{label}{required &&<span className="text-destructive">*</span>}</Label>}
      <Input
        id={baseFieldName}
        ref={(e) => {
          rhfRef(e); // RHF ref
          inputRef.current = e; // Local ref for Autocomplete
        }}
        {...restOfRegister} // RHF's name, onBlur, etc.
        // RHF controls the value, so 'value' or 'defaultValue' prop here can conflict
        // if also using propValue. Ensure RHF is the source of truth for the input's value.
        // defaultValue={propValue} // Only if propValue is for initial RHF default and not meant to control it after
        className={cn("w-full", fieldErrorActual && "border-destructive focus-visible:ring-destructive")}
        placeholder={placeholder || "123 Main St, City, State ZIP"}
        autoComplete="off"
        aria-invalid={!!fieldErrorActual}
        onChange={(e) => { // This onChange is primarily for RHF
            restOfRegister.onChange(e); // RHF's internal onChange
            if (propOnChange) propOnChange(e.target.value); // Call the prop onChange for external updates
        }}
      />
      {fieldErrorActual && <p className="text-xs text-destructive mt-1">{String(fieldErrorActual)}</p>}
    </div>
  );
}
