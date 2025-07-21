// src/lib/documents/us/licensing-agreement-general/questions.ts
import type { FormQuestion } from '@/types/documents';

export const licensingAgreementGeneralQuestions: FormQuestion[] = [
  {
    id: 'licensorName',
    type: 'text',
    label: 'Licensor Name',
    placeholder: 'Enter licensor name',
    required: true,
    group: 'licensor',
  },
  {
    id: 'licenseeName',
    type: 'text',
    label: 'Licensee Name',
    placeholder: 'Enter licensee name',
    required: true,
    group: 'licensee',
  },
  {
    id: 'propertyType',
    type: 'select',
    label: 'Property Type',
    options: [
      { value: 'patent', label: 'Patent' },
      { value: 'trademark', label: 'Trademark' },
      { value: 'copyright', label: 'Copyright' },
      { value: 'trade-secret', label: 'Trade Secret' },
      { value: 'know-how', label: 'Know-how' },
      { value: 'technology', label: 'Technology' },
    ],
    required: true,
    group: 'property',
  },
  {
    id: 'propertyDescription',
    type: 'textarea',
    label: 'Property Description',
    placeholder: 'Describe the licensed property',
    required: true,
    group: 'property',
  },
  {
    id: 'licenseType',
    type: 'select',
    label: 'License Type',
    options: [
      { value: 'exclusive', label: 'Exclusive' },
      { value: 'non-exclusive', label: 'Non-Exclusive' },
      { value: 'sole', label: 'Sole' },
    ],
    required: true,
    group: 'license',
  },
];
