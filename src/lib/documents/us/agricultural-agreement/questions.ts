// src/lib/documents/us/agricultural-agreement/questions.ts
import type { FormQuestion } from '@/types/documents';

export const agriculturalAgreementQuestions: FormQuestion[] = [
  {
    id: 'landownerName',
    type: 'text',
    label: 'Landowner Name',
    placeholder: 'Enter landowner name',
    required: true,
    group: 'landowner',
  },
  {
    id: 'farmerName',
    type: 'text',
    label: 'Farmer/Operator Name',
    placeholder: 'Enter farmer name',
    required: true,
    group: 'farmer',
  },
  {
    id: 'propertyDescription',
    type: 'textarea',
    label: 'Property Description',
    placeholder: 'Describe the agricultural property',
    required: true,
    group: 'property',
  },
  {
    id: 'agreementType',
    type: 'select',
    label: 'Agreement Type',
    options: [
      { value: 'cash-rent', label: 'Cash Rent' },
      { value: 'crop-share', label: 'Crop Share' },
      { value: 'livestock-share', label: 'Livestock Share' },
      { value: 'custom-farming', label: 'Custom Farming' },
      { value: 'grazing', label: 'Grazing Agreement' },
    ],
    required: true,
    group: 'agreement',
  },
  {
    id: 'totalAcreage',
    type: 'text',
    label: 'Total Acreage',
    placeholder: 'Enter total acres',
    required: false,
    group: 'property',
  },
];
