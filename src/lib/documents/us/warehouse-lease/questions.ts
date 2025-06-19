// src/lib/documents/us/warehouse-lease/questions.ts
import type { FormQuestion } from '@/types/documents';

export const warehouseLeaseQuestions: FormQuestion[] = [
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