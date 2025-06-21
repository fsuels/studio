import type { Question } from '@/types/documents';
import { usStates } from '@/lib/document-library/utils';

export const questions: Question[] = [
  {
    id: 'landlord_name',
    label: "Landlord's Full Name or Company",
    required: true,
    type: 'text',
    placeholder: 'e.g., Acme Property Management',
  },
  {
    id: 'tenant_name',
    label: "Tenant's Full Name",
    required: true,
    type: 'text',
    placeholder: 'e.g., Jane Doe',
  },
  {
    id: 'property_address',
    label: 'Full Property Address (incl. unit #)',
    required: true,
    type: 'textarea',
    placeholder: 'e.g., 123 Main St, Unit 4B, Anytown, USA 12345',
  },
  {
    id: 'lease_start',
    label: 'Lease Start Date',
    required: true,
    type: 'date',
  },
  {
    id: 'lease_term',
    label: 'Lease Term (Months)',
    required: true,
    type: 'number',
    placeholder: 'e.g., 12',
  },
  {
    id: 'monthly_rent',
    label: 'Monthly Rent Amount ($)',
    required: true,
    type: 'number',
    placeholder: 'e.g., 1500',
  },
  {
    id: 'rent_due_date',
    label: 'Rent Due Date (e.g., 1st of month)',
    required: true,
    type: 'text',
    placeholder: 'e.g., 1st',
  },
  {
    id: 'security_deposit',
    label: 'Security Deposit Amount ($)',
    type: 'number',
    placeholder: 'e.g., 1500',
  },
  {
    id: 'pets_allowed',
    label: 'Are Pets Allowed?',
    type: 'select',
    required: true,
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
      { value: 'specific', label: 'Yes, with conditions' },
    ],
  },
  {
    id: 'pet_conditions',
    label: 'Pet Conditions (if allowed)',
    type: 'textarea',
    placeholder: 'e.g., One cat under 15 lbs allowed with $200 pet deposit.',
    required: false,
  },
  {
    id: 'late_fee_policy',
    label: 'Late Fee Policy (Optional)',
    type: 'textarea',
    placeholder: 'e.g., $50 fee if rent is more than 5 days late.',
    required: false,
  },
  {
    id: 'state',
    label: 'State Governing Lease',
    type: 'select',
    required: true,
    options: usStates.map((s) => ({ value: s.value, label: s.label })),
  },
];
