// src/lib/documents/us/promissory-note/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { PromissoryNoteSchema } from './schema'; // Assuming schema is in the same folder
import { promissoryNoteQuestions } from './questions'; // Assuming questions is in the same folder

/**
 *  Single source-of-truth for the Promissory Note definition.
 *  (Named “…Meta” so the US barrel can alias it cleanly.)
 */
export const promissoryNoteMeta: LegalDocument = {
  /* ───────── core identity ───────── */
  id: 'promissory-note',
  jurisdiction: 'US', // Added based on folder structure
  category: 'Finance',
  languageSupport: ['en', 'es'],
  basePrice: 5, // Defaulting to 5 as per other similar docs, adjust if needed
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  states: 'all',

  // Top-level names and descriptions for current component compatibility
  name: 'Promissory Note',
  name_es: 'Pagaré',
  description: 'Formalize a promise to repay a loan.',
  description_es: 'Formalizar una promesa de pago de un préstamo.',
  aliases: ["iou", "loan paper", "promise to pay"],
  aliases_es: ["pagaré", "documento de préstamo", "promesa de pago"],
  
  /* ─────── localisation / templates ─────── */
  // Paths should be relative to the `public` folder for fetch
  templatePath:    '/templates/en/us/promissory-note.md', // Assuming it's in public/templates/en/us/
  templatePath_es: '/templates/es/us/promissory-note.md', // Assuming it's in public/templates/es/us/

  /* ───────── validation schema ───────── */
  schema: PromissoryNoteSchema,

  /* -------- questions for the wizard -------- */
  questions: promissoryNoteQuestions,

  /* ───────── optional paid clauses ──────── */
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
  // Optional: If you plan to use the new translations structure universally
  // translations: {
  //   en: {
  //     name: 'Promissory Note',
  //     description: 'Formalize a promise to repay a loan.',
  //     aliases: ["iou", "loan paper", "promise to pay"]
  //   },
  //   es: {
  //     name: 'Pagaré',
  //     description: 'Formalizar una promesa de pago de un préstamo.',
  //     aliases: ["pagaré", "documento de préstamo", "promesa de pago"]
  //   }
  // }
};
