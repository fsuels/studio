// src/lib/documents/us/mechanics-lien/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { MechanicsLienSchema } from './schema';
import { mechanicsLienQuestions } from './questions';

export const mechanicsLienMeta: LegalDocument = {
  id: 'mechanics-lien',
  jurisdiction: 'US',
  category: 'Legal',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: true,
  offerNotarization: true,
  offerRecordingHelp: true,
  basePrice: 44.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/mechanics-lien.md',
    es: '/templates/es/mechanics-lien.md',
  },
  schema: MechanicsLienSchema,
  questions: mechanicsLienQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Mechanics Lien',
      description:
        'Secure payment for your construction work by filing a legal claim against the property you improved.',
      aliases: ['construction lien', 'materialman lien', 'contractor lien'],
    },
    es: {
      name: 'Gravamen de Mecánicos',
      description:
        'Reclamo legal contra la propiedad por trabajo no pagado o materiales proporcionados para mejoras de construcción.',
      aliases: ['gravamen de construcción', 'gravamen de contratista'],
    },
  },
};
