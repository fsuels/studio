import { z } from 'zod';
import type { LegalDocument } from '@/types/documents';

export const independentContractorAgreement: LegalDocument = {
  id: 'independent-contractor-agreement',
  name: 'Independent Contractor Agreement',
  name_es: 'Contrato de Contratista Independiente',
  category: 'Business',
  description: 'Define terms for hiring a freelancer or independent contractor.',
  description_es: 'Definir términos para contratar a un freelancer o contratista independiente.',
  aliases: ["freelance", "contractor", "gig work", "1099 job"],
  aliases_es: ["freelance", "contratista", "trabajo gig", "trabajo 1099"],
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 5,
  states: 'all',
  schema: z.object({
    clientName: z.string().min(1),
    contractorName: z.string().min(1),
    serviceDescription: z.string().min(1),
    paymentTerms: z.string().min(1),
    startDate: z.string().min(1), // Date
    endDate: z.string().optional(), // Date
  }),
  questions: [
    { id: 'clientName', label: 'Client/Company Name', type: 'text', required: true },
    { id: 'contractorName', label: 'Contractor Name', type: 'text', required: true },
    { id: 'serviceDescription', label: 'Description of Services', type: 'textarea', required: true },
    { id: 'paymentTerms', label: 'Payment Rate and Schedule', type: 'textarea', required: true },
    { id: 'startDate', label: 'Start Date', type: 'date', required: true },
    { id: 'endDate', label: 'End Date (Optional)', type: 'date' },
  ]
};