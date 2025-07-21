// src/lib/documents/us/letter-of-intent/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { LetterOfIntentSchema } from './schema';
import { letterOfIntentQuestions } from './questions';

export const letterOfIntentMeta: LegalDocument = {
  id: 'letter-of-intent',
  jurisdiction: 'US',
  category: 'Business',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 7.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/letter-of-intent.md',
    es: '/templates/es/letter-of-intent.md',
  },
  schema: LetterOfIntentSchema,
  questions: letterOfIntentQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Letter of Intent',
      description:
        'Express your intention to enter into a business agreement or transaction.',
      aliases: ['LOI', 'intent letter', 'business intent'],
    },
    es: {
      name: 'Carta de Intención',
      description:
        'Expresa tu intención de entrar en un acuerdo comercial o transacción.',
      aliases: ['carta de intenciones', 'LOI'],
    },
  },
};
