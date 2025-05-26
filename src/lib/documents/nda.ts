import { z } from 'zod';
import type { LegalDocument } from '@/types/documents';

export const nda: LegalDocument = {
  id: 'nda',
  name: 'Non-Disclosure Agreement (NDA)',
  name_es: 'Acuerdo de Confidencialidad (NDA)',
  category: 'Business',
  description: 'Protect confidential information shared between parties.',
  description_es: 'Proteger información confidencial compartida entre partes.',
  aliases: ['confidential', 'nda', 'protect idea', 'secret'],
  aliases_es: ['confidencial', 'nda', 'proteger idea', 'secreto'],
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 5,
  states: 'all',
  schema: z.object({
    party1Name: z.string().min(1, 'Party 1 name is required.'),
    party1Address: z.string().min(1, 'Party 1 address is required.'),
    party2Name: z.string().min(1, 'Party 2 name is required.'),
    party2Address: z.string().min(1, 'Party 2 address is required.'),
    effectiveDate: z.string().min(1, 'Effective date is required.'), // Should be date
    purpose: z.string().min(1, 'Purpose of disclosure is required.'),
    confidentialInfoDescription: z.string().optional(),
    termYears: z.coerce
      .number()
      .int()
      .min(0, 'Term must be a non-negative integer.')
      .optional(),
  }),
  questions: [
    {
      id: 'party1Name',
      label: 'Party 1 Full Name/Company',
      type: 'text',
      required: true,
    },
    {
      id: 'party1Address',
      label: 'Party 1 Address',
      type: 'textarea',
      required: true,
    },
    {
      id: 'party2Name',
      label: 'Party 2 Full Name/Company',
      type: 'text',
      required: true,
    },
    {
      id: 'party2Address',
      label: 'Party 2 Address',
      type: 'textarea',
      required: true,
    },
    {
      id: 'effectiveDate',
      label: 'Effective Date of Agreement',
      type: 'date',
      required: true,
    },
    {
      id: 'purpose',
      label: 'Purpose of Disclosure',
      type: 'textarea',
      required: true,
      placeholder:
        'e.g., Discussing potential business partnership, evaluating software',
    },
    {
      id: 'confidentialInfoDescription',
      label: 'Brief Description of Confidential Information',
      type: 'textarea',
      placeholder: 'e.g., Business plans, customer lists, source code',
    },
    {
      id: 'termYears',
      label: 'Term of Agreement (Years, 0 for indefinite)',
      type: 'number',
      placeholder: 'e.g., 3',
    },
  ],
  upsellClauses: [],
};
