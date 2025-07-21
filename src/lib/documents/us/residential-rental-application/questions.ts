// src/lib/documents/us/residential-rental-application/questions.ts
import type { FormQuestion } from '@/types/documents';

export const residentialRentalApplicationQuestions: FormQuestion[] = [
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
