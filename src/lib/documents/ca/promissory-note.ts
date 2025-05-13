import { z } from 'zod';
import type { LegalDocument } from '@/types/documents';
import { caProvinces } from '@/lib/document-library/utils';

export const promissoryNoteCA: LegalDocument = {
  id: 'promissory-note-ca',
  jurisdiction: 'CA',
  category: 'Finance',
  languageSupport: ['en', 'fr'],
  basePrice: 7,
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  states: 'all',
  translations: {
    en: {
      name: 'Promissory Note (Canada)',
      description: 'Formal promise to repay a loan in compliance with Canadian federal and provincial law.',
      aliases: ['IOU', 'loan document', 'payment promise']
    },
    fr: {
      name: 'Billet à ordre (Canada)',
      description: 'Promesse officielle de rembourser un prêt conformément à la loi canadienne.',
      aliases: ['Reconnaissance de dette', 'document de prêt', 'promesse de paiement']
    }
  },
  templatePaths: {
    // Relative to /src/templates/
    en: "en/ca/promissory-note-ca.md",
    fr: "fr/ca/promissory-note-ca.md"
  },
  schema: z.object({
    lenderName: z.string().min(1, 'Lender name is required'),
    borrowerName: z.string().min(1, 'Borrower name is required'),
    principalAmount: z.coerce.number().positive('Amount must be positive'),
    interestRate: z.coerce.number().min(0).optional(),
    repaymentTerms: z.string().min(1, 'Repayment terms are required'),
    province: z.string().min(2, 'Province is required'),
  }),
  questions: [
    { id: 'lenderName', label: 'documents.ca.promissory-note-ca.lenderName.label', type: 'text', required: true },
    { id: 'borrowerName', label: 'documents.ca.promissory-note-ca.borrowerName.label', type: 'text', required: true },
    { id: 'principalAmount', label: 'documents.ca.promissory-note-ca.principalAmount.label', type: 'number', required: true },
    { id: 'interestRate', label: 'documents.ca.promissory-note-ca.interestRate.label', type: 'number', required: false, placeholder: 'e.g., 5' },
    { id: 'repaymentTerms', label: 'documents.ca.promissory-note-ca.repaymentTerms.label', type: 'textarea', required: true, placeholder: 'e.g., Monthly payments of $100 for 12 months.' }, 
    { id: 'province', label: 'documents.ca.promissory-note-ca.province.label', type: 'select', required: true, options: caProvinces } 
  ],
  upsellClauses: [
    {
      id: 'bilingualClause',
      price: 2,
      translations: {
         en: { description: 'Include French and English bilingual version' },
         fr: { description: 'Inclure une version bilingue en français et en anglais' }
      }
    }
  ]
};