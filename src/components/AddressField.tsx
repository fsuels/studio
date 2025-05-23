// src/components/AddressField.tsx
'use client';

import React, { useRef } from 'react';
import dynamic from 'next/dynamic';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next'; // Added
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from '@/components/ui/button';
import usePlacesAutocomplete, { getGeocode } from 'use-places-autocomplete';
import { Input } from '@/components/ui/input';

const GooglePlacesLoader = dynamic(() => import('./GooglePlacesLoader'), { ssr: false });

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

  const {
    ready,
    value: placesValue,
    suggestions: { status, data },
    setValue: setPlacesValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: { componentRestrictions: { country: ['us', 'ca', 'mx'] } },
    debounce: 300,
    defaultValue: controlledValue || '',
  });

  const handleSelect = async (address: string) => {
    setPlacesValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const place = results[0];
      const parts: Record<string, string> = {};
      place.address_components?.forEach((c) => {
        const type = c.types[0];
        if (type === 'locality') parts.city = c.short_name;
        if (type === 'administrative_area_level_1') parts.state = c.short_name;
        if (type === 'postal_code') parts.postalCode = c.short_name;
      });
      if (controlledOnChange) {
        controlledOnChange(address, parts);
      } else {
        rhfSetValue(name, address, { shouldValidate: true, shouldDirty: true });
      }
    } catch (err) {
      console.error('Failed to get geocode', err);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlacesValue(e.target.value);
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
      <div className="relative">
        <Input
          id={name}
          placeholder={placeholder ? t(placeholder) : undefined}
          {...restOfRegister}
          value={placesValue}
          onChange={handleInput}
          ref={(el) => {
            rhfRef(el);
            inputRef.current = el;
          }}
          className={cn('w-full max-w-sm', fieldErrorActual && 'border-destructive focus-visible:ring-destructive')}
          autoComplete="on"
          aria-invalid={!!fieldErrorActual}
          disabled={!ready && !controlledOnChange}
        />
        {status === 'OK' && data.length > 0 && (
          <ul className="absolute z-10 mt-1 w-full max-w-sm bg-background border border-border rounded-md shadow-md max-h-60 overflow-auto">
            {data.map(({ place_id, description }) => (
              <li
                key={place_id}
                className="px-2 py-1 cursor-pointer hover:bg-muted"
                onClick={() => handleSelect(description)}
              >
                {description}
              </li>
            ))}
          </ul>
        )}
      </div>
      {fieldErrorActual && <p className="text-xs text-destructive mt-1">{t(String(fieldErrorActual))}</p>} {/* Changed */}
      </div>
    </>
  );
});
export default AddressField;
