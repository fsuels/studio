// src/lib/documents/us/data-processing-agreement/questions.ts
import type { FormQuestion } from '@/types/documents';

export const dataProcessingAgreementQuestions: FormQuestion[] = [
  {
    id: 'controllerName',
    type: 'text',
    label: 'Data Controller Name',
    placeholder: 'Enter data controller name',
    required: true,
    group: 'controller',
  },
  {
    id: 'processorName',
    type: 'text',
    label: 'Data Processor Name',
    placeholder: 'Enter data processor name',
    required: true,
    group: 'processor',
  },
  {
    id: 'processingPurpose',
    type: 'textarea',
    label: 'Processing Purpose',
    placeholder: 'Describe the purpose of data processing',
    required: true,
    group: 'processing',
  },
  {
    id: 'legalBasis',
    type: 'select',
    label: 'Legal Basis for Processing',
    options: [
      { value: 'consent', label: 'Consent' },
      { value: 'contract', label: 'Contract Performance' },
      { value: 'legal-obligation', label: 'Legal Obligation' },
      { value: 'vital-interests', label: 'Vital Interests' },
      { value: 'public-task', label: 'Public Task' },
      { value: 'legitimate-interests', label: 'Legitimate Interests' },
    ],
    required: true,
    group: 'processing',
  },
];
