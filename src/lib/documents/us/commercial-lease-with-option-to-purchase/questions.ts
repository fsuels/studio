// src/lib/documents/us/commercial-lease-with-option-to-purchase/questions.ts
import type { FormQuestion } from '@/types/documents';

export const commercialLeaseWithOptionToPurchaseQuestions: FormQuestion[] = [
  {
    id: 'title',
    type: 'text',
    label: 'Document Title',
    placeholder: 'Enter document title',
    required: true,
    group: 'basic',
  },
  // More questions will be added based on document requirements
];
