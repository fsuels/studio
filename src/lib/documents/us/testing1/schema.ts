// src/lib/documents/us/first-second/schema.ts
import { z } from 'zod';
// Assuming your main schema is in src/schemas/
import { FirstSecondNoteSchema as MainFirstSecondSchema } from '@/schemas/first-second'; 

// Re-export the schema to ensure it's a ZodObject for LegalDocument type compatibility
export const FirstSecondSchema: z.ZodObject<any, any, any> = MainFirstSecondSchema;

// Export the inferred type if needed elsewhere, though WizardForm infers directly
export type FirstSecondData = z.infer<typeof FirstSecondSchema>;