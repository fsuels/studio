// src/lib/documents/us/warehouse-agreement/questions.ts
import type { FormQuestion } from '@/types/documents';

export const warehouseAgreementQuestions: FormQuestion[] = [
  {
    id: 'warehouseName',
    type: 'text',
    label: 'Warehouse Provider Name',
    placeholder: 'Enter warehouse company name',
    required: true,
    group: 'warehouse',
  },
  {
    id: 'clientName',
    type: 'text',
    label: 'Client Name',
    placeholder: 'Enter client company name',
    required: true,
    group: 'client',
  },
  {
    id: 'storageType',
    type: 'select',
    label: 'Storage Type',
    options: [
      { value: 'general', label: 'General Storage' },
      { value: 'refrigerated', label: 'Refrigerated' },
      { value: 'frozen', label: 'Frozen' },
      { value: 'hazardous', label: 'Hazardous Materials' },
      { value: 'pharmaceutical', label: 'Pharmaceutical' },
    ],
    required: false,
    group: 'storage',
  },
  {
    id: 'storageSpace',
    type: 'text',
    label: 'Storage Space Required',
    placeholder: 'Enter square footage or pallet positions',
    required: false,
    group: 'storage',
  },
  {
    id: 'orderFulfillment',
    type: 'boolean',
    label: 'Order fulfillment services?',
    required: false,
    group: 'services',
  },
  {
    id: 'contractTerm',
    type: 'text',
    label: 'Contract Term',
    placeholder: 'Enter contract duration',
    required: false,
    group: 'terms',
  },
];
