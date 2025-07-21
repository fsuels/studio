'use client';

import { lazyClient } from '@/lib/lazy-client';

const PromoBanner = lazyClient(() => import('./PromoBanner.client'));

export default PromoBanner;
