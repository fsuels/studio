// src/lib/documents/us/child-care-authorization-form/questions.ts
import type { FormQuestion } from '@/types/documents';

export const childCareAuthorizationFormQuestions: FormQuestion[] = [
  {
    id: 'parentName',
    type: 'text',
    label: 'Parent/Guardian Name',
    placeholder: 'Enter parent or guardian full name',
    required: true,
    group: 'parent',
  },
  {
    id: 'childName',
    type: 'text',
    label: 'Child Name',
    placeholder: 'Enter child full name',
    required: true,
    group: 'child',
  },
  {
    id: 'caregiverName',
    type: 'text',
    label: 'Authorized Caregiver Name',
    placeholder: 'Enter caregiver full name',
    required: true,
    group: 'caregiver',
  },
  {
    id: 'authorizationType',
    type: 'select',
    label: 'Authorization Type',
    options: [
      { value: 'temporary', label: 'Temporary Authorization' },
      { value: 'ongoing', label: 'Ongoing Authorization' },
      { value: 'emergency', label: 'Emergency Authorization' },
    ],
    required: false,
    group: 'authorization',
  },
  {
    id: 'medicalTreatmentAuthorization',
    type: 'boolean',
    label: 'Authorize medical treatment?',
    required: false,
    group: 'medical',
  },
  {
    id: 'emergencyMedicalCare',
    type: 'boolean',
    label: 'Authorize emergency medical care?',
    required: false,
    group: 'medical',
  },
];