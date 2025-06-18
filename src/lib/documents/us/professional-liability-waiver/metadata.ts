// src/lib/documents/us/professional-liability-waiver/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { ProfessionalLiabilityWaiverSchema } from './schema';
import { professionalLiabilityWaiverQuestions } from './questions';

export const professionalLiabilityWaiverMeta: LegalDocument = {
  id: 'professional-liability-waiver',
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
    en: '/templates/en/professional-liability-waiver.md',
    es: '/templates/es/professional-liability-waiver.md',
  },
  schema: ProfessionalLiabilityWaiverSchema,
  questions: professionalLiabilityWaiverQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Professional Liability Waiver',
      description: 'Waiver protecting professionals from malpractice and professional liability claims.',
      aliases: ['malpractice waiver', 'professional indemnity waiver', 'service liability waiver'],
    },
    es: {
      name: 'Exención de Responsabilidad Profesional',
      description: 'Exención que protege a profesionales de reclamos de negligencia profesional y responsabilidad.',
      aliases: ['exención de negligencia profesional', 'exención de servicios profesionales'],
    },
  },
};