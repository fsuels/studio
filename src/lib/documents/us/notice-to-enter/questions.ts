// src/lib/documents/us/notice-to-enter/questions.ts
import type { FormQuestion } from '@/types/documents';

export const noticeToEnterQuestions: FormQuestion[] = [
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