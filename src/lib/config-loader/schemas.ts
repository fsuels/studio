// Zod schemas for runtime validation of JSON document configurations
// These provide type safety and validation for the JSON-first configuration system

import { z } from 'zod';

// Base validation schemas
const JurisdictionSchema = z.string()
  .min(1, 'Jurisdiction is required')
  .regex(/^[a-z]{2}\/[a-z-]+$/, 'Jurisdiction must be in format "us/state-name"')
  .describe('Jurisdiction in format "us/state-name" (e.g., "us/florida")');

const DocTypeSchema = z.string()
  .min(1, 'Document type is required')
  .regex(/^[a-z0-9-]+$/, 'Document type must be lowercase with hyphens')
  .describe('Document type identifier (e.g., "vehicle-bill-of-sale")');

const SchemaVersionSchema = z.string()
  .regex(/^\d+\.\d+$/, 'Schema version must be in format "major.minor"')
  .describe('Schema version in semantic format (e.g., "1.0")');

const FormVersionSchema = z.string()
  .regex(/^\d{4}\.\d+$/, 'Form version must be in format "YYYY.N"')
  .optional()
  .describe('PDF form version in format "YYYY.N" (e.g., "2024.1")');

const LastUpdatedSchema = z.string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Last updated must be in ISO date format')
  .describe('Last updated date in ISO format (YYYY-MM-DD)');

// Question configuration schemas
const QuestionTypeSchema = z.enum([
  'text', 
  'select', 
  'number', 
  'date', 
  'boolean', 
  'textarea', 
  'address'
]).describe('Type of form input for this question');

const OptionSchema = z.object({
  value: z.string().min(1, 'Option value is required'),
  label: z.string().min(1, 'Option label is required')
}).describe('Option for select-type questions');

const ValidationSchema = z.object({
  min: z.number().optional().describe('Minimum value for number inputs'),
  max: z.number().optional().describe('Maximum value for number inputs'),
  pattern: z.string().optional().describe('Regex pattern for text validation'),
  message: z.string().optional().describe('Custom validation error message')
}).optional().describe('Field validation rules');

export const QuestionConfigSchema = z.object({
  id: z.string()
    .min(1, 'Question ID is required')
    .regex(/^[a-z_][a-z0-9_]*$/, 'Question ID must be valid identifier')
    .describe('Unique identifier for this question'),
  
  label: z.string()
    .min(1, 'Question label is required')
    .describe('Display label for the question'),
  
  type: QuestionTypeSchema,
  
  required: z.boolean()
    .describe('Whether this question is required'),
  
  options: z.array(OptionSchema)
    .optional()
    .describe('Options for select-type questions'),
  
  placeholder: z.string()
    .optional()
    .describe('Placeholder text for input fields'),
  
  tooltip: z.string()
    .optional()
    .describe('Help text displayed to users'),
  
  validation: ValidationSchema
}).describe('Configuration for a single form question');

// Compliance configuration schema
export const ComplianceConfigSchema = z.object({
  requiresNotary: z.union([
    z.boolean(),
    z.literal('conditional')
  ]).describe('Whether notarization is required'),
  
  officialForm: z.string()
    .optional()
    .describe('Name of official state form (e.g., "HSMV 82050")'),
  
  billOfSaleMandatory: z.boolean()
    .describe('Whether a bill of sale is mandatory'),
  
  odometerIntegrated: z.boolean()
    .describe('Whether odometer disclosure is integrated'),
  
  specialNotes: z.string()
    .optional()
    .describe('Special compliance notes or requirements'),
  
  localFormPath: z.string()
    .optional()
    .describe('Path to local PDF form file')
}).describe('Legal compliance requirements');

// PDF overlay configuration schema
const CoordinatesSchema = z.object({
  x: z.number()
    .min(0, 'X coordinate must be positive')
    .describe('X coordinate in PDF points'),
  
  y: z.number()
    .min(0, 'Y coordinate must be positive')
    .describe('Y coordinate in PDF points'),
  
  page: z.number()
    .int()
    .min(0, 'Page number must be non-negative')
    .optional()
    .default(0)
    .describe('Page number (0-indexed)'),
  
  width: z.number()
    .min(0, 'Width must be positive')
    .optional()
    .describe('Field width in PDF points'),
  
  height: z.number()
    .min(0, 'Height must be positive')
    .optional()
    .describe('Field height in PDF points')
}).describe('PDF coordinates for field placement');

