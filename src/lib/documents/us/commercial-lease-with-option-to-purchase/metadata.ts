// src/lib/documents/us/commercial-lease-with-option-to-purchase/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { CommercialLeaseWithOptionToPurchaseSchema } from './schema';
import { commercialLeaseWithOptionToPurchaseQuestions } from './questions';

export const commercialLeaseWithOptionToPurchaseMeta: LegalDocument = {
  id: 'commercial-lease-with-option-to-purchase',
  jurisdiction: 'US',
  category: 'Business & Commercial',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 59.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/commercial-lease-with-option-to-purchase.md',
    es: '/templates/es/commercial-lease-with-option-to-purchase.md',
  },
  schema: CommercialLeaseWithOptionToPurchaseSchema,
  questions: commercialLeaseWithOptionToPurchaseQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Commercial Lease with Option to Purchase',
      description: 'Test commercial locations without committing to purchase immediately. Secure the option to buy successful properties in the future.',
      aliases: [],
    },
    es: {
      name: 'Arrendamiento Comercial con Opción de Compra',
      description: 'Prueba ubicaciones comerciales sin comprometerte a comprar inmediatamente. Asegura la opción de adquirir propiedades exitosas en el futuro.',
      aliases: [],
    },
  },
};
