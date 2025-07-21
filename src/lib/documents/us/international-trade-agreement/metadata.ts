// src/lib/documents/us/international-trade-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { InternationalTradeAgreementSchema } from './schema';
import { internationalTradeAgreementQuestions } from './questions';

export const internationalTradeAgreementMeta: LegalDocument = {
  id: 'international-trade-agreement',
  jurisdiction: 'US',
  category: 'Business & Commercial',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 39.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/international-trade-agreement.md',
    es: '/templates/es/international-trade-agreement.md',
  },
  schema: InternationalTradeAgreementSchema,
  questions: internationalTradeAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'International Trade Agreement',
      description:
        'Agreement for international business transactions and trade relationships.',
      aliases: [
        'import export agreement',
        'international sales contract',
        'global trade contract',
      ],
    },
    es: {
      name: 'Acuerdo de Comercio Internacional',
      description: 'Acuerdo para transacciones comerciales internacionales.',
      aliases: [
        'contrato de importación exportación',
        'acuerdo comercial global',
      ],
    },
  },
};
