// src/lib/documents/us/business-plan/questions.ts
import type { FormQuestion } from '@/types/documents';

export const businessPlanQuestions: FormQuestion[] = [
  {
    id: 'businessName',
    type: 'text',
    label: 'Business Name',
    placeholder: 'Enter business name',
    required: true,
    section: 'Executive Summary',
  },
  {
    id: 'businessType',
    type: 'select',
    label: 'Business Type',
    options: [
      { value: 'sole_proprietorship', label: 'Sole Proprietorship' },
      { value: 'partnership', label: 'Partnership' },
      { value: 'llc', label: 'LLC' },
      { value: 'corporation', label: 'Corporation' },
    ],
    required: true,
    section: 'Executive Summary',
  },
  {
    id: 'businessLocation',
    type: 'address',
    label: 'Business Location',
    required: true,
    section: 'Executive Summary',
  },
  {
    id: 'missionStatement',
    type: 'textarea',
    label: 'Mission Statement',
    required: true,
    section: 'Executive Summary',
  },
  {
    id: 'productsServices',
    type: 'textarea',
    label: 'Products/Services Description',
    required: true,
    section: 'Products/Services',
  },
  {
    id: 'targetMarket',
    type: 'textarea',
    label: 'Target Market',
    required: true,
    section: 'Market Analysis',
  },
  {
    id: 'competitiveAdvantage',
    type: 'textarea',
    label: 'Competitive Advantage',
    required: true,
    section: 'Market Analysis',
  },
  {
    id: 'marketingStrategy',
    type: 'textarea',
    label: 'Marketing Strategy',
    required: true,
    section: 'Marketing Strategy',
  },
  {
    id: 'managementTeam',
    type: 'textarea',
    label: 'Management Team',
    required: true,
    section: 'Operations',
  },
];
