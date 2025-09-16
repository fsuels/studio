// Universal Document Intelligence System Types
// This system handles ANY document type, ANY jurisdiction, ANY language

export type DocumentType = 
  | 'vehicle-bill-of-sale'
  | 'employment-contract'
  | 'nda'
  | 'lease-agreement'
  | 'power-of-attorney'
  | 'business-formation'
  | string; // Extensible for future document types

export type Jurisdiction = 
  | 'US'
  | 'CA'
  | 'UK'
  | 'AU'
  | 'ES'
  | 'FR'
  | 'DE'
  | 'MX'
  | string; // Extensible for future countries

export type SubJurisdiction = string; // US states, CA provinces, UK regions, etc.

export type Language = 'en' | 'es' | 'fr' | 'de' | 'pt' | 'it' | string;

export interface QuestionField {
  id: string;
  type: 'text' | 'select' | 'checkbox' | 'number' | 'date' | 'email' | 'phone' | 'textarea';
  label: Record<Language, string>;
  placeholder?: Record<Language, string>;
  required: boolean;
  validation?: {
    pattern?: string;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
  };
  options?: Array<{
    value: string;
    label: Record<Language, string>;
  }>;
  conditionalLogic?: {
    showIf?: {
      field: string;
      value: any;
    };
    hideIf?: {
      field: string;
      value: any;
    };
  };
}

export interface FormSection {
  id: string;
  title: Record<Language, string>;
  description?: Record<Language, string>;
  fields: QuestionField[];
  order: number;
  icon?: string;
}

export interface DocumentStrategy {
  id: string;
  documentType: DocumentType;
  jurisdiction: Jurisdiction;
  subJurisdiction?: SubJurisdiction;
  language: Language;
  
  // Form handling strategy
  formType: 'custom-template' | 'official-form' | 'hybrid';
  
  // For custom templates
  templatePath?: string;
  questionFlow: FormSection[];
  
  // For official forms
  officialFormPath?: string;
  fieldMappings?: Record<string, {
    pdfField?: string;
    coordinates?: { x: number; y: number; page?: number };
    transform?: (value: any) => string;
  }>;
  
  // Business logic
  pricing: {
    basePrice: number;
    currency: string;
    priceBreakdown?: Array<{
      component: string;
      price: number;
      description: Record<Language, string>;
    }>;
  };
  
  // Legal requirements
  compliance: {
    requiresNotary?: boolean;
    requiresWitness?: boolean;
    requiresRecording?: boolean;
    specialRequirements?: Array<{
      type: string;
      description: Record<Language, string>;
    }>;
  };
  
  // Monetization
  monetization: {
    allowPreview: boolean;
    previewLimitations?: string[];
    paymentRequired: 'before_download' | 'before_completion' | 'subscription';
    trialMode?: {
      allowedActions: string[];
      limitations: string[];
    };
  };
}

export interface DocumentIntelligence {
  strategies: DocumentStrategy[];
  
  // Methods
  getStrategy(
    documentType: DocumentType,
    jurisdiction: Jurisdiction,
    subJurisdiction?: SubJurisdiction,
    language?: Language
  ): DocumentStrategy | null;
  
  getQuestionFlow(strategy: DocumentStrategy): FormSection[];
  
  processFormData(
    strategy: DocumentStrategy,
    formData: Record<string, any>
  ): {
    processedData: Record<string, any>;
    validationErrors: string[];
    completionPercentage: number;
  };
  
  generateDocument(
    strategy: DocumentStrategy,
    formData: Record<string, any>
  ): Promise<{
    success: boolean;
    documentBuffer?: ArrayBuffer;
    error?: string;
    requiresPayment?: boolean;
  }>;
}

export interface UniversalFormWizard {
  currentStrategy: DocumentStrategy;
  currentSection: number;
  formData: Record<string, any>;
  completionPercentage: number;
  validationErrors: string[];
  
  // State management
  nextSection(): void;
  previousSection(): void;
  updateFormData(fieldId: string, value: any): void;
  validateCurrentSection(): boolean;
  
  // Preview and payment
  canPreview(): boolean;
  requiresPayment(): boolean;
  getPreviewLimitations(): string[];
  
  // Document generation
  generatePreview(): Promise<ArrayBuffer | null>;
  generateFinalDocument(): Promise<{
    success: boolean;
    document?: ArrayBuffer;
    paymentRequired?: boolean;
    error?: string;
  }>;
}

// Global registry for all document strategies
export interface DocumentRegistry {
  // Document types
  registerDocumentType(type: DocumentType, metadata: {
    name: Record<Language, string>;
    description: Record<Language, string>;
    category: string;
    icon: string;
  }): void;
  
  // Jurisdictions
  registerJurisdiction(jurisdiction: Jurisdiction, metadata: {
    name: Record<Language, string>;
    subJurisdictions: Array<{
      code: SubJurisdiction;
      name: Record<Language, string>;
    }>;
    languages: Language[];
  }): void;
  
  // Strategies
  registerStrategy(strategy: DocumentStrategy): void;
  
  // Query methods
  getSupportedDocuments(jurisdiction?: Jurisdiction): DocumentType[];
  getSupportedJurisdictions(documentType?: DocumentType): Jurisdiction[];
  getAvailableLanguages(documentType: DocumentType, jurisdiction: Jurisdiction): Language[];
}