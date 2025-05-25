// src/schemas/billOfSale.ts
import { z } from 'zod';
import { isValidVIN } from '@/utils/isValidVIN';
import { getCompliance } from '@/lib/compliance';

const PartySchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  address: z.string().min(5, { message: 'Address must be at least 5 characters.' }),
  phone: z.string()
    .optional()
    .refine(val => !val || /^\(\d{3}\)\s\d{3}-\d{4}$/.test(val), {
      message: 'Phone number must be in (XXX) XXX-XXXX format or empty.',
    }),
});

export const BillOfSaleSchema = z.object({
  sellers: z.array(PartySchema).min(1, 'At least one seller is required'),
  buyers: z.array(PartySchema).min(1, 'At least one buyer is required'),

  /* ---------- Vehicle ---------- */
  vin: z.string().trim().length(17, { message: 'VIN must be 17 characters.' })
    .refine(isValidVIN, { message: 'Invalid VIN format or characters.' }),
  year: z.coerce.number({ invalid_type_error: 'Vehicle year must be a number.' })
    .int({ message: 'Vehicle year must be a whole number.' })
    .gte(1900, { message: 'Vehicle year must be 1900 or later.' })
    .lte(new Date().getFullYear() + 1, { message: 'Vehicle year cannot be in the far future.' }),
  make: z.string().min(2, { message: 'Vehicle make is required.' })
    .regex(/^[a-zA-Z0-9\s-]+$/, { message: 'Invalid characters in vehicle make.' }).optional(),
  model: z.string().min(1, { message: 'Vehicle model is required.' }).optional(),
  color: z.string().min(2, { message: 'Vehicle color is required.' })
    .regex(/^[a-zA-Z\s]+$/, { message: 'Only letters and spaces allowed for color.' }).optional(),

  /* ---------- Sale ---------- */
  sale_date: z.coerce.date({ invalid_type_error: 'Invalid sale date.' }),
  price: z.coerce.number({ invalid_type_error: 'Price must be a number.' }).positive({ message: 'Price must be a positive number.' }),
  payment_method: z.enum(['cash', 'check', 'wire', 'paypal', 'credit_card'], {
    errorMap: () => ({ message: 'Please select a valid payment method.' }),
  }).optional(),

  /* ---------- Odometer ---------- */
  odometer: z.coerce.number({ invalid_type_error: 'Odometer reading must be a number.' })
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
  requireNotary: z.boolean().optional(),
  witnessCount: z.number().optional(),
}).superRefine((data, ctx) => {
  if (data.as_is === false && (!data.warranty_text || data.warranty_text.trim() === '')) {
    ctx.addIssue({
      path: ['warranty_text'],
      code: z.ZodIssueCode.custom,
      message: "Warranty details are required if not sold 'as-is'",
    });
  }
  const rules = getCompliance('us', data.state);
  if (rules.requireNotary && data.requireNotary !== true) {
    ctx.addIssue({
      path: ['requireNotary'],
      code: z.ZodIssueCode.custom,
      message: 'A notary is required in this state.',
    });
  }
  if (rules.witnessCount > 0 && (!data.witnessCount || data.witnessCount < rules.witnessCount)) {
    ctx.addIssue({
      path: ['witnessCount'],
      code: z.ZodIssueCode.custom,
      message: `At least ${rules.witnessCount} witness(es) required.`,
    });
  }
});

export type BillOfSaleData = z.infer<typeof BillOfSaleSchema>;
