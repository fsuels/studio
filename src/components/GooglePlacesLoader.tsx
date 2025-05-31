// src/components/GooglePlacesLoader.tsx
'use client';
import Script from 'next/script';
import React, { useState, useEffect } from 'react';

declare global {
  interface Window {
    google?: {
      maps?: {
        places?: unknown;
      };
    };
  }
}

export default function GooglePlacesLoader() {
  const [loaded, setLoaded] = useState(false);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (window.google?.maps?.places) {
      setLoaded(true);
    }
  }, []);

  if (!apiKey) {
    console.error(
      'GooglePlacesLoader: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set. Autocomplete will not work.',
    );
    return null;
  }

  return (
    <>
      {!loaded && (
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`}
          strategy="lazyOnload"
          onLoad={() => {
            setLoaded(true);
            // Dispatch a custom event to notify that Google Maps is loaded
            window.dispatchEvent(new Event('google-maps-loaded'));
          }}
          onError={(e) => {
            console.error('Failed to load Google Maps API script:', e);
          }}
        />
      )}
    </>
  );
}
