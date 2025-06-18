// src/lib/documents/us/film-production-agreement/questions.ts
import type { FormQuestion } from '@/types/documents';

export const filmProductionAgreementQuestions: FormQuestion[] = [
  {
    id: 'producerName',
    type: 'text',
    label: 'Producer Name',
    placeholder: 'Enter producer name',
    required: true,
    group: 'producer',
  },
  {
    id: 'clientName',
    type: 'text',
    label: 'Client/Financier Name',
    placeholder: 'Enter client name',
    required: true,
    group: 'client',
  },
  {
    id: 'projectTitle',
    type: 'text',
    label: 'Project Title',
    placeholder: 'Enter film/project title',
    required: false,
    group: 'project',
  },
  {
    id: 'projectType',
    type: 'select',
    label: 'Project Type',
    options: [
      { value: 'feature-film', label: 'Feature Film' },
      { value: 'short-film', label: 'Short Film' },
      { value: 'documentary', label: 'Documentary' },
      { value: 'commercial', label: 'Commercial' },
      { value: 'music-video', label: 'Music Video' },
      { value: 'series', label: 'TV Series' },
      { value: 'pilot', label: 'TV Pilot' },
    ],
    required: false,
    group: 'project',
  },
  {
    id: 'totalBudget',
    type: 'text',
    label: 'Total Budget',
    placeholder: 'Enter total production budget',
    required: false,
    group: 'budget',
  },
  {
    id: 'principalPhotographyStart',
    type: 'date',
    label: 'Principal Photography Start',
    required: false,
    group: 'schedule',
  },
];