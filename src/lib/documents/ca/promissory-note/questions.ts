import type { Question } from '@/types/documents';
import { caProvinces } from '@/lib/document-library/utils';

export const promissoryNoteCAQuestions: Question[] = [
  {
    id: 'lenderName',
    label: 'documents.ca.promissory-note-ca.lenderName.label',
    type: 'text',
    required: true,
  },
  {
    id: 'borrowerName',
    label: 'documents.ca.promissory-note-ca.borrowerName.label',
    type: 'text',
    required: true,
  },
  {
    id: 'principalAmount',
    label: 'documents.ca.promissory-note-ca.principalAmount.label',
    type: 'number',
    required: true,
  },
  {
    id: 'interestRate',
    label: 'documents.ca.promissory-note-ca.interestRate.label',
    type: 'number',
    required: false,
    placeholder: 'e.g., 5',
  },
  {
    id: 'repaymentTerms',
    label: 'documents.ca.promissory-note-ca.repaymentTerms.label',
    type: 'textarea',
    required: true,
    placeholder: 'e.g., Monthly payments of $100 for 12 months.',
  },
  {
    id: 'province',
    label: 'documents.ca.promissory-note-ca.province.label',
    type: 'select',
    required: true,
    options: caProvinces,
  },
];
