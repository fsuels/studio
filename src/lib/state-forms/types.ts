// Types for scalable state-specific form system

export interface StateFormField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'boolean' | 'address' | 'textarea';
  required: boolean;
  placeholder?: string;
  tooltip?: string;
  options?: Array<{ value: string; label: string }>;
  validation?: {
    pattern?: string;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
  };
}

export interface StateFormConfig {
  stateCode: string;
  stateName: string;
  formName: string;
  formNumber?: string; // e.g., "HSMV-82050"
  pdfFileName: string;
  requiresNotary: boolean;
  requiresWitnesses?: number;
  specialRequirements?: string[];
  
  // Questions specific to this state's form
  fields: StateFormField[];
  
  // PDF field mappings (field ID -> PDF field name or coordinates)
  pdfMappings: Record<string, {
    pdfFieldName?: string; // For fillable PDFs
    coordinates?: { x: number; y: number; page: number }; // For non-fillable PDFs
  }>;
  
  // Optional custom validation rules
  customValidation?: (formData: Record<string, any>) => { valid: boolean; errors?: string[] };
}

export interface SavedFormData {
  id: string;
  userId: string;
  documentType: string;
  stateCode: string;
  formData: Record<string, any>;
  status: 'draft' | 'completed' | 'signed';
  createdAt: Date;
  updatedAt: Date;
  completionPercentage: number;
}