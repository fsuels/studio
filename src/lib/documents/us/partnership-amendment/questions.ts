import type { Question } from '@/types/documents';
import { usStates } from '@/lib/document-library/utils';

export const partnershipAmendmentQuestions: Question[] = [
  {
    id: 'originalPartnershipName',
    label: 'Original Partnership Name',
    type: 'text',
    required: true,
    placeholder: 'e.g., Smith & Johnson Partnership',
  },
  {
    id: 'originalAgreementDate',
    label: 'Original Agreement Date',
    type: 'date',
    required: true,
  },
  {
    id: 'partnerNames',
    label: 'All Current Partners',
    type: 'textarea',
    required: true,
    placeholder: 'List all current partners who are party to this amendment',
  },
  {
    id: 'amendmentType',
    label: 'Type of Amendment',
    type: 'select',
    required: true,
    options: [
      { value: 'ownership_change', label: 'Ownership/Equity Change' },
      { value: 'profit_sharing', label: 'Profit Sharing Modification' },
      { value: 'management_change', label: 'Management Structure Change' },
      { value: 'capital_contribution', label: 'Capital Contribution Change' },
      { value: 'name_change', label: 'Partnership Name Change' },
      { value: 'other', label: 'Other Amendment' },
    ],
  },
  {
    id: 'amendmentDescription',
    label: 'Amendment Description',
    type: 'textarea',
    required: true,
    placeholder: 'Briefly describe what is being amended in the partnership agreement',
  },
  {
    id: 'specificChanges',
    label: 'Specific Changes',
    type: 'textarea',
    required: true,
    placeholder: 'Detail the exact changes being made to the original agreement',
  },
  {
    id: 'effectiveDate',
    label: 'Amendment Effective Date',
    type: 'date',
    required: true,
  },
  {
    id: 'newPartnerInfo',
    label: 'New Partner Information (if applicable)',
    type: 'textarea',
    placeholder: 'If adding a new partner, provide their name, address, and contribution',
  },
  {
    id: 'departingPartnerInfo',
    label: 'Departing Partner Information (if applicable)',
    type: 'textarea',
    placeholder: 'If a partner is leaving, provide their name and terms of departure',
  },
  {
    id: 'capitalAdjustments',
    label: 'Capital Account Adjustments',
    type: 'textarea',
    placeholder: 'Any adjustments to partner capital accounts',
  },
  {
    id: 'profitSharingChanges',
    label: 'Profit Sharing Changes',
    type: 'textarea',
    placeholder: 'Changes to how profits and losses are shared',
  },
  {
    id: 'managementChanges',
    label: 'Management Changes',
    type: 'textarea',
    placeholder: 'Changes to management roles and decision-making authority',
  },
  {
    id: 'otherProvisions',
    label: 'Other Provisions',
    type: 'textarea',
    placeholder: 'Any other amendments or provisions not covered above',
  },
  {
    id: 'partnerApproval',
    label: 'All Partners Approve This Amendment',
    type: 'checkbox',
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