// src/lib/documents/us/testing1/schema.ts
import { z } from 'zod';

export const FirstSecondSchema = z.object({
  fullName: z.string().min(1),
  state: z.string().length(2)
});

export type FirstSecondData = z.infer<typeof FirstSecondSchema>;
