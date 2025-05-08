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
  // RHF's `value` and `onChange` will be handled by Controller or register
}


export function AddressField({ inputNamePrefix = "", label, required, error }: AddressFieldProps) {
  const { register, setValue, formState: { errors } } = useFormContext();
  const inputRef = useRef<HTMLInputElement>(null);

  const baseFieldName = inputNamePrefix ? `${inputNamePrefix}_address` : "address";
  const streetFieldName = inputNamePrefix ? `${inputNamePrefix}_street` : "street";
  const cityFieldName = inputNamePrefix ? `${inputNamePrefix}_city` : "city";
  const stateFieldName = inputNamePrefix ? `${inputNamePrefix}_state` : "state";
  const postalCodeFieldName = inputNamePrefix ? `${inputNamePrefix}_postalCode` : "postalCode";
  const countryFieldName = inputNamePrefix ? `${inputNamePrefix}_country` : "country";

  useEffect(() => {
    let autocomplete: google.maps.places.Autocomplete | undefined;

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
        autocomplete = new google.maps.places.Autocomplete(inputRef.current!, {
          fields: ['address_components', 'formatted_address', 'name'], 
          types: ['address'],
        });

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete!.getPlace();
          if (!place.address_components) {
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
            'locality', 
            'administrative_area_level_1', 
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
             setValue(baseFieldName, streetValue, { shouldValidate: true, shouldDirty: true });
          }
        });
      } catch (e) {
        console.error("Error loading Google Maps Places Autocomplete library:", e);
      }
    })();

    return () => {
      if (autocomplete) {
        autocomplete.unbindAll();
        const pacContainers = document.querySelectorAll('.pac-container');
        pacContainers.forEach(container => container.remove());
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseFieldName, streetFieldName, cityFieldName, stateFieldName, postalCodeFieldName, countryFieldName, setValue]); 

  const { ref: rhfRef, ...restOfRegister } = register(baseFieldName); // Register the main address field
  const fieldErrorActual = errors[baseFieldName]?.message || error;


  return (
    <div>
      {label && <Label htmlFor={baseFieldName} className={cn(fieldErrorActual && "text-destructive")}>{label}{required &&<span className="text-destructive">*</span>}</Label>}
      <Input
        id={baseFieldName}
        ref={(e) => {
          rhfRef(e);
          inputRef.current = e;
        }}
        {...restOfRegister}
        className={cn("w-full", fieldErrorActual && "border-destructive focus-visible:ring-destructive")}
        placeholder="123 Main St, City, State ZIP" 
        autoComplete="off"
        aria-invalid={!!fieldErrorActual}
      />
      {fieldErrorActual && <p className="text-xs text-destructive mt-1">{String(fieldErrorActual)}</p>}
    </div>
  );
}
