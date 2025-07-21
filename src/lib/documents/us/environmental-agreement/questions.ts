// src/lib/documents/us/environmental-agreement/questions.ts
import type { FormQuestion } from '@/types/documents';

export const environmentalAgreementQuestions: FormQuestion[] = [
  {
    id: 'primaryPartyName',
    type: 'text',
    label: 'Primary Party Name',
    placeholder: 'Enter primary party name',
    required: true,
    group: 'parties',
  },
  {
    id: 'secondaryPartyName',
    type: 'text',
    label: 'Secondary Party Name',
    placeholder: 'Enter secondary party name',
    required: true,
    group: 'parties',
  },
  {
    id: 'agreementType',
    type: 'select',
    label: 'Agreement Type',
    options: [
      { value: 'compliance', label: 'Environmental Compliance' },
      { value: 'conservation', label: 'Conservation' },
      { value: 'remediation', label: 'Environmental Remediation' },
      { value: 'sustainability', label: 'Sustainability Project' },
      { value: 'carbon-offset', label: 'Carbon Offset' },
    ],
    required: true,
    group: 'project',
  },
  {
    id: 'projectDescription',
    type: 'textarea',
    label: 'Project Description',
    placeholder: 'Describe the environmental project',
    required: true,
    group: 'project',
  },
  {
    id: 'projectLocation',
    type: 'text',
    label: 'Project Location',
    placeholder: 'Enter project location',
    required: false,
    group: 'location',
  },
];
