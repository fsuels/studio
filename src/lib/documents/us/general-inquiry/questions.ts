import type { Question } from '@/types/documents';
import { usStates } from '@/lib/document-library/utils';

export const questions: Question[] = [
  {
    id: 'inquiryDetails',
    label: 'documents.us.general-inquiry.inquiryDetails.label',
    type: 'textarea',
    required: true,
  },
  {
    id: 'desiredOutcome',
    label: 'documents.us.general-inquiry.desiredOutcome.label',
    type: 'text',
  },
  {
    id: 'state',
    label: 'documents.us.general-inquiry.state.label',
    type: 'select',
    options: usStates.map((s) => ({ value: s.value, label: s.label })),
  },
];