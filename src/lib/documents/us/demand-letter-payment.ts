import { z } from 'zod';
import type { LegalDocument } from '@/types/documents';

export const demandLetterPayment: LegalDocument = {
  id: 'demand-letter-payment',
  category: 'Finance',
  translations: {
    en: {
      name: 'Demand Letter (Payment)',
      description: 'Formally request payment that is overdue.',
      aliases: ['request payment', 'owe money', 'legal demand'],
    },
    es: {
      name: 'Carta de Reclamación (Pago)',
      description: 'Solicitar formalmente un pago atrasado.',
      aliases: ['solicitar pago', 'deber dinero', 'demanda legal'],
    },
  },
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 5,
  states: 'all',
  schema: z.object({
    senderName: z.string().min(1),
    senderAddress: z.string().min(1),
    recipientName: z.string().min(1),
    recipientAddress: z.string().min(1),
    amountDue: z.coerce.number().positive(),
    originalDueDate: z.string().optional(), // Date
    reasonForDebt: z.string().min(1),
    deadlineForPayment: z.string().min(1), // Date
    consequences: z.string().optional(),
  }),
  questions: [
    {
      id: 'senderName',
      label: 'Your Name/Company (Sender)',
      type: 'text',
      required: true,
    },
    {
      id: 'senderAddress',
      label: 'Your Address',
      type: 'textarea',
      required: true,
    },
    {
      id: 'recipientName',
      label: 'Recipient Name/Company',
      type: 'text',
      required: true,
    },
    {
      id: 'recipientAddress',
      label: 'Recipient Address',
      type: 'textarea',
      required: true,
    },
    {
      id: 'amountDue',
      label: 'Amount Due ($)',
      type: 'number',
      required: true,
    },
    { id: 'originalDueDate', label: 'Original Due Date', type: 'date' },
    {
      id: 'reasonForDebt',
      label: 'Reason for Debt (e.g., Unpaid invoice #123)',
      type: 'text',
      required: true,
    },
    {
      id: 'deadlineForPayment',
      label: 'New Deadline for Payment',
      type: 'date',
      required: true,
    },
    {
      id: 'consequences',
      label: 'Consequences of Non-Payment',
      type: 'textarea',
      placeholder: 'e.g., Legal action will be pursued',
    },
  ],
};
