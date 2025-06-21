// src/lib/documents/us/telemedicine-agreement/questions.ts
import type { FormQuestion } from '@/types/documents';

export const telemedicineAgreementQuestions: FormQuestion[] = [
  {
    id: 'providerName',
    type: 'text',
    label: 'Healthcare Provider Name',
    placeholder: 'Enter provider name',
    required: true,
    group: 'provider',
  },
  {
    id: 'patientName',
    type: 'text',
    label: 'Patient Name',
    placeholder: 'Enter patient name',
    required: true,
    group: 'patient',
  },
  {
    id: 'serviceType',
    type: 'select',
    label: 'Service Type',
    options: [
      { value: 'consultation', label: 'Consultation' },
      { value: 'diagnosis', label: 'Diagnosis' },
      { value: 'treatment', label: 'Treatment' },
      { value: 'follow-up', label: 'Follow-up' },
      { value: 'prescription', label: 'Prescription' },
      { value: 'monitoring', label: 'Monitoring' },
    ],
    required: false,
    group: 'services',
  },
  {
    id: 'consultationType',
    type: 'select',
    label: 'Consultation Type',
    options: [
      { value: 'video', label: 'Video Call' },
      { value: 'phone', label: 'Phone Call' },
      { value: 'chat', label: 'Text Chat' },
      { value: 'hybrid', label: 'Hybrid' },
    ],
    required: false,
    group: 'services',
  },
  {
    id: 'consultationFee',
    type: 'text',
    label: 'Consultation Fee',
    placeholder: 'Enter consultation fee',
    required: false,
    group: 'payment',
  },
];
