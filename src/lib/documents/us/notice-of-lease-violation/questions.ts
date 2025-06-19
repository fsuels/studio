// src/lib/documents/us/notice-of-lease-violation/questions.ts
import type { FormQuestion } from '@/types/documents';

export const noticeOfLeaseViolationQuestions: FormQuestion[] = [
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