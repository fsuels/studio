// src/lib/documents/us/real-estate-purchase-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { RealEstatePurchaseAgreementSchema } from './schema';
import { realEstatePurchaseAgreementQuestions } from './questions';

export const realEstatePurchaseAgreementMeta: LegalDocument = {
  id: 'real-estate-purchase-agreement',
  jurisdiction: 'US',
  category: 'Real Estate & Property',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: true,
  offerNotarization: true,
  offerRecordingHelp: true,
  basePrice: 24.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/real-estate-purchase-agreement.md',
    es: '/templates/es/real-estate-purchase-agreement.md',
  },
  schema: RealEstatePurchaseAgreementSchema,
  questions: realEstatePurchaseAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Real Estate Purchase Agreement',
      description: 'Agreement for the purchase and sale of real property.',
      aliases: [
        'home purchase agreement',
        'property purchase contract',
        'real estate sales contract',
      ],
    },
    es: {
      name: 'Acuerdo de Compra de Bienes Raíces',
      description: 'Acuerdo para la compra y venta de bienes inmuebles.',
      aliases: ['contrato de compra de casa', 'acuerdo de venta de propiedad'],
    },
  },
};
