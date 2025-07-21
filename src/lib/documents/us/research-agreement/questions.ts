// src/lib/documents/us/research-agreement/questions.ts
import type { FormQuestion } from '@/types/documents';

export const researchAgreementQuestions: FormQuestion[] = [
  {
    id: 'leadInstitution',
    type: 'text',
    label: 'Lead Institution',
    placeholder: 'Enter lead research institution',
    required: true,
    group: 'lead',
  },
  {
    id: 'leadResearcher',
    type: 'text',
    label: 'Lead Researcher',
    placeholder: 'Enter principal investigator name',
    required: true,
    group: 'lead',
  },
  {
    id: 'collaboratorName',
    type: 'text',
    label: 'Collaborator Name',
    placeholder: 'Enter collaborating researcher name',
    required: true,
    group: 'collaborator',
  },
  {
    id: 'projectTitle',
    type: 'text',
    label: 'Research Project Title',
    placeholder: 'Enter research project title',
    required: true,
    group: 'project',
  },
  {
    id: 'researchDescription',
    type: 'textarea',
    label: 'Research Description',
    placeholder: 'Describe the research project',
    required: true,
    group: 'project',
  },
];
