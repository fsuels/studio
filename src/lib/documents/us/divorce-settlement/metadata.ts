import type { LegalDocument } from '@/types/documents';
import { divorceSettlementSchema } from './schema';
import { divorceSettlementQuestions } from './questions';

export const divorceSettlementMeta: LegalDocument = {
  id: 'divorce-settlement',
  jurisdiction: 'US',
  category: 'Personal',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: true,
  offerNotarization: true,
  offerRecordingHelp: true,
  basePrice: 24.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/divorce-settlement.md',
    es: '/templates/es/divorce-settlement.md',
  },
  schema: divorceSettlementSchema,
  questions: divorceSettlementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Divorce Settlement Agreement',
      description: 'Create a legally binding divorce settlement agreement with our easy-to-use template. State-specific requirements included.',
      aliases: [
        'divorce settlement contract',
        'marital settlement agreement',
        'property settlement',
        'divorce agreement'
      ],
    },
    es: {
      name: 'Acuerdo de Liquidación de Divorcio',
      description: 'Crea un acuerdo de liquidación de divorcio legalmente válido con nuestra plantilla fácil de usar. Incluye requisitos específicos del estado.',
      aliases: [
        'contrato de divorcio',
        'acuerdo matrimonial',
        'liquidación de bienes'
      ],
    },
  },
};
