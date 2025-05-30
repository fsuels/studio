'use client';

import { lazyClient } from '@/lib/lazy-client';

const AnnouncementBar = lazyClient(() => import('./AnnouncementBar.client'));

export default AnnouncementBar;
