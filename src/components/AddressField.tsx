// src/components/AddressField.tsx
'use client';

import React, { useState } from 'react'; // Import React
import usePlacesAutocomplete, {
  // geocodeByAddress, // Not used in the provided code, but keeping for reference
  // getLatLng, // Not used in the provided code
  getDetails, // Used for parsing components
} from 'use-places-autocomplete';
import { Loader2, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils'; // Import cn for class utility
import { Input } from '@/components/ui/input'; // Import Input from ui
import { Label } from '@/components/ui/label'; // Import Label from ui

export interface ParsedAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface AddressFieldProps {
  label?: string; // Made label optional as it's rendered externally sometimes
  value: string;
  onChange: (v: string, parts?: ParsedAddress) => void;
  placeholder?: string;
  required?: boolean;
  error?: string | undefined;
  name?: string; // Added name prop for react-hook-form integration
  id?: string; // Added id prop
  className?: string; // Added className for general styling
}

export const AddressField: React.FC<AddressFieldProps> = ({
  label,
  value,
  onChange,
  placeholder = '123 Main St, Springfield, IL',
  required,
  error,
  name,
  id,
  className,
}) => {
  const {
    ready,
    value: autocompleteValue, // Renamed to avoid conflict with prop `value`
    setValue: setAutocompleteValue, // Renamed
    suggestions: { status, data: suggestionsData, loading: placesLoading },
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: { /* Optional: configure to your needs */ },
    debounce: 300,
    defaultValue: value, // Initialize with the current form value
  });
  
  // Keep internal state in sync with prop value if it changes externally
  React.useEffect(() => {
    if (value !== autocompleteValue) {
        setAutocompleteValue(value, false); // false to not re-trigger suggestions
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setAutocompleteValue(newValue); // Update hook's internal value
    onChange(newValue); // Update form's value
  };


  const parseComponents = async (placeId: string): Promise<ParsedAddress | undefined> => {
    try {
        const results = await getDetails({ placeId, fields: ["address_components", "name", "formatted_address"] });
        const addr = results?.address_components ?? [];

        const get = (type: string, useShortName = false) => {
            const component = addr.find((c) => c.types.includes(type));
            return component ? (useShortName ? component.short_name : component.long_name) : '';
        }
        
        const streetNumber = get('street_number');
        const route = get('route');
        
        return {
            street: `${streetNumber} ${route}`.trim() || results?.name || '',
            city: get('locality') || get('sublocality_level_1') || get('administrative_area_level_2'), // More fallbacks for city
            state: get('administrative_area_level_1', true), // Use short name for state
            postalCode: get('postal_code'),
            country: get('country', true), // Use short name for country
        };
    } catch (e) {
        console.error("Error parsing address components:", e);
        return undefined;
    }
  };

  const handleSelect = async (
    description: string,
    placeId: string | undefined,
  ) => {
    setAutocompleteValue(description, false); // Set input field to full description
    clearSuggestions();
    let parts: ParsedAddress | undefined = undefined;

    if (placeId) {
      try {
        parts = await parseComponents(placeId);
        // When a suggestion is selected, update the main form value with the full description
        // and optionally pass the parsed parts if the parent component needs them.
        onChange(description, parts); 
      } catch (e) {
        console.error("Error during geocoding or parsing address:", e);
        onChange(description); // Fallback to raw description
      }
    } else {
        onChange(description); // Fallback if no placeId
    }
  };

  return (
    <div className={cn("space-y-1 w-full", className)}>
      {label && <Label htmlFor={id || name} className={cn("block text-sm font-medium", error && "text-destructive")}>{label}{required && <span className="text-destructive">*</span>}</Label>}

      <div className="relative">
        <Input
          id={id || name}
          name={name}
          required={required}
          value={autocompleteValue} // Use hook's value for input display
          onChange={handleInputChange}
          disabled={!ready || placesLoading}
          placeholder={placeholder}
          className={cn("pr-10", error && "border-destructive ring-1 ring-destructive focus-visible:ring-destructive")}
          autoComplete="off" // Crucial for custom autocomplete to work without browser interference
          aria-invalid={!!error}
        />
        {placesLoading ? (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        ) : (
            <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        )}
      </div>

      {status === 'OK' && suggestionsData.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
          {suggestionsData.map((suggestion) => {
             const {
              place_id,
              structured_formatting: { main_text, secondary_text },
              description,
            } = suggestion;
            return (
                <li
                    key={place_id}
                    onClick={() => handleSelect(description, place_id)}
                    className="px-3 py-2 hover:bg-accent hover:text-accent-foreground cursor-pointer text-sm transition-colors"
                >
                    <strong>{main_text}</strong> <small className="text-muted-foreground">{secondary_text}</small>
                </li>
            );
          })}
        </ul>
      )}
      {status !== 'OK' && status !== '' && !placesLoading && suggestionsData.length === 0 && autocompleteValue.length > 0 && (
         <p className="text-xs text-muted-foreground p-2">{status === 'ZERO_RESULTS' ? 'No results found.' : `Google Maps Error: ${status}`}</p>
      )}

      {error && <p className="text-destructive text-xs mt-1">{error}</p>}
    </div>
  );
};
