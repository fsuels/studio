// src/lib/documents/us/patent-license-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { PatentLicenseAgreementSchema } from './schema';
import { patentLicenseAgreementQuestions } from './questions';

export const patentLicenseAgreementMeta: LegalDocument = {
  id: 'patent-license-agreement',
  jurisdiction: 'US',
  category: 'Intellectual Property',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: true,
  offerNotarization: false,
  offerRecordingHelp: true,
  basePrice: 29.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/patent-license-agreement.md',
    es: '/templates/es/patent-license-agreement.md',
  },
  schema: PatentLicenseAgreementSchema,
  questions: patentLicenseAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Patent License Agreement',
      description:
        'Comprehensive agreement for licensing patent rights with royalty and technical provisions.',
      aliases: [
        'patent licensing contract',
        'technology license agreement',
        'patent usage agreement',
      ],
    },
    es: {
      name: 'Acuerdo de Licencia de Patente',
      description:
        'Acuerdo integral para licenciar derechos de patente con provisiones técnicas y de regalías.',
      aliases: [
        'contrato de licencia de patente',
        'acuerdo de licencia tecnológica',
      ],
    },
  },
};
