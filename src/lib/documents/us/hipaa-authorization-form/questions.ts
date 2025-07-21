// src/lib/documents/us/hipaa-authorization-form/questions.ts
import type { FormQuestion } from '@/types/documents';

export const hipaaAuthorizationFormQuestions: FormQuestion[] = [
  {
    id: 'patientName',
    type: 'text',
    label: 'Patient Name',
    placeholder: 'Enter patient full name',
    required: true,
    group: 'patient',
  },
  {
    id: 'patientDateOfBirth',
    type: 'text',
    label: 'Patient Date of Birth',
    placeholder: 'MM/DD/YYYY',
    required: true,
    group: 'patient',
  },
  {
    id: 'releasingProviderName',
    type: 'text',
    label: 'Healthcare Provider Releasing Information',
    placeholder: 'Enter provider or facility name',
    required: true,
    group: 'provider',
  },
  {
    id: 'recipientName',
    type: 'text',
    label: 'Recipient Name',
    placeholder: 'Who will receive the information',
    required: true,
    group: 'recipient',
  },
  {
    id: 'purposeDescription',
    type: 'textarea',
    label: 'Purpose of Disclosure',
    placeholder: 'Explain why the information is being released',
    required: true,
    group: 'purpose',
  },
];
