// src/lib/documents/us/affidavit-general.ts
import { z } from 'zod';
import type { LegalDocument } from '@/types/documents';
import { usStates } from '@/lib/document-library/utils';

export const affidavitGeneral: LegalDocument = {
  id: 'affidavit-general',
  jurisdiction: 'US',
  category: 'Personal',
  name: 'Affidavit (General)',
  description: 'A sworn written statement confirmed by oath, often used as evidence.',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 5,
  states: 'all',
  templatePaths: {
    en: 'en/us/affidavit-general.md',
    es: 'es/us/affidavit-general.md'
  },
  translations: {
    en: {
      name: 'Affidavit (General)',
      description: 'A sworn written statement confirmed by oath, often used as evidence.',
      aliases: ['sworn statement', 'declaration', 'official statement', 'statement under oath']
    },
    es: {
      name: 'Declaración Jurada (General)',
      description: 'Una declaración escrita jurada confirmada por juramento, a menudo utilizada como prueba.',
      aliases: ['declaración jurada', 'declaración oficial', 'declaración bajo juramento']
    }
  },
  schema: z.object({
    affiantName: z.string().min(1, "Affiant's name is required."),
    affiantAddress: z.string().min(1, "Affiant's address is required."),
    statement: z.string().min(1, 'Statement is required.'),
    state: z.string().length(2, 'State must be 2 characters.'),
    county: z.string().min(1, 'County is required.')
  }),
  questions: [
    {
      id: 'affiantName',
      label: 'documents.us.affidavit-general.affiantName.label',
      type: 'text',
      required: true,
      tooltip: 'documents.us.affidavit-general.affiantName.tooltip'
    },
    {
      id: 'affiantAddress',
      label: 'documents.us.affidavit-general.affiantAddress.label',
      type: 'textarea',
      required: true,
      tooltip: 'documents.us.affidavit-general.affiantAddress.tooltip'
    },
    {
      id: 'statement',
      label: 'documents.us.affidavit-general.statement.label',
      type: 'textarea',
      required: true,
      placeholder: '1. On [Date], I observed...\n2. The following occurred...',
      tooltip: 'documents.us.affidavit-general.statement.tooltip'
    },
    {
      id: 'state',
      label: 'documents.us.affidavit-general.state.label',
      type: 'select',
      required: true,
      options: usStates.map(s => ({ value: s.value, label: s.label })),
      tooltip: 'documents.us.affidavit-general.state.tooltip'
    },
    {
      id: 'county',
      label: 'documents.us.affidavit-general.county.label',
      type: 'text',
      required: true,
      tooltip: 'documents.us.affidavit-general.county.tooltip'
    }
  ]
};
