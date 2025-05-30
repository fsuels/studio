'use client';

import { lazyClient } from '@/lib/lazy-client';

const SlideFade = lazyClient(() => import('./SlideFade.client'));

export default SlideFade;
