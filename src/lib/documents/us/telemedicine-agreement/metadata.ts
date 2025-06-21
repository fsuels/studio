// src/lib/documents/us/telemedicine-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { TelemedicineAgreementSchema } from './schema';
import { telemedicineAgreementQuestions } from './questions';

export const telemedicineAgreementMeta: LegalDocument = {
  id: 'telemedicine-agreement',
  jurisdiction: 'US',
  category: 'Healthcare & Medical',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 18.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/telemedicine-agreement.md',
    es: '/templates/es/telemedicine-agreement.md',
  },
  schema: TelemedicineAgreementSchema,
  questions: telemedicineAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Telemedicine Agreement',
      description: 'Agreement for telehealth and remote medical services.',
      aliases: [
        'telehealth agreement',
        'virtual care agreement',
        'remote medical consultation',
      ],
    },
    es: {
      name: 'Acuerdo de Telemedicina',
      description: 'Acuerdo para servicios de telesalud y medicina remota.',
      aliases: ['acuerdo de telesalud', 'consulta médica virtual'],
    },
  },
};
