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
    en: 'en/us/independent-contractor-agreement.md',
    es: 'es/us/independent-contractor-agreement.md',
  },
  upsellClauses: [],
  translations: {
    en: {
      name: 'Independent Contractor Agreement',
      description:
        'Protect your business when hiring freelancers and avoid IRS problems. Clearly establish they are contractors, not employees, to prevent tax issues.',
      aliases: ['freelance', 'contractor', 'gig work', '1099 job'],
    },
    es: {
      name: 'Contrato de Contratista Independiente',
      description:
        'Protege tu negocio al contratar freelancers y evita problemas con el IRS. Establece claramente que son contratistas independientes, no empleados.',
      aliases: ['freelance', 'contratista', 'trabajo gig', 'trabajo 1099'],
    },
  },
};
