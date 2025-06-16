'use client';

import { lazyClient } from '@/lib/lazy-client';

const CartDrawer = lazyClient(() => import('./CartDrawer.client'));

export default CartDrawer;
