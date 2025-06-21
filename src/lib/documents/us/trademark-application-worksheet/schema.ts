// src/lib/documents/us/trademark-application-worksheet/schema.ts
import { z } from 'zod';

export const TrademarkApplicationWorksheetSchema = z.object({
  applicantName: z.string().min(1, 'Applicant name is required.'),
  applicantAddress: z.string().min(1, 'Applicant address is required.'),
  applicantEmail: z.string().email('Valid email is required.'),
  applicantPhone: z.string().min(1, 'Phone number is required.'),
  trademarkName: z.string().min(1, 'Trademark name is required.'),
  trademarkType: z.enum(['word', 'design', 'combined'], {
    errorMap: () => ({ message: 'Trademark type is required.' }),
  }),
  trademarkDescription: z.string().min(1, 'Trademark description is required.'),
  goodsServices: z
    .string()
    .min(1, 'Description of goods/services is required.'),
  trademarkClass: z.string().min(1, 'Trademark class is required.'),
  firstUseDate: z.string().optional(),
  firstUseCommerceDate: z.string().optional(),
  intentToUse: z.boolean().optional(),
  currentUse: z.boolean().optional(),
  priority: z.string().optional(),
  attorneyName: z.string().optional(),
  attorneyAddress: z.string().optional(),
  attorneyPhone: z.string().optional(),
  attorneyEmail: z.string().optional(),
  signatureDate: z
    .string()
    .min(1, 'Signature date is required.')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});

export type TrademarkApplicationWorksheetData = z.infer<
  typeof TrademarkApplicationWorksheetSchema
>;
