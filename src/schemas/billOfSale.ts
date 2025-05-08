// src/schemas/billOfSale.ts
import { z } from 'zod';
import { isValidVIN } from '@/utils/isValidVIN';

export const BillOfSaleSchema = z.object({
  /* ---------- Seller ---------- */
  seller_name:      z.string().min(2, { message: "Seller name must be at least 2 characters." }),
  seller_address:   z.string().min(5, { message: "Seller address must be at least 5 characters." }),
  seller_phone:     z.string()
                     .regex(/^\(\d{3}\)\s\d{3}-\d{4}$/, { message: "Invalid phone number format. Use (XXX) XXX-XXXX."})
                     .optional(),

  /* ---------- Buyer ---------- */
  buyer_name:       z.string().min(2, { message: "Buyer name must be at least 2 characters." }),
  buyer_address:    z.string().min(5, { message: "Buyer address must be at least 5 characters." }),
  buyer_phone:      z.string()
                     .regex(/^\(\d{3}\)\s\d{3}-\d{4}$/, { message: "Invalid phone number format. Use (XXX) XXX-XXXX."})
                     .optional()
                     .or(z.literal('')), // Allow empty string or valid format if optional

  /* ---------- Vehicle ---------- */
  vin:              z.string().length(17, { message: 'VIN must be 17 characters.'})
                     .refine(isValidVIN, { message: 'Invalid VIN format or characters.'}),
  // Ensure 'year' is consistently referred to as 'year' in schema and questions.
  // The template uses {{vehicle_year}}, so questions might use 'vehicle_year'.
  // For schema, let's stick to 'year' if that's what form fields are named.
  // If form fields are 'vehicle_year', this should be 'vehicle_year' too.
  // Assuming form field is 'year' for now based on previous request.
  year:             z.coerce.number({invalid_type_error: "Vehicle year must be a number."})
                     .int({ message: "Vehicle year must be a whole number."})
                     .gte(1900, { message: "Vehicle year must be 1900 or later." })
                     .lte(new Date().getFullYear() + 1, { message: "Vehicle year cannot be in the far future." }),
  // Re-aliasing vehicle_make, vehicle_model, vehicle_color to make, model, color
  make:             z.string().min(2, { message: "Vehicle make is required."}).regex(/^[a-zA-Z0-9\s-]+$/, { message: 'Invalid characters in vehicle make.'}).optional(),
  model:            z.string().min(1, { message: "Vehicle model is required."}).optional(),
  color:            z.string().min(2, { message: "Vehicle color is required."}).regex(/^[a-zA-Z\s]+$/, { message: 'Only letters and spaces allowed for color.'}).optional(),


  /* ---------- Sale ---------- */
  sale_date:        z.coerce.date({invalid_type_error: "Invalid sale date."}),
  price:            z.coerce.number({invalid_type_error: "Price must be a number."}).positive({ message: "Price must be a positive number." }),
  payment_method:   z.enum(['cash', 'check', 'wire', 'paypal', 'credit_card'], { errorMap: () => ({ message: "Please select a valid payment method."}) }).optional(),


  /* ---------- Odometer ---------- */
  odometer:         z.coerce.number({invalid_type_error: "Odometer reading must be a number."}).int({ message: "Odometer reading must be a whole number."}).gte(0, { message: "Odometer reading must be non-negative." }),
  odo_status:       z.enum(['ACTUAL', 'EXCEEDS', 'NOT_ACTUAL'], { errorMap: () => ({ message: "Please select a valid odometer status."}) }),
  
  /* ---------- Warranty & State ---------- */
  as_is:        z.boolean().optional().default(true),
  warranty_text:z.string().optional(),
  existing_liens: z.string().optional(),
  state:        z.string().length(2, { message: "State must be 2 characters." }),
  county:       z.string().optional(),

}).refine(data => data.as_is === false ? !!data.warranty_text && data.warranty_text.trim() !== '' : true, {
  message: "Warranty details are required if not sold 'as-is'",
  path: ['warranty_text'],
});

export type BillOfSaleData = z.infer<typeof BillOfSaleSchema>;
