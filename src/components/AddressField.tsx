'use client'
import PlacesAutocomplete, {
  geocodeByAddress,
  // getLatLng, // getLatLng can be imported if needed for further geo operations
} from 'react-places-autocomplete'
import React, { useState } from 'react' // Import React explicitly
import { Input } from '@/components/ui/input' // Assuming shadcn/ui input
import { Loader2 } from 'lucide-react' // For loading indicator

interface Props {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  name?: string // Added name prop for better form integration if needed
  id?: string // Added id prop for label association
  className?: string // Allow custom styling for the wrapper
}

export default function AddressField({ 
    value, 
    onChange, 
    placeholder, 
    name, 
    id,
    className
}: Props) {
  const [loading, setLoading] = useState(false)

  const handleSelect = async (address: string) => {
    setLoading(true);
    onChange(address); // Update the form field with the selected address
    try {
      // You can use geocodeByAddress if you need lat/lng or more detailed address components
      // const results = await geocodeByAddress(address);
      // const latLng = await getLatLng(results[0]);
      // console.log('Successfully geocoded!', { latLng, results });
      // Here you could further update other form fields (city, state, zip) if Places API returns them separately
      // For now, just setting the full formatted address.
    } catch (error) {
      console.error('Error geocoding address:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PlacesAutocomplete 
        value={value} 
        onChange={onChange} 
        onSelect={handleSelect}
        searchOptions={{
            // Optional: bias search to US or specific regions/types
            // componentRestrictions: { country: 'us' },
            // types: ['address'] 
        }}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading: placesLoading }) => (
        <div className={`relative ${className || ''}`}>
          <Input
            {...getInputProps({
              placeholder: placeholder || 'Enter address...',
              className: 'w-full pr-10', // Added pr-10 for loading spinner space
              name: name, // Pass name to input
              id: id, // Pass id to input
            })}
          />
          {(loading || placesLoading) && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
          )}
          {suggestions.length > 0 && (
            <ul className="absolute z-50 mt-1 w-full bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
              {suggestions.map(suggestion => {
                const className = suggestion.active
                  ? 'bg-accent text-accent-foreground cursor-pointer px-3 py-2 text-sm'
                  : 'bg-popover text-popover-foreground cursor-pointer px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground';
                return (
                  <li
                    key={suggestion.placeId || suggestion.description} // Ensure key is unique
                    {...getSuggestionItemProps(suggestion, {
                      className,
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </PlacesAutocomplete>
  );
}
