import type { Question } from '@/types/documents';

export const questions: Question[] = [
  {
    id: 'declarantName',
    label: 'Your Full Name',
    type: 'text',
    required: true,
  },
  {
    id: 'declarantAddress',
    label: 'Your Full Address',
    type: 'textarea',
    required: true,
  },
  {
    id: 'lifeSustainPreference',
    label: 'Life-Sustaining Treatment Preference',
    type: 'select',
    required: true,
    options: [
      { value: 'withdraw', label: 'Withdraw all life-sustaining treatment' },
      { value: 'continue', label: 'Continue all life-sustaining treatment' },
      { value: 'limited', label: 'Limited life-sustaining treatment' },
    ],
  },
  {
    id: 'nutritionHydrationPreference',
    label: 'Artificial Nutrition and Hydration Preference',
    type: 'select',
    required: true,
    options: [
      {
        value: 'withdraw',
        label: 'Withdraw artificial nutrition and hydration',
      },
      {
        value: 'continue',
        label: 'Continue artificial nutrition and hydration',
      },
      { value: 'limited', label: 'Limited artificial nutrition and hydration' },
    ],
  },
  {
    id: 'painManagementPreference',
    label: 'Pain Management Preferences',
    type: 'textarea',
    required: true,
    placeholder:
      'Describe your preferences for pain management and comfort care',
  },
  {
    id: 'organDonation',
    label: 'Organ Donation Preference',
    type: 'select',
    options: [
      { value: 'yes', label: 'Yes, donate all organs and tissues' },
      { value: 'no', label: 'No, do not donate organs or tissues' },
      { value: 'specific', label: 'Specific organs/tissues only' },
    ],
  },
  {
    id: 'organDonationDetails',
    label: 'Organ Donation Details (if specific)',
    type: 'textarea',
    placeholder: 'Specify which organs or tissues you wish to donate',
  },
  {
    id: 'additionalWishes',
    label: 'Additional End-of-Life Wishes',
    type: 'textarea',
    placeholder: 'Any other preferences or instructions for your care',
  },
];
