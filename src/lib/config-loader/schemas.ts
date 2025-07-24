// Zod schemas for runtime validation of JSON document configurations
// These provide type safety and validation for the JSON-first configuration system

import { z } from 'zod';

/* ----------------------- Base validation schemas ----------------------- */

const JurisdictionSchema = z
  .string()
  .min(1, 'Jurisdiction is required')
  .regex(/^[a-z]{2}\/[a-z-]+$/, 'Jurisdiction must be in format "us/state-name"')
  .describe('Jurisdiction in format "us/state-name" (e.g., "us/florida")');

const DocTypeSchema = z
  .string()
  .min(1, 'Document type is required')
  .regex(/^[a-z0-9-]+$/, 'Document type must be lowercase with hyphens')
  .describe('Document type identifier (e.g., "vehicle-bill-of-sale")');

const SchemaVersionSchema = z
  .string()
  .regex(/^\d+\.\d+$/, 'Schema version must be in format "major.minor"')
  .describe('Schema version in semantic format (e.g., "1.0")');

const FormVersionSchema = z
  .string()
  .regex(/^\d{4}\.\d+$/, 'Form version must be in format "YYYY.N"')
  .optional()
  .describe('PDF form version in format "YYYY.N" (e.g., "2024.1")');

const LastUpdatedSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Last updated must be in ISO date format')
  .describe('Last updated date in ISO format (YYYY-MM-DD)');

/* ----------------------- Question configuration ----------------------- */

const QuestionTypeSchema = z.enum([
  'text',
  'select',
  'number',
  'date',
  'boolean',
  'textarea',
  'address',
]);

const OptionSchema = z.object({
  value: z.string().min(1, 'Option value is required'),
  label: z.string().min(1, 'Option label is required'),
});

const ValidationSchema = z
  .object({
    min: z.number().optional(),
    max: z.number().optional(),
    pattern: z.string().optional(),
    message: z.string().optional(),
  })
  .optional();

export const QuestionConfigSchema = z.object({
  id: z
    .string()
    .min(1, 'Question ID is required')
    .regex(/^[a-z_][a-z0-9_]*$/, 'Question ID must be a valid identifier'),

  label: z.string().min(1, 'Question label is required'),

  type: QuestionTypeSchema,

  required: z.boolean(),

  options: z.array(OptionSchema).optional(),

  placeholder: z.string().optional(),

  tooltip: z.string().optional(),

  validation: ValidationSchema,
});

/* ----------------------- Compliance configuration ----------------------- */

export const ComplianceConfigSchema = z.object({
  requiresNotary: z.union([z.boolean(), z.literal('conditional')]),
  officialForm: z.string().optional(),
  billOfSaleMandatory: z.boolean(),
  odometerIntegrated: z.boolean(),
  specialNotes: z.string().optional(),
  localFormPath: z.string().optional(),
});

/* ----------------------- Overlay configuration ----------------------- */

const CoordinatesSchema = z.object({
  x: z.number().min(0, 'X coordinate must be positive'),
  y: z.number().min(0, 'Y coordinate must be positive'),
  page: z.number().int().min(0).optional().default(0),
  width: z.number().min(0).optional(),
  height: z.number().min(0).optional(),
  fontSize: z.number().min(6).max(72).optional(),
});

const CoordinateMapSchema = z.record(
  z.string(),
  z
    .object({
      x: z.number(),
      y: z.number(),
      page: z.number().optional().default(0),
      fontSize: z.number().optional().default(10),
      width: z.number().optional(),
      height: z.number().optional(),
    })
    .optional()
);

const FieldMappingSchema = z.object({
  fieldId: z.string().min(1),
  coordinates: CoordinatesSchema.optional(),
  acroFieldNames: z.array(z.string()).optional(),
  fontSize: z.number().min(6).max(72).optional().default(10),
});

export const OverlayConfigSchema = z
  .object({
    pdfPath: z.string().optional(),

    // NOTE: allow empty array; the refine below will enforce "at least one usable mapping"
    fieldMappings: z.array(FieldMappingSchema).optional(),

    coordinates: CoordinateMapSchema.optional(),

    // Direct AcroForm mapping
    fieldMapping: z
      .record(
        z.string(),
        z.object({
          fieldName: z.string(),
          exact: z.array(z.string()).optional(),
          partial: z.array(z.string()).optional(),
          fuzzy: z.array(z.string()).optional(),
        })
      )
      .optional(),
  })
  .refine(
    (data) => {
      const hasFieldMapping =
        !!data.fieldMapping && Object.keys(data.fieldMapping).length > 0;
      const hasCoordinates =
        !!data.coordinates && Object.keys(data.coordinates).length > 0;
      const hasFieldMappings =
        !!data.fieldMappings && data.fieldMappings.length > 0;

      return hasFieldMapping || hasCoordinates || hasFieldMappings;
    },
    {
      message:
        'At least one of fieldMapping, coordinates, or fieldMappings must contain entries',
    }
  );

