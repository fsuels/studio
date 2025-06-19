import type { LegalDocument } from '@/types/documents';

export const singleMemberLlcOperatingAgreementMeta: Omit<LegalDocument, 'schema' | 'questions'> = {
  id: 'single-member-llc-operating-agreement',
  jurisdiction: 'US',
  category: 'Business',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 25,
  states: 'all',
  templatePaths: {
    en: '/templates/en/single-member-llc-operating-agreement.md',
    es: '/templates/es/single-member-llc-operating-agreement.md',
  },
  upsellClauses: [],
  translations: {
    en: {
      name: 'Single-Member LLC Operating Agreement',
      description:
        'Operating agreement for single-member limited liability companies to establish ownership structure and operational procedures.',
      aliases: ['Single member LLC agreement', 'Solo LLC operating agreement', 'Single owner LLC agreement'],
    },
    es: {
      name: 'Acuerdo Operativo de LLC de Miembro Único',
      description:
        'Acuerdo operativo para sociedades de responsabilidad limitada de un solo miembro para establecer la estructura de propiedad y procedimientos operativos.',
      aliases: ['Acuerdo LLC de un miembro', 'Acuerdo operativo LLC solo', 'Acuerdo LLC propietario único'],
    },
  },
};