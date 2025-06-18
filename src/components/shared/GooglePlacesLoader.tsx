// src/components/GooglePlacesLoader.tsx
'use client';
import React from 'react';
import { APILoader } from '@googlemaps/extended-component-library/react';

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
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey || apiKey === 'your_google_maps_api_key_here') {
    console.warn(
      'GooglePlacesLoader: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not configured. Address autocomplete will fall back to regular text input.',
    );
    return null;
  }

  return <APILoader apiKey={apiKey} />;
}
