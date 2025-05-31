import { z } from 'zod';
import type { LegalDocument } from '@/types/documents';

export const nonCompeteAgreement: LegalDocument = {
  id: 'non-compete-agreement',
  name: 'Non-Compete Agreement',
  category: 'Business',
  description:
    'Restrict an employee or contractor from competing after termination.',
  aliases: ['restrict competition', 'former employee', 'noncompete'],
  translations: {
    en: {
      name: 'Non-Compete Agreement',
      description:
        'Restrict an employee or contractor from competing after termination.',
      aliases: ['restrict competition', 'former employee', 'noncompete'],
    },
    es: {
      name: 'Acuerdo de No Competencia',
      description:
        'Restringir a un empleado o contratista de competir después de la terminación.',
      aliases: ['restringir competencia', 'ex empleado', 'no competencia'],
    },
  },
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 5,
  states: 'all',
  schema: z.object({
    companyName: z.string().min(1),
    employeeName: z.string().min(1),
    restrictedActivities: z.string().min(1),
    geographicScope: z.string().optional(),
    durationMonths: z.coerce.number().int().positive(),
  }),
  questions: [
    { id: 'companyName', label: 'Company Name', type: 'text', required: true },
    {
      id: 'employeeName',
      label: 'Employee/Contractor Name',
      type: 'text',
      required: true,
    },
    {
      id: 'restrictedActivities',
      label: 'Description of Restricted Activities',
      type: 'textarea',
      required: true,
    },
    {
      id: 'geographicScope',
      label: 'Geographic Scope of Restriction',
      type: 'text',
      placeholder:
        'e.g., 50 miles radius from main office, State of California',
    },
    {
      id: 'durationMonths',
      label: 'Duration of Restriction (Months after termination)',
      type: 'number',
      required: true,
    },
  ],
};
