// src/lib/documents/us/demand-letter-payment/questions.ts
import type { QuestionConfig } from '@/types/documents';

export const demandLetterPaymentQuestions: QuestionConfig[] = [
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
];
