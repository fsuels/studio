// src/types/documents.ts
import type { z } from 'zod';

// Define the structure for a single question
export type Question = {
  id: string;
  label: string; // Can be a direct string or an i18n key
  placeholder?: string; // Can be a direct string or an i18n key
  required?: boolean;
  type:
    | 'text'
    | 'select'
    | 'date'
    | 'number'
    | 'textarea'
    | 'boolean'
    | 'address'
    | 'tel'
    | 'button'; // Add button type for +ADD buttons
  options?: { value: string; label: string }[]; // Labels can be direct strings or i18n keys
  stateSpecific?: string[];
  helperText?: string; // Can be a direct string or an i18n key
  tooltip?: string; // Can be a direct string or an i18n key
  uiType?: 'textarea' | 'switch' | 'radio'; // Optional UI hint for Zod-derived fields
  conditional?: {
    field: string;
    value: any;
  }; // Conditional rendering based on another field
  buttonAction?: string; // For button type - what action to perform
};

// Define structure for upsell clauses with translations
export type LocalizedUpsellClause = {
  description: string; // i18n key or direct string
};

export type UpsellClause = {
  id: string;
  price: number;
  translations?: {
    [lang: string]: LocalizedUpsellClause;
  };
  description?: string; // Fallback if translations object is not used
  description_es?: string; // Fallback for Spanish if translations object is not used
};

// Structure for localized name, description, and aliases
export type LocalizedText = {
  name: string; // i18n key or direct string
  description: string; // i18n key or direct string
  aliases?: string[]; // Array of i18n keys or direct strings
};

// Define the structure for a single legal document
export type LegalDocument = {
  id: string;
  jurisdiction?: string; // e.g., 'US', 'CA'
  category: string;
  states?: string[] | 'all'; // Applies to the jurisdiction
  schema: z.ZodTypeAny; // Allow raw objects or schemas with effects
  questions?: Question[];

  // Core display text (can be direct or i18n keys)
  // Prefer using the 'translations' object below for better organization
  name?: string;
  description?: string;
  name_es?: string; // Deprecated in favor of translations object
  description_es?: string; // Deprecated in favor of translations object
  aliases?: string[]; // Deprecated in favor of translations object
  aliases_es?: string[]; // Deprecated in favor of translations object

  // Search keywords for intelligent document discovery
  keywords?: string[]; // Comprehensive keywords in English
  keywords_es?: string[]; // Comprehensive keywords in Spanish
  searchTerms?: string[]; // Additional search terms and phrases

  translations?: {
    [lang: string]: LocalizedText;
  };

  // Language support
  languageSupport: string[]; // Array of language codes e.g. ['en', 'es', 'fr']

  // Pricing and Features
  basePrice: number;
  requiresNotarization: boolean;
  canBeRecorded: boolean;
  offerNotarization: boolean;
  offerRecordingHelp: boolean;
  upsellClauses?: UpsellClause[];
  requiresNotarizationStates?: string[]; // Specific states within its jurisdiction

  // Template paths (relative to /public folder)
  // Prefer templatePaths over individual templatePath/templatePath_es for multi-language
  templatePaths?: {
    [lang: string]: string; // e.g., { en: '/templates/en/my-doc.md', es: '/templates/es/my-doc.md' }
  };
  templatePath?: string; // Fallback for English if templatePaths.en is not set
  templatePath_es?: string; // Fallback for Spanish if templatePaths.es is not set
};

// Type for document metadata (everything except schema and questions)
export type DocumentMetadata = Omit<LegalDocument, 'schema' | 'questions'>;

// Alias for backward compatibility
export type QuestionConfig = Question;
