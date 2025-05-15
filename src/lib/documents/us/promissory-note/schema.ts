// src/lib/documents/us/promissory-note/schema.ts
import { z } from 'zod';
// Assuming your main schema is in src/schemas/
import { PromissoryNoteSchema as MainPromissoryNoteSchema } from '@/schemas/promissory-note'; 

// Re-export the schema to ensure it's a ZodObject for LegalDocument type compatibility
export const PromissoryNoteSchema: z.ZodObject<any, any, any> = MainPromissoryNoteSchema;

// Export the inferred type if needed elsewhere, though WizardForm infers directly
export type PromissoryNoteData = z.infer<typeof PromissoryNoteSchema>;