const FieldMappingSchema = z.object({
  fieldId: z.string()
    .min(1, 'Field ID is required')
    .describe('ID of the form field to map'),
  
  coordinates: CoordinatesSchema
    .optional()
    .describe('Coordinates for manual field placement'),
  
  acroFieldNames: z.array(z.string())
    .optional()
    .describe('AcroForm field names to try for smart filling'),
  
  fontSize: z.number()
    .min(6, 'Font size must be at least 6pt')
    .max(72, 'Font size must be at most 72pt')
    .optional()
    .default(10)
    .describe('Font size for text rendering')
}).describe('Mapping from form field to PDF placement');

// Simple coordinate mapping for direct placement
const CoordinateMapSchema = z.record(
  z.string(),
  z.object({
    x: z.number(),
    y: z.number(),
    page: z.number().optional().default(0),
    fontSize: z.number().optional().default(10),
    width: z.number().optional(),
    height: z.number().optional()
  }).optional()
).describe('Map of field IDs to their coordinates');

export const OverlayConfigSchema = z.object({
  pdfPath: z.string()
    .optional()
    .describe('Relative path to blank PDF form'),
  
  fieldMappings: z.array(FieldMappingSchema)
    .min(1, 'At least one field mapping is required')
    .optional()
    .describe('Array of field-to-PDF mappings'),
  
  coordinates: CoordinateMapSchema
    .optional()
    .describe('Simple coordinate-based field placement'),
  
  fieldMapping: z.record(z.string(), z.object({
    fieldName: z.string().describe('Exact PDF AcroForm field name'),
    exact: z.array(z.string()).optional(),
    partial: z.array(z.string()).optional(),
    fuzzy: z.array(z.string()).optional()
  })).optional()
    .describe('Direct mapping to PDF AcroForm field names')
}).refine(
  (data) => data.fieldMappings || data.coordinates || data.fieldMapping,
  'At least one of fieldMappings, coordinates, or fieldMapping must be provided'
).describe('Configuration for PDF form overlay');

// Main document configuration schema
export const DocumentConfigSchema = z.object({
  jurisdiction: JurisdictionSchema,
  docType: DocTypeSchema,
  schemaVersion: SchemaVersionSchema,
  formVersion: FormVersionSchema,
  lastUpdated: LastUpdatedSchema,
  
  questions: z.array(QuestionConfigSchema)
    .min(1, 'At least one question is required')
    .describe('Array of form questions'),
  
  compliance: ComplianceConfigSchema,
  
  overlayConfig: OverlayConfigSchema
    .optional()
    .describe('PDF overlay configuration (for official forms)')
}).describe('Complete document configuration');

// Specialized schemas for partial configs
export const BaseDocumentConfigSchema = DocumentConfigSchema.pick({
  jurisdiction: true,
  docType: true,
  schemaVersion: true,
  formVersion: true,
  lastUpdated: true
}).describe('Base document metadata');

export const QuestionsOnlySchema = z.object({
  questions: z.array(QuestionConfigSchema)
}).describe('Questions-only configuration');

export const ComplianceOnlySchema = z.object({
  compliance: ComplianceConfigSchema
}).describe('Compliance-only configuration');

export const OverlayOnlySchema = z.object({
  overlayConfig: OverlayConfigSchema
}).describe('Overlay-only configuration');

// Validation helper functions
export function validateDocumentConfig(data: unknown): DocumentConfigSchema {
  try {
    return DocumentConfigSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => 
        `${err.path.join('.')}: ${err.message}`
      ).join('; ');
      throw new Error(`Configuration validation failed: ${errorMessages}`);
    }
    throw error;
  }
}

export function validateQuestionConfig(data: unknown): QuestionConfigSchema {
  return QuestionConfigSchema.parse(data);
}

