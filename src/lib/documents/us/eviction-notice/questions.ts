import type { Question } from '@/types/documents';
import { usStates } from '@/lib/document-library/utils';

export const questions: Question[] = [
  {
    id: 'landlordName',
    label: 'Landlord Name',
    type: 'text',
    required: true,
  },
  {
    id: 'tenantName',
    label: 'Tenant Name',
    type: 'text',
    required: true,
  },
  {
    id: 'propertyAddress',
    label: 'Property Address',
    type: 'textarea',
    required: true,
  },
  {
    id: 'reasonForEviction',
    label: 'Reason for Eviction',
    type: 'select',
    required: true,
    options: [
      { value: 'nonpayment', label: 'Non-payment of Rent' },
      { value: 'leaseViolation', label: 'Lease Violation' },
      { value: 'endOfTerm', label: 'End of Lease Term' },
      { value: 'other', label: 'Other (Specify)' },
    ],
  },
  {
    id: 'reasonDetails',
    label: 'Details of Reason (if violation or other)',
    type: 'textarea',
  },
  {
    id: 'noticeDate',
    label: 'Date Notice Given',
    type: 'date',
    required: true,
  },
  {
    id: 'vacateDate',
    label: 'Date Tenant Must Vacate By',
    type: 'date',
    required: true,
  },
  {
    id: 'state',
    label: 'State Governing Lease',
    type: 'select',
    required: true,
    options: usStates.map((s) => ({ value: s.value, label: s.label })),
  },
];
