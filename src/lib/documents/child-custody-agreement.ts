import { z } from 'zod';
import type { LegalDocument } from '@/types/documents';

export const childCustodyAgreement: LegalDocument = {
  id: 'child-custody-agreement',
  name: 'Child Custody Agreement',
  name_es: 'Acuerdo de Custodia de Menores',
  category: 'Family',
  description: 'Outline legal/physical custody, visitation schedule for children.',
  description_es: 'Esbozar la custodia legal/física, horario de visitas para los hijos.',
  aliases: ["child custody", "custody battle", "parenting plan"],
  aliases_es: ["custodia de hijos", "batalla por custodia", "plan de crianza"],
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: true,
  offerNotarization: true,
  offerRecordingHelp: true,
  basePrice: 7,
  states: 'all',
  schema: z.object({}), // Placeholder
  questions: [] // Placeholder
};