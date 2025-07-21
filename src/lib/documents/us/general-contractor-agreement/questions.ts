// src/lib/documents/us/general-contractor-agreement/questions.ts
import type { FormQuestion } from '@/types/documents';

export const generalContractorAgreementQuestions: FormQuestion[] = [
  {
    id: 'contractorName',
    type: 'text',
    label: 'Contractor Name',
    placeholder: 'Enter general contractor name',
    required: true,
    group: 'contractor',
  },
  {
    id: 'ownerName',
    type: 'text',
    label: 'Property Owner Name',
    placeholder: 'Enter property owner name',
    required: true,
    group: 'owner',
  },
  {
    id: 'projectType',
    type: 'select',
    label: 'Project Type',
    options: [
      { value: 'new-construction', label: 'New Construction' },
      { value: 'renovation', label: 'Renovation' },
      { value: 'addition', label: 'Addition' },
      { value: 'commercial', label: 'Commercial' },
      { value: 'residential', label: 'Residential' },
    ],
    required: false,
    group: 'project',
  },
  {
    id: 'contractType',
    type: 'select',
    label: 'Contract Type',
    options: [
      { value: 'fixed-price', label: 'Fixed Price' },
      { value: 'cost-plus', label: 'Cost Plus' },
      { value: 'time-materials', label: 'Time & Materials' },
      { value: 'unit-price', label: 'Unit Price' },
    ],
    required: false,
    group: 'contract',
  },
  {
    id: 'totalContractPrice',
    type: 'text',
    label: 'Total Contract Price',
    placeholder: 'Enter total contract amount',
    required: false,
    group: 'financial',
  },
  {
    id: 'startDate',
    type: 'date',
    label: 'Project Start Date',
    required: false,
    group: 'timeline',
  },
];
