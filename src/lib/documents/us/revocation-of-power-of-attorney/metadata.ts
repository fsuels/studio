export const metadata = {
  id: 'revocation-of-power-of-attorney',
  jurisdiction: 'US',
  category: 'Legal',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 8,
  states: 'all',
  templatePaths: { 
    en: "en/us/revocation-of-power-of-attorney.md", 
    es: "es/us/revocation-of-power-of-attorney.md" 
  },
  upsellClauses: [],
  translations: {
    en: {
      name: 'Revocation of Power of Attorney',
      description:
        'Officially revoke a previously granted power of attorney and terminate the agent\'s authority.',
      aliases: ['revoke poa', 'cancel power of attorney', 'terminate agent authority', 'poa revocation'],
    },
    es: {
      name: 'Revocación de Poder Notarial',
      description:
        'Revocar oficialmente un poder notarial previamente otorgado y terminar la autoridad del agente.',
      aliases: ['revocar poder', 'cancelar poder notarial', 'terminar autoridad agente'],
    },
  },
};