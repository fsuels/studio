import { z } from 'zod';
import type { LegalDocument } from '@/types/documents';
import { usStates } from '@/lib/document-library/utils';

export const generalInquiry: LegalDocument = {
  id: 'general-inquiry',
  jurisdiction: 'US',
  category: 'Miscellaneous',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 0,
  states: 'all',
  // templatePaths: { en: "en/us/general-inquiry.md", es: "es/us/general-inquiry.md" }, // Assuming template path
  translations: {
    en: {
      name: 'General Inquiry',
      description:
        "For situations where a specific document isn't immediately clear or needed.",
      aliases: ['help', 'question', 'legal advice', 'not sure'],
    },
    es: {
      name: 'Consulta General',
      description:
        'Para situaciones donde un documento específico no está claro o no se necesita de inmediato.',
      aliases: ['ayuda', 'pregunta', 'consejo legal', 'no estoy seguro'],
    },
  },
  schema: z.object({
    inquiryDetails: z
      .string()
      .min(10, 'Please provide more details about your situation.'),
    desiredOutcome: z.string().optional(),
    state: z.string().length(2).optional(),
  }),
  questions: [
    {
      id: 'inquiryDetails',
      label: 'documents.us.general-inquiry.inquiryDetails.label',
      type: 'textarea',
      required: true,
    },
    {
      id: 'desiredOutcome',
      label: 'documents.us.general-inquiry.desiredOutcome.label',
      type: 'text',
    },
    {
      id: 'state',
      label: 'documents.us.general-inquiry.state.label',
      type: 'select',
      options: usStates.map((s) => ({ value: s.value, label: s.label })),
    },
  ],
};
