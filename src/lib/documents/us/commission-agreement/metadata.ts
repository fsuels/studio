// src/lib/documents/us/commission-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { CommissionAgreementSchema } from './schema';
import { commissionAgreementQuestions } from './questions';

export const commissionAgreementMeta: LegalDocument = {
  id: 'commission-agreement',
  jurisdiction: 'US',
  category: 'Employment',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 16.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/commission-agreement.md',
    es: '/templates/es/commission-agreement.md',
  },
  schema: CommissionAgreementSchema,
  questions: commissionAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Commission Agreement',
      description:
        'Comprehensive agreement establishing commission-based compensation structure and terms.',
      aliases: [
        'sales commission agreement',
        'commission contract',
        'compensation agreement',
      ],
    },
    es: {
      name: 'Acuerdo de Comisión',
      description:
        'Acuerdo integral que establece la estructura y términos de compensación basada en comisiones.',
      aliases: ['acuerdo de comisión de ventas', 'contrato de comisión'],
    },
  },
};
