// src/lib/documents/us/work-from-home-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { WorkFromHomeAgreementSchema } from './schema';
import { workFromHomeAgreementQuestions } from './questions';

export const workFromHomeAgreementMeta: LegalDocument = {
  id: 'work-from-home-agreement',
  jurisdiction: 'US',
  category: 'Employment',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 14.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/work-from-home-agreement.md',
    es: '/templates/es/work-from-home-agreement.md',
  },
  schema: WorkFromHomeAgreementSchema,
  questions: workFromHomeAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Work from Home Agreement',
      description:
        'Comprehensive agreement establishing terms and conditions for remote work arrangements.',
      aliases: [
        'remote work agreement',
        'telecommuting agreement',
        'home office agreement',
      ],
    },
    es: {
      name: 'Acuerdo de Trabajo desde Casa',
      description:
        'Acuerdo integral que establece términos y condiciones para arreglos de trabajo remoto.',
      aliases: ['acuerdo de trabajo remoto', 'acuerdo de teletrabajo'],
    },
  },
};
