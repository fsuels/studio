// src/types/documents.ts
import type { z } from 'zod';

// Define the structure for a single question
export type Question = {
  id: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  type: 'text' | 'select' | 'date' | 'number' | 'textarea' | 'boolean' | 'address';
  options?: { value: string; label: string }[];
  stateSpecific?: string[];
  helperText?: string;
  tooltip?: string;
};

// Define structure for upsell clauses
export type UpsellClause = {
  id: string;
  description: string;
  description_es?: string;
  price: number;
};

// Define the structure for a single legal document
export type LegalDocument = {
  id: string;
  name: string;
  name_es?: string;
  aliases?: string[];
  aliases_es?: string[];
  category: string;
  states?: string[] | 'all';
  questions?: Question[];
  schema: z.AnyZodObject; // Use AnyZodObject for broader compatibility
  description: string;
  description_es?: string;
  requiresNotarization: boolean;
  canBeRecorded: boolean;
  offerNotarization: boolean;
  offerRecordingHelp: boolean;
  basePrice: number;
  languageSupport: string[];
  upsellClauses?: UpsellClause[];
  templatePath?: string;
  templatePath_es?: string;
  requiresNotarizationStates?: string[];
};
