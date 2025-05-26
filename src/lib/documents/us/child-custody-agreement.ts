import { z } from 'zod';
import type { LegalDocument } from '@/types/documents';

export const childCustodyAgreement: LegalDocument = {
  id: 'child-custody-agreement',
  jurisdiction: 'US',
  category: 'Family',
  name: 'Child Custody Agreement',
  description: 'Outline legal/physical custody, visitation schedule for children.',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: true,
  offerNotarization: true,
  offerRecordingHelp: true,
  basePrice: 7,
  states: 'all',
  templatePaths: { 
    en: "en/us/child-custody-agreement.md", 
    es: "es/us/child-custody-agreement.md" 
  },
  translations: {
    en: {
      name: 'Child Custody Agreement',
      description: 'Outline legal/physical custody, visitation schedule for children.',
      aliases: ["child custody", "custody battle", "parenting plan"]
    },
    es: {
      name: 'Acuerdo de Custodia de Menores',
      description: 'Esbozar la custodia legal/física, horario de visitas para los hijos.',
      aliases: ["custodia de hijos", "batalla por custodia", "plan de crianza"]
    }
  },
  schema: z.object({}), // Placeholder - Add actual schema fields if defined
  questions: [] // Placeholder - Add actual questions with i18n keys if defined
};