// src/lib/documents/us/patent-assignment/questions.ts
import type { Question } from '@/types/documents';

export const patentAssignmentQuestions: Question[] = [
  {
    id: 'assignorName',
    label: 'Assignor Full Name (Current Patent Owner)',
    type: 'text',
    required: true,
  },
  {
    id: 'assignorAddress',
    label: 'Assignor Address',
    type: 'textarea',
    required: true,
  },
  {
    id: 'assigneeName',
    label: 'Assignee Full Name (New Patent Owner)',
    type: 'text',
    required: true,
  },
  {
    id: 'assigneeAddress',
    label: 'Assignee Address',
    type: 'textarea',
    required: true,
  },
  {
    id: 'patentTitle',
    label: 'Patent Title',
    type: 'text',
    required: true,
    placeholder: 'Official title of the patent',
  },
  {
    id: 'patentNumber',
    label: 'Patent Number (if issued)',
    type: 'text',
    placeholder: 'e.g., US 10,123,456',
  },
  {
    id: 'applicationNumber',
    label: 'Application Serial Number',
    type: 'text',
    placeholder: 'e.g., 16/123,456',
  },
  {
    id: 'filingDate',
    label: 'Filing Date',
    type: 'date',
    placeholder: 'Date when patent application was filed',
  },
  {
    id: 'inventionDescription',
    label: 'Brief Description of Invention',
    type: 'textarea',
    required: true,
    placeholder: 'Describe what the patent covers',
  },
  {
    id: 'assignmentType',
    label: 'Type of Assignment',
    type: 'radio',
    required: true,
    options: [
      { value: 'full', label: 'Full Assignment (complete ownership transfer)' },
      { value: 'partial', label: 'Partial Assignment (partial ownership transfer)' },
    ],
  },
  {
    id: 'consideration',
    label: 'Consideration (Payment/Value)',
    type: 'text',
    required: true,
    placeholder: 'e.g., $10,000, employment agreement, other valuable consideration',
  },
  {
    id: 'assignmentDate',
    label: 'Date of Assignment',
    type: 'date',
    required: true,
  },
  {
    id: 'witnessName',
    label: 'Witness Name (Optional)',
    type: 'text',
    placeholder: 'Name of witness to the assignment',
  },
  {
    id: 'witnessAddress',
    label: 'Witness Address (Optional)',
    type: 'textarea',
    placeholder: 'Address of witness',
  },
  {
    id: 'notaryRequired',
    label: 'Notarization Required?',
    type: 'checkbox',
    placeholder: 'Check if notarization is needed',
  },
  {
    id: 'recordingRequested',
    label: 'Record with USPTO?',
    type: 'checkbox',
    placeholder: 'Check if you want to record this assignment with the USPTO',
  },
];