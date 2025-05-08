// src/schemas/billOfSale.ts
import { z } from 'zod';
import { isValidVIN } from '@/utils/vin';

export const BillOfSaleSchema = z.object({
  seller_name: z.string().min(2, { message: "Seller name must be at least 2 characters." }),
  seller_phone: z.string().regex(/^\(\d{3}\)\s\d{3}-\d{4}$/, { message: "Invalid phone number format (XXX) XXX-XXXX." }),
  seller_address: z.string().min(5, { message: "Seller address must be at least 5 characters." }),
  buyer_name: z.string().min(2, { message: "Buyer name must be at least 2 characters." }),
  buyer_address: z.string().min(5, { message: "Buyer address must be at least 5 characters." }),
  year: z.coerce.number().int().gte(1900, { message: "Vehicle year must be 1900 or later." }).lte(new Date().getFullYear() + 1, { message: "Vehicle year cannot be in the future." }),
  vin: z.string().refine(isValidVIN, 'Invalid VIN format or characters.'),
  price: z.coerce.number().positive({ message: "Price must be a positive number." }),
  odometer: z.coerce.number().int().gte(0, { message: "Odometer reading must be non-negative." }),
  odo_status: z.enum(['ACTUAL', 'EXCEEDS', 'NOT_ACTUAL'], { errorMap: () => ({ message: "Please select a valid odometer status."}) }),
  as_is: z.boolean(),
  warranty_text: z.string().optional(),
  // Fields from previous schema that are kept or slightly modified for consistency
  vehicle_make: z.string().min(2, "Vehicle make is required").regex(/^[a-zA-Z0-9 ]+$/, 'Invalid characters in vehicle make'),
  vehicle_model: z.string().min(1, "Vehicle model is required"),
  vehicle_color: z.string().min(2, "Vehicle color is required").regex(/^[a-zA-Z ]+$/, 'Only letters and spaces allowed for color'),
  payment_method: z.enum(['cash', 'check', 'wire', 'paypal', 'credit_card'], { errorMap: () => ({ message: "Please select a valid payment method."}) }),
  sale_date: z.string().min(1, "Sale date is required"), // Assuming YYYY-MM-DD string from date input
  existing_liens: z.string().optional(),
  state: z.string().length(2, "State must be 2 characters"),
  county: z.string().optional(),
}).refine(data => data.as_is === false ? !!data.warranty_text && data.warranty_text.trim() !== '' : true, {
  message: "Warranty details are required if not sold 'as-is'",
  path: ['warranty_text'],
});

export type BillOfSaleData = z.infer<typeof BillOfSaleSchema>;
