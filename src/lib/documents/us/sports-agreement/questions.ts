// src/lib/documents/us/sports-agreement/questions.ts
import type { FormQuestion } from '@/types/documents';

export const sportsAgreementQuestions: FormQuestion[] = [
  {
    id: 'organizationName',
    type: 'text',
    label: 'Organization/Team Name',
    placeholder: 'Enter organization or team name',
    required: true,
    group: 'organization',
  },
  {
    id: 'athleteName',
    type: 'text',
    label: 'Athlete Name',
    placeholder: 'Enter athlete full name',
    required: true,
    group: 'athlete',
  },
  {
    id: 'sportType',
    type: 'text',
    label: 'Sport Type',
    placeholder: 'e.g., Basketball, Soccer, Tennis',
    required: true,
    group: 'sport',
  },
  {
    id: 'agreementType',
    type: 'select',
    label: 'Agreement Type',
    options: [
      { value: 'player-contract', label: 'Player Contract' },
      { value: 'coaching', label: 'Coaching Agreement' },
      { value: 'training', label: 'Training Agreement' },
      { value: 'facility-use', label: 'Facility Use' },
      { value: 'sponsorship', label: 'Sponsorship' },
    ],
    required: true,
    group: 'agreement',
  },
  {
    id: 'participationLevel',
    type: 'select',
    label: 'Participation Level',
    options: [
      { value: 'recreational', label: 'Recreational' },
      { value: 'competitive', label: 'Competitive' },
      { value: 'professional', label: 'Professional' },
    ],
    required: true,
    group: 'participation',
  },
  {
    id: 'isMinor',
    type: 'checkbox',
    label: 'Athlete is under 18 years old',
    required: false,
    group: 'athlete',
  },
];
