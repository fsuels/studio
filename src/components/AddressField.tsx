'use client'
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import React, { useState } from 'react' 
import { Input } from '@/components/ui/input' 
import { Loader2 } from 'lucide-react' 
import { cn } from "@/lib/utils";

interface Props {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  name?: string 
  id?: string 
  className?: string 
  onAddressSelect?: (address: string, latLng: { lat: number; lng: number } | null) => void;
}

export default function AddressField({ 
    value, 
    onChange, 
    placeholder, 
    name, 
    id,
    className,
    onAddressSelect, 
}: Props) {
  const {
    ready,
    value: autocompleteValue, // Renamed to avoid conflict with prop `value`
    suggestions: { status, data: suggestionsData, loading: placesLoading },
    setValue: setAutocompleteValue, // Renamed
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

  const handleSelect = async (address: string) => {
    setAutocompleteValue(address, false); // Set value, don't fetch new suggestions
    onChange(address); // Update form's value
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      console.log("📍 Coordinates: ", { lat, lng });
      if (onAddressSelect) {
        onAddressSelect(address, { lat, lng });
      }
    } catch (error) {
      console.error("Error: ", error);
       if (onAddressSelect) {
        onAddressSelect(address, null); // Still pass address even if geocoding fails
      }
    }
  };
  
  return (
    <div className={cn("relative w-full", className)}>
      <Input
        value={autocompleteValue} // Use hook's value for input
        onChange={handleInputChange}
        disabled={!ready}
        placeholder={placeholder || "Enter address..."}
        name={name}
        id={id}
        className="pr-10" // Space for loader
        autoComplete="off" // Important for custom autocomplete
      />
      {(placesLoading) && (
        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
      )}
      {status === "OK" && suggestionsData.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
          {suggestionsData.map((suggestion) => {
            const {
              place_id,
              structured_formatting: { main_text, secondary_text },
              description, // Use full description for selection
            } = suggestion;

            return (
              <li
                key={place_id}
                onClick={() => handleSelect(description)}
                className="px-3 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <strong>{main_text}</strong> <small className="text-muted-foreground">{secondary_text}</small>
              </li>
            );
          })}
        </ul>
      )}
       {status === "ZERO_RESULTS" && (
         <p className="text-xs text-muted-foreground p-2">No results found.</p>
       )}
       {status === "REQUEST_DENIED" && (
         <p className="text-xs text-destructive p-2">Request denied. Check API key or permissions.</p>
       )}
       {status === "INVALID_REQUEST" && (
         <p className="text-xs text-destructive p-2">Invalid request.</p>
       )}
       {status === "UNKNOWN_ERROR" && (
         <p className="text-xs text-destructive p-2">An unknown error occurred.</p>
       )}
    </div>
  );
}
