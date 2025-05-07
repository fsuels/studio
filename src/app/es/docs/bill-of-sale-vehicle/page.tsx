// src/app/es/docs/bill-of-sale-vehicle/page.tsx
'use client';
import VehicleBillOfSaleDisplay from '@/components/docs/VehicleBillOfSaleDisplay';

export default function BillOfSalePageES() {
  // This page will now render the Spanish version by passing locale="es"
  return <VehicleBillOfSaleDisplay locale="es" />;
}
