export const metadata = {
  id: 'lease-agreement',
  jurisdiction: 'US',
  category: 'Real Estate',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: true,
  offerNotarization: false,
  offerRecordingHelp: true,
  basePrice: 5,
  states: 'all',
  templatePaths: {
    en: 'en/us/lease-agreement.md',
    es: 'es/us/lease-agreement.md',
  },
  upsellClauses: [],
  translations: {
    en: {
      name: 'Residential Lease Agreement',
      description: 'Generate rental income or secure quality housing with clear terms that protect both parties. Prevent costly disputes.',
      aliases: ['rent apartment', 'tenant', 'lease form', 'landlord agreement'],
    },
    es: {
      name: 'Contrato de Arrendamiento Residencial',
      description:
        'Protege tus derechos como propietario o inquilino. Establece expectativas claras sobre renta, depósitos, reparaciones y reglas de la propiedad.',
      aliases: [
        'alquiler de apartamento',
        'inquilino',
        'formulario de arrendamiento',
        'acuerdo de propietario',
      ],
    },
  },
};
