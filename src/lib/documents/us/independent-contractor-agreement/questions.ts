import type { Question } from '@/types/documents';

export const questions: Question[] = [
  {
    id: 'clientName',
    label: 'documents.us.independent-contractor-agreement.clientName.label',
    type: 'text',
    required: true,
  },
  {
    id: 'contractorName',
    label: 'documents.us.independent-contractor-agreement.contractorName.label',
    type: 'text',
    required: true,
  },
  {
    id: 'serviceDescription',
    label:
      'documents.us.independent-contractor-agreement.serviceDescription.label',
    type: 'textarea',
    required: true,
  },
  {
    id: 'paymentTerms',
    label: 'documents.us.independent-contractor-agreement.paymentTerms.label',
    type: 'textarea',
    required: true,
  },
  {
    id: 'startDate',
    label: 'documents.us.independent-contractor-agreement.startDate.label',
    type: 'date',
    required: true,
  },
  {
    id: 'endDate',
    label: 'documents.us.independent-contractor-agreement.endDate.label',
    type: 'date',
  },
];
