import { z } from 'zod';
import type { LegalDocument } from '@/types/documents';

export const independentContractorAgreement: LegalDocument = {
  id: 'independent-contractor-agreement',
  jurisdiction: 'US',
  category: 'Business',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 5,
  states: 'all',
  // templatePaths: { en: "en/us/independent-contractor-agreement.md", es: "es/us/independent-contractor-agreement.md" }, // Assuming template path
  translations: {
    en: {
      name: 'Independent Contractor Agreement',
      description:
        'Define terms for hiring a freelancer or independent contractor.',
      aliases: ['freelance', 'contractor', 'gig work', '1099 job'],
    },
    es: {
      name: 'Contrato de Contratista Independiente',
      description:
        'Definir términos para contratar a un freelancer o contratista independiente.',
      aliases: ['freelance', 'contratista', 'trabajo gig', 'trabajo 1099'],
    },
  },
  schema: z.object({
    clientName: z.string().min(1),
    contractorName: z.string().min(1),
    serviceDescription: z.string().min(1),
    paymentTerms: z.string().min(1),
    startDate: z.string().min(1), // Date
    endDate: z.string().optional(), // Date
  }),
  questions: [
    {
      id: 'clientName',
      label: 'documents.us.independent-contractor-agreement.clientName.label',
      type: 'text',
      required: true,
    },
    {
      id: 'contractorName',
      label:
        'documents.us.independent-contractor-agreement.contractorName.label',
      type: 'text',
      required: true,
    },
    {
      id: 'serviceDescription',
      label:
        'documents.us.independent-contractor-agreement.serviceDescription.label',
      type: 'textarea',
      required: true,
    },
    {
      id: 'paymentTerms',
      label: 'documents.us.independent-contractor-agreement.paymentTerms.label',
      type: 'textarea',
      required: true,
    },
    {
      id: 'startDate',
      label: 'documents.us.independent-contractor-agreement.startDate.label',
      type: 'date',
      required: true,
    },
    {
      id: 'endDate',
      label: 'documents.us.independent-contractor-agreement.endDate.label',
      type: 'date',
    },
  ],
};
