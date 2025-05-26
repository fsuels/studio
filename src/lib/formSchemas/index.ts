// src/lib/formSchemas/index.ts
import type { FormSchema } from '@/data/formSchemas';
import { vehicleBillOfSale } from './vehicleBillOfSale';
// import { leaseAgreement } from './leaseAgreement'
// import { powerOfAttorney } from './powerOfAttorney'

export const formSchemas: FormSchema = {
  'Bill of Sale (Vehicle)': vehicleBillOfSale,
  // "Residential Lease Agreement": leaseAgreement,
  // "General Power of Attorney": powerOfAttorney,
};
