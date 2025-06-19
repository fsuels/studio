// src/lib/documents/us/provisional-patent-application/schema.ts
import { z } from 'zod';

export const ProvisionalPatentApplicationSchema = z.object({
  inventorName: z.string().min(1, 'Inventor name is required.'),
  inventorAddress: z.string().min(1, 'Inventor address is required.'),
  inventorEmail: z.string().email('Valid email is required.'),
  inventorPhone: z.string().min(1, 'Phone number is required.'),
  inventorCitizenship: z.string().min(1, 'Citizenship is required.'),
  inventionTitle: z.string().min(1, 'Invention title is required.'),
  inventionDescription: z.string().min(1, 'Detailed invention description is required.'),
  technicalField: z.string().min(1, 'Technical field is required.'),
  backgroundArt: z.string().optional(),
  inventionSummary: z.string().min(1, 'Invention summary is required.'),
  detailedDescription: z.string().min(1, 'Detailed description is required.'),
  drawingsDescription: z.string().optional(),
  claims: z.string().optional(),
  abstractText: z.string().min(1, 'Abstract is required.'),
  priorArt: z.string().optional(),
  advantages: z.string().optional(),
  attorney: z.string().optional(),
  attorneyAddress: z.string().optional(),
  filingDate: z.string().min(1, 'Filing date is required.').regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});

export type ProvisionalPatentApplicationData = z.infer<typeof ProvisionalPatentApplicationSchema>;