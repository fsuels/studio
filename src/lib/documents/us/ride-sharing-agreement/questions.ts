// src/lib/documents/us/ride-sharing-agreement/questions.ts
import type { FormQuestion } from '@/types/documents';

export const rideSharingAgreementQuestions: FormQuestion[] = [
  {
    id: 'driverName',
    type: 'text',
    label: 'Driver Name',
    placeholder: 'Enter driver name',
    required: true,
    group: 'driver',
  },
  {
    id: 'passengerName',
    type: 'text',
    label: 'Passenger Name',
    placeholder: 'Enter passenger name',
    required: true,
    group: 'passenger',
  },
  {
    id: 'tripType',
    type: 'select',
    label: 'Trip Type',
    options: [
      { value: 'one-time', label: 'One-Time Trip' },
      { value: 'recurring', label: 'Recurring Trips' },
      { value: 'daily-commute', label: 'Daily Commute' },
      { value: 'occasional', label: 'Occasional' },
    ],
    required: false,
    group: 'trip',
  },
  {
    id: 'pickupLocation',
    type: 'text',
    label: 'Pickup Location',
    placeholder: 'Enter pickup address',
    required: false,
    group: 'trip',
  },
  {
    id: 'dropoffLocation',
    type: 'text',
    label: 'Drop-off Location',
    placeholder: 'Enter drop-off address',
    required: false,
    group: 'trip',
  },
  {
    id: 'passengerContribution',
    type: 'text',
    label: 'Passenger Contribution',
    placeholder: 'Enter passenger cost share',
    required: false,
    group: 'costs',
  },
  {
    id: 'costSharingMethod',
    type: 'select',
    label: 'Cost Sharing Method',
    options: [
      { value: 'per-trip', label: 'Per Trip' },
      { value: 'weekly', label: 'Weekly' },
      { value: 'monthly', label: 'Monthly' },
      { value: 'per-mile', label: 'Per Mile' },
      { value: 'gas-only', label: 'Gas Only' },
    ],
    required: false,
    group: 'costs',
  },
];