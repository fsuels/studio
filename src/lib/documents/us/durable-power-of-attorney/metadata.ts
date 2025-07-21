// src/lib/documents/us/durable-power-of-attorney/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { DurablePowerOfAttorneySchema } from './schema';
import { durablePowerOfAttorneyQuestions } from './questions';

export const durablePowerOfAttorneyMeta: LegalDocument = {
  id: 'durable-power-of-attorney',
  jurisdiction: 'US',
  category: 'Estate Planning',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: true,
  offerNotarization: true,
  offerRecordingHelp: true,
  basePrice: 16.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/durable-power-of-attorney.md',
    es: '/templates/es/durable-power-of-attorney.md',
  },
  schema: DurablePowerOfAttorneySchema,
  questions: durablePowerOfAttorneyQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Durable Power of Attorney',
      description:
        'Grant someone authority to act on your behalf for financial and legal matters, even if you become incapacitated.',
      aliases: [
        'financial power of attorney',
        'general power of attorney',
        'durable POA',
      ],
    },
    es: {
      name: 'Poder Duradero',
      description:
        'Otorga a alguien autoridad para actuar en tu nombre en asuntos financieros y legales, incluso si quedas incapacitado.',
      aliases: ['poder financiero', 'poder general', 'POA duradero'],
    },
  },
};
