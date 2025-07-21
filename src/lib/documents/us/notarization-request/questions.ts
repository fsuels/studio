// src/lib/documents/us/notarization-request/questions.ts
import type { FormQuestion } from '@/types/documents';

export const notarizationRequestQuestions: FormQuestion[] = [
  {
    id: 'requesterName',
    type: 'text',
    label: 'Requester Name',
    placeholder: 'Enter your full name',
    required: true,
    group: 'requester',
  },
  {
    id: 'documentType',
    type: 'text',
    label: 'Document Type',
    placeholder: 'e.g., Power of Attorney, Affidavit',
    required: true,
    group: 'document',
  },
  {
    id: 'signerName',
    type: 'text',
    label: 'Signer Name',
    placeholder: 'Enter person who will sign',
    required: true,
    group: 'signer',
  },
  {
    id: 'notarialActType',
    type: 'select',
    label: 'Notarial Act Type',
    options: [
      { value: 'acknowledgment', label: 'Acknowledgment' },
      { value: 'jurat', label: 'Jurat' },
      { value: 'oath', label: 'Oath' },
      { value: 'affirmation', label: 'Affirmation' },
      { value: 'signature-witnessing', label: 'Signature Witnessing' },
    ],
    required: true,
    group: 'notarial',
  },
  {
    id: 'appointmentLocation',
    type: 'select',
    label: 'Appointment Location',
    options: [
      { value: 'notary-office', label: 'Notary Office' },
      { value: 'client-location', label: 'Client Location' },
      { value: 'online', label: 'Online' },
    ],
    required: true,
    group: 'appointment',
  },
];
