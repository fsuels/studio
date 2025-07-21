import type { Question } from '@/types/documents';
import { usStates } from '@/lib/document-library/utils';

export const limitedPartnershipAgreementQuestions: Question[] = [
  {
    id: 'partnershipName',
    label: 'Limited Partnership Name',
    type: 'text',
    required: true,
    placeholder: 'e.g., Acme Investments, LP',
  },
  {
    id: 'partnershipAddress',
    label: 'Partnership Principal Address',
    type: 'textarea',
    required: true,
  },
  {
    id: 'businessPurpose',
    label: 'Business Purpose',
    type: 'textarea',
    required: true,
    placeholder:
      'Describe the business activities and purpose of the partnership',
  },
  {
    id: 'generalPartnerName',
    label: 'General Partner Name',
    type: 'text',
    required: true,
    placeholder: 'e.g., John Smith or ABC Management LLC',
  },
  {
    id: 'generalPartnerAddress',
    label: 'General Partner Address',
    type: 'textarea',
    required: true,
  },
  {
    id: 'generalPartnerContribution',
    label: 'General Partner Initial Contribution',
    type: 'textarea',
    required: true,
    placeholder: 'e.g., $50,000 cash, management services, equipment',
  },
  {
    id: 'limitedPartner1Name',
    label: 'Limited Partner 1 Name',
    type: 'text',
    required: true,
    placeholder: 'e.g., Alice Johnson',
  },
  {
    id: 'limitedPartner1Address',
    label: 'Limited Partner 1 Address',
    type: 'textarea',
    required: true,
  },
  {
    id: 'limitedPartner1Contribution',
    label: 'Limited Partner 1 Initial Contribution',
    type: 'text',
    required: true,
    placeholder: 'e.g., $100,000',
  },
  {
    id: 'limitedPartner1Percentage',
    label: 'Limited Partner 1 Ownership Percentage',
    type: 'text',
    required: true,
    placeholder: 'e.g., 75%',
  },
  {
    id: 'additionalLimitedPartners',
    label: 'Additional Limited Partners',
    type: 'textarea',
    placeholder:
      'List additional limited partners with their contributions and percentages',
  },
  {
    id: 'managementStructure',
    label: 'Management Structure',
    type: 'textarea',
    required: true,
    placeholder:
      'Describe how the partnership will be managed and decision-making authority',
  },
  {
    id: 'profitDistribution',
    label: 'Profit Distribution',
    type: 'textarea',
    required: true,
    placeholder: 'How profits will be distributed among partners',
  },
  {
    id: 'lossAllocation',
    label: 'Loss Allocation',
    type: 'textarea',
    required: true,
    placeholder: 'How losses will be allocated among partners',
  },
  {
    id: 'capitalAccounts',
    label: 'Capital Accounts Management',
    type: 'textarea',
    required: true,
    placeholder: 'How capital accounts will be maintained and adjusted',
  },
  {
    id: 'withdrawalRestrictions',
    label: 'Withdrawal Restrictions',
    type: 'textarea',
    placeholder:
      'Restrictions on partner withdrawals and capital distributions',
  },
  {
    id: 'transferRestrictions',
    label: 'Transfer Restrictions',
    type: 'textarea',
    placeholder: 'Restrictions on transferring partnership interests',
  },
  {
    id: 'dissolutionEvents',
    label: 'Dissolution Events',
    type: 'textarea',
    required: true,
    placeholder: 'Events that would trigger dissolution of the partnership',
  },
  {
    id: 'term',
    label: 'Partnership Term',
    type: 'text',
    required: true,
    placeholder: 'e.g., 10 years, or until dissolved',
  },
  {
    id: 'effectiveDate',
    label: 'Effective Date',
    type: 'date',
    required: true,
  },
  {
    id: 'state',
    label: 'Governing State Law',
    type: 'select',
    required: true,
    options: usStates.map((s) => ({ value: s.value, label: s.label })),
  },
];
