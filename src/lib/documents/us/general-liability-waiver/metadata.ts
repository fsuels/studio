// src/lib/documents/us/general-liability-waiver/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { GeneralLiabilityWaiverSchema } from './schema';
import { generalLiabilityWaiverQuestions } from './questions';

export const generalLiabilityWaiverMeta: LegalDocument = {
  id: 'general-liability-waiver',
  jurisdiction: 'US',
  category: 'Risk Management',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 9.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/general-liability-waiver.md',
    es: '/templates/es/general-liability-waiver.md',
  },
  schema: GeneralLiabilityWaiverSchema,
  questions: generalLiabilityWaiverQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'General Liability Waiver',
      description:
        'Comprehensive liability waiver and release form for activities and services.',
      aliases: [
        'liability release',
        'waiver of liability',
        'release form',
      ],
    },
    es: {
      name: 'Exención de Responsabilidad General',
      description:
        'Protege tu negocio de demandas por accidentes en eventos, talleres o actividades peligrosas. Exención completa de responsabilidad.',
      aliases: [
        'liberación de responsabilidad',
        'exención de responsabilidad',
        'formulario de liberación',
      ],
    },
  },
};
