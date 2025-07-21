'use client';
import { lazyClient } from '@/lib/lazy-client';

const UseCasesSection = lazyClient(() => import('./UseCasesSection.client'));

export default UseCasesSection;
