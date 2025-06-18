// src/lib/documents/us/cybersecurity-agreement/questions.ts
import type { FormQuestion } from '@/types/documents';

export const cybersecurityAgreementQuestions: FormQuestion[] = [
  {
    id: 'providerName',
    type: 'text',
    label: 'Security Provider Name',
    placeholder: 'Enter cybersecurity provider name',
    required: true,
    group: 'provider',
  },
  {
    id: 'clientName',
    type: 'text',
    label: 'Client Name',
    placeholder: 'Enter client name',
    required: true,
    group: 'client',
  },
  {
    id: 'securityAssessment',
    type: 'boolean',
    label: 'Security assessment included?',
    required: false,
    group: 'services',
  },
  {
    id: 'penetrationTesting',
    type: 'boolean',
    label: 'Penetration testing included?',
    required: false,
    group: 'services',
  },
  {
    id: 'incidentResponse',
    type: 'boolean',
    label: 'Incident response included?',
    required: false,
    group: 'services',
  },
  {
    id: 'totalCost',
    type: 'text',
    label: 'Total Cost',
    placeholder: 'Enter total cost',
    required: false,
    group: 'financial',
  },
];