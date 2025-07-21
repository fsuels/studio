export const metadata = {
  id: 'joint-living-trust',
  jurisdiction: 'US',
  category: 'Estate Planning',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 18,
  states: 'all',
  templatePaths: {
    en: 'en/us/joint-living-trust.md',
    es: 'es/us/joint-living-trust.md',
  },
  upsellClauses: [],
  translations: {
    en: {
      name: 'Joint Living Trust (Married Couples)',
      description:
        'A revocable living trust for married couples to manage joint assets and provide for each other and beneficiaries.',
      aliases: [
        'joint trust',
        'married couple trust',
        'joint revocable trust',
        'family trust',
      ],
    },
    es: {
      name: 'Fideicomiso Conjunto en Vida (Parejas Casadas)',
      description:
        'Un fideicomiso en vida revocable para parejas casadas para administrar activos conjuntos y proveer el uno para el otro y beneficiarios.',
      aliases: [
        'fideicomiso conjunto',
        'fideicomiso de pareja',
        'fideicomiso familiar',
      ],
    },
  },
};
