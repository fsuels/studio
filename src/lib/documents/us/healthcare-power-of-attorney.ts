// src/lib/documents/us/healthcare-power-of-attorney.ts
import { z } from 'zod';
import type { LegalDocument } from '@/types/documents';
import { usStates } from '@/lib/document-library/utils';

export const healthcarePowerOfAttorney: LegalDocument = {
  id: 'healthcare-power-of-attorney',
  category: 'Personal',
  translations: {
    en: {
      name: 'Healthcare Power of Attorney',
      description: 'Appoint an agent to make healthcare decisions if you cannot.',
      aliases: [
        'medical poa',
        'healthcare proxy',
        'appoint agent for health',
        'medical decisions',
      ],
    },
    es: {
      name: 'Poder Notarial para Atención Médica',
      description:
        'Nombrar un agente para tomar decisiones de atención médica si usted no puede.',
      aliases: [
        'poder médico',
        'proxy de salud',
        'designar agente de salud',
        'decisiones médicas',
      ],
    },
  },
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 5,
  states: 'all',
  schema: z.object({
    principalName: z.string().min(1),
    principalAddress: z.string().min(1),
    agentName: z.string().min(1),
    agentAddress: z.string().min(1),
    alternateAgentName: z.string().optional(),
    lifeSupportPreferences: z.string().optional(),
    state: z.string().length(2),
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
      label: "Healthcare Agent's Full Name",
      type: 'text',
      required: true,
    },
    {
      id: 'agentAddress',
      label: "Healthcare Agent's Full Address",
      type: 'textarea',
      required: true,
    },
    {
      id: 'alternateAgentName',
      label: "Alternate Healthcare Agent's Full Name (Optional)",
      type: 'text',
    },
    {
      id: 'lifeSupportPreferences',
      label: 'Preferences regarding life support (Optional)',
      type: 'textarea',
      placeholder: 'e.g., I do/do not want artificial respiration...',
    },
    {
      id: 'state',
      label: 'State Governing the POA',
      type: 'select',
      required: true,
      options: usStates.map((s) => ({ value: s.value, label: s.label })),
    },
  ],
};
