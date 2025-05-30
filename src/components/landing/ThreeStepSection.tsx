'use client';

import { lazyClient } from '@/lib/lazy-client';

const ThreeStepSection = lazyClient(() => import('./ThreeStepSection.client'));

export default ThreeStepSection;
