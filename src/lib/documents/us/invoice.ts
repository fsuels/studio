import { z } from 'zod';
import type { LegalDocument } from '@/types/documents';

export const invoice: LegalDocument = {
  id: 'invoice',
  category: 'Finance',
  translations: {
    en: {
      name: 'Invoice',
      description: 'Request payment for goods or services rendered.',
    },
    es: {
      name: 'Factura',
      description: 'Solicitar pago por bienes o servicios prestados.',
    },
  },
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 3,
  states: 'all',
  schema: z.object({
    recipientName: z.string().min(1),
    recipientAddress: z.string().optional(),
    yourName: z.string().min(1),
    invoiceNumber: z.string().min(1),
    invoiceDate: z.string().min(1),
    dueDate: z.string().optional(),
    lineItems: z.string().min(1),
    totalAmount: z.coerce.number().positive(),
  }),
  questions: [
    {
      id: 'recipientName',
      label: 'Recipient Name/Company',
      type: 'text',
      required: true,
    },
    { id: 'recipientAddress', label: 'Recipient Address', type: 'textarea' },
    {
      id: 'yourName',
      label: 'Your Name/Company',
      type: 'text',
      required: true,
    },
    {
      id: 'invoiceNumber',
      label: 'Invoice Number',
      type: 'text',
      required: true,
    },
    { id: 'invoiceDate', label: 'Invoice Date', type: 'date', required: true },
    { id: 'dueDate', label: 'Payment Due Date', type: 'date' },
    {
      id: 'lineItems',
      label: 'Items/Services (Description & Amount)',
      type: 'textarea',
      required: true,
      placeholder: 'Item 1 - $100\nService B - $250',
    },
    {
      id: 'totalAmount',
      label: 'Total Amount Due ($)',
      type: 'number',
      required: true,
    },
  ],
};
