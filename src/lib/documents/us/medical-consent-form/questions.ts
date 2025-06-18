// src/lib/documents/us/medical-consent-form/questions.ts
import type { FormQuestion } from '@/types/documents';

export const medicalConsentFormQuestions: FormQuestion[] = [
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
    id: 'isMinor',
    type: 'checkbox',
    label: 'Patient is a minor',
    required: false,
    group: 'patient',
  },
  {
    id: 'guardianName',
    type: 'text',
    label: 'Guardian Name',
    placeholder: 'Enter guardian name if patient is minor',
    required: false,
    group: 'guardian',
  },
  {
    id: 'providerName',
    type: 'text',
    label: 'Healthcare Provider Name',
    placeholder: 'Enter doctor or provider name',
    required: true,
    group: 'provider',
  },
  {
    id: 'treatmentDescription',
    type: 'textarea',
    label: 'Treatment Description',
    placeholder: 'Describe the medical treatment or procedure',
    required: true,
    group: 'treatment',
  },
];