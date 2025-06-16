'use client';

import { lazyClient } from '@/lib/lazy-client';

const HowItWorks = lazyClient(() => import('./HowItWorks.client'));

export default HowItWorks;
