// src/components/workflow/ReviewStep/constants.ts

/**
 * Fields that should be excluded from the review step
 */
export const EXCLUDED_FIELDS = ['notarizationPreference'] as const;

/**
 * Special field configurations for common field types
 */
export const SPECIAL_FIELD_CONFIGS = {
  ODO_STATUS: {
    id: 'odo_status',
    options: [
      {
        value: 'ACTUAL',
        translationKey: 'documents:fields.odo_status.options.ACTUAL',
      },
      {
        value: 'EXCEEDS',
        translationKey: 'documents:fields.odo_status.options.EXCEEDS',
      },
      {
        value: 'NOT_ACTUAL',
        translationKey: 'documents:fields.odo_status.options.NOT_ACTUAL',
      },
    ],
  },
} as const;
