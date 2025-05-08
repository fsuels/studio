// src/components/AddressField.tsx
'use client';
import { useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { APILoader } from '@googlemaps/extended-component-library';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface AddressFieldProps {
  inputNamePrefix?: string; // e.g., "seller" or "buyer" to create "seller_address"
  label?: string;
  required?: boolean;
  error?: string;
  // RHF's `value` and `onChange` will be handled by Controller or register
}


export function AddressField({ inputNamePrefix = "", label, required, error }: AddressFieldProps) {
  const { register, setValue, formState: { errors: formErrors } } = useFormContext(); // Renamed errors to formErrors
  const inputRef = useRef<HTMLInputElement>(null);

  // Construct field names based on prefix
  const baseFieldName = inputNamePrefix ? `${inputNamePrefix}_address` : "address";
  const streetFieldName = inputNamePrefix ? `${inputNamePrefix}_street` : "street";
  const cityFieldName = inputNamePrefix ? `${inputNamePrefix}_city` : "city";
  const stateFieldName = inputNamePrefix ? `${inputNamePrefix}_state` : "state";
  const postalCodeFieldName = inputNamePrefix ? `${inputNamePrefix}_postalCode` : "postalCode"; // Corrected: postalCode
  const countryFieldName = inputNamePrefix ? `${inputNamePrefix}_country` : "country";


  useEffect(() => {
    let autocomplete: google.maps.places.Autocomplete | undefined; // Corrected type

    (async () => {
      if (!(window as any).google?.maps?.places) {
        console.warn("Google Maps API not loaded yet for AddressField. APILoader might still be working or script is missing/failed.");
        await APILoader.importLibrary('places'); // Ensure library is loaded
      }
      
      if (!inputRef.current) {
        console.error("AddressField: inputRef is null, cannot initialize Autocomplete.");
        return;
      }

      try {
        // APILoader should make google.maps.places.Autocomplete available
        autocomplete = new google.maps.places.Autocomplete(inputRef.current!, { // Added non-null assertion
          fields: ['address_components', 'formatted_address', 'name'], // Removed geometry as it's not used
          types: ['address'],
        });

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete!.getPlace(); // Added non-null assertion
          if (!place.address_components) {
            // If place has no address_components, it might be a business or just a name.
            // Clear dependent fields if the input is also cleared, otherwise leave as is.
            if (!inputRef.current?.value) {
                setValue(streetFieldName, '');
                setValue(cityFieldName, '');
                setValue(stateFieldName, '');
                setValue(postalCodeFieldName, '');
                setValue(countryFieldName, '');
                setValue(baseFieldName, ''); // Clear the main address field too
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
          
          // Construct street from street_number and route, or use place.name as fallback
          const streetValue = `${parts.street_number ?? ''} ${parts.route ?? ''}`.trim() || place.name || '';
          
          setValue(streetFieldName, streetValue, { shouldValidate: true, shouldDirty: true });
          setValue(cityFieldName, parts.locality ?? '', { shouldValidate: true, shouldDirty: true });
          setValue(stateFieldName, parts.administrative_area_level_1 ?? '', { shouldValidate: true, shouldDirty: true });
          
          const fullPostalCode = [parts.postal_code, parts.postal_code_suffix].filter(Boolean).join('-');
          setValue(postalCodeFieldName, fullPostalCode, { shouldValidate: true, shouldDirty: true });
          setValue(countryFieldName, parts.country ?? '', { shouldValidate: true, shouldDirty: true });

          // Update the main address field (the one with Autocomplete) to formatted_address
          if (place.formatted_address) {
            setValue(baseFieldName, place.formatted_address, { shouldValidate: true, shouldDirty: true });
            if (inputRef.current) {
              inputRef.current.value = place.formatted_address; // Also directly set input value if needed
            }
          } else {
             // Fallback if formatted_address is not available, use the constructed street value
             setValue(baseFieldName, streetValue, { shouldValidate: true, shouldDirty: true });
          }
        });
      } catch (e) {
        console.error("Error loading Google Maps Places Autocomplete library:", e);
        // Potentially set an error state here to inform the user
      }
    })();

    return () => {
      // Cleanup: remove listeners and PAC container if it exists
      if (autocomplete) {
        autocomplete.unbindAll(); // Remove all listeners from the Autocomplete instance
        // Remove the PAC container from the DOM
        const pacContainers = document.querySelectorAll('.pac-container');
        pacContainers.forEach(container => container.remove());
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseFieldName, streetFieldName, cityFieldName, stateFieldName, postalCodeFieldName, countryFieldName, setValue]); // Dependencies for useEffect

  // Get RHF registration props, separating ref
  const { ref: rhfRef, ...restOfRegister } = register(baseFieldName); // Register the main address field
  const fieldErrorActual = formErrors[baseFieldName]?.message || error;


  return (
    <div>
      {label && <Label htmlFor={baseFieldName} className={cn(fieldErrorActual && "text-destructive")}>{label}{required &&<span className="text-destructive">*</span>}</Label>}
      <Input
        id={baseFieldName}
        ref={(e) => {
          rhfRef(e); // Pass the element to RHF's ref
          inputRef.current = e; // Also assign to local inputRef
        }}
        {...restOfRegister} // Spread other RHF props (onChange, onBlur, name)
        className={cn("w-full", fieldErrorActual && "border-destructive focus-visible:ring-destructive")}
        placeholder="123 Main St, City, State ZIP" // Generic placeholder
        autoComplete="off" // Important to disable browser's own autocomplete
        aria-invalid={!!fieldErrorActual}
      />
      {fieldErrorActual && <p className="text-xs text-destructive mt-1">{String(fieldErrorActual)}</p>}
    </div>
  );
}
