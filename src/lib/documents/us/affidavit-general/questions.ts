// src/lib/documents/us/affidavit-general/questions.ts
import { usStates } from '@/lib/document-library/utils';
import type { QuestionConfig } from '@/types/documents';

export const affidavitGeneralQuestions: QuestionConfig[] = [
  {
    id: 'affiantName',
    label: 'documents.us.affidavit-general.affiantName.label',
    type: 'text',
    required: true,
    tooltip: 'documents.us.affidavit-general.affiantName.tooltip',
  },
  {
    id: 'affiantAddress',
    label: 'documents.us.affidavit-general.affiantAddress.label',
    type: 'textarea',
    required: true,
    tooltip: 'documents.us.affidavit-general.affiantAddress.tooltip',
  },
  {
    id: 'statement',
    label: 'documents.us.affidavit-general.statement.label',
    type: 'textarea',
    required: true,
    placeholder: '1. On [Date], I observed...\n2. The following occurred...',
    tooltip: 'documents.us.affidavit-general.statement.tooltip',
  },
  {
    id: 'state',
    label: 'documents.us.affidavit-general.state.label',
    type: 'select',
    required: true,
    options: usStates.map((s) => ({ value: s.value, label: s.label })),
    tooltip: 'documents.us.affidavit-general.state.tooltip',
  },
  {
    id: 'county',
    label: 'documents.us.affidavit-general.county.label',
    type: 'text',
    required: true,
    tooltip: 'documents.us.affidavit-general.county.tooltip',
  },
];
