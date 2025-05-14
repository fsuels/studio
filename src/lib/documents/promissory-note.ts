import { z } from 'zod';
import type { LegalDocument } from '@/types/documents';
import { usStates } from '../usStates'; // Adjusted path

export const promissoryNote: LegalDocument = {
  id: 'promissory-note',
  name: 'Promissory Note',
  name_es: 'Pagaré',
  category: 'Finance',
  description: 'Formalize a promise to repay a loan.',
  description_es: 'Formalizar una promesa de pago de un préstamo.',
  aliases: ["iou", "loan paper", "promise to pay"],
  aliases_es: ["pagaré", "documento de préstamo", "promesa de pago"],
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 5,
  states: 'all',
  schema: z.object({
    lenderName: z.string().min(1, "Lender name is required"),
    borrowerName: z.string().min(1, "Borrower name is required"),
    principalAmount: z.coerce.number().positive("Principal amount must be positive"),
    interestRate: z.coerce.number().min(0).optional(),
    repaymentTerms: z.string().min(1, "Repayment terms are required"),
  }),
  questions: [
    { id: 'lenderName', label: 'Lender Name', type: 'text', required: true, tooltip: "The person or entity lending the money." },
    { id: 'borrowerName', label: 'Borrower Name', type: 'text', required: true, tooltip: "The person or entity borrowing the money." },
    { id: 'principalAmount', label: 'Loan Amount ($)', type: 'number', required: true, tooltip: "The total amount of money being loaned." },
    { id: 'interestRate', label: 'Interest Rate (%)', type: 'number', tooltip: "Annual interest rate. Leave blank or 0 if no interest." },
    { id: 'repaymentTerms', label: 'Repayment Terms', type: 'textarea', required: true, tooltip: "Describe how the loan will be repaid (e.g., monthly installments, lump sum)." },
  ],
  upsellClauses: [
    { id: 'securedClause', description: 'Add collateral details (secured note)', description_es: 'Añadir detalles de garantía (pagaré garantizado)', price: 2 }
  ]
};