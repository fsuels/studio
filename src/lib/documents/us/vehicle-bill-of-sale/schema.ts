import { z } from 'zod'; // Added z import
import { BillOfSaleSchema } from '@/schemas/billOfSale';
export { BillOfSaleSchema };      // just re-export for local imports
export type VehicleBillOfSaleData = z.infer<typeof BillOfSaleSchema>;