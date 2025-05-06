
/* super‑light wrapper – works with GA4, Plausible, FB Pixel, ... */
export function track(event: string, data: Record<string, any> = {}) {
  if (typeof window === 'undefined') return
  if ((window as any).gtag) {
    (window as any).gtag('event', event, data)
  }
  // fallback – console log so you see events in dev
  if (process.env.NODE_ENV === 'development') {
    console.info('[analytics]', event, data)
  }
}
