// src/lib/documents/us/transportation-service-agreement/questions.ts
import type { FormQuestion } from '@/types/documents';

export const transportationServiceAgreementQuestions: FormQuestion[] = [
  {
    id: 'providerName',
    type: 'text',
    label: 'Service Provider Name',
    placeholder: 'Enter provider name',
    required: true,
    group: 'provider',
  },
  {
    id: 'clientName',
    type: 'text',
    label: 'Client Name',
    placeholder: 'Enter client name',
    required: true,
    group: 'client',
  },
  {
    id: 'serviceType',
    type: 'select',
    label: 'Service Type',
    options: [
      { value: 'delivery', label: 'Delivery' },
      { value: 'passenger', label: 'Passenger' },
      { value: 'freight', label: 'Freight' },
      { value: 'moving', label: 'Moving' },
      { value: 'courier', label: 'Courier' },
    ],
    required: true,
    group: 'service',
  },
  {
    id: 'serviceDescription',
    type: 'textarea',
    label: 'Service Description',
    placeholder: 'Describe transportation services',
    required: true,
    group: 'service',
  },
  {
    id: 'pricingModel',
    type: 'select',
    label: 'Pricing Model',
    options: [
      { value: 'per-mile', label: 'Per Mile' },
      { value: 'hourly', label: 'Hourly' },
      { value: 'flat-rate', label: 'Flat Rate' },
      { value: 'per-delivery', label: 'Per Delivery' },
    ],
    required: true,
    group: 'pricing',
  },
];