export function validateComplianceConfig(data: unknown): ComplianceConfigSchema {
  return ComplianceConfigSchema.parse(data);
}

export function validateOverlayConfig(data: unknown): OverlayConfigSchema {
  return OverlayConfigSchema.parse(data);
}

// Type inference from schemas
export type DocumentConfig = z.infer<typeof DocumentConfigSchema>;
export type QuestionConfig = z.infer<typeof QuestionConfigSchema>;
export type ComplianceConfig = z.infer<typeof ComplianceConfigSchema>;
export type OverlayConfig = z.infer<typeof OverlayConfigSchema>;
export type FieldMapping = z.infer<typeof FieldMappingSchema>;
export type Coordinates = z.infer<typeof CoordinatesSchema>;

// Schema registry for dynamic validation
export const SchemaRegistry = {
  document: DocumentConfigSchema,
  questions: QuestionsOnlySchema,
  compliance: ComplianceOnlySchema,
  overlay: OverlayOnlySchema,
  base: BaseDocumentConfigSchema
} as const;

export type SchemaType = keyof typeof SchemaRegistry;

// Validation with specific schema type
export function validateWithSchema<T extends SchemaType>(
  schemaType: T,
  data: unknown
): z.infer<typeof SchemaRegistry[T]> {
  const schema = SchemaRegistry[schemaType];
  return schema.parse(data);
}

// Migration helpers for converting TypeScript configs to JSON
export function createConfigFromLegacy(
  legacyCompliance: any,
  legacyQuestions: any[],
  metadata: {
    jurisdiction: string;
    docType: string;
    schemaVersion: string;
    lastUpdated: string;
  }
): DocumentConfig {
  const config = {
    ...metadata,
    formVersion: legacyCompliance.formVersion,
    questions: legacyQuestions.map(q => ({
      id: q.id,
      label: q.label,
      type: q.type,
      required: q.required,
      options: q.options,
      placeholder: q.placeholder,
      tooltip: q.tooltip
    })),
    compliance: {
      requiresNotary: legacyCompliance.requiresNotary,
      officialForm: legacyCompliance.officialForm,
      billOfSaleMandatory: legacyCompliance.billOfSaleMandatory,
      odometerIntegrated: legacyCompliance.odometerIntegrated,
      specialNotes: legacyCompliance.specialNotes,
      localFormPath: legacyCompliance.localFormPath
    }
  };
  
  // Validate the converted config
  return validateDocumentConfig(config);
}

// Development helpers
export function getSchemaDescription(schemaType: SchemaType): string {
  const schema = SchemaRegistry[schemaType];
  return schema.description || `Schema for ${schemaType}`;
}

export function getValidationExample(schemaType: SchemaType): any {
  switch (schemaType) {
    case 'document':
      return {
        jurisdiction: 'us/florida',
        docType: 'vehicle-bill-of-sale',
        schemaVersion: '1.0',
        formVersion: '2024.1',
        lastUpdated: '2025-01-18',
        questions: [{
          id: 'seller_name',
          label: 'Seller Name',
          type: 'text',
          required: true,
          tooltip: 'Enter the full legal name of the seller'
        }],
        compliance: {
          requiresNotary: true,
          officialForm: 'HSMV 82050',
          billOfSaleMandatory: true,
          odometerIntegrated: true,
          specialNotes: 'Must use official form with notarization'
        }
      };
    case 'questions':
      return {
        questions: [{
          id: 'example_field',
          label: 'Example Field',
          type: 'text',
          required: true
        }]
      };
    case 'compliance':
      return {
        compliance: {
          requiresNotary: true,
          billOfSaleMandatory: true,
          odometerIntegrated: true
        }
      };
    case 'overlay':
      return {
        overlayConfig: {
          pdfPath: 'blank-form.pdf',
          fieldMappings: [{
            fieldId: 'seller_name',
            coordinates: { x: 100, y: 200, page: 0 },
            acroFieldNames: ['seller', 'sellerName'],
            fontSize: 12
          }]
        }
      };
    default:
      return {};
  }
}