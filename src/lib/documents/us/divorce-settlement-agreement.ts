import { z } from 'zod';
import type { LegalDocument } from '@/types/documents';
import { usStates } from '@/lib/document-library/utils';

export const divorceSettlementAgreement: LegalDocument = {
  id: 'divorce-settlement-agreement',
  category: 'Family',
  translations: {
    en: {
      name: 'Divorce Settlement Agreement',
      description:
        'Formalizes the terms of a divorce, including property division, support, and custody.',
      aliases: [
        'divorce',
        'separation',
        'end marriage',
        'get divorced',
        'marital settlement',
      ],
    },
    es: {
      name: 'Acuerdo de Divorcio',
      description:
        'Formaliza los términos de un divorcio, incluyendo división de bienes, manutención y custodia.',
      aliases: [
        'divorcio',
        'separación',
        'terminar matrimonio',
        'divorciarse',
        'acuerdo matrimonial',
      ],
    },
  },
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: true,
  offerNotarization: true,
  offerRecordingHelp: true,
  basePrice: 7,
  states: 'all',
  schema: z.object({
    spouse1Name: z.string().min(1, 'Spouse 1 name is required.'),
    spouse2Name: z.string().min(1, 'Spouse 2 name is required.'),
    dateOfMarriage: z.string().min(1, 'Date of marriage is required.').regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    dateOfSeparation: z.string().min(1, 'Date of separation is required.').regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    hasChildren: z.enum(['yes', 'no'], {
      errorMap: () => ({
        message: 'Please specify if there are minor children.',
      }),
    }),
    propertyDivision: z
      .string()
      .min(1, 'Property division details are required.'),
    spousalSupport: z.string().optional(),
    state: z.string().length(2, 'State must be 2 characters.'),
  }),
  questions: [
    {
      id: 'spouse1Name',
      label: 'Spouse 1 Full Name',
      type: 'text',
      required: true,
    },
    {
      id: 'spouse2Name',
      label: 'Spouse 2 Full Name',
      type: 'text',
      required: true,
    },
    {
      id: 'dateOfMarriage',
      label: 'Date of Marriage',
      type: 'date',
      required: true,
    },
    {
      id: 'dateOfSeparation',
      label: 'Date of Separation',
      type: 'date',
      required: true,
    },
    {
      id: 'hasChildren',
      label: 'Are there minor children involved?',
      type: 'select',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
      ],
      required: true,
    },
    {
      id: 'propertyDivision',
      label: 'Describe Division of Assets & Debts',
      type: 'textarea',
      required: true,
      placeholder: 'e.g., House to Spouse 1, Car to Spouse 2, Split savings...',
    },
    {
      id: 'spousalSupport',
      label: 'Spousal Support (Alimony) Details',
      type: 'textarea',
      placeholder: 'e.g., Spouse 1 pays $500/month for 36 months, or waived',
    },
    {
      id: 'state',
      label: 'State Governing Divorce',
      type: 'select',
      required: true,
      options: usStates.map((s) => ({ value: s.value, label: s.label })),
    },
  ],
  upsellClauses: [],
};
