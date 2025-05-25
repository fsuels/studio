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
  templatePath: '/templates/en/us/promissory-note.md', // Path relative to public folder
  templatePath_es: '/templates/es/us/promissory-note.md', // Path relative to public folder
  schema: PromissoryNoteSchema,
  questions: promissoryNoteQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Promissory Note',
      description: 'Formalize a promise to repay a loan, with terms for principal, interest, and repayment schedule.',
      aliases: ["iou", "loan paper", "promise to pay", "loan document"]
    },
    es: {
      name: 'Pagaré',
      description: 'Formalizar una promesa de pago de un préstamo, con plazos para el capital, intereses y calendario de pagos.',
      aliases: ["pagaré", "documento de préstamo", "promesa de pago"]
    }
  }
};

console.log('[promissory-note metadata] questions loaded:', promissoryNoteMeta.questions?.length);
