// src/lib/documents/us/promissory-note/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { PromissoryNoteSchema } from './schema';
import { promissoryNoteQuestions } from './questions';

export const promissoryNoteMeta: LegalDocument = {
  id: 'promissory-note',
  jurisdiction: 'US',
  category: 'Finance',
  languageSupport: ['en', 'es'],
  basePrice: 5, // Adjusted to 5 as per other docs, can be changed
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  states: 'all',
  name: 'Promissory Note', 
  name_es: 'Pagaré', 
  description: 'Formalize a promise to repay a loan, with terms for principal, interest, and repayment schedule.',
  description_es: 'Formalizar una promesa de pago de un préstamo, con plazos para el capital, intereses y calendario de pagos.',
  aliases: ["iou", "loan paper", "promise to pay", "loan document"],
  aliases_es: ["pagaré", "documento de préstamo", "promesa de pago"],
  templatePath: '/templates/en/promissory-note.md', // Standardized path
  templatePath_es: '/templates/es/promissory-note.md', // Standardized path
  schema: PromissoryNoteSchema,
  questions: promissoryNoteQuestions,
  upsellClauses: [
    { 
      id: 'lateFee', 
      description: 'Late-payment fee clause', 
      description_es: 'Cláusula de cargo por pago atrasado', 
      price: 1 
    },
    { 
      id: 'securedClause', 
      description: 'Add collateral details (secured note)', 
      description_es: 'Añadir detalles de garantía (pagaré garantizado)', 
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
