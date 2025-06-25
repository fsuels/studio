// src/lib/documents/us/cloud-services-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { CloudServicesAgreementSchema } from './schema';
import { cloudServicesAgreementQuestions } from './questions';

export const cloudServicesAgreementMeta: LegalDocument = {
  id: 'cloud-services-agreement',
  jurisdiction: 'US',
  category: 'Technology & IT',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 17.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/cloud-services-agreement.md',
    es: '/templates/es/cloud-services-agreement.md',
  },
  schema: CloudServicesAgreementSchema,
  questions: cloudServicesAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Cloud Services Agreement',
      description: 'Agreement for cloud computing and hosting services.',
      aliases: ['cloud hosting', 'SaaS agreement', 'cloud computing contract'],
    },
    es: {
      name: 'Acuerdo de Servicios en la Nube',
      description:
        'Contrata servicios de almacenamiento y software en la nube. Define seguridad, disponibilidad y qué pasa con tus datos.',
      aliases: ['hospedaje en la nube', 'acuerdo SaaS'],
    },
  },
};
