'use client';

import { lazyClient } from '@/lib/lazy-client';

const BundleSlider = lazyClient(() => import('./BundleSlider.client'));

export default BundleSlider;
