import type { DocumentMetadata } from '@/types/documents';

export const metadata: DocumentMetadata = {
  id: 'employment-termination-letter',
  jurisdiction: 'US',
  category: 'Employment',
  translations: {
    en: {
      name: 'Employment Termination Letter',
      description: 'Formally notify an employee of their termination.',
      aliases: ['fire employee', 'layoff letter', 'termination notice'],
    },
    es: {
      name: 'Carta de Terminación de Empleo',
      description: 'Notificar formalmente a un empleado de su despido.',
      aliases: ['despedir empleado', 'carta de despido', 'aviso de terminación'],
    },
  },
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 5,
  states: 'all',
  templatePaths: {
    en: '/templates/en/termination-letter.md',
    es: '/templates/es/termination-letter.md',
  },
  upsellClauses: [],
};