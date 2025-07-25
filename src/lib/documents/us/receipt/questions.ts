import type { Question } from '@/types/documents';

export const receiptQuestions: Question[] = [
  {
    id: 'receiptNumber',
    label: 'Receipt Number',
    type: 'text',
    required: true,
    placeholder: 'e.g., RCP-001',
  },
  { id: 'date', label: 'Date of Payment', type: 'date', required: true },
  { id: 'payerName', label: 'Payer Name', type: 'text', required: true },
  {
    id: 'payerAddress',
    label: 'Payer Address',
    type: 'text',
    required: true,
    placeholder: 'Street, City, State, ZIP',
  },
  {
    id: 'payeeName',
    label: 'Payee Name (Receiver)',
    type: 'text',
    required: true,
  },
  {
    id: 'payeeAddress',
    label: 'Payee Address',
    type: 'text',
    required: true,
    placeholder: 'Street, City, State, ZIP',
  },
  {
    id: 'amount',
    label: 'Payment Amount',
    type: 'number',
    required: true,
    placeholder: 'e.g., 500',
  },
  {
    id: 'paymentMethod',
    label: 'Payment Method',
    type: 'select',
    required: true,
    options: [
      { value: 'Cash', label: 'Cash' },
      { value: 'Check', label: 'Check' },
      { value: 'Credit Card', label: 'Credit Card' },
      { value: 'Debit Card', label: 'Debit Card' },
      { value: 'Bank Transfer', label: 'Bank Transfer' },
      { value: 'Money Order', label: 'Money Order' },
      { value: 'Other', label: 'Other' },
    ],
  },
  {
    id: 'checkNumber',
    label: 'Check Number',
    type: 'text',
    required: false,
    tooltip: 'Required if payment method is check',
  },
  {
    id: 'transactionId',
    label: 'Transaction ID',
    type: 'text',
    required: false,
    tooltip: 'For electronic payments',
  },
  {
    id: 'purposeOfPayment',
    label: 'Purpose of Payment',
    type: 'text',
    required: true,
    placeholder: 'What this payment is for',
  },
  {
    id: 'taxAmount',
    label: 'Tax Amount',
    type: 'number',
    required: false,
    placeholder: 'e.g., 40',
  },
  {
    id: 'totalAmount',
    label: 'Total Amount',
    type: 'number',
    required: true,
    placeholder: 'Including tax if applicable',
  },
  {
    id: 'balanceDue',
    label: 'Balance Due',
    type: 'number',
    required: false,
    placeholder: 'Remaining amount owed',
  },
  {
    id: 'receiptType',
    label: 'Receipt Type',
    type: 'select',
    required: true,
    options: [
      { value: 'Payment Receipt', label: 'Payment Receipt' },
      { value: 'Deposit Receipt', label: 'Deposit Receipt' },
      { value: 'Rental Receipt', label: 'Rental Receipt' },
      { value: 'Service Receipt', label: 'Service Receipt' },
      { value: 'Purchase Receipt', label: 'Purchase Receipt' },
    ],
  },
  {
    id: 'paymentFor',
    label: 'Payment For',
    type: 'select',
    required: true,
    options: [
      { value: 'Goods', label: 'Goods' },
      { value: 'Services', label: 'Services' },
      { value: 'Rent', label: 'Rent' },
      { value: 'Loan Payment', label: 'Loan Payment' },
      { value: 'Deposit', label: 'Deposit' },
      { value: 'Other', label: 'Other' },
    ],
  },
  {
    id: 'accountNumber',
    label: 'Account Number',
    type: 'text',
    required: false,
    placeholder: 'Account or reference number',
  },
  {
    id: 'dueDate',
    label: 'Next Payment Due Date',
    type: 'date',
    required: false,
    tooltip: 'For recurring payments',
  },
  {
    id: 'notes',
    label: 'Additional Notes',
    type: 'textarea',
    required: false,
    placeholder: 'Any additional information...',
  },
];
