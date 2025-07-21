export const metadata = {
  id: 'living-trust',
  jurisdiction: 'US',
  category: 'Estate Planning',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 10,
  states: 'all',
  templatePaths: {
    en: 'en/us/living-trust.md',
    es: 'es/us/living-trust.md',
  },
  upsellClauses: [],
  translations: {
    en: {
      name: 'Living Trust (Revocable)',
      description:
        "Protect your family's privacy and wealth from expensive probate. Transfer assets quickly while maintaining confidentiality.",
      aliases: ['revocable trust', 'estate planning', 'avoid probate'],
    },
    es: {
      name: 'Fideicomiso en Vida (Revocable)',
      description:
        'Asegura que tu familia reciba tu herencia rápidamente y sin complicaciones legales. Evita el costoso proceso de corte sucesorio y protege tu privacidad.',
      aliases: [
        'fideicomiso revocable',
        'planificación patrimonial',
        'evitar sucesorio',
      ],
    },
  },
};
