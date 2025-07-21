import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

/**
 * Wrap any heavy, browser-only component so it:
 *   • never runs during next build / static export
 *   • loads in its own JS chunk after hydration
 *   • shows nothing while loading (customise if you prefer)
 */
export const lazyClient = <T extends ComponentType<unknown>>(
  loader: () => Promise<{ default: T }>,
) => dynamic(loader, { ssr: false, loading: () => null });
