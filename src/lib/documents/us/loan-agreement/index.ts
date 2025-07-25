// Loan Agreement
import { z } from 'zod';
import type { LegalDocument } from '@/types/documents';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email required').optional(),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(5, 'Valid ZIP code required'),
  date: z.string().min(1, 'Date is required'),
  amount: z.number().min(0, 'Amount must be positive'),
  interestRate: z
    .number()
    .min(0)
    .max(100, 'Interest rate must be between 0-100%'),
  paymentTerms: z.string().min(1, 'Payment terms required'),
  dueDate: z.string().min(1, 'Due date required'),
});

export const loanAgreement: LegalDocument = {
  id: 'loan-agreement',
  name: 'Loan Agreement',
  category: 'Financial',
  schema,
  questions: [
    {
      id: 'name',
      label: 'Name',
      type: 'text',
      required: true,
      placeholder: 'Enter name...',
    },
    {
      id: 'email',
      label: 'Email',
      type: 'text',
      required: false,
      placeholder: 'Enter email...',
    },
    {
      id: 'address',
      label: 'Address',
      type: 'address',
      required: true,
      placeholder: 'Enter address...',
    },
    {
      id: 'city',
      label: 'City',
      type: 'text',
      required: true,
      placeholder: 'Enter city...',
    },
    {
      id: 'state',
      label: 'State',
      type: 'text',
      required: true,
      placeholder: 'Enter state...',
    },
    {
      id: 'zipCode',
      label: 'Zip Code',
      type: 'text',
      required: true,
      placeholder: 'Enter zip code...',
    },
    {
      id: 'date',
      label: 'Date',
      type: 'date',
      required: true,
      placeholder: 'Enter date...',
    },
    {
      id: 'amount',
      label: 'Amount',
      type: 'number',
      required: true,
      placeholder: 'Enter amount...',
    },
    {
      id: 'interestRate',
      label: 'Interest Rate',
      type: 'number',
      required: true,
      placeholder: 'Enter interest rate...',
    },
    {
      id: 'paymentTerms',
      label: 'Payment Terms',
      type: 'text',
      required: true,
      placeholder: 'Enter payment terms...',
    },
    {
      id: 'dueDate',
      label: 'Due Date',
      type: 'date',
      required: true,
      placeholder: 'Enter due date...',
    },
  ],
  offerNotarization: true,
  states: 'all',
  complexity: 'medium',
  estimatedTime: '10-20 minutes',
  tags: ['financial', 'medium', 'legal', 'template', 'notarization'],
  translations: {
    en: {
      name: 'Loan Agreement',
      description:
        'Create a legally binding Loan Agreement with our easy-to-use template. State-specific requirements included.',
      aliases: ['loan contract'],
    },
    es: {
      name: 'Acuerdo de Préstamo',
      description:
        'Crea un Loan Acuerdo legalmente válido con nuestra plantilla fácil de usar. Incluye requisitos específicos del estado.',
      aliases: [],
    },
  },
};
