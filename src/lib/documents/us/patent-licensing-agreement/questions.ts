// src/lib/documents/us/patent-licensing-agreement/questions.ts
import type { FormQuestion } from '@/types/documents';

export const patentLicensingAgreementQuestions: FormQuestion[] = [
  {
    id: 'licensorName',
    type: 'text',
    label: 'Licensor Name',
    placeholder: 'Enter patent owner name',
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
    id: 'patentNumber',
    type: 'text',
    label: 'Patent Number',
    placeholder: 'Enter patent number',
    required: false,
    group: 'patent',
  },
  {
    id: 'licenseType',
    type: 'select',
    label: 'License Type',
    options: [
      { value: 'exclusive', label: 'Exclusive' },
      { value: 'non-exclusive', label: 'Non-Exclusive' },
      { value: 'sole', label: 'Sole License' },
      { value: 'co-exclusive', label: 'Co-Exclusive' },
    ],
    required: false,
    group: 'license',
  },
  {
    id: 'territorialScope',
    type: 'select',
    label: 'Territorial Scope',
    options: [
      { value: 'worldwide', label: 'Worldwide' },
      { value: 'usa', label: 'United States' },
      { value: 'north-america', label: 'North America' },
      { value: 'specific-countries', label: 'Specific Countries' },
    ],
    required: false,
    group: 'scope',
  },
  {
    id: 'royaltyRate',
    type: 'text',
    label: 'Royalty Rate (%)',
    placeholder: 'Enter royalty percentage',
    required: false,
    group: 'financial',
  },
];
