// src/components/workflow/ReviewStep/types.ts
import type { Question } from '@/types/documents';

export interface ReviewField {
  id: string;
  label: string;
  type: Question['type'];
  options?: Array<{ value: string | number; label: string }>;
  required: boolean;
  placeholder?: string;
  tooltip?: string;
}

export interface ZodDefExtras {
  placeholder?: string;
  tooltip?: string;
  labelKey?: string;
  uiType?: string;
}

export type FormValues = Record<string, unknown>;
