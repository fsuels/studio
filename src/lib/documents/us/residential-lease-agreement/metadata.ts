import type { LegalDocument } from '@/types/documents';
import { residentialLeaseAgreementSchema } from './schema';
import { residentialLeaseAgreementQuestions } from './questions';

export const residentialLeaseAgreementMeta: LegalDocument = {
  id: 'residential-lease-agreement',
  jurisdiction: 'US',
  category: 'Real Estate',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: true,
  offerNotarization: false,
  offerRecordingHelp: true,
  basePrice: 9.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/residential-lease-agreement.md',
    es: '/templates/es/residential-lease-agreement.md',
  },
  schema: residentialLeaseAgreementSchema,
  questions: residentialLeaseAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Residential Rental Agreement',
      description:
        "Secure quality housing or generate reliable rental income. Establish clear expectations that protect everyone's interests.",
      aliases: [
        'residential lease contract',
        'apartment lease',
        'rental lease',
        'home rental agreement',
      ],
    },
    es: {
      name: 'Contrato de Alquiler Residencial',
      description:
        'Alquila una casa o apartamento con términos que protegen tanto al inquilino como al propietario. Cubre renta, depósitos de seguridad y reglas de la casa.',
      aliases: [
        'contrato de arrendamiento residencial',
        'arrendamiento de apartamento',
        'contrato de alquiler',
        'acuerdo de alquiler de viviendas',
      ],
    },
  },
};
