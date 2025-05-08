// src/components/form/AddressField.tsx
'use client';
import React, { useEffect, useState } from 'react';
import usePlacesAutocomplete, { getDetails } from 'use-places-autocomplete';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Loader2, MapPin } from 'lucide-react';

export interface ParsedAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface AddressFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  name: string;
  label?: string;
  onAddressParsed?: (parsedAddress: ParsedAddress) => void; // Callback for when address is parsed
  // RHF's onChange and value will be handled by Controller or register
}

export default function AddressField({ name, label, className, onAddressParsed, ...rest }: AddressFieldProps) {
  const { register, setValue, watch, formState: { errors } } = useFormContext();
  const fieldValue = watch(name);

  const {
    ready,
    value: autocompleteValue,
    setValue: setAutocompleteValue,
    suggestions: { status, data: suggestionsData, loading: placesLoading },
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: ['us'] }, // Bias to US
      types: ['address'],
    },
    debounce: 300,
    defaultValue: fieldValue || '', // Initialize with RHF value
  });

  // Keep autocompleteValue in sync with RHF's value if it changes externally
  useEffect(() => {
    if (fieldValue !== autocompleteValue && typeof fieldValue === 'string') {
      setAutocompleteValue(fieldValue, false); // false to not re-trigger suggestions
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldValue]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setAutocompleteValue(newValue); // Update hook's internal value for suggestions
    setValue(name, newValue, { shouldDirty: true, shouldValidate: true }); // Update RHF's value for the main address field
  };

  const parsePlaceDetails = (place: google.maps.places.PlaceResult): ParsedAddress | null => {
    if (!place.address_components) return null;

    const wanted = new Set([
      'street_number',
      'route', // street name
      'locality', // city
      'administrative_area_level_1', // state (short name)
      'postal_code',
      'postal_code_suffix',
      'country', // country (short name)
    ]);

    const parts: Record<string, string> = {};
    place.address_components.forEach(component => {
      const type = component.types[0];
      if (wanted.has(type)) {
        parts[type] = component.short_name; // Use short_name for state and country
      }
      // For locality, long_name is often better if short_name is unavailable
      if (type === 'locality' && !parts[type]) {
         parts[type] = component.long_name;
      }
    });
    
    const street = `${parts.street_number ?? ''} ${parts.route ?? ''}`.trim() || place.name || '';
    const city = parts.locality || '';
    const state = parts.administrative_area_level_1 || '';
    const postalCode = [parts.postal_code, parts.postal_code_suffix].filter(Boolean).join('-');
    const country = parts.country || '';

    return { street, city, state, postalCode, country };
  };


  const handleSelectSuggestion = async (suggestion: google.maps.places.AutocompletePrediction) => {
    setAutocompleteValue(suggestion.description, false); // Update input field display
    setValue(name, suggestion.description, { shouldValidate: true, shouldDirty: true }); // Update main RHF field
    clearSuggestions();

    try {
      const placeDetailsArray = await getDetails({ place_id: suggestion.place_id, fields: ['address_components', 'name', 'formatted_address'] });
      // getDetails in use-places-autocomplete might return an array or a single object depending on usage.
      // Assuming it returns a single PlaceResult object as per common Google API patterns.
      // If it returns an array, you'd take the first element.
      const place = Array.isArray(placeDetailsArray) ? placeDetailsArray[0] : placeDetailsArray;

      if (place) {
        const parsed = parsePlaceDetails(place as google.maps.places.PlaceResult);
        if (parsed) {
          // Automatically set related fields if they exist in the form (e.g., seller_city, seller_state, seller_postal_code)
          // This requires knowing the prefix (e.g., "seller", "buyer", "property")
          const namePrefix = name.substring(0, name.lastIndexOf('_address')); // e.g. "seller" from "seller_address"
          
          if (namePrefix) {
            setValue(`${namePrefix}_street`, parsed.street, { shouldValidate: true });
            setValue(`${namePrefix}_city`, parsed.city, { shouldValidate: true });
            setValue(`${namePrefix}_state`, parsed.state, { shouldValidate: true });
            setValue(`${namePrefix}_postal_code`, parsed.postalCode, { shouldValidate: true });
            setValue(`${namePrefix}_country`, parsed.country, { shouldValidate: true });
          }
          if(onAddressParsed) onAddressParsed(parsed);
        }
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };
  
  const fieldError = errors[name];

  return (
    <div className={cn("relative w-full space-y-1", className)}>
      {label && <Label htmlFor={name} className={cn(fieldError && "text-destructive")}>{label}{rest.required && <span className="text-destructive">*</span>}</Label>}
      <div className="relative">
        <Input
          {...register(name)} // RHF registration for the main address string
          {...rest}
          id={name}
          value={autocompleteValue} // Controlled by usePlacesAutocomplete state
          onChange={handleInputChange}
          disabled={!ready || rest.disabled}
          autoComplete="off"
          aria-invalid={!!fieldError}
          className={cn("pr-10", fieldError && "border-destructive ring-1 ring-destructive focus-visible:ring-destructive")}
        />
        {placesLoading ? (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        ) : (
          <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        )}
      </div>

      {status === 'OK' && suggestionsData.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
          {suggestionsData.map((suggestion) => (
            <li
              key={suggestion.place_id}
              onMouseDown={(e) => { // Use onMouseDown to prevent input blur before click
                e.preventDefault(); 
                handleSelectSuggestion(suggestion);
              }}
              className="px-3 py-2 hover:bg-accent hover:text-accent-foreground cursor-pointer text-sm transition-colors"
            >
              {suggestion.description}
            </li>
          ))}
        </ul>
      )}
      {status !== 'OK' && status !== '' && !placesLoading && suggestionsData.length === 0 && autocompleteValue.length > 2 && (
         <p className="text-xs text-muted-foreground p-2">{status === 'ZERO_RESULTS' ? 'No results found.' : `Google Maps Error: ${status}`}</p>
      )}
      {fieldError && <p className="text-xs text-destructive mt-1">{fieldError.message as string}</p>}
    </div>
  );
}
