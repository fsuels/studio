// src/lib/documents/us/lottery-pool-contract/questions.ts
import type { FormQuestion } from '@/types/documents';

export const lotteryPoolContractQuestions: FormQuestion[] = [
  {
    id: 'administratorName',
    type: 'text',
    label: 'Pool Administrator Name',
    placeholder: 'Enter name of person managing the pool',
    required: true,
    group: 'administrator',
  },
  {
    id: 'lotteryGame',
    type: 'text',
    label: 'Lottery Game',
    placeholder: 'Enter name of lottery game (e.g., Powerball)',
    required: false,
    group: 'pool',
  },
  {
    id: 'poolContribution',
    type: 'text',
    label: 'Individual Contribution',
    placeholder: 'Enter amount each person contributes',
    required: false,
    group: 'pool',
  },
  {
    id: 'participantNames',
    type: 'textarea',
    label: 'Pool Participants',
    placeholder: 'List all pool members',
    required: false,
    group: 'participants',
  },
  {
    id: 'winningsDistribution',
    type: 'select',
    label: 'Winnings Distribution',
    options: [
      { value: 'equal-shares', label: 'Equal Shares' },
      { value: 'proportional', label: 'Proportional to Contribution' },
      { value: 'contribution-based', label: 'Based on Contribution Amount' },
    ],
    required: false,
    group: 'winnings',
  },
];