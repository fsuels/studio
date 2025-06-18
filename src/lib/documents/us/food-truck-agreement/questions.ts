// src/lib/documents/us/food-truck-agreement/questions.ts
import type { FormQuestion } from '@/types/documents';

export const foodTruckAgreementQuestions: FormQuestion[] = [
  {
    id: 'operatorName',
    type: 'text',
    label: 'Food Truck Operator Name',
    placeholder: 'Enter operator name',
    required: true,
    group: 'operator',
  },
  {
    id: 'locationOwnerName',
    type: 'text',
    label: 'Location Owner Name',
    placeholder: 'Enter location owner name',
    required: true,
    group: 'location',
  },
  {
    id: 'operatingLocation',
    type: 'text',
    label: 'Operating Location',
    placeholder: 'Enter operating location address',
    required: false,
    group: 'location',
  },
  {
    id: 'foodType',
    type: 'select',
    label: 'Food Type',
    options: [
      { value: 'american', label: 'American' },
      { value: 'mexican', label: 'Mexican' },
      { value: 'asian', label: 'Asian' },
      { value: 'mediterranean', label: 'Mediterranean' },
      { value: 'bbq', label: 'BBQ' },
      { value: 'desserts', label: 'Desserts' },
      { value: 'mixed', label: 'Mixed Cuisine' },
    ],
    required: false,
    group: 'menu',
  },
  {
    id: 'operatingDays',
    type: 'text',
    label: 'Operating Days',
    placeholder: 'Enter operating days of the week',
    required: false,
    group: 'schedule',
  },
  {
    id: 'vendorFee',
    type: 'text',
    label: 'Vendor Fee',
    placeholder: 'Enter vendor fee amount',
    required: false,
    group: 'financial',
  },
];