// src/lib/documents/us/auto-repair-agreement/questions.ts
import type { FormQuestion } from '@/types/documents';

export const autoRepairAgreementQuestions: FormQuestion[] = [
  {
    id: 'shopName',
    type: 'text',
    label: 'Auto Repair Shop Name',
    placeholder: 'Enter shop name',
    required: true,
    group: 'shop',
  },
  {
    id: 'shopAddress',
    type: 'text',
    label: 'Shop Address',
    placeholder: 'Enter complete shop address',
    required: true,
    group: 'shop',
  },
  {
    id: 'customerName',
    type: 'text',
    label: 'Customer Name',
    placeholder: 'Enter customer full name',
    required: true,
    group: 'customer',
  },
  {
    id: 'vehicleYear',
    type: 'text',
    label: 'Vehicle Year',
    placeholder: 'e.g., 2020',
    required: true,
    group: 'vehicle',
  },
  {
    id: 'vehicleMake',
    type: 'text',
    label: 'Vehicle Make',
    placeholder: 'e.g., Toyota',
    required: true,
    group: 'vehicle',
  },
  {
    id: 'vehicleModel',
    type: 'text',
    label: 'Vehicle Model',
    placeholder: 'e.g., Camry',
    required: true,
    group: 'vehicle',
  },
  {
    id: 'repairDescription',
    type: 'textarea',
    label: 'Repair Description',
    placeholder: 'Describe the repair work needed',
    required: true,
    group: 'repair',
  },
];
