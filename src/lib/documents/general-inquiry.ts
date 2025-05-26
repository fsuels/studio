import { z } from 'zod';
import type { LegalDocument } from '@/types/documents';
import { usStates } from '../usStates'; // Adjusted path

export const generalInquiry: LegalDocument = {
  id: 'general-inquiry',
  name: 'General Inquiry',
  name_es: 'Consulta General',
  category: 'Miscellaneous',
  description:
    "For situations where a specific document isn't immediately clear or needed.",
  description_es:
    'Para situaciones donde un documento específico no está claro o no se necesita de inmediato.',
  aliases: ['help', 'question', 'legal advice', 'not sure'],
  aliases_es: ['ayuda', 'pregunta', 'consejo legal', 'no estoy seguro'],
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 0, // Usually free
  states: 'all',
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
      label: 'Please describe your situation or question in detail',
      type: 'textarea',
      required: true,
    },
    {
      id: 'desiredOutcome',
      label: 'What outcome are you hoping for?',
      type: 'text',
    },
    {
      id: 'state',
      label: 'Which U.S. state is relevant? (Optional)',
      type: 'select',
      options: usStates.map((s) => ({ value: s.value, label: s.label })),
    },
  ],
};
