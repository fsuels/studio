// src/lib/documents/us/event-planning-contract/questions.ts
import type { FormQuestion } from '@/types/documents';

export const eventPlanningContractQuestions: FormQuestion[] = [
  {
    id: 'plannerName',
    type: 'text',
    label: 'Event Planner Name',
    placeholder: 'Enter planner name',
    required: true,
    group: 'planner',
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
    id: 'eventType',
    type: 'select',
    label: 'Event Type',
    options: [
      { value: 'wedding', label: 'Wedding' },
      { value: 'birthday', label: 'Birthday Party' },
      { value: 'corporate', label: 'Corporate Event' },
      { value: 'anniversary', label: 'Anniversary' },
      { value: 'graduation', label: 'Graduation' },
      { value: 'other', label: 'Other' },
    ],
    required: true,
    group: 'event',
  },
  {
    id: 'eventDate',
    type: 'text',
    label: 'Event Date',
    placeholder: 'Enter event date',
    required: true,
    group: 'event',
  },
  {
    id: 'planningFee',
    type: 'text',
    label: 'Planning Fee',
    placeholder: 'Enter total planning fee',
    required: true,
    group: 'pricing',
  },
  {
    id: 'feeStructure',
    type: 'select',
    label: 'Fee Structure',
    options: [
      { value: 'flat-fee', label: 'Flat Fee' },
      { value: 'hourly', label: 'Hourly Rate' },
      { value: 'percentage', label: 'Percentage of Budget' },
      { value: 'package', label: 'Package Deal' },
    ],
    required: true,
    group: 'pricing',
  },
];
