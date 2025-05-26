import { z } from 'zod';
import type { LegalDocument } from '@/types/documents';

export const employmentTerminationLetter: LegalDocument = {
  id: 'employment-termination-letter',
  name: 'Employment Termination Letter',
  name_es: 'Carta de Terminación de Empleo',
  category: 'Employment',
  description: 'Formally notify an employee of their termination.',
  description_es: 'Notificar formalmente a un empleado de su despido.',
  aliases: ['fire employee', 'layoff letter', 'termination notice'],
  aliases_es: ['despedir empleado', 'carta de despido', 'aviso de terminación'],
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 5,
  states: 'all',
  templatePath: '/templates/en/termination-letter.md',
  templatePath_es: '/templates/es/termination-letter.md',
  schema: z.object({
    employerName: z.string().min(1, 'Employer name is required.'),
    employerAddress: z.string().min(1, 'Employer address is required.'),
    employeeName: z.string().min(1, 'Employee name is required.'),
    employeePosition: z.string().optional(),
    terminationDate: z.string().min(1, 'Termination date is required.'), // Should be date
    terminationReason: z.string().optional(),
    finalPaycheckDate: z.string().min(1, 'Final paycheck date is required.'), // Should be date
    supervisorName: z.string().min(1, 'Supervisor name is required.'),
    supervisorTitle: z.string().min(1, 'Supervisor title is required.'),
  }),
  questions: [
    {
      id: 'employerName',
      label: 'Employer / Company Name',
      type: 'text',
      required: true,
    },
    {
      id: 'employerAddress',
      label: 'Employer Address',
      type: 'textarea',
      required: true,
    },
    {
      id: 'employeeName',
      label: 'Employee Full Name',
      type: 'text',
      required: true,
    },
    { id: 'employeePosition', label: 'Position / Job Title', type: 'text' },
    {
      id: 'terminationDate',
      label: 'Termination Effective Date',
      type: 'date',
      required: true,
    },
    {
      id: 'terminationReason',
      label: 'Reason for Termination (brief)',
      type: 'textarea',
      placeholder: 'e.g. position eliminated, misconduct, performance',
    },
    {
      id: 'finalPaycheckDate',
      label: 'Final Paycheck Date',
      type: 'date',
      required: true,
    },
    {
      id: 'supervisorName',
      label: 'Supervisor Name',
      type: 'text',
      required: true,
    },
    {
      id: 'supervisorTitle',
      label: 'Supervisor Title',
      type: 'text',
      required: true,
    },
  ],
};
