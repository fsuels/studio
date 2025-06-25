// src/lib/documents/us/confidentiality-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { ConfidentialityAgreementSchema } from './schema';
import { confidentialityAgreementQuestions } from './questions';

export const confidentialityAgreementMeta: LegalDocument = {
  id: 'confidentiality-agreement',
  jurisdiction: 'US',
  category: 'Legal',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 6,
  states: 'all',
  templatePaths: {
    en: '/templates/en/confidentiality-agreement.md',
    es: '/templates/es/confidentiality-agreement.md',
  },
  schema: ConfidentialityAgreementSchema,
  questions: confidentialityAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Confidentiality Agreement',
      description:
        'General confidentiality agreement to protect sensitive information shared between parties.',
      aliases: [
        'confidential agreement',
        'secrecy agreement',
        'non-disclosure',
        'privacy agreement',
      ],
    },
    es: {
      name: 'Acuerdo de Confidencialidad',
      description:
        'Protege tus secretos comerciales y datos confidenciales. Evita que empleados, socios o contratistas compartan tu información privada.',
      aliases: [
        'acuerdo confidencial',
        'acuerdo de secreto',
        'no divulgación',
        'acuerdo de privacidad',
      ],
    },
  },
};
