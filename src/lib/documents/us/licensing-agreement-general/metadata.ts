// src/lib/documents/us/licensing-agreement-general/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { LicensingAgreementGeneralSchema } from './schema';
import { licensingAgreementGeneralQuestions } from './questions';

export const licensingAgreementGeneralMeta: LegalDocument = {
  id: 'licensing-agreement-general',
  jurisdiction: 'US',
  category: 'Intellectual Property',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 14.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/licensing-agreement-general.md',
    es: '/templates/es/licensing-agreement-general.md',
  },
  schema: LicensingAgreementGeneralSchema,
  questions: licensingAgreementGeneralQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'General Licensing Agreement',
      description:
        'Turn your intellectual property into profit by licensing it to others while maintaining ownership and control.',
      aliases: [
        'general license agreement',
        'IP licensing contract',
        'licensing contract',
      ],
    },
    es: {
      name: 'Acuerdo General de Licencia',
      description:
        'Acuerdo integral de licencia para varios tipos de propiedad intelectual.',
      aliases: ['contrato general de licencia', 'acuerdo de licenciamiento'],
    },
  },
};
