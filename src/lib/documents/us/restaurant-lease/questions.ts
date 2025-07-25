// src/lib/documents/us/restaurant-lease/questions.ts
import type { FormQuestion } from '@/types/documents';

export const restaurantLeaseQuestions: FormQuestion[] = [
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
