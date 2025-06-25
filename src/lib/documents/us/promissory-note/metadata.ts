// src/lib/documents/us/promissory-note/metadata.ts

import type { LegalDocument } from '@/types/documents';
import { PromissoryNoteSchema } from './schema';
import { promissoryNoteQuestions } from './questions';

export const promissoryNoteMeta: LegalDocument = {
  id: 'promissory-note',
  jurisdiction: 'US',
  category: 'Finance',
  languageSupport: ['en', 'es'],
  basePrice: 5,
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  states: 'all',
  templatePaths: {
    en: '/templates/en/promissory-note.md',
    es: '/templates/es/promissory-note.md',
  },
  schema: PromissoryNoteSchema,
  questions: promissoryNoteQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Promissory Note',
      description:
        'Formalize a promise to repay a loan, with terms for principal, interest, and repayment schedule.',
      aliases: ['iou', 'loan paper', 'promise to pay', 'loan document'],
    },
    es: {
      name: 'Pagaré',
      description:
        'Presta dinero a familia, amigos o clientes con protección legal. Define cantidad, interés y cuándo se pagará de vuelta.',
      aliases: ['pagaré', 'documento de préstamo', 'promesa de pago'],
    },
  },
};
