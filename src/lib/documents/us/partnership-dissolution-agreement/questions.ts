import type { Question } from '@/types/documents';
import { usStates } from '@/lib/document-library/utils';

export const partnershipDissolutionAgreementQuestions: Question[] = [
  {
    id: 'partnershipName',
    label: 'Partnership Name',
    type: 'text',
    required: true,
    placeholder: 'e.g., Smith & Johnson Partnership',
  },
  {
    id: 'originalAgreementDate',
    label: 'Original Partnership Agreement Date',
    type: 'date',
    required: true,
  },
  {
    id: 'partnerNames',
    label: 'All Partners',
    type: 'textarea',
    required: true,
    placeholder: 'List all partners involved in the dissolution',
  },
  {
    id: 'dissolutionReason',
    label: 'Reason for Dissolution',
    type: 'select',
    required: true,
    options: [
      { value: 'mutual_agreement', label: 'Mutual Agreement' },
      { value: 'expiration', label: 'Partnership Term Expiration' },
      { value: 'partner_withdrawal', label: 'Partner Withdrawal' },
      { value: 'breach', label: 'Breach of Agreement' },
      { value: 'bankruptcy', label: 'Bankruptcy' },
      { value: 'death', label: 'Death of Partner' },
      { value: 'other', label: 'Other' },
    ],
  },
  {
    id: 'dissolutionDate',
    label: 'Dissolution Date',
    type: 'date',
    required: true,
  },
  {
    id: 'businessAssets',
    label: 'Business Assets',
    type: 'textarea',
    required: true,
    placeholder:
      'List all partnership assets including cash, inventory, equipment, real estate, etc.',
  },
  {
    id: 'businessLiabilities',
    label: 'Business Liabilities',
    type: 'textarea',
    required: true,
    placeholder:
      'List all partnership debts, loans, obligations, and liabilities',
  },
  {
    id: 'assetDistribution',
    label: 'Asset Distribution Plan',
    type: 'textarea',
    required: true,
    placeholder:
      'How assets will be distributed among partners after liquidation',
  },
  {
    id: 'liabilityAllocation',
    label: 'Liability Allocation',
    type: 'textarea',
    required: true,
    placeholder: 'How liabilities and debts will be allocated among partners',
  },
  {
    id: 'liquidationProcess',
    label: 'Liquidation Process',
    type: 'textarea',
    required: true,
    placeholder: 'Process for liquidating assets and paying creditors',
  },
  {
    id: 'continuingObligations',
    label: 'Continuing Obligations',
    type: 'textarea',
    placeholder: 'Any ongoing obligations that survive dissolution',
  },
  {
    id: 'nonCompeteTerms',
    label: 'Non-Compete Terms',
    type: 'textarea',
    placeholder: 'Any restrictions on partners competing after dissolution',
  },
  {
    id: 'confidentialityTerms',
    label: 'Confidentiality Terms',
    type: 'textarea',
    placeholder:
      'Ongoing confidentiality obligations for trade secrets, client lists, etc.',
  },
  {
    id: 'finalAccounting',
    label: 'Final Accounting',
    type: 'textarea',
    required: true,
    placeholder:
      'Process for final accounting and settlement of partner accounts',
  },
  {
    id: 'releaseClaims',
    label: 'Release of Claims',
    type: 'checkbox',
    required: true,
  },
  {
    id: 'disputeResolution',
    label: 'Dispute Resolution Method',
    type: 'select',
    required: true,
    options: [
      { value: 'mediation', label: 'Mediation' },
      { value: 'arbitration', label: 'Arbitration' },
      { value: 'litigation', label: 'Court Litigation' },
    ],
  },
  {
    id: 'effectiveDate',
    label: 'Agreement Effective Date',
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
