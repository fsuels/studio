import { z } from 'zod';
import type { LegalDocument } from '@/types/documents';
import { usStates } from '../usStates'; // Adjusted path

export const powerOfAttorney: LegalDocument = {
  id: 'powerOfAttorney',
  name: 'General Power of Attorney',
  name_es: 'Poder Notarial General',
  category: 'Personal',
  description:
    'Authorize someone to act on your behalf for financial or general matters.',
  description_es:
    'Autorizar a alguien para actuar en su nombre en asuntos financieros o generales.',
  aliases: [
    'represent me',
    'act on my behalf',
    'authorize someone',
    'financial poa',
  ],
  aliases_es: [
    'representarme',
    'actuar en mi nombre',
    'autorizar a alguien',
    'poder financiero',
  ],
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 5,
  states: 'all',
  schema: z.object({
    principalName: z.string().min(1, "Principal's name is required."),
    principalAddress: z.string().min(1, "Principal's address is required."),
    agentName: z.string().min(1, "Agent's name is required."),
    agentAddress: z.string().min(1, "Agent's address is required."),
    alternateAgentName: z.string().optional(),
    effectiveDateType: z.enum(['immediately', 'incapacity'], {
      errorMap: () => ({
        message: 'Please select when the POA becomes effective.',
      }),
    }),
    isDurable: z.enum(['yes', 'no'], {
      errorMap: () => ({ message: 'Please specify if this is a Durable POA.' }),
    }),
    state: z.string().length(2, 'State must be 2 characters.'),
  }),
  questions: [
    {
      id: 'principalName',
      label: "Principal's Full Name (Person granting power)",
      type: 'text',
      required: true,
    },
    {
      id: 'principalAddress',
      label: "Principal's Full Address",
      type: 'textarea',
      required: true,
    },
    {
      id: 'agentName',
      label: "Agent's Full Name (Person receiving power)",
      type: 'text',
      required: true,
    },
    {
      id: 'agentAddress',
      label: "Agent's Full Address",
      type: 'textarea',
      required: true,
    },
    {
      id: 'alternateAgentName',
      label: "Alternate Agent's Full Name (Optional)",
      type: 'text',
    },
    {
      id: 'effectiveDateType',
      label: 'When does this POA become effective?',
      type: 'select',
      options: [
        { value: 'immediately', label: 'Immediately' },
        { value: 'incapacity', label: 'Upon my incapacity' },
      ],
      required: true,
    },
    {
      id: 'isDurable',
      label: 'Is this a Durable POA (remains effective after incapacity)?',
      type: 'select',
      options: [
        { value: 'yes', label: 'Yes (Durable)' },
        { value: 'no', label: 'No (Terminates on incapacity)' },
      ],
      required: true,
    },
    {
      id: 'state',
      label: 'State Governing the POA',
      type: 'select',
      required: true,
      options: usStates.map((s) => ({ value: s.value, label: s.label })),
    },
  ],
  upsellClauses: [],
};
