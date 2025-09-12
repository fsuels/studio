'use client';

import { lazyClient } from '@/lib/lazy-client';
import React from 'react';
import { GooglePlacesLoader } from '@/components/shared';

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
      {/* Ensure Google Places API is available when configured */}
      <GooglePlacesLoader />
      <VehicleBillOfSalePageClient />
      <VehicleFaqSection />
    </>
  );
};

export default VehicleBillOfSalePageClientWrapper;
