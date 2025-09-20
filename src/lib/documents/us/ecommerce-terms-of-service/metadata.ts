// src/lib/documents/us/ecommerce-terms-of-service/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { EcommerceTermsOfServiceSchema } from './schema';
import { ecommerceTermsOfServiceQuestions } from './questions';

export const ecommerceTermsOfServiceMeta: LegalDocument = {
  id: 'ecommerce-terms-of-service',
  jurisdiction: 'US',
  category: 'Business & Commercial',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 19.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/ecommerce-terms-of-service.md',
    es: '/templates/es/ecommerce-terms-of-service.md',
  },
  schema: EcommerceTermsOfServiceSchema,
  questions: ecommerceTermsOfServiceQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'E-commerce Terms of Service',
      description:
        'Terms of service agreement for online retail and e-commerce businesses.',
      aliases: [
        'online store terms',
        'website terms',
        'user agreement',
      ],
    },
    es: {
      name: 'Términos de Servicio de Comercio Electrónico',
      description:
        'Acuerdo de términos de servicio para negocios de venta en línea.',
      aliases: [
        'términos de tienda en línea',
        'acuerdo de usuario',
        'acuerdo de usuario legal',
      ],
    },
  },
};
