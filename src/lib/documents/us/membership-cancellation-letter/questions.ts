// src/lib/documents/us/membership-cancellation-letter/questions.ts
import type { FormQuestion } from '@/types/documents';

export const membershipCancellationLetterQuestions: FormQuestion[] = [
  {
    id: 'memberName',
    type: 'text',
    label: 'Member Name',
    placeholder: 'Enter your name as it appears on membership',
    required: true,
    group: 'member',
  },
  {
    id: 'organizationName',
    type: 'text',
    label: 'Organization Name',
    placeholder: 'Enter gym, club, or service name',
    required: false,
    group: 'organization',
  },
  {
    id: 'membershipNumber',
    type: 'text',
    label: 'Membership Number',
    placeholder: 'Enter membership ID or account number',
    required: false,
    group: 'membership',
  },
  {
    id: 'cancellationDate',
    type: 'text',
    label: 'Desired Cancellation Date',
    placeholder: 'Enter when you want membership to end',
    required: false,
    group: 'cancellation',
  },
  {
    id: 'reasonForCancellation',
    type: 'textarea',
    label: 'Reason for Cancellation',
    placeholder: 'Briefly explain why you are canceling',
    required: false,
    group: 'cancellation',
  },
];
