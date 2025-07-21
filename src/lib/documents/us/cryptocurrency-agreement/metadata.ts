// src/lib/documents/us/cryptocurrency-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { CryptocurrencyAgreementSchema } from './schema';
import { cryptocurrencyAgreementQuestions } from './questions';

export const cryptocurrencyAgreementMeta: LegalDocument = {
  id: 'cryptocurrency-agreement',
  jurisdiction: 'US',
  category: 'Digital Assets & Blockchain',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 14.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/cryptocurrency-agreement.md',
    es: '/templates/es/cryptocurrency-agreement.md',
  },
  schema: CryptocurrencyAgreementSchema,
  questions: cryptocurrencyAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Cryptocurrency Agreement',
      description:
        'Agreement for cryptocurrency transactions, trading, and digital asset services.',
      aliases: [
        'crypto agreement',
        'digital asset agreement',
        'blockchain agreement',
      ],
    },
    es: {
      name: 'Acuerdo de Criptomonedas',
      description:
        'Acuerdo para transacciones de criptomonedas, comercio y servicios de activos digitales.',
      aliases: ['acuerdo crypto', 'acuerdo de activos digitales'],
    },
  },
};
