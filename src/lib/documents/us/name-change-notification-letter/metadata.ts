// src/lib/documents/us/name-change-notification-letter/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { NameChangeNotificationLetterSchema } from './schema';
import { nameChangeNotificationLetterQuestions } from './questions';

export const nameChangeNotificationLetterMeta: LegalDocument = {
  id: 'name-change-notification-letter',
  jurisdiction: 'US',
  category: 'Personal & Lifestyle',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 14.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/name-change-notification-letter.md',
    es: '/templates/es/name-change-notification-letter.md',
  },
  schema: NameChangeNotificationLetterSchema,
  questions: nameChangeNotificationLetterQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Name Change Notification Letter',
      description: 'Letter to notify institutions and organizations of legal name change.',
      aliases: ['name change letter', 'legal name update notification'],
    },
    es: {
      name: 'Carta de Notificación de Cambio de Nombre',
      description: 'Carta para notificar a instituciones sobre cambio legal de nombre.',
      aliases: ['carta de cambio de nombre', 'notificación de actualización de nombre'],
    },
  },
};