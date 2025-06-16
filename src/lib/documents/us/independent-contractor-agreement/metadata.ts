export const metadata = {
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
  templatePaths: { 
    en: "en/us/independent-contractor-agreement.md", 
    es: "es/us/independent-contractor-agreement.md" 
  },
  upsellClauses: [],
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
};