'use client';

import dynamic from 'next/dynamic';
import type { Tenant } from '@/types/tenant';

// Lazy-load the actual dashboard only on the client with its own chunk
const InnerTenantDashboard = dynamic(
  () => import('./TenantDashboard').then(m => m.TenantDashboard),
  { ssr: false, loading: () => null },
);

interface Props {
  tenant: Tenant;
}

export function TenantDashboardLazy({ tenant }: Props) {
  return <InnerTenantDashboard tenant={tenant} />;
}

