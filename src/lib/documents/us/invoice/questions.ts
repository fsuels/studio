// src/lib/documents/us/invoice/questions.ts
import type { Question } from '@/types/documents';

export const invoiceQuestions: Question[] = [
  {
    id: 'recipientName',
    label: 'Recipient Name/Company',
    type: 'text',
    required: true,
  },
  { 
    id: 'recipientAddress', 
    label: 'Recipient Address', 
    type: 'textarea' 
  },
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
  { 
    id: 'invoiceDate', 
    label: 'Invoice Date', 
    type: 'date', 
    required: true 
  },
  { 
    id: 'dueDate', 
    label: 'Payment Due Date', 
    type: 'date' 
  },
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
];