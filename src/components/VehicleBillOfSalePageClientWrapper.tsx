"use client";

import { lazyClient } from "@/lib/lazy-client";
import React from "react";

const VehicleBillOfSalePageClient = lazyClient(() => import("@/lib/documents/us/vehicle-bill-of-sale").then(mod => mod.VehicleBillOfSalePageClient));
const VehicleFaqSection = lazyClient(() => import("@/lib/documents/us/vehicle-bill-of-sale").then(mod => mod.VehicleFaqSection));

const VehicleBillOfSalePageClientWrapper: React.FC = () => {
  return (
    <>
      <VehicleBillOfSalePageClient />
      <VehicleFaqSection />
    </>
  );
};

export default VehicleBillOfSalePageClientWrapper;