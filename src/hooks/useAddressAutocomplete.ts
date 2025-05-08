// src/hooks/useAddressAutocomplete.ts
'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { debounce } from 'lodash-es';
// import { nanoid } from 'nanoid'; // nanoid is installed but not used in the provided snippet

export interface Prediction {
  description: string;
  place_id: string;
}

export function useAddressAutocomplete() {
  const [input, setInput] = useState('');
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const serviceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const sessionRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);

  // one-time init
  useEffect(() => {
    const initializeService = () => {
      if (typeof window !== 'undefined' && (window as any).google?.maps?.places) {
        if (!serviceRef.current) {
          serviceRef.current = new google.maps.places.AutocompleteService();
        }
        if (!sessionRef.current) {
          sessionRef.current = new google.maps.places.AutocompleteSessionToken();
        }
        setIsGoogleMapsLoaded(true);
        console.log('Google Places AutocompleteService and SessionToken initialized.');
      } else {
        console.log('Google Maps API not yet loaded for useAddressAutocomplete.');
      }
    };
    
    if (typeof window !== 'undefined' && (window as any).google?.maps?.places) {
      initializeService();
    } else if (typeof window !== 'undefined') {
      // Listen for the custom event dispatched by GooglePlacesLoader
      const handleGoogleMapsLoad = () => {
        console.log('useAddressAutocomplete: google-maps-loaded event received.');
        initializeService();
      };
      window.addEventListener('google-maps-loaded', handleGoogleMapsLoad);
      return () => {
        window.removeEventListener('google-maps-loaded', handleGoogleMapsLoad);
      };
    }
  }, []);

  // debounced fetcher
  const fetchPredictions = useCallback(
    debounce((value: string) => {
      if (!serviceRef.current || !sessionRef.current || !isGoogleMapsLoaded) {
        if(value.length >=3) console.warn('useAddressAutocomplete: Autocomplete service or session token not ready. Predictions will not be fetched.');
        return;
      }

      serviceRef.current.getPlacePredictions(
        {
          input: value,
          sessionToken: sessionRef.current,
          componentRestrictions: { country: ['us'] }, // bias to US; add MX/CA etc if needed
          types: ['address'],
        },
        (res, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && res) {
            setPredictions(res.map(p => ({ description: p.description, place_id: p.place_id })));
          } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
            setPredictions([]);
          } else {
            console.error('Google Places Autocomplete error:', status);
            setPredictions([]);
          }
        }
      );
    }, 300),
    [isGoogleMapsLoaded] // Recreate debounce if google maps loaded state changes
  );

  // request on input change
  useEffect(() => {
    if (input.length < 3) {
      setPredictions([]);
      return;
    }
    if (isGoogleMapsLoaded) {
      fetchPredictions(input);
    }
  }, [input, fetchPredictions, isGoogleMapsLoaded]);

  const clearPredictions = useCallback(() => {
    setPredictions([]);
  }, []);

  return { input, setInput, predictions, clearPredictions, isGoogleMapsApiLoaded: isGoogleMapsLoaded };
}
