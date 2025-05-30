/* src/lib/documents/us/vehicle-bill-of-sale.ts
   Temporary stub to satisfy every import until the real implementation is ready. */

import type { DocumentDefinition } from '@/types/documents';
import React from 'react';

export const vehicleBillOfSale: DocumentDefinition = {
  id: 'bill-of-sale-vehicle',
  title: 'Vehicle Bill of Sale',
  country: 'us',
  language: 'en',
  questions: [],
  templatePath: '',
};

export const VehicleBillOfSalePageClient: React.FC = () => null;
export const VehicleFaqSection: React.FC = () => null;