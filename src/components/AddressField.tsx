// src/components/AddressField.tsx
'use client';

import { useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface AddressFieldProps {
  name: string;          // RHF field name (e.g. "sellerAddress")
  label: string;         // i18n-ready label
  placeholder?: string;
  required?: boolean;
  className?: string;
  error?: string; // Added error prop
  value?: string; // Added value prop for controlled component pattern if needed outside RHF
  onChange?: (raw: string, parts?: any) => void; // Added onChange prop
  inputNamePrefix?: string; // keep this prop for potential use even if not directly used by this impl.
}

/**
 * Address input with Google Places Autocomplete.
 * Uses the single <script> tag you already load in `layout.tsx`.
 */
export default function AddressField({
  name,
  label,
  placeholder,
  required = false,
  className,
  error, // consume error prop
}: AddressFieldProps) {
  const { register, setValue, formState: { errors: formErrors } } = useFormContext();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const fieldErrorActual = formErrors[name]?.message || error;


  const { ref: rhfRef, ...restOfRegister } = register(name, { required });

  useEffect(() => {
    // Make sure the Google script has loaded and inputRef is set
    if (!(window as any).google?.maps?.places || !inputRef.current) {
        // console.warn("AddressField: Google Maps API not ready or input ref not set.");
        // Retry mechanism could be added here if needed, or rely on GooglePlacesLoader
        const checkGoogleMaps = setInterval(() => {
            if ((window as any).google?.maps?.places && inputRef.current) {
                clearInterval(checkGoogleMaps);
                initializeAutocomplete();
            }
        }, 100);
        return () => clearInterval(checkGoogleMaps);
    }

    const initializeAutocomplete = () => {
        if (!inputRef.current) return;
        const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
            types: ['address'],
            fields: ['address_components', 'formatted_address'], // Ensure 'formatted_address' is requested
            componentRestrictions: { country: ['us', 'ca', 'mx'] } // Optional: Restrict to specific countries
        });

        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (place.formatted_address) {
                setValue(name, place.formatted_address, { shouldValidate: true, shouldDirty: true });
                 if (inputRef.current) { // Directly update input value for visual consistency
                    inputRef.current.value = place.formatted_address;
                }

                // Optional: Parse and set individual address components if needed elsewhere in the form
                // const parts = parseAddressComponents(place.address_components);
                // if (parts && onChangeProp) { onChangeProp(place.formatted_address, parts); }
            }
        });

        // Clean-up on unmount
        // Storing autocomplete instance on the ref to access it in cleanup
        (inputRef.current as any).googleAutocomplete = autocomplete;
    }
    
    initializeAutocomplete();

    return () => {
        const currentInputRef = inputRef.current;
        if (currentInputRef && (currentInputRef as any).googleAutocomplete) {
            (currentInputRef as any).googleAutocomplete.unbindAll();
            // Remove PAC container to prevent duplicates if component re-initializes
            const pacContainers = document.querySelectorAll('.pac-container');
            pacContainers.forEach(container => container.remove());
        }
    };
  }, [name, setValue]);

  return (
    <div className={cn('space-y-1', className)}>
      <Label htmlFor={name} className={cn(fieldErrorActual && "text-destructive")}>{label}{required && <span className="text-destructive">*</span>}</Label>
      <Input
        id={name}
        placeholder={placeholder}
        {...restOfRegister} // RHF's name, onBlur, etc.
        ref={el => {
          rhfRef(el);   // forward ref to RHF
          inputRef.current = el;    // keep our own ref for Autocomplete
        }}
        className={cn("w-full", fieldErrorActual && "border-destructive focus-visible:ring-destructive")}
        autoComplete="off" // Important for Google Places Autocomplete to work correctly
        aria-invalid={!!fieldErrorActual}
      />
      {fieldErrorActual && <p className="text-xs text-destructive mt-1">{String(fieldErrorActual)}</p>}
    </div>
  );
}

// Helper function to parse address components (optional)
// function parseAddressComponents(components: google.maps.GeocoderAddressComponent[] | undefined) {
//   if (!components) return undefined;
//   const parts: Record<string, string> = {};
//   components.forEach(c => {
//     const type = c.types[0];
//     if (type === 'street_number') parts.streetNumber = c.long_name;
//     if (type === 'route') parts.streetName = c.long_name;
//     if (type === 'locality') parts.city = c.long_name;
//     if (type === 'administrative_area_level_1') parts.state = c.short_name;
//     if (type === 'postal_code') parts.postalCode = c.long_name;
//     if (type === 'country') parts.country = c.short_name;
//   });
//   return {
//     street: `${parts.streetNumber || ''} ${parts.streetName || ''}`.trim(),
//     city: parts.city || '',
//     state: parts.state || '',
//     postalCode: parts.postalCode || '',
//     country: parts.country || '',
//   };
// }
