import { z } from 'zod';
import type { LegalDocument } from '@/types/documents';
import { usStates } from '@/lib/document-library/utils';

export const serviceAgreement: LegalDocument = {
  id: 'service-agreement',
  name: 'Service Agreement',
  name_es: 'Acuerdo de Servicios',
  category: 'Business',
  description: 'Outline terms for providing or receiving ongoing services.',
  description_es:
    'Esbozar términos para proporcionar o recibir servicios continuos.',
  aliases: ['hire services', 'service provider', 'payment terms'],
  aliases_es: [
    'contratar servicios',
    'proveedor de servicios',
    'términos de pago',
  ],
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 5,
  states: 'all',
  schema: z.object({
    clientName: z.string().min(1),
    clientAddress: z.string().min(1),
    providerName: z.string().min(1),
    providerAddress: z.string().min(1),
    serviceDescription: z.string().min(1),
    startDate: z.string().min(1), // Date
    endDate: z.string().optional(), // Date
    paymentTerms: z.string().min(1),
    confidentialityClause: z.enum(['yes', 'no']),
    state: z.string().length(2),
  }),
  questions: [
    {
      id: 'clientName',
      label: 'Client Full Name/Company',
      type: 'text',
      required: true,
    },
    {
      id: 'clientAddress',
      label: 'Client Address',
      type: 'textarea',
      required: true,
    },
    {
      id: 'providerName',
      label: 'Service Provider Full Name/Company',
      type: 'text',
      required: true,
    },
    {
      id: 'providerAddress',
      label: 'Service Provider Address',
      type: 'textarea',
      required: true,
    },
    {
      id: 'serviceDescription',
      label: 'Description of Services to be Provided',
      type: 'textarea',
      required: true,
      placeholder: 'e.g., Web design, marketing consulting, writing services',
    },
    {
      id: 'startDate',
      label: 'Service Start Date',
      type: 'date',
      required: true,
    },
    {
      id: 'endDate',
      label: 'Service End Date (Optional, for fixed term)',
      type: 'date',
    },
    {
      id: 'paymentTerms',
      label: 'Payment Amount and Terms',
      type: 'textarea',
      required: true,
      placeholder:
        'e.g., $50/hour billed monthly, $1000 fixed fee upon completion',
    },
    {
      id: 'confidentialityClause',
      label: 'Include Confidentiality Clause?',
      type: 'select',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
      ],
      required: true,
    },
    {
      id: 'state',
      label: 'Governing State Law',
      type: 'select',
      required: true,
      options: usStates.map((s) => ({ value: s.value, label: s.label })),
    },
  ],
};
