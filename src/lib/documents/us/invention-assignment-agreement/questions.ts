// src/lib/documents/us/invention-assignment-agreement/questions.ts
import type { Question } from '@/types/documents';

export const inventionAssignmentAgreementQuestions: Question[] = [
  {
    id: 'employeeName',
    label: 'Employee/Contractor Full Name',
    type: 'text',
    required: true,
  },
  {
    id: 'employeeAddress',
    label: 'Employee/Contractor Address',
    type: 'textarea',
    required: true,
  },
  {
    id: 'companyName',
    label: 'Company Name',
    type: 'text',
    required: true,
  },
  {
    id: 'companyAddress',
    label: 'Company Address',
    type: 'textarea',
    required: true,
  },
  {
    id: 'effectiveDate',
    label: 'Effective Date of Agreement',
    type: 'date',
    required: true,
  },
  {
    id: 'employmentPosition',
    label: 'Employment Position/Role',
    type: 'text',
    required: true,
    placeholder: 'e.g., Software Engineer, Research Scientist',
  },
  {
    id: 'workScope',
    label: 'Scope of Work',
    type: 'textarea',
    required: true,
    placeholder: "Describe the employee's work responsibilities",
  },
  {
    id: 'inventionDefinition',
    label: 'Definition of Inventions',
    type: 'textarea',
    required: true,
    placeholder: 'Define what constitutes an invention under this agreement',
  },
  {
    id: 'assignmentScope',
    label: 'Assignment Scope',
    type: 'radio',
    required: true,
    options: [
      { value: 'all', label: 'All inventions during employment' },
      { value: 'work-related', label: 'Only work-related inventions' },
      { value: 'specific', label: 'Specific inventions only' },
    ],
  },
  {
    id: 'specificInventions',
    label: 'Specific Inventions (if applicable)',
    type: 'textarea',
    placeholder: 'List specific inventions if assignment scope is limited',
  },
  {
    id: 'priorInventions',
    label: 'Prior Inventions (Optional)',
    type: 'textarea',
    placeholder: 'List any inventions created before employment',
  },
  {
    id: 'confidentialityTerms',
    label: 'Confidentiality Terms (Optional)',
    type: 'textarea',
    placeholder: 'Additional confidentiality requirements',
  },
  {
    id: 'competingWork',
    label: 'Competing Work Restrictions (Optional)',
    type: 'textarea',
    placeholder: 'Restrictions on competing work or inventions',
  },
  {
    id: 'disclosure',
    label: 'Requires Invention Disclosure?',
    type: 'checkbox',
    placeholder: 'Employee must disclose all inventions',
  },
  {
    id: 'patentCooperation',
    label: 'Patent Application Cooperation Required?',
    type: 'checkbox',
    placeholder: 'Employee must cooperate in patent applications',
  },
  {
    id: 'moralRights',
    label: 'Waiver of Moral Rights?',
    type: 'checkbox',
    placeholder: 'Employee waives moral rights in inventions',
  },
];
