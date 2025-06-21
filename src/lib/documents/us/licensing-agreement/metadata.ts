// src/lib/documents/us/licensing-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { licensingAgreementSchema } from './schema';
import { licensingAgreementQuestions } from './questions';

export const licensingAgreementMeta: LegalDocument = {
  id: 'licensing-agreement',
  jurisdiction: 'US',
  category: 'Intellectual Property',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 20,
  states: 'all',
  templatePaths: {
    en: '/templates/en/us/licensing-agreement.md',
    es: '/templates/es/us/licensing-agreement.md',
  },
  schema: licensingAgreementSchema,
  questions: licensingAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Licensing Agreement',
      description:
        'Create a legally binding Licensing Agreement with our easy-to-use template. State-specific requirements included.',
      aliases: [
        'licensing contract',
        'license agreement',
        'intellectual property license',
      ],
    },
    es: {
      name: 'Acuerdo de Licencia',
      description:
        'Crea un Acuerdo de Licencia legalmente válido con nuestra plantilla fácil de usar. Incluye requisitos específicos del estado.',
      aliases: ['contrato de licencia', 'licencia de propiedad intelectual'],
    },
  },
};
