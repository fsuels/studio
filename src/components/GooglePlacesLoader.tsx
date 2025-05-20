// src/components/GooglePlacesLoader.tsx
'use client';
import Script from 'next/script';
import React, { useState, useEffect } from 'react';

export default function GooglePlacesLoader() {
  const [loaded, setLoaded] = useState(false);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if ((window as any).google?.maps?.places) {
      setLoaded(true);
      return;
    }

    const handler = () => setLoaded(true);
    window.addEventListener('google-maps-loaded', handler);
    return () => window.removeEventListener('google-maps-loaded', handler);
  }, []);

  if (!apiKey) {
    console.error("GooglePlacesLoader: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set. Autocomplete will not work.");
    return null;
  }

  const scriptExists = typeof document !== 'undefined' &&
    document.getElementById('google-maps-script');

  return (
    <>
      {!loaded && !scriptExists && (
        <Script
          id="google-maps-script"
          src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`}
          strategy="afterInteractive"
          onLoad={() => {
            console.log('Google Maps API script loaded.');
            setLoaded(true);
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
