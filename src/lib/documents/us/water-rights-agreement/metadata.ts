// src/lib/documents/us/water-rights-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { WaterRightsAgreementSchema } from './schema';
import { waterRightsAgreementQuestions } from './questions';

export const waterRightsAgreementMeta: LegalDocument = {
  id: 'water-rights-agreement',
  jurisdiction: 'US',
  category: 'Real Estate & Property',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: true,
  offerNotarization: true,
  offerRecordingHelp: true,
  basePrice: 39.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/water-rights-agreement.md',
    es: '/templates/es/water-rights-agreement.md',
  },
  schema: WaterRightsAgreementSchema,
  questions: waterRightsAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Water Rights Agreement',
      description: 'Agreement for the transfer, lease, or use of water rights.',
      aliases: [
        'water transfer agreement',
        'irrigation rights',
        'water usage agreement',
      ],
    },
    es: {
      name: 'Acuerdo de Derechos de Agua',
      description:
        'Acuerdo para la transferencia, arrendamiento o uso de derechos de agua.',
      aliases: ['acuerdo de transferencia de agua', 'derechos de riego'],
    },
  },
};
