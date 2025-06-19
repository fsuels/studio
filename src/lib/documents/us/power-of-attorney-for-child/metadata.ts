export const metadata = {
  id: 'power-of-attorney-for-child',
  jurisdiction: 'US',
  category: 'Estate Planning',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 8,
  states: 'all',
  templatePaths: { 
    en: "en/us/power-of-attorney-for-child.md", 
    es: "es/us/power-of-attorney-for-child.md" 
  },
  upsellClauses: [],
  translations: {
    en: {
      name: 'Power of Attorney for Minor Child',
      description:
        'Grant temporary authority to another person to make decisions for your minor child when you are unavailable.',
      aliases: ['child poa', 'minor child power of attorney', 'temporary guardianship', 'child care authorization'],
    },
    es: {
      name: 'Poder Notarial para Menor de Edad',
      description:
        'Otorgar autoridad temporal a otra persona para tomar decisiones por su hijo menor cuando usted no esté disponible.',
      aliases: ['poder para menor', 'autorización cuidado menor', 'tutela temporal'],
    },
  },
};