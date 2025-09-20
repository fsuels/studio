// src/lib/documents/us/patent-licensing-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { PatentLicensingAgreementSchema } from './schema';
import { patentLicensingAgreementQuestions } from './questions';

export const patentLicensingAgreementMeta: LegalDocument = {
  id: 'patent-licensing-agreement',
  jurisdiction: 'US',
  category: 'Intellectual Property',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 44.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/patent-license-agreement.md',
    es: '/templates/es/patent-license-agreement.md',
  },
  schema: PatentLicensingAgreementSchema,
  questions: patentLicensingAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Patent Licensing Agreement',
      description:
        'Agreement for licensing patent rights and intellectual property usage.',
      aliases: [
        'patent license',
        'ip licensing agreement',
        'technology licensing contract',
      ],
    },
    es: {
      name: 'Acuerdo de Licencia de Patente',
      description:
        'Acuerdo para licenciar derechos de patente y uso de propiedad intelectual.',
      aliases: [
        'licencia de patente',
        'contrato de propiedad intelectual',
        'contrato de licencia de tecnología',
      ],
    },
  },
};
