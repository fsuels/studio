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
      description: 'Agreement for affiliate marketing partnerships and commission-based promotions.',
      aliases: ['affiliate program agreement', 'commission agreement', 'partner marketing agreement'],
    },
    es: {
      name: 'Acuerdo de Marketing de Afiliados',
      description: 'Acuerdo para asociaciones de marketing de afiliados y promociones basadas en comisiones.',
      aliases: ['acuerdo de programa de afiliados', 'acuerdo de comisiones'],
    },
  },
};