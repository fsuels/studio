import dynamic from 'next/dynamic';

/**
 * Wrap any heavy, browser-only component so it:
 *   • never runs during next build / static export
 *   • loads in its own JS chunk after hydration
 *   • shows nothing while loading (customise if you prefer)
 */
export const lazyClient = <T extends () => Promise<any>>(loader: T) =>
  dynamic(loader, { ssr: false, loading: () => null });