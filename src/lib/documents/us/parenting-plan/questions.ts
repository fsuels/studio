// src/lib/documents/us/parenting-plan/questions.ts
import type { FormQuestion } from '@/types/documents';

export const parentingPlanQuestions: FormQuestion[] = [
  {
    id: 'parent1Name',
    type: 'text',
    label: 'First Parent Name',
    placeholder: 'Enter first parent full name',
    required: true,
    group: 'parents',
  },
  {
    id: 'parent2Name',
    type: 'text',
    label: 'Second Parent Name',
    placeholder: 'Enter second parent full name',
    required: true,
    group: 'parents',
  },
  {
    id: 'childrenNames',
    type: 'textarea',
    label: 'Children Names and Ages',
    placeholder: 'List all children with ages',
    required: false,
    group: 'children',
  },
  {
    id: 'legalCustody',
    type: 'select',
    label: 'Legal Custody',
    options: [
      { value: 'joint', label: 'Joint Legal Custody' },
      { value: 'parent1-sole', label: 'First Parent Sole Custody' },
      { value: 'parent2-sole', label: 'Second Parent Sole Custody' },
    ],
    required: false,
    group: 'custody',
  },
  {
    id: 'physicalCustody',
    type: 'select',
    label: 'Physical Custody',
    options: [
      { value: 'joint', label: 'Joint Physical Custody' },
      { value: 'parent1-primary', label: 'First Parent Primary' },
      { value: 'parent2-primary', label: 'Second Parent Primary' },
    ],
    required: false,
    group: 'custody',
  },
  {
    id: 'residentialSchedule',
    type: 'textarea',
    label: 'Residential Schedule',
    placeholder: 'Describe the custody schedule',
    required: false,
    group: 'schedule',
  },
  {
    id: 'childSupportAmount',
    type: 'text',
    label: 'Child Support Amount',
    placeholder: 'Enter monthly support amount',
    required: false,
    group: 'support',
  },
  {
    id: 'holidayRotation',
    type: 'boolean',
    label: 'Alternate holidays each year?',
    required: false,
    group: 'holidays',
  },
];
