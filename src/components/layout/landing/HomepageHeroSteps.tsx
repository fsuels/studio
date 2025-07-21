'use client';

import { lazyClient } from '@/lib/lazy-client';

const HomepageHeroSteps = lazyClient(
  () => import('./HomepageHeroSteps.client'),
);

export default HomepageHeroSteps;
