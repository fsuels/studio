import type { LegalDocument } from '@/types/documents';
import { employmentContractSchema } from './schema';
import { employmentContractQuestions } from './questions';

export const employmentContractMeta: LegalDocument = {
  id: 'employment-contract',
  jurisdiction: 'US',
  category: 'Employment',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 12.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/employment-contract.md',
    es: '/templates/es/employment-contract.md',
  },
  schema: employmentContractSchema,
  questions: employmentContractQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Employment Contract',
      description:
        'Protect your business and establish clear expectations with new employees. Avoid misunderstandings about salary, benefits, and job responsibilities.',
      aliases: [
        'employment agreement',
        'job contract',
        'work agreement',
        'employee contract',
      ],
    },
    es: {
      name: 'Contrato de Empleo',
      description:
        'Protege tu negocio y establece expectativas claras con nuevos empleados. Evita malentendidos sobre salario, beneficios y responsabilidades laborales.',
      aliases: ['acuerdo de empleo', 'contrato laboral', 'acuerdo de trabajo'],
    },
  },
};
