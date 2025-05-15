import { z } from 'zod';
import { PromissoryNoteSchema } from '@/schemas/promissory-note';

export { PromissoryNoteSchema };
export type PromissoryNoteData = z.infer<typeof PromissoryNoteSchema>;
