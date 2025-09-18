// src/lib/documents/us/vehicle-bill-of-sale/schema.ts
import { z } from 'zod';
import { isValidVIN } from '@/utils/isValidVIN';

export const BillOfSaleSchema = z.object({
    /* ---------- Seller ---------- */
    seller_name: z
      .string()
      .min(2, { message: 'Seller name must be at least 2 characters.' }),
    seller_address: z
      .string()
      .min(5, { message: 'Seller address must be at least 5 characters.' }),
    seller_phone: z
      .string()
      .optional()
      .refine(
        (val) =>
          val === undefined ||
          val === '' ||
          /^\(\d{3}\)\s\d{3}-\d{4}$/.test(val),
        {
          message: 'Phone number must be in (XXX) XXX-XXXX format or empty.',
        },
      ),
    seller2_name: z.string().optional(),
    seller2_phone: z
      .string()
      .optional()
      .refine(
        (val) =>
          val === undefined ||
          val === '' ||
          /^\(\d{3}\)\s\d{3}-\d{4}$/.test(val),
        {
          message: 'Phone number must be in (XXX) XXX-XXXX format or empty.',
        },
      ),

    /* ---------- Buyer ---------- */
    buyer_name: z
      .string()
      .min(2, { message: 'Buyer name must be at least 2 characters.' }),
    buyer_address: z
      .string()
      .min(5, { message: 'Buyer address must be at least 5 characters.' }),
    buyer_phone: z
      .string()
      .optional()
      .refine(
        (val) =>
          val === undefined ||
          val === '' ||
          /^\(\d{3}\)\s\d{3}-\d{4}$/.test(val),
        {
          message: 'Phone number must be in (XXX) XXX-XXXX format or empty.',
        },
      ),
    buyer2_name: z.string().optional(),
    buyer2_phone: z
      .string()
      .optional()
      .refine(
        (val) =>
          val === undefined ||
          val === '' ||
          /^\(\d{3}\)\s\d{3}-\d{4}$/.test(val),
        {
          message: 'Phone number must be in (XXX) XXX-XXXX format or empty.',
        },
      ),

    /* ---------- Vehicle ---------- */
    vin: z
      .string()
      .trim()
      .length(17, { message: 'VIN must be 17 characters.' })
      .refine(isValidVIN, { message: 'Invalid VIN format or characters.' }),
    year: z.coerce
      .number({ invalid_type_error: 'Vehicle year must be a number.' })
      .int({ message: 'Vehicle year must be a whole number.' })
      .gte(1900, { message: 'Vehicle year must be 1900 or later.' })
      .lte(new Date().getFullYear() + 1, {
        message: 'Vehicle year cannot be in the far future.',
      }),
    make: z
      .string()
      .min(2, { message: 'Vehicle make is required.' })
      .regex(/^[a-zA-Z0-9\s-]+$/, {
        message: 'Invalid characters in vehicle make.',
      })
      .optional(),
    model: z
      .string()
      .min(1, { message: 'Vehicle model is required.' })
      .optional(),
    color: z
      .string()
      .min(2, { message: 'Vehicle color is required.' })
      .regex(/^[a-zA-Z\s]+$/, {
        message: 'Only letters and spaces allowed for color.',
      })
      .optional(),
    body_type: z
      .string()
      .min(1, { message: 'Vehicle body type is required.' })
      .optional(),

    /* ---------- Sale ---------- */
    sale_date: z.coerce.date({ invalid_type_error: 'Invalid sale date.' }),
    price: z.coerce
      .number({ invalid_type_error: 'Price must be a number.' })
      .positive({ message: 'Price must be a positive number.' }),
    payment_method: z
      .enum(['cash', 'check', 'wire', 'paypal', 'credit_card'], {
        errorMap: () => ({ message: 'Please select a valid payment method.' }),
      })
      .optional(),

    /* ---------- Odometer ---------- */
    odometer: z.coerce
      .number({ invalid_type_error: 'Odometer reading must be a number.' })
      .int({ message: 'Odometer reading must be a whole number.' })
      .gte(0, { message: 'Odometer reading must be non-negative.' }),
    odo_status: z.enum(['ACTUAL', 'EXCEEDS', 'NOT_ACTUAL'], {
      errorMap: () => ({ message: 'Please select a valid odometer status.' }),
    }),

    /* ---------- Warranty & State ---------- */
    as_is: z.boolean().optional().default(true),
    warranty_text: z.string().optional(),
    existing_liens: z.string().optional(),
    state: z.string().length(2, { message: 'State must be 2 characters.' }),
    county: z.string().optional(),
  })
  .refine(
    (data) =>
      data.as_is === false
        ? !!data.warranty_text && data.warranty_text.trim() !== ''
        : true,
    {
      message: "Warranty details are required if not sold 'as-is'",
      path: ['warranty_text'],
    },
  );

export type BillOfSaleData = z.infer<typeof BillOfSaleSchema>;
export type VehicleBillOfSaleData = BillOfSaleData;
