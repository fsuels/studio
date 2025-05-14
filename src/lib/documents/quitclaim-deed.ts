import { z } from 'zod';
import type { LegalDocument } from '@/types/documents';
import { usStates } from '../usStates'; // Adjusted path

export const quitclaimDeed: LegalDocument = {
  id: 'quitclaim-deed',
  name: 'Quitclaim Deed',
  name_es: 'Escritura de Finiquito',
  category: 'Real Estate',
  description: 'Transfer property interest without warranty of title.',
  description_es: 'Transferir interés en una propiedad sin garantía de título.',
  aliases: ["property transfer", "quit claim deed", "transfer ownership"],
  aliases_es: ["transferencia de propiedad", "escritura de finiquito", "transferir titularidad"],
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: true,
  offerNotarization: true,
  offerRecordingHelp: true,
  basePrice: 5,
  states: 'all',
  schema: z.object({}), // Placeholder
  questions: [] // Placeholder
};