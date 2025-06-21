// src/lib/documents/us/royalty-agreement/questions.ts
import type { Question } from '@/types/documents';

export const royaltyAgreementQuestions: Question[] = [
  {
    id: 'licensorName',
    label: 'Licensor Full Name/Company (Rights Owner)',
    type: 'text',
    required: true,
  },
  {
    id: 'licensorAddress',
    label: 'Licensor Address',
    type: 'textarea',
    required: true,
  },
  {
    id: 'licenseeName',
    label: 'Licensee Full Name/Company (Rights User)',
    type: 'text',
    required: true,
  },
  {
    id: 'licenseeAddress',
    label: 'Licensee Address',
    type: 'textarea',
    required: true,
  },
  {
    id: 'intellectualProperty',
    label: 'Description of Intellectual Property',
    type: 'textarea',
    required: true,
    placeholder:
      'Describe the IP being licensed (patent, trademark, copyright, etc.)',
  },
  {
    id: 'royaltyRate',
    label: 'Royalty Rate',
    type: 'text',
    required: true,
    placeholder: 'e.g., 5%, $2 per unit, 10% of net sales',
  },
  {
    id: 'royaltyBase',
    label: 'Royalty Base',
    type: 'radio',
    required: true,
    options: [
      { value: 'net-sales', label: 'Net Sales' },
      { value: 'gross-sales', label: 'Gross Sales' },
      { value: 'units', label: 'Units Sold' },
      { value: 'revenue', label: 'Total Revenue' },
    ],
  },
  {
    id: 'minimumRoyalty',
    label: 'Minimum Royalty (Optional)',
    type: 'text',
    placeholder: 'Minimum payment amount per period',
  },
  {
    id: 'paymentSchedule',
    label: 'Payment Schedule',
    type: 'radio',
    required: true,
    options: [
      { value: 'monthly', label: 'Monthly' },
      { value: 'quarterly', label: 'Quarterly' },
      { value: 'annually', label: 'Annually' },
      { value: 'other', label: 'Other' },
    ],
  },
  {
    id: 'territoryScope',
    label: 'Territory/Geographic Scope',
    type: 'text',
    required: true,
    placeholder: 'e.g., United States, Worldwide, North America',
  },
  {
    id: 'termDuration',
    label: 'Agreement Duration',
    type: 'text',
    required: true,
    placeholder: 'e.g., 5 years, until patent expiration',
  },
  {
    id: 'effectiveDate',
    label: 'Effective Date',
    type: 'date',
    required: true,
  },
  {
    id: 'exclusiveRights',
    label: 'Exclusive Rights?',
    type: 'checkbox',
    placeholder: 'Licensee has exclusive rights',
  },
  {
    id: 'auditRights',
    label: 'Audit Rights?',
    type: 'checkbox',
    placeholder: 'Licensor can audit licensee records',
  },
  {
    id: 'terminationClause',
    label: 'Termination Conditions (Optional)',
    type: 'textarea',
    placeholder: 'Conditions under which agreement can be terminated',
  },
];
