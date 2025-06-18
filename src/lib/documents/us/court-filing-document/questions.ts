// src/lib/documents/us/court-filing-document/questions.ts
import type { FormQuestion } from '@/types/documents';

export const courtFilingDocumentQuestions: FormQuestion[] = [
  {
    id: 'courtName',
    type: 'text',
    label: 'Court Name',
    placeholder: 'Enter court name',
    required: true,
    group: 'court',
  },
  {
    id: 'caseTitle',
    type: 'text',
    label: 'Case Title',
    placeholder: 'Enter case title',
    required: true,
    group: 'case',
  },
  {
    id: 'caseType',
    type: 'select',
    label: 'Case Type',
    options: [
      { value: 'civil', label: 'Civil' },
      { value: 'criminal', label: 'Criminal' },
      { value: 'family', label: 'Family' },
      { value: 'probate', label: 'Probate' },
      { value: 'small-claims', label: 'Small Claims' },
    ],
    required: true,
    group: 'case',
  },
  {
    id: 'documentType',
    type: 'select',
    label: 'Document Type',
    options: [
      { value: 'complaint', label: 'Complaint' },
      { value: 'answer', label: 'Answer' },
      { value: 'motion', label: 'Motion' },
      { value: 'petition', label: 'Petition' },
      { value: 'response', label: 'Response' },
      { value: 'brief', label: 'Brief' },
    ],
    required: true,
    group: 'document',
  },
  {
    id: 'documentTitle',
    type: 'text',
    label: 'Document Title',
    placeholder: 'Enter specific document title',
    required: true,
    group: 'document',
  },
];