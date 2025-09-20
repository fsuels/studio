// src/lib/documents/us/personal-care-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { PersonalCareAgreementSchema } from './schema';
import { personalCareAgreementQuestions } from './questions';

export const personalCareAgreementMeta: LegalDocument = {
  id: 'personal-care-agreement',
  jurisdiction: 'US',
  category: 'Family',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 16.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/personal-care-agreement.md',
    es: '/templates/es/personal-care-agreement.md',
  },
  schema: PersonalCareAgreementSchema,
  questions: personalCareAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Personal Care Agreement',
      description:
        'Agreement for personal care services including caregiving, assistance, and support.',
      aliases: [
        'caregiver agreement',
        'personal assistance contract',
        'care services agreement',
      ],
    },
    es: {
      name: 'Acuerdo de Cuidado Personal',
      description:
        'Acuerdo para servicios de cuidado personal incluyendo cuidado, asistencia y apoyo.',
      aliases: [
        'acuerdo de cuidador',
        'contrato de asistencia personal',
        'acuerdo de servicios de atención',
      ],
    },
  },
};
