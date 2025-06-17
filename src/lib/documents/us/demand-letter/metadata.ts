// src/lib/documents/us/demand-letter/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { DemandLetterSchema } from './schema';
import { demandLetterQuestions } from './questions';

export const demandLetterMeta: LegalDocument = {
  id: 'demand-letter',
  jurisdiction: 'US',
  category: 'Legal',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 8,
  states: 'all',
  templatePaths: {
    en: '/templates/en/us/demand-letter-payment.md',
    es: '/templates/es/us/demand-letter-payment.md',
  },
  schema: DemandLetterSchema,
  questions: demandLetterQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Demand Letter for Payment',
      description:
        'Create a legally binding Demand Letter for Payment with our easy-to-use template. State-specific requirements included.',
      aliases: [
        'payment demand letter',
        'collection letter',
        'notice of demand',
      ],
    },
    es: {
      name: 'Carta de Demanda de Pago',
      description:
        'Crea una Carta de Demanda de Pago legalmente válida con nuestra plantilla fácil de usar. Incluye requisitos específicos del estado.',
      aliases: [
        'carta de cobro',
        'aviso de demanda',
        'carta de reclamación',
      ],
    },
  },
};
