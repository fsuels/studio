// src/lib/documents/us/lottery-pool-contract/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { LotteryPoolContractSchema } from './schema';
import { lotteryPoolContractQuestions } from './questions';

export const lotteryPoolContractMeta: LegalDocument = {
  id: 'lottery-pool-contract',
  jurisdiction: 'US',
  category: 'Personal & Lifestyle',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 19.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/lottery-pool-contract.md',
    es: '/templates/es/lottery-pool-contract.md',
  },
  schema: LotteryPoolContractSchema,
  questions: lotteryPoolContractQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Lottery Pool Contract',
      description:
        'Agreement for group lottery ticket purchases and winnings distribution.',
      aliases: ['lottery syndicate agreement', 'group lottery contract'],
    },
    es: {
      name: 'Contrato de Grupo de Lotería',
      description:
        'Acuerdo para compras grupales de boletos de lotería y distribución de ganancias.',
      aliases: [
        'acuerdo de sindicato de lotería',
        'contrato grupal de lotería',
      ],
    },
  },
};
