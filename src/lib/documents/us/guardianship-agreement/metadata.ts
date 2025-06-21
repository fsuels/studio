// src/lib/documents/us/guardianship-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { GuardianshipAgreementSchema } from './schema';
import { guardianshipAgreementQuestions } from './questions';

export const guardianshipAgreementMeta: LegalDocument = {
  id: 'guardianship-agreement',
  jurisdiction: 'US',
  category: 'Family & Personal',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: true,
  offerNotarization: true,
  offerRecordingHelp: true,
  basePrice: 34.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/guardianship-agreement.md',
    es: '/templates/es/guardianship-agreement.md',
  },
  schema: GuardianshipAgreementSchema,
  questions: guardianshipAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Guardianship Agreement',
      description:
        'Legal agreement establishing guardianship responsibilities and authority.',
      aliases: [
        'guardian appointment',
        'custody agreement',
        'legal guardianship',
      ],
    },
    es: {
      name: 'Acuerdo de Tutelá',
      description:
        'Acuerdo legal que establece responsabilidades y autoridad de tutelá.',
      aliases: ['nombramiento de tutor', 'acuerdo de custodia'],
    },
  },
};
