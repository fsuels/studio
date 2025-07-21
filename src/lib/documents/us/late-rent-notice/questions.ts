// src/lib/documents/us/late-rent-notice/questions.ts
import type { FormQuestion } from '@/types/documents';

export const lateRentNoticeQuestions: FormQuestion[] = [
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
