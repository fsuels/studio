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
  templatePath: '/templates/en/promissory-note.md', // Path relative to public folder
  templatePath_es: '/templates/es/promissory-note.md', // Path relative to public folder
  schema: PromissoryNoteSchema,
  questions: promissoryNoteQuestions,
  upsellClauses: [
    { 
      id: 'lateFee', 
      translations: {
        en: { description: 'Late-payment fee clause' },
        es: { description: 'Cláusula de cargo por pago atrasado' }
      },
      price: 1 
    },
    { 
      id: 'securedClause', 
      translations: {
        en: { description: 'Add collateral details (secured note)' },
        es: { description: 'Añadir detalles de garantía (pagaré garantizado)' }
      },
      price: 2 
    }
  ],
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
