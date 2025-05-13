import { z } from 'zod';
import type { LegalDocument } from '@/types/documents';

export const livingWill: LegalDocument = {
  id: 'living-will',
  name: 'Living Will / Advance Directive',
  name_es: 'Testamento Vital / Directiva Anticipada',
  category: 'Personal',
  description: 'Specify your wishes for end-of-life medical care.',
  description_es: 'Especificar sus deseos para la atención médica al final de la vida.',
  aliases: ["medical wishes", "advance directive", "life support", "end of life"],
  aliases_es: ["deseos médicos", "directiva anticipada", "soporte vital", "fin de vida"],
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 5,
  states: 'all',
  schema: z.object({}), // Placeholder
  questions: [] // Placeholder
};