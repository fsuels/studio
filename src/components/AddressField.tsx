'use client';
import { useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { APILoader } from '@googlemaps/extended-component-library';
import { Label } from '@/components/ui/label'; // Assuming Label might be needed for consistency
import { Input } from '@/components/ui/input'; // Assuming RHF will use this
import { cn } from '@/lib/utils';

// Note: The props for this component have significantly changed.
// It now expects to be used within a FormProvider and will register/set values for
// 'street', 'city', 'state', 'postalCode', 'country' directly.
// The 'name' prop here is conceptual for the overall address block, the actual RHF registration is for 'street'.
interface AddressFieldProps {
  // Props like label, error, required will need to be handled by the parent FieldRenderer
  // or this component needs to be adapted to accept them if it's meant to be a self-contained RHF field.
  // For now, following the provided "drop-in" code.
  inputNamePrefix?: string; // e.g., "seller" or "buyer" to form "seller_street", "seller_city"
  label?: string;
  required?: boolean;
  error?: string;
}


export function AddressField({ inputNamePrefix = "", label, required, error }: AddressFieldProps) {
  const { register, setValue, formState: { errors } } = useFormContext();
  const inputRef = useRef<HTMLInputElement>(null);

  const streetFieldName = `${inputNamePrefix ? inputNamePrefix + "_" : ""}street`;
  const cityFieldName = `${inputNamePrefix ? inputNamePrefix + "_" : ""}city`;
  const stateFieldName = `${inputNamePrefix ? inputNamePrefix + "_" : ""}state`;
  const postalCodeFieldName = `${inputNamePrefix ? inputNamePrefix + "_" : ""}postalCode`;
  const countryFieldName = `${inputNamePrefix ? inputNamePrefix + "_" : ""}country`;

  useEffect(() => {
    let autocomplete: google.maps.places.Autocomplete | undefined;

    (async () => {
      // Ensure Google Maps API is loaded (APILoader should handle this, but good to check window.google)
      if (!(window as any).google || !(window as any).google.maps || !(window as any).google.maps.places) {
        console.warn("Google Maps API not loaded yet for AddressField. APILoader might still be working or script is missing/failed.");
        // Optionally, wait for a custom event dispatched by GooglePlacesLoader
        const waitForGoogleMaps = async () => {
          return new Promise<void>(resolve => {
            if ((window as any).google?.maps?.places) {
              resolve();
            } else {
              window.addEventListener('google-maps-loaded', () => resolve(), { once: true });
            }
          });
        };
        await waitForGoogleMaps();
      }
      
      if (!inputRef.current) {
        console.error("AddressField: inputRef is null, cannot initialize Autocomplete.");
        return;
      }

      try {
        const { Autocomplete } = await APILoader.importLibrary('places') as typeof google.maps.places;
        autocomplete = new Autocomplete(inputRef.current!, {
          fields: ['address_components', 'formatted_address', 'name'], // 'geometry' removed as not used, 'formatted_address' can be useful
          types: ['address'],
        });

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete!.getPlace();
          if (!place.address_components) {
            // User might have typed something not in Places, or cleared the input
            // Clear related fields if the main address is cleared or invalid
            if (!inputRef.current?.value) {
                setValue(streetFieldName, '');
                setValue(cityFieldName, '');
                setValue(stateFieldName, '');
                setValue(postalCodeFieldName, '');
                setValue(countryFieldName, '');
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
            if (wanted.has(type)) parts[type] = c.short_name; // Use short_name for consistency
          });
          
          const streetValue = `${parts.street_number ?? ''} ${parts.route ?? ''}`.trim() || place.name || '';
          
          setValue(streetFieldName, streetValue, { shouldValidate: true, shouldDirty: true });
          setValue(cityFieldName, parts.locality ?? '', { shouldValidate: true, shouldDirty: true });
          setValue(stateFieldName, parts.administrative_area_level_1 ?? '', { shouldValidate: true, shouldDirty: true });
          setValue(
            postalCodeFieldName,
            [parts.postal_code, parts.postal_code_suffix].filter(Boolean).join('-'),
            { shouldValidate: true, shouldDirty: true }
          );
          setValue(countryFieldName, parts.country ?? '', { shouldValidate: true, shouldDirty: true });

          // Update the input field itself to the formatted address if needed, or keep user input
          // This ensures the input field shows what the user selected.
          if (inputRef.current && place.formatted_address && inputRef.current.value !== place.formatted_address) {
            inputRef.current.value = place.formatted_address;
            // setValue(streetFieldName, place.formatted_address, { shouldValidate: true, shouldDirty: true }); // Or set the 'street' field to formatted_address
          }

        });
      } catch (e) {
        console.error("Error loading Google Maps Places Autocomplete library:", e);
      }
    })();

    return () => {
      if (autocomplete) {
        autocomplete.unbindAll();
        // Clean up Google Maps script artifacts if APILoader doesn't do it or if loaded manually
        const pacContainers = document.querySelectorAll('.pac-container');
        pacContainers.forEach(container => container.remove());
      }
    };
  // IMPORTANT: RHF's setValue should not be in dependency array if we want effect to run only once for setup
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streetFieldName, cityFieldName, stateFieldName, postalCodeFieldName, countryFieldName]); 
  // Removed setValue from deps to prevent re-running the effect unnecessarily.
  // The effect is for initializing the autocomplete.

  const { ref: rhfRef, ...restOfRegister } = register(streetFieldName);

  return (
    <div>
      {label && <Label htmlFor={streetFieldName} className={cn(error && "text-destructive")}>{label}{required &&<span className="text-destructive">*</span>}</Label>}
      <Input
        id={streetFieldName}
        ref={(e) => {
          rhfRef(e);
          inputRef.current = e;
        }}
        {...restOfRegister}
        className={cn("w-full", error && "border-destructive focus-visible:ring-destructive")}
        placeholder="123 Main St" // This placeholder might be overridden by RHF defaultValues or FieldRenderer
        autoComplete="off" // Important for custom autocomplete
        aria-invalid={!!error}
      />
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}
