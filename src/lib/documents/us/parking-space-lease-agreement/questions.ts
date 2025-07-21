// src/lib/documents/us/parking-space-lease-agreement/questions.ts
import type { FormQuestion } from '@/types/documents';

export const parkingSpaceLeaseAgreementQuestions: FormQuestion[] = [
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
