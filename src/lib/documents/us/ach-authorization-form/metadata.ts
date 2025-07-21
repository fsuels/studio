// src/lib/documents/us/ach-authorization-form/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { AchAuthorizationFormSchema } from './schema';
import { achAuthorizationFormQuestions } from './questions';

export const achAuthorizationFormMeta: LegalDocument = {
  id: 'ach-authorization-form',
  jurisdiction: 'US',
  category: 'Business',
  languageSupport: ['en', 'es'],
  basePrice: 5,
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  states: 'all',
  templatePaths: {
    en: '/templates/en/ach-authorization-form.md',
    es: '/templates/es/ach-authorization-form.md',
  },
  schema: AchAuthorizationFormSchema,
  questions: achAuthorizationFormQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'ACH Authorization Form',
      description:
        'Authorize automatic bank transfers (ACH) for recurring or one-time payments.',
      aliases: [
        'bank authorization',
        'automatic payment form',
        'direct debit authorization',
        'electronic payment form',
      ],
    },
    es: {
      name: 'Formulario de Autorización ACH',
      description:
        'Permite retiros automáticos del banco para facturas, renta o pagos de préstamos. Forma conveniente de configurar pagos recurrentes.',
      aliases: [
        'autorización bancaria',
        'formulario de pago automático',
        'autorización de débito directo',
        'formulario de pago electrónico',
      ],
    },
  },
};
