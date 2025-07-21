// src/lib/documents/us/app-development-agreement/questions.ts
import type { FormQuestion } from '@/types/documents';

export const appDevelopmentAgreementQuestions: FormQuestion[] = [
  {
    id: 'clientName',
    type: 'text',
    label: 'Client Name',
    placeholder: 'Enter client name',
    required: true,
    group: 'client',
  },
  {
    id: 'developerName',
    type: 'text',
    label: 'Developer Name',
    placeholder: 'Enter developer name',
    required: true,
    group: 'developer',
  },
  {
    id: 'projectName',
    type: 'text',
    label: 'Project Name',
    placeholder: 'Enter app/project name',
    required: true,
    group: 'project',
  },
  {
    id: 'appType',
    type: 'select',
    label: 'App Type',
    options: [
      { value: 'mobile-ios', label: 'iOS Mobile App' },
      { value: 'mobile-android', label: 'Android Mobile App' },
      { value: 'mobile-cross-platform', label: 'Cross-Platform Mobile App' },
      { value: 'web-app', label: 'Web Application' },
      { value: 'progressive-web-app', label: 'Progressive Web App' },
    ],
    required: false,
    group: 'project',
  },
  {
    id: 'totalProjectCost',
    type: 'text',
    label: 'Total Project Cost',
    placeholder: 'Enter total cost',
    required: false,
    group: 'financial',
  },
  {
    id: 'paymentStructure',
    type: 'select',
    label: 'Payment Structure',
    options: [
      { value: 'fixed-price', label: 'Fixed Price' },
      { value: 'hourly', label: 'Hourly Rate' },
      { value: 'milestone-based', label: 'Milestone Based' },
      { value: 'retainer', label: 'Retainer' },
    ],
    required: false,
    group: 'financial',
  },
];
