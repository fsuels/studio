// src/lib/documents/us/affidavit-general/schema.ts
import { z } from 'zod';

export const AffidavitGeneralSchema = z.object({
  affiantName: z.string().min(1, "Affiant's name is required."),
  affiantAddress: z.string().min(1, "Affiant's address is required."),
  statement: z.string().min(1, 'Statement is required.'),
  state: z.string().length(2, 'State must be 2 characters.'),
  county: z.string().min(1, 'County is required.'),
});
