// src/lib/documents/us/affiliate-marketing-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { AffiliateMarketingAgreementSchema } from './schema';
import { affiliateMarketingAgreementQuestions } from './questions';

export const affiliateMarketingAgreementMeta: LegalDocument = {
  id: 'affiliate-marketing-agreement',
  jurisdiction: 'US',
  category: 'Marketing & Advertising',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 9.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/affiliate-marketing-agreement.md',
    es: '/templates/es/affiliate-marketing-agreement.md',
  },
  schema: AffiliateMarketingAgreementSchema,
  questions: affiliateMarketingAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Affiliate Marketing Agreement',
      description:
        'Expand your marketing reach and boost sales without upfront costs. Attract motivated partners who only earn when they deliver results.',
      aliases: [
        'affiliate program agreement',
        'commission agreement',
        'partner marketing agreement',
      ],
    },
    es: {
      name: 'Acuerdo de Marketing de Afiliados',
      description:
        'Establece términos de comisión y protege tu negocio al trabajar con afiliados que promocionan tus productos por un porcentaje de las ventas.',
      aliases: ['acuerdo de programa de afiliados', 'acuerdo de comisiones'],
    },
  },
};
