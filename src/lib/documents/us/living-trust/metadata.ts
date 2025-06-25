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
        'Manage assets during life and distribute after death, potentially avoiding probate.',
      aliases: ['revocable trust', 'estate planning', 'avoid probate'],
    },
    es: {
      name: 'Fideicomiso en Vida (Revocable)',
      description:
        'Administra tu propiedad mientras vives y la transfiere a herederos sin pasar por corte sucesorio. Ahorra tiempo y dinero.',
      aliases: [
        'fideicomiso revocable',
        'planificación patrimonial',
        'evitar sucesorio',
      ],
    },
  },
};
