// src/lib/documents/us/provisional-patent-application/questions.ts
import type { Question } from '@/types/documents';

export const provisionalPatentApplicationQuestions: Question[] = [
  {
    id: 'inventorName',
    label: 'Inventor Full Name',
    type: 'text',
    required: true,
  },
  {
    id: 'inventorAddress',
    label: 'Inventor Complete Address',
    type: 'textarea',
    required: true,
  },
  {
    id: 'inventorEmail',
    label: 'Inventor Email Address',
    type: 'email',
    required: true,
  },
  {
    id: 'inventorPhone',
    label: 'Inventor Phone Number',
    type: 'tel',
    required: true,
  },
  {
    id: 'inventorCitizenship',
    label: 'Inventor Citizenship',
    type: 'text',
    required: true,
    placeholder: 'e.g., United States, Canada',
  },
  {
    id: 'inventionTitle',
    label: 'Title of Invention',
    type: 'text',
    required: true,
    placeholder: 'Clear, concise title describing the invention',
  },
  {
    id: 'technicalField',
    label: 'Technical Field',
    type: 'textarea',
    required: true,
    placeholder: 'Describe the technical field of the invention',
  },
  {
    id: 'backgroundArt',
    label: 'Background Art (Optional)',
    type: 'textarea',
    placeholder: 'Description of relevant prior art and existing solutions',
  },
  {
    id: 'inventionSummary',
    label: 'Summary of Invention',
    type: 'textarea',
    required: true,
    placeholder: 'Brief summary of what the invention does and its main advantages',
  },
  {
    id: 'detailedDescription',
    label: 'Detailed Description of Invention',
    type: 'textarea',
    required: true,
    placeholder: 'Comprehensive description of how the invention works',
  },
  {
    id: 'drawingsDescription',
    label: 'Description of Drawings (Optional)',
    type: 'textarea',
    placeholder: 'If you have drawings, describe what each figure shows',
  },
  {
    id: 'claims',
    label: 'Claims (Optional for Provisional)',
    type: 'textarea',
    placeholder: 'What you claim as your invention (optional for provisional applications)',
  },
  {
    id: 'abstractText',
    label: 'Abstract',
    type: 'textarea',
    required: true,
    placeholder: 'Brief technical summary in 150 words or less',
  },
  {
    id: 'priorArt',
    label: 'Prior Art References (Optional)',
    type: 'textarea',
    placeholder: 'List any known prior art, patents, or publications',
  },
  {
    id: 'advantages',
    label: 'Advantages of Invention (Optional)',
    type: 'textarea',
    placeholder: 'Key benefits and improvements over existing solutions',
  },
  {
    id: 'attorney',
    label: 'Patent Attorney Name (Optional)',
    type: 'text',
    placeholder: 'Name of representing patent attorney',
  },
  {
    id: 'attorneyAddress',
    label: 'Patent Attorney Address (Optional)',
    type: 'textarea',
  },
  {
    id: 'filingDate',
    label: 'Filing Date',
    type: 'date',
    required: true,
  },
];