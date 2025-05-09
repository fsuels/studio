// src/components/AddressField.tsx
'use client';

import { useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from '@/components/ui/button';


interface AddressFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  error?: string;
  tooltip?: string;
}

// Ensure this is a default export
export default function AddressField({
  name,
  label,
  placeholder,
  required = false,
  className,
  error,
  tooltip,
}: AddressFieldProps) {
  const { register, setValue, formState: { errors: formErrors } } = useFormContext();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const fieldErrorActual = formErrors[name]?.message || error;

  // Forwarding ref for react-hook-form
  const { ref: rhfRef, ...restOfRegister } = register(name, { required });

  useEffect(() => {
    let autocomplete: google.maps.places.Autocomplete | undefined;
    let intervalId: NodeJS.Timeout | undefined;

    const initializeAutocomplete = () => {
      if (!(window as any).google?.maps?.places || !inputRef.current) {
        // Retry if Google Maps API is not loaded yet
        intervalId = setInterval(() => {
          if ((window as any).google?.maps?.places && inputRef.current) {
            clearInterval(intervalId);
            intervalId = undefined;
            initializeAutocompleteInternal();
          }
        }, 100);
        return;
      }
      initializeAutocompleteInternal();
    };

    const initializeAutocompleteInternal = () => {
      if (!inputRef.current) return;
      autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
        types: ['address'],
        fields: ['address_components', 'formatted_address', 'name'], // Added 'name' for business names etc.
        componentRestrictions: { country: ['us', 'ca', 'mx'] }, // Restrict to North America
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.formatted_address) {
          setValue(name, place.formatted_address, { shouldValidate: true, shouldDirty: true });
          // Update the input visually as well, as RHF might not do it immediately for controlled external components
          if (inputRef.current) {
            inputRef.current.value = place.formatted_address;
          }
        }
        // Potentially parse address_components here and setValue for city, state, zip if needed
        // This part was in a previous version and might be useful depending on schema structure
        if (place.address_components) {
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

          // Example: setValue for structured address fields if they exist in your form
          // This assumes your form has fields like 'street', 'city', 'stateCode', 'postalCode'
          // Adjust field names as per your Zod schema
          if (setValue) { // Check if setValue is available (it should be from useFormContext)
            const streetValue = `${parts.street_number ?? ''} ${parts.route ?? ''}`.trim();
            // setValue(`${name}_street`, streetValue); // If you have a separate street field
            // setValue(`${name}_city`, parts.locality ?? '');
            // setValue(`${name}_state`, parts.administrative_area_level_1 ?? '');
            const postalCodeValue = [parts.postal_code, parts.postal_code_suffix].filter(Boolean).join('-');
            // setValue(`${name}_zip`, postalCodeValue);
            // setValue(`${name}_country`, parts.country ?? '');
          }
        }
      });
      // Store autocomplete instance on the input element to help with cleanup
      (inputRef.current as any).googleAutocomplete = autocomplete;
    };

    initializeAutocomplete();

    return () => {
      if (intervalId) clearInterval(intervalId);
      const currentInputRef = inputRef.current;
      if (currentInputRef && (currentInputRef as any).googleAutocomplete) {
        // google.maps.event.clearInstanceListeners(currentInputRef); // Preferred way if listeners are directly on input
        // (currentInputRef as any).googleAutocomplete.unbindAll(); // Fallback
        const pacContainers = document.querySelectorAll('.pac-container');
        pacContainers.forEach(container => container.remove());
      }
    };
  }, [name, setValue]);

  return (
    <div className={cn('space-y-1', className)}>
      <div className="flex items-center gap-1">
        <Label htmlFor={name} className={cn(fieldErrorActual && "text-destructive")}>{label}{required && <span className="text-destructive">*</span>}</Label>
        {tooltip && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-5 w-5 p-0 text-muted-foreground hover:text-foreground">
                <Info className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" align="start" className="max-w-xs text-sm bg-popover text-popover-foreground border shadow-md rounded-md p-2">
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      <Input
        id={name}
        placeholder={placeholder}
        {...restOfRegister} // Spread the registration props from react-hook-form
        ref={el => { // Combine refs
          rhfRef(el);
          inputRef.current = el;
        }}
        className={cn("w-full max-w-sm", fieldErrorActual && "border-destructive focus-visible:ring-destructive")} // Applied max-w-sm
        autoComplete="off" // Disable browser autocomplete to prefer Google Places
        aria-invalid={!!fieldErrorActual}
      />
      {fieldErrorActual && <p className="text-xs text-destructive mt-1">{String(fieldErrorActual)}</p>}
    </div>
  );
}
