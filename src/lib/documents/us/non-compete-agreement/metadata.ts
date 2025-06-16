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
    en: "en/us/non-compete-agreement.md", 
    es: "es/us/non-compete-agreement.md" 
  },
  upsellClauses: [],
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
};