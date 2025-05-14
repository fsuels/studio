import { z } from 'zod';
import type { LegalDocument } from '@/types/documents';
import { usStates } from '../usStates'; // Adjusted path

export const affidavitGeneral: LegalDocument = {
  id: 'affidavit-general',
  name: 'Affidavit (General)',
  name_es: 'Declaración Jurada (General)',
  category: 'Personal',
  description: 'A sworn written statement confirmed by oath, often used as evidence.',
  description_es: 'Una declaración escrita jurada confirmada por juramento, a menudo utilizada como prueba.',
  aliases: ["sworn statement", "declaration", "official statement", "statement under oath"],
  aliases_es: ["declaración jurada", "declaración oficial", "declaración bajo juramento"],
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 5,
  states: 'all',
  schema: z.object({
    affiantName: z.string().min(1, "Affiant's name is required."),
    affiantAddress: z.string().min(1, "Affiant's address is required."),
    statement: z.string().min(1, "Statement is required."),
    state: z.string().length(2, "State must be 2 characters."),
    county: z.string().min(1, "County is required."),
  }),
  questions: [
    { id: 'affiantName', label: 'Your Full Name (Affiant)', type: 'text', required: true },
    { id: 'affiantAddress', label: 'Your Address', type: 'textarea', required: true },
    { id: 'statement', label: 'Statement of Facts (Number each paragraph)', type: 'textarea', required: true, placeholder: `1. On [Date], I observed...
2. The following occurred...` },
    { id: 'state', label: 'State where signed', type: 'select', required: true, options: usStates.map(s => ({ value: s.value, label: s.label })) },
    { id: 'county', label: 'County where signed', type: 'text', required: true },
  ]
};