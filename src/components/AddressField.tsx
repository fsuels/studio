// src/components/AddressField.tsx
'use client';

import { useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface AddressFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  error?: string;
}

export default function AddressField({
  name,
  label,
  placeholder,
  required = false,
  className,
  error,
}: AddressFieldProps) {
  const { register, setValue, formState: { errors: formErrors } } = useFormContext();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const fieldErrorActual = formErrors[name]?.message || error;

  const { ref: rhfRef, ...restOfRegister } = register(name, { required });

  useEffect(() => {
    let autocomplete: google.maps.places.Autocomplete | undefined;

    const initializeAutocomplete = () => {
      if (!(window as any).google?.maps?.places || !inputRef.current) {
        const checkGoogleMaps = setInterval(() => {
          if ((window as any).google?.maps?.places && inputRef.current) {
            clearInterval(checkGoogleMaps);
            initializeAutocompleteInternal();
          }
        }, 100);
        return () => clearInterval(checkGoogleMaps);
      }
      initializeAutocompleteInternal();
    };
    
    const initializeAutocompleteInternal = () => {
        if (!inputRef.current) return;
        autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
            types: ['address'],
            fields: ['address_components', 'formatted_address'],
            componentRestrictions: { country: ['us', 'ca', 'mx'] }
        });

        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (place.formatted_address) {
                setValue(name, place.formatted_address, { shouldValidate: true, shouldDirty: true });
                 if (inputRef.current) { 
                    inputRef.current.value = place.formatted_address;
                }
            }
        });
        (inputRef.current as any).googleAutocomplete = autocomplete;
    }
    
    const cleanupEffect = initializeAutocomplete();

    return () => {
      if (cleanupEffect) cleanupEffect(); // Call the cleanup function returned by initializeAutocomplete
      const currentInputRef = inputRef.current;
      if (currentInputRef && (currentInputRef as any).googleAutocomplete) {
        (currentInputRef as any).googleAutocomplete.unbindAll();
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
        {...restOfRegister}
        ref={el => {
          rhfRef(el);
          inputRef.current = el;
        }}
        className={cn("w-full max-w-sm", fieldErrorActual && "border-destructive focus-visible:ring-destructive")} // Added max-w-sm
        autoComplete="off"
        aria-invalid={!!fieldErrorActual}
      />
      {fieldErrorActual && <p className="text-xs text-destructive mt-1">{String(fieldErrorActual)}</p>}
    </div>
  );
}
