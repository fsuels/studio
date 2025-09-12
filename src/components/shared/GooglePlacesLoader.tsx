// src/components/GooglePlacesLoader.tsx
'use client';
import React from 'react';
import { APILoader } from '@googlemaps/extended-component-library/react';
import { getPublicGoogleMapsApiKey } from '@/lib/env';

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
  const apiKey = getPublicGoogleMapsApiKey();

  if (!apiKey) {
    console.warn(
      'GooglePlacesLoader: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not configured. Address autocomplete will fall back to regular text input.',
    );
    return null;
  }

  return <APILoader apiKey={apiKey} />;
}
