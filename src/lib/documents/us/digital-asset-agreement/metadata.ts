// src/lib/documents/us/digital-asset-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { DigitalAssetAgreementSchema } from './schema';
import { digitalAssetAgreementQuestions } from './questions';

export const digitalAssetAgreementMeta: LegalDocument = {
  id: 'digital-asset-agreement',
  jurisdiction: 'US',
  category: 'Technology & IT',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 29.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/digital-asset-agreement.md',
    es: '/templates/es/digital-asset-agreement.md',
  },
  schema: DigitalAssetAgreementSchema,
  questions: digitalAssetAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Digital Asset Agreement',
      description:
        'Agreement for trading, managing, and transferring digital assets and cryptocurrencies.',
      aliases: [
        'crypto agreement',
        'nft agreement',
        'blockchain asset agreement',
      ],
    },
    es: {
      name: 'Acuerdo de Activos Digitales',
      description:
        'Acuerdo para comerciar, gestionar y transferir activos digitales y criptomonedas.',
      aliases: ['acuerdo crypto', 'contrato de NFT'],
    },
  },
};
