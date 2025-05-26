/* super‑light wrapper – works with GA4, Plausible, FB Pixel, ... */
declare global {
  interface Window {
    gtag?: (..._args: unknown[]) => void;
  }
}

export function track(event: string, data: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag === 'function') {
    window.gtag('event', event, data);
  }
  // fallback – console log so you see events in dev
  if (process.env.NODE_ENV === 'development') {
    console.info('[analytics]', event, data);
  }
}
