import { useEffect, useState } from 'react';

let scriptLoadingPromise: Promise<void> | null = null;
let scriptLoaded = false;

export function useLoadGoogleMaps() {
  const [loaded, setLoaded] = useState(scriptLoaded);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!apiKey) {
      console.error('Google Maps API key not set.');
      return;
    }

    if (scriptLoaded) {
      setLoaded(true);
      return;
    }

    if (!scriptLoadingPromise) {
      scriptLoadingPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
        script.async = true;
        script.onload = () => {
          scriptLoaded = true;
          resolve();
        };
        script.onerror = (e) => reject(e);
        document.head.appendChild(script);
      });
    }

    scriptLoadingPromise
      .then(() => {
        setLoaded(true);
        window.dispatchEvent(new Event('google-maps-loaded'));
      })
      .catch((e) => {
        console.error('Failed to load Google Maps API script:', e);
      });
  }, [apiKey]);

  return loaded;
}
