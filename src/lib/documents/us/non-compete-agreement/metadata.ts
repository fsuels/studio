export const metadata = {
  id: 'non-compete-agreement',
  jurisdiction: 'US',
  category: 'Business',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 5,
  states: 'all',
  templatePaths: {
    en: 'en/us/non-compete-agreement.md',
    es: 'es/us/non-compete-agreement.md',
  },
  upsellClauses: [],
  translations: {
    en: {
      name: 'Non-Compete Agreement',
      description:
        'Protect your business secrets and customer relationships by preventing employees from becoming competitors.',
      aliases: ['restrict competition', 'former employee', 'noncompete'],
    },
    es: {
      name: 'Acuerdo de No Competencia',
      description:
        'Restringir a un empleado o contratista de competir después de la terminación.',
      aliases: ['restringir competencia', 'ex empleado', 'no competencia'],
    },
  },
};
