// src/lib/env.ts
// Small helpers to read public environment variables consistently.

const INVALID_PLACEHOLDERS = new Set([
  'your_google_maps_api_key_here',
  'YOUR_GOOGLE_MAPS_API_KEY',
  'changeme',
  'placeholder',
]);

export function getPublicGoogleMapsApiKey(): string | undefined {
  const env = process.env as NodeJS.ProcessEnv;
  const candidates = [
    env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    // Common alternate names we may see in different setups
    env['NEXT_PUBLIC_GMAPS_API_KEY'],
    env.GOOGLE_MAPS_API_KEY,
    env['GMAPS_API_KEY'],
  ].filter(Boolean) as string[];

  const key = candidates.find(
    (k) => typeof k === 'string' && !INVALID_PLACEHOLDERS.has(k.trim()),
  );

  return key?.trim() || undefined;
}
