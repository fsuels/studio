// src/components/AddressField.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import GooglePlacesLoader from './GooglePlacesLoader';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next'; // Added
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
  label: string; // Expected to be a translation key
  placeholder?: string; // Expected to be a translation key
  required?: boolean;
  className?: string;
  error?: string; // Expected to be a translation key if it's a direct string
  tooltip?: string; // Expected to be a translation key
  value?: string;
  onChange?: (value: string, parts?: Record<string, string>) => void;
}

const AddressField = React.memo(function AddressField({
  name,
  label,
  placeholder,
  required = false,
  className,
  error,
  tooltip,
  value: controlledValue,
  onChange: controlledOnChange,
}: AddressFieldProps) {
  const { t } = useTranslation("common"); // Added
  const { register, setValue: rhfSetValue, formState: { errors: formErrors } } = useFormContext();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const fieldErrorActual = formErrors[name]?.message || error;

  const { ref: rhfRef, ...restOfRegister } = register(name, { required });

  useEffect(() => {
    let autocomplete: google.maps.places.Autocomplete | undefined;
    let intervalId: NodeJS.Timeout | undefined;

    const initializeAutocomplete = () => {
      if (!(window as any).google?.maps?.places || !inputRef.current) {
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
        fields: ['address_components', 'formatted_address', 'name'],
        componentRestrictions: { country: ['us', 'ca', 'mx'] },
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        const formattedAddress = place.formatted_address || '';

        const wanted = new Set([
          'street_number', 'route', 'locality', 'administrative_area_level_1',
          'postal_code', 'postal_code_suffix', 'country'
        ]);
        const parts: Record<string, string> = {};
        place.address_components?.forEach(c => {
          const type = c.types[0];
          if (wanted.has(type)) parts[type] = c.short_name;
        });
        const addressParts = {
            street: `${parts.street_number ?? ''} ${parts.route ?? ''}`.trim() || place.name || '',
            city: parts.locality ?? '',
            state: parts.administrative_area_level_1 ?? '',
            postalCode: [parts.postal_code, parts.postal_code_suffix].filter(Boolean).join('-'),
            country: parts.country ?? '',
        };

        if (controlledOnChange) {
          controlledOnChange(formattedAddress, addressParts);
        } else {
          rhfSetValue(name, formattedAddress, { shouldValidate: true, shouldDirty: true });
        }

        if (inputRef.current) {
          inputRef.current.value = formattedAddress;
        }
      });
      (inputRef.current as any).googleAutocomplete = autocomplete;
    };

    initializeAutocomplete();

    return () => {
      if (intervalId) clearInterval(intervalId);
      const currentInputRef = inputRef.current;
      if (currentInputRef && (currentInputRef as any).googleAutocomplete) {
        const pacContainers = document.querySelectorAll('.pac-container');
        pacContainers.forEach(container => container.remove());
      }
    };
  }, [name, rhfSetValue, controlledOnChange]);

  const handleLocalInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (controlledOnChange) {
      controlledOnChange(e.target.value);
    }
  };

  return (
    <>
      <GooglePlacesLoader />
      <div className={cn('space-y-1', className)}>
      <div className="flex items-center gap-1">
        <Label htmlFor={name} className={cn(fieldErrorActual && "text-destructive")}>{t(label)}{required && <span className="text-destructive">*</span>}</Label>
        {tooltip && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-5 w-5 p-0 text-muted-foreground hover:text-foreground">
                <Info className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" align="start" className="max-w-xs text-sm bg-popover text-popover-foreground border shadow-md rounded-md p-2">
              <p>{t(tooltip)}</p> {/* Changed from tooltipText to t(tooltip) */}
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      <Input
        id={name}
        placeholder={placeholder ? t(placeholder) : undefined} // Changed
        {...restOfRegister}
        defaultValue={controlledValue}
        onChange={controlledOnChange ? handleLocalInputChange : restOfRegister.onChange}
        ref={el => {
          rhfRef(el);
          inputRef.current = el;
        }}
        className={cn("w-full max-w-sm", fieldErrorActual && "border-destructive focus-visible:ring-destructive")}
        autoComplete="off"
        aria-invalid={!!fieldErrorActual}
      />
      {fieldErrorActual && <p className="text-xs text-destructive mt-1">{t(String(fieldErrorActual))}</p>} {/* Changed */}
      </div>
    </>
  );
});
export default AddressField;
