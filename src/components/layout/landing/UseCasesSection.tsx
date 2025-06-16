'use client';
import { lazyClient } from '@/lib/lazy-client';

const UseCasesSection = lazyClient(() => import('./UseCasesSection.client').then(m => ({ default: m.UseCasesSection })));

export { UseCasesSection };
export default UseCasesSection;
