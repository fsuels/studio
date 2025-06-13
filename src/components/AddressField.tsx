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
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

const GooglePlacesLoader = dynamic(() => import('./GooglePlacesLoader'), {
  ssr: false,
});
const PlacePicker = dynamic(
  () =>
    import('@googlemaps/extended-component-library/react').then(
      (m) => m.PlacePicker,
    ),
  { ssr: false },
);




interface AddressFieldProps {
  name: string;
  label: string; // Expected to be a translation key
  placeholder?: string; // Expected to be a translation key
  required?: boolean;
  className?: string;
  error?: string; // Expected to be a translation key if it's a direct string
  tooltip?: string; // Expected to be a translation key
  value?: string;
  onChange?: (_value: string, _parts?: Record<string, string>) => void;
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
  const { t } = useTranslation('common'); // Added
  const {
    register,
    setValue: rhfSetValue,
    formState: { errors: formErrors },
  } = useFormContext();
  const pickerRef = useRef<HTMLElement | null>(null);
  const fieldErrorActual = formErrors[name]?.message || error;

  const { ref: rhfRef, ...restOfRegister } = register(name, { required });
  const handlePlaceChange = (e: Event) => {
    const target = e.target as any;
    const place = target.value as {
      formattedAddress?: string;
      displayName?: string;
      addressComponents?: { types: string[]; shortText: string }[];
    } | null;
    const formattedAddress = place?.formattedAddress || '';

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

    place?.addressComponents?.forEach((c) => {
      const type = c.types[0];
      if (wanted.has(type)) parts[type] = c.shortText;
    });
    const addressParts = {
      street:
        `${parts.street_number ?? ''} ${parts.route ?? ''}`.trim() ||
        place?.displayName ||
        '',
      city: parts.locality ?? '',
      state: parts.administrative_area_level_1 ?? '',
      postalCode: [parts.postal_code, parts.postal_code_suffix]
        .filter(Boolean)
        .join('-'),
      country: parts.country ?? '',
    };

    if (controlledOnChange) {
      controlledOnChange(formattedAddress, addressParts);
    } else {
      rhfSetValue(name, formattedAddress, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };


  return (
    <>
      <GooglePlacesLoader />
      <div className={cn('space-y-1', className)}>
        <div className="flex items-center gap-1">
          <Label
            htmlFor={name}
            className={cn(fieldErrorActual && 'text-destructive')}
          >
            {t(label)}
            {required && <span className="text-destructive">*</span>}
          </Label>
          {tooltip && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 p-0 text-muted-foreground hover:text-foreground"
                >
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                align="start"
                className="max-w-xs text-sm bg-popover text-popover-foreground border shadow-md rounded-md p-2"
              >
                <p>{t(tooltip)}</p>{' '}
                {/* Changed from tooltipText to t(tooltip) */}
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        <input type="hidden" id={name} {...restOfRegister} />
        <PlacePicker
          placeholder={placeholder ? t(placeholder) : undefined}
          country={["us", "ca", "mx"]}
          type="address"
          onPlaceChange={handlePlaceChange}
          ref={(el) => {
            rhfRef(el as unknown as HTMLInputElement);
            pickerRef.current = el;
          }}
          style={{ width: '100%' }}
        />
        {fieldErrorActual && (
          <p className="text-xs text-destructive mt-1">
            {t(String(fieldErrorActual))}
          </p>
        )}{' '}
        {/* Changed */}
      </div>
    </>
  );
});
export default AddressField;
