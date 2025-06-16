'use client';

import { lazyClient } from '@/lib/lazy-client';

const BundlesCarousel = lazyClient(() => import('./BundlesCarousel.client'));

export default BundlesCarousel;
