// src/lib/documents/us/software-license-agreement/questions.ts
import type { FormQuestion } from '@/types/documents';

export const softwareLicenseAgreementQuestions: FormQuestion[] = [
  {
    id: 'licensorName',
    type: 'text',
    label: 'Licensor Name',
    placeholder: 'Enter software company name',
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
    id: 'softwareName',
    type: 'text',
    label: 'Software Name',
    placeholder: 'Enter software application name',
    required: true,
    group: 'software',
  },
  {
    id: 'softwareDescription',
    type: 'textarea',
    label: 'Software Description',
    placeholder: 'Describe the software functionality',
    required: true,
    group: 'software',
  },
  {
    id: 'licenseType',
    type: 'select',
    label: 'License Type',
    options: [
      { value: 'perpetual', label: 'Perpetual' },
      { value: 'subscription', label: 'Subscription' },
      { value: 'trial', label: 'Trial' },
      { value: 'educational', label: 'Educational' },
      { value: 'enterprise', label: 'Enterprise' },
    ],
    required: true,
    group: 'license',
  },
  {
    id: 'licenseScope',
    type: 'select',
    label: 'License Scope',
    options: [
      { value: 'single-user', label: 'Single User' },
      { value: 'multi-user', label: 'Multi User' },
      { value: 'site-license', label: 'Site License' },
      { value: 'enterprise', label: 'Enterprise' },
    ],
    required: true,
    group: 'license',
  },
];