/* ----------------------- Document configuration ----------------------- */

export const DocumentConfigSchema = z.object({
  jurisdiction: JurisdictionSchema,
  docType: DocTypeSchema,
  schemaVersion: SchemaVersionSchema,
  formVersion: FormVersionSchema,
  lastUpdated: LastUpdatedSchema,

  questions: z.array(QuestionConfigSchema).min(1).optional(),

  compliance: ComplianceConfigSchema,

  overlayConfig: OverlayConfigSchema.optional(),
});

/* ----------------------- Partial schemas ----------------------- */

export const BaseDocumentConfigSchema = DocumentConfigSchema.pick({
  jurisdiction: true,
  docType: true,
  schemaVersion: true,
  formVersion: true,
  lastUpdated: true,
});

export const QuestionsOnlySchema = z.object({
  questions: z.array(QuestionConfigSchema),
});

export const ComplianceOnlySchema = z.object({
  compliance: ComplianceConfigSchema,
});

export const OverlayOnlySchema = z.object({
  overlayConfig: OverlayConfigSchema,
});

/* ----------------------- Types ----------------------- */

export type DocumentConfig = z.infer<typeof DocumentConfigSchema>;
export type QuestionConfig = z.infer<typeof QuestionConfigSchema>;
export type ComplianceConfig = z.infer<typeof ComplianceConfigSchema>;
export type OverlayConfig = z.infer<typeof OverlayConfigSchema>;
export type FieldMapping = z.infer<typeof FieldMappingSchema>;
export type Coordinates = z.infer<typeof CoordinatesSchema>;

export const SchemaRegistry = {
  document: DocumentConfigSchema,
  questions: QuestionsOnlySchema,
  compliance: ComplianceOnlySchema,
  overlay: OverlayOnlySchema,
  base: BaseDocumentConfigSchema,
} as const;

export type SchemaType = keyof typeof SchemaRegistry;

/* ----------------------- Validation helpers ----------------------- */

export function validateDocumentConfig(data: unknown): DocumentConfig {
  try {
    return DocumentConfigSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join('; ');
      throw new Error(`Configuration validation failed: ${errorMessages}`);
    }
    throw error;
  }
}

export function validateQuestionConfig(data: unknown): QuestionConfig {
  return QuestionConfigSchema.parse(data);
}

export function validateComplianceConfig(data: unknown): ComplianceConfig {
  return ComplianceConfigSchema.parse(data);
}

export function validateOverlayConfig(data: unknown): OverlayConfig {
  return OverlayConfigSchema.parse(data);
}

export function validateWithSchema<T extends SchemaType>(
  schemaType: T,
  data: unknown
): z.infer<(typeof SchemaRegistry)[T]> {
  const schema = SchemaRegistry[schemaType];
  return schema.parse(data);
}

/* ----------------------- Legacy migration helpers ----------------------- */

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
  const config: DocumentConfig = {
    ...metadata,
    formVersion: legacyCompliance.formVersion,
    questions: legacyQuestions.map((q) => ({
      id: q.id,
      label: q.label,
      type: q.type,
      required: q.required,
      options: q.options,
      placeholder: q.placeholder,
      tooltip: q.tooltip,
    })),
    compliance: {
      requiresNotary: legacyCompliance.requiresNotary,
      officialForm: legacyCompliance.officialForm,
      billOfSaleMandatory: legacyCompliance.billOfSaleMandatory,
      odometerIntegrated: legacyCompliance.odometerIntegrated,
      specialNotes: legacyCompliance.specialNotes,
      localFormPath: legacyCompliance.localFormPath,
    },
  };

  return validateDocumentConfig(config);
}

/* ----------------------- Dev helpers ----------------------- */

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
        questions: [
          {
            id: 'seller_name',
            label: 'Seller Name',
            type: 'text',
            required: true,
            tooltip: 'Enter the full legal name of the seller',
          },
        ],
        compliance: {
          requiresNotary: true,
          officialForm: 'HSMV 82050',
          billOfSaleMandatory: true,
          odometerIntegrated: true,
          specialNotes: 'Must use official form with notarization',
        },
      };
    case 'questions':
      return {
        questions: [
          {
            id: 'example_field',
            label: 'Example Field',
            type: 'text',
            required: true,
          },
        ],
      };
    case 'compliance':
      return {
        compliance: {
          requiresNotary: true,
          billOfSaleMandatory: true,
          odometerIntegrated: true,
        },
      };
    case 'overlay':
      return {
        overlayConfig: {
          pdfPath: 'blank-form.pdf',
          coordinates: {
            seller_name: { x: 100, y: 200, page: 0, fontSize: 12 },
          },
        },
      };
    default:
      return {};
  }
}
