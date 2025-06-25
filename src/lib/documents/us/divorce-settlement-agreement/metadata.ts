// src/lib/documents/us/divorce-settlement-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { schema } from './schema';
import { questions } from './questions';

export const divorceSettlementAgreementMeta: LegalDocument = {
  id: 'divorce-settlement-agreement',
  jurisdiction: 'US',
  category: 'Family',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: true,
  offerNotarization: true,
  offerRecordingHelp: true,
  basePrice: 25,
  states: 'all',
  templatePaths: {
    en: '/templates/en/divorce-settlement-agreement.md',
    es: '/templates/es/divorce-settlement-agreement.md',
  },
  schema: schema,
  questions: questions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Divorce Settlement Agreement',
      description:
        'Formalizes the terms of a divorce, including property division, support, and custody.',
      aliases: [
        'divorce',
        'separation',
        'end marriage',
        'get divorced',
        'marital settlement',
      ],
    },
    es: {
      name: 'Acuerdo de Divorcio',
      description:
        'Divide bienes, deudas y responsabilidades al terminar un matrimonio. Cubre propiedades, custodia y pagos de manutención.',
      aliases: [
        'divorcio',
        'separación',
        'terminar matrimonio',
        'divorciarse',
        'acuerdo matrimonial',
      ],
    },
  },
};
