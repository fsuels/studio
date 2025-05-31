import { z } from 'zod';
import type { LegalDocument } from '@/types/documents';
import { usStates } from '@/lib/document-library/utils';

export const lastWillTestament: LegalDocument = {
  id: 'last-will-testament',
  name: 'Last Will and Testament',
  category: 'Estate Planning',
  description: 'Specify how your assets should be distributed after death.',
  aliases: ['will', 'inheritance', 'distribute assets'],
  translations: {
    en: {
      name: 'Last Will and Testament',
      description: 'Specify how your assets should be distributed after death.',
      aliases: ['will', 'inheritance', 'distribute assets'],
    },
    es: {
      name: 'Última Voluntad y Testamento',
      description:
        'Especificar cómo deben distribuirse sus bienes después de la muerte.',
      aliases: ['testamento', 'herencia', 'distribuir bienes'],
    },
  },
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 7,
  states: 'all',
  schema: z.object({
    testatorName: z.string().min(1, "Testator's name is required."),
    testatorAddress: z.string().min(1, "Testator's address is required."),
    executorName: z.string().min(1, "Executor's name is required."),
    executorAddress: z.string().min(1, "Executor's address is required."),
    alternateExecutorName: z.string().optional(),
    beneficiaries: z.string().min(1, 'Beneficiary details are required.'),
    guardianForMinors: z.string().optional(),
    state: z.string().length(2, 'State must be 2 characters.'),
  }),
  questions: [
    {
      id: 'testatorName',
      label: 'Your Full Name (Testator)',
      type: 'text',
      required: true,
    },
    {
      id: 'testatorAddress',
      label: 'Your Full Address',
      type: 'textarea',
      required: true,
    },
    {
      id: 'executorName',
      label: 'Executor Full Name',
      type: 'text',
      required: true,
    },
    {
      id: 'executorAddress',
      label: 'Executor Address',
      type: 'textarea',
      required: true,
    },
    {
      id: 'alternateExecutorName',
      label: 'Alternate Executor Full Name (Optional)',
      type: 'text',
    },
    {
      id: 'beneficiaries',
      label: 'Beneficiaries and Asset Distribution',
      type: 'textarea',
      required: true,
      placeholder:
        'e.g., My house at 123 Main St to my daughter Jane Doe. My savings account to my son John Doe. Residue to...',
    },
    {
      id: 'guardianForMinors',
      label: 'Guardian for Minor Children (if applicable)',
      type: 'text',
      placeholder: 'Full name of guardian',
    },
    {
      id: 'state',
      label: 'State Governing the Will',
      type: 'select',
      required: true,
      options: usStates.map((s) => ({ value: s.value, label: s.label })),
    },
  ],
};
