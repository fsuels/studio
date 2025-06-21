// src/lib/documents/us/service-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { serviceAgreementSchema } from './schema';
import { serviceAgreementQuestions } from './questions';

export const serviceAgreementMeta: LegalDocument = {
  id: 'service-agreement',
  jurisdiction: 'US',
  category: 'Business',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 15,
  states: 'all',
  templatePaths: {
    en: '/templates/en/service-agreement.md',
    es: '/templates/es/service-agreement.md',
  },
  schema: serviceAgreementSchema,
  questions: serviceAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Service Agreement',
      description: 'Outline terms for providing or receiving ongoing services.',
      aliases: ['hire services', 'service provider', 'payment terms'],
    },
    es: {
      name: 'Acuerdo de Servicios',
      description:
        'Esbozar términos para proporcionar o recibir servicios continuos.',
      aliases: [
        'contratar servicios',
        'proveedor de servicios',
        'términos de pago',
      ],
    },
  },
};
