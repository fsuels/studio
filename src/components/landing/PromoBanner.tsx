'use client';

import { lazyClient } from '@/lib/lazy-client';

export const PromoBanner = lazyClient(() =>
  import('./PromoBanner.client').then((m) => m.PromoBanner),
);
