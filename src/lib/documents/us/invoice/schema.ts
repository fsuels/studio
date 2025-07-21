// src/lib/documents/us/invoice/schema.ts
import { z } from 'zod';

export const InvoiceSchema = z.object({
  recipientName: z.string().min(1),
  recipientAddress: z.string().optional(),
  yourName: z.string().min(1),
  invoiceNumber: z.string().min(1),
  invoiceDate: z.string().min(1),
  dueDate: z.string().optional(),
  lineItems: z.string().min(1),
  totalAmount: z.coerce.number().positive(),
});

export type InvoiceData = z.infer<typeof InvoiceSchema>;
