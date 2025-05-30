/* src/lib/documents/us/vehicle-bill-of-sale-client.ts
   Tiny client-only stub so lazyClient() can still load something
   without shadowing the real document definition folder. */

import React from 'react';

export const VehicleBillOfSalePageClient: React.FC = () => (
  <div className="text-center py-12">
    <h1 className="text-2xl font-semibold">Vehicle Bill of Sale</h1>
    <p className="text-muted-foreground">
      Interactive form coming soon — for now start the wizard to create your
      document.
    </p>
  </div>
);

export const VehicleFaqSection: React.FC = () => null;