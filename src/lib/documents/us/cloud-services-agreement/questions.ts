// src/lib/documents/us/cloud-services-agreement/questions.ts
import type { FormQuestion } from '@/types/documents';

export const cloudServicesAgreementQuestions: FormQuestion[] = [
  {
    id: 'providerName',
    type: 'text',
    label: 'Cloud Provider Name',
    placeholder: 'Enter provider company name',
    required: true,
    group: 'provider',
  },
  {
    id: 'customerName',
    type: 'text',
    label: 'Customer Name',
    placeholder: 'Enter customer name',
    required: true,
    group: 'customer',
  },
  {
    id: 'serviceType',
    type: 'select',
    label: 'Service Type',
    options: [
      { value: 'iaas', label: 'Infrastructure as a Service (IaaS)' },
      { value: 'paas', label: 'Platform as a Service (PaaS)' },
      { value: 'saas', label: 'Software as a Service (SaaS)' },
      { value: 'hybrid', label: 'Hybrid Cloud' },
      { value: 'other', label: 'Other' },
    ],
    required: false,
    group: 'service',
  },
  {
    id: 'uptimeGuarantee',
    type: 'text',
    label: 'Uptime Guarantee',
    placeholder: 'Enter uptime percentage (e.g., 99.9%)',
    required: false,
    group: 'sla',
  },
  {
    id: 'monthlyFee',
    type: 'text',
    label: 'Monthly Fee',
    placeholder: 'Enter monthly service fee',
    required: false,
    group: 'pricing',
  },
];
