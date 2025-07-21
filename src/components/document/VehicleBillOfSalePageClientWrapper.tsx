'use client';

import { lazyClient } from '@/lib/lazy-client';
import React from 'react';

/* NOTE: we now import from -client.ts to avoid shadowing the real
   document folder that provides metadata for menu/search. */
const VehicleBillOfSalePageClient = lazyClient(() =>
  import('@/lib/documents/us/vehicle-bill-of-sale-client').then(
    (mod) => mod.VehicleBillOfSalePageClient,
  ),
);

const VehicleFaqSection = lazyClient(() =>
  import('@/lib/documents/us/vehicle-bill-of-sale-client').then(
    (mod) => mod.VehicleFaqSection,
  ),
);
const VehicleBillOfSalePageClientWrapper: React.FC = () => {
  return (
    <>
      <VehicleBillOfSalePageClient />
      <VehicleFaqSection />
    </>
  );
};

export default VehicleBillOfSalePageClientWrapper;
