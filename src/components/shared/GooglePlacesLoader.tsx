// src/components/GooglePlacesLoader.tsx
'use client';
import React, { useEffect, useState } from 'react';
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
  const [Loader, setLoader] = useState<React.ComponentType<{ apiKey: string }> | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    let cancelled = false;

    import('@googlemaps/extended-component-library/react')
      .then((mod) => {
        if (!cancelled) {
          setLoader(() => mod.APILoader);
        }
      })
      .catch((error) => {
        console.warn('GooglePlacesLoader: failed to load maps library', error);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!apiKey) {
    console.warn(
      'GooglePlacesLoader: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not configured. Address autocomplete will fall back to regular text input.',
    );
    return null;
  }

  if (!isClient || !Loader) {
    return null;
  }

  return <Loader apiKey={apiKey} />;
}
