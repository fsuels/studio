import { z } from 'zod';
import type { LegalDocument } from '@/types/documents';

export const promissoryNote: LegalDocument = {
  id: 'promissory-note',
  jurisdiction: 'US', // Added jurisdiction
  category: 'Finance',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 5,
  states: 'all',
  // Note: templatePaths should be added if this document has templates
  // Assuming it uses a default or no specific template for now based on previous data
  // templatePaths: {
  //   en: "en/us/promissory-note.md",
  //   es: "es/us/promissory-note.md"
  // },
  schema: z.object({
    lenderName: z.string().min(1, "Lender name is required"),
    borrowerName: z.string().min(1, "Borrower name is required"),
    principalAmount: z.coerce.number().positive("Principal amount must be positive"),
    interestRate: z.coerce.number().min(0).optional(),
    repaymentTerms: z.string().min(1, "Repayment terms are required"),
  }),
  questions: [
    // Assuming labels/tooltips here should also be i18n keys
    { id: 'lenderName', label: 'documents.us.promissory-note.lenderName.label', type: 'text', required: true, tooltip: 'documents.us.promissory-note.lenderName.tooltip' },
    { id: 'borrowerName', label: 'documents.us.promissory-note.borrowerName.label', type: 'text', required: true, tooltip: 'documents.us.promissory-note.borrowerName.tooltip' },
    { id: 'principalAmount', label: 'documents.us.promissory-note.principalAmount.label', type: 'number', required: true, tooltip: 'documents.us.promissory-note.principalAmount.tooltip' },
    { id: 'interestRate', label: 'documents.us.promissory-note.interestRate.label', type: 'number', tooltip: 'documents.us.promissory-note.interestRate.tooltip' },
    { id: 'repaymentTerms', label: 'documents.us.promissory-note.repaymentTerms.label', type: 'textarea', required: true, tooltip: 'documents.us.promissory-note.repaymentTerms.tooltip' },
  ],
  upsellClauses: [
    {
      id: 'securedClause',
      price: 2,
      translations: {
        en: { description: 'Add collateral details (secured note)' },
        es: { description: 'Añadir detalles de garantía (pagaré garantizado)' }
      }
    }
  ],
  translations: {
    en: {
      name: 'Promissory Note',
      description: 'Formalize a promise to repay a loan.',
      aliases: ["iou", "loan paper", "promise to pay"]
    },
    es: {
      name: 'Pagaré',
      description: 'Formalizar una promesa de pago de un préstamo.',
      aliases: ["pagaré", "documento de préstamo", "promesa de pago"]
    }
  }
};