// src/lib/documents/us/photo-release-form/questions.ts
import type { Question } from '@/types/documents';

export const photoReleaseFormQuestions: Question[] = [
  {
    id: 'subjectName',
    label: 'Subject Full Name',
    type: 'text',
    required: true,
  },
  {
    id: 'subjectAddress',
    label: 'Subject Address',
    type: 'textarea',
    required: true,
  },
  {
    id: 'photographerName',
    label: 'Photographer/Company Name',
    type: 'text',
    required: true,
  },
  {
    id: 'photographerAddress',
    label: 'Photographer Address',
    type: 'textarea',
    required: true,
  },
  {
    id: 'shootDate',
    label: 'Photo Shoot Date',
    type: 'date',
    required: true,
  },
  {
    id: 'location',
    label: 'Photo Location',
    type: 'text',
    required: true,
    placeholder: 'Where the photos will be taken',
  },
  {
    id: 'purpose',
    label: 'Purpose of Photos',
    type: 'textarea',
    required: true,
    placeholder: 'e.g., Commercial advertising, portfolio, social media',
  },
  {
    id: 'usageRights',
    label: 'Usage Rights',
    type: 'radio',
    required: true,
    options: [
      { value: 'unlimited', label: 'Unlimited usage rights' },
      { value: 'limited', label: 'Limited usage rights' },
      { value: 'specific', label: 'Specific usage only' },
    ],
  },
  {
    id: 'specificUsage',
    label: 'Specific Usage Details (if applicable)',
    type: 'textarea',
    placeholder: 'Describe specific permitted uses',
  },
  {
    id: 'compensation',
    label: 'Compensation (Optional)',
    type: 'text',
    placeholder: 'Payment amount or other compensation',
  },
  {
    id: 'creditRequired',
    label: 'Photo Credit Required?',
    type: 'checkbox',
    placeholder: 'Requires attribution/credit',
  },
  {
    id: 'creditName',
    label: 'Credit Name (if required)',
    type: 'text',
    placeholder: 'Name to use for photo credit',
  },
  {
    id: 'exclusiveRights',
    label: 'Exclusive Rights?',
    type: 'checkbox',
    placeholder: 'Photographer has exclusive rights',
  },
  {
    id: 'duration',
    label: 'Duration of Rights (Optional)',
    type: 'text',
    placeholder: 'e.g., 5 years, indefinite',
  },
  {
    id: 'territory',
    label: 'Geographic Territory (Optional)',
    type: 'text',
    placeholder: 'e.g., United States, Worldwide',
  },
  {
    id: 'modification',
    label: 'Allow Photo Modification?',
    type: 'checkbox',
    placeholder: 'Photos may be edited or altered',
  },
  {
    id: 'minorAge',
    label: 'Subject is Minor (Under 18)?',
    type: 'checkbox',
    placeholder: 'Check if subject is under 18 years old',
  },
  {
    id: 'guardianName',
    label: 'Guardian Name (if minor)',
    type: 'text',
    placeholder: 'Parent or guardian name if subject is minor',
  },
  {
    id: 'guardianRelation',
    label: 'Guardian Relationship (if minor)',
    type: 'text',
    placeholder: 'e.g., Parent, Legal Guardian',
  },
];
