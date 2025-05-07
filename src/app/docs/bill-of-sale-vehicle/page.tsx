// src/app/docs/bill-of-sale-vehicle/page.tsx
'use client';
import VehicleBillOfSaleDisplay from '@/components/docs/VehicleBillOfSaleDisplay';

export default function BillOfSalePage() {
  // This page will now render the English version by passing locale="en"
  return <VehicleBillOfSaleDisplay locale="en" />;
}
