import { 
  DocumentStrategy, 
  DocumentType, 
  Jurisdiction, 
  SubJurisdiction, 
  Language,
  FormSection,
  DocumentIntelligence,
  UniversalFormWizard
} from './types';

/**
 * UNIVERSAL DOCUMENT INTELLIGENCE ENGINE
 * 
 * This is the core system that handles ANY document type, ANY jurisdiction, ANY language.
 * It automatically adapts question flows, form mappings, and monetization strategies
 * based on the specific document and jurisdiction requirements.
 */

export class DocumentIntelligenceEngine implements DocumentIntelligence {
  private strategies: Map<string, DocumentStrategy> = new Map();
  
  constructor() {
    this.loadStrategies();
  }

  private loadStrategies() {
    // Load all document strategies from the registry
    // This will be populated from database/config files
    console.log('📚 Loading document strategies...');
  }

  /**
   * SMART STRATEGY SELECTION
   * Automatically selects the best strategy for a document/jurisdiction combination
   */
  getStrategy(
    documentType: DocumentType,
    jurisdiction: Jurisdiction,
    subJurisdiction?: SubJurisdiction,
    language: Language = 'en'
  ): DocumentStrategy | null {
    // Priority order for strategy selection:
    // 1. Exact match (document + jurisdiction + subJurisdiction + language)
    // 2. Document + jurisdiction + subJurisdiction (any language)
    // 3. Document + jurisdiction (any subJurisdiction)
    // 4. Document only (fallback to generic)
    
    const keys = [
      `${documentType}:${jurisdiction}:${subJurisdiction}:${language}`,
      `${documentType}:${jurisdiction}:${subJurisdiction}`,
      `${documentType}:${jurisdiction}`,
      `${documentType}:generic`
    ];
    
    for (const key of keys) {
      const strategy = this.strategies.get(key);
      if (strategy) {
        console.log(`🎯 Selected strategy: ${key}`);
        return strategy;
      }
    }
    
    console.warn(`⚠️ No strategy found for ${documentType} in ${jurisdiction}`);
    return null;
  }

  /**
   * ADAPTIVE QUESTION FLOW
   * Automatically adapts question order based on the document strategy
   */
  getQuestionFlow(strategy: DocumentStrategy): FormSection[] {
    switch (strategy.formType) {
      case 'official-form':
        // For official forms, reorder questions to match the form structure
        return this.optimizeQuestionFlowForOfficialForm(strategy);
      
      case 'custom-template':
        // For custom templates, use logical business flow
        return this.optimizeQuestionFlowForTemplate(strategy);
      
      case 'hybrid':
        // Best of both worlds - logical flow with form-aware ordering
        return this.optimizeQuestionFlowHybrid(strategy);
      
      default:
        return strategy.questionFlow;
    }
  }

  private optimizeQuestionFlowForOfficialForm(strategy: DocumentStrategy): FormSection[] {
    // Reorder questions to match the official form structure
    const sections = [...strategy.questionFlow];
    
    // Custom logic for each document type and jurisdiction
    if (strategy.documentType === 'vehicle-bill-of-sale' && strategy.jurisdiction === 'US') {
      return this.optimizeVehicleBillOfSaleForUS(sections, strategy.subJurisdiction);
    }
    
    return sections;
  }

  private optimizeVehicleBillOfSaleForUS(sections: FormSection[], state?: SubJurisdiction): FormSection[] {
    // State-specific optimizations
    const stateOptimizations: Record<string, (sections: FormSection[]) => FormSection[]> = {
      'FL': (sections) => this.optimizeForFloridaForm(sections),
      'CA': (sections) => this.optimizeForCaliforniaForm(sections),
      'TX': (sections) => this.optimizeForTexasForm(sections),
      // Add more states as needed
    };

    if (state && stateOptimizations[state]) {
      return stateOptimizations[state](sections);
    }

    return sections;
  }

  private optimizeForFloridaForm(sections: FormSection[]): FormSection[] {
    // Florida HSMV-82050 form structure optimization
    const optimizedOrder = [
      'vehicle_information',    // Form starts with vehicle details
      'seller_information',     // Then seller information
      'buyer_information',      // Then buyer information
      'transaction_details',    // Price and terms
      'odometer_disclosure',    // Florida-specific odometer section
      'notary_acknowledgment'   // Florida requires notary
    ];

    return this.reorderSections(sections, optimizedOrder);
  }

  private optimizeForCaliforniaForm(sections: FormSection[]): FormSection[] {
    // California-specific form optimization
    const optimizedOrder = [
      'vehicle_information',
      'seller_information',
      'buyer_information',
      'transaction_details',
      'smog_certification',     // California-specific smog requirement
      'odometer_disclosure'
    ];

    return this.reorderSections(sections, optimizedOrder);
  }

  private optimizeForTexasForm(sections: FormSection[]): FormSection[] {
    // Texas-specific form optimization
    const optimizedOrder = [
      'vehicle_information',
      'seller_information',
      'buyer_information',
      'transaction_details',
      'odometer_disclosure',
      'lien_information'        // Texas-specific lien handling
    ];

    return this.reorderSections(sections, optimizedOrder);
  }

  private reorderSections(sections: FormSection[], preferredOrder: string[]): FormSection[] {
    const sectionMap = new Map(sections.map(s => [s.id, s]));
    const reordered: FormSection[] = [];
    
    // Add sections in preferred order
    preferredOrder.forEach((sectionId, index) => {
      const section = sectionMap.get(sectionId);
      if (section) {
        reordered.push({ ...section, order: index + 1 });
        sectionMap.delete(sectionId);
      }
    });
    
    // Add any remaining sections
    sectionMap.forEach((section, id) => {
      reordered.push({ ...section, order: reordered.length + 1 });
    });
    
    return reordered;
  }

  private optimizeQuestionFlowForTemplate(strategy: DocumentStrategy): FormSection[] {
    // For custom templates, use logical business flow
    return strategy.questionFlow.sort((a, b) => a.order - b.order);
  }

  private optimizeQuestionFlowHybrid(strategy: DocumentStrategy): FormSection[] {
    // Combine logical flow with form-aware optimizations
    const baseFlow = this.optimizeQuestionFlowForTemplate(strategy);
    
    if (strategy.officialFormPath) {
      return this.optimizeQuestionFlowForOfficialForm({
        ...strategy,
        questionFlow: baseFlow
      });
    }
    
    return baseFlow;
  }

  /**
   * INTELLIGENT FORM DATA PROCESSING
   * Validates and processes form data according to strategy requirements
   */
  processFormData(
    strategy: DocumentStrategy,
    formData: Record<string, any>
  ): {
    processedData: Record<string, any>;
    validationErrors: string[];
    completionPercentage: number;
  } {
    const processedData: Record<string, any> = {};
    const validationErrors: string[] = [];
    let totalFields = 0;
    let completedFields = 0;

    // Process each section
    strategy.questionFlow.forEach(section => {
      section.fields.forEach(field => {
        totalFields++;
        const value = formData[field.id];
        
        // Check if field is completed
        if (value !== undefined && value !== null && value !== '') {
          completedFields++;
        }
        
        // Validate field
        if (field.required && (value === undefined || value === null || value === '')) {
          validationErrors.push(`${field.id} is required`);
        }
        
        // Apply transformations based on strategy
        if (value !== undefined && strategy.fieldMappings?.[field.id]?.transform) {
          processedData[field.id] = strategy.fieldMappings[field.id].transform!(value);
        } else {
          processedData[field.id] = value;
        }
      });
    });

    const completionPercentage = totalFields > 0 ? (completedFields / totalFields) * 100 : 0;

    return {
      processedData,
      validationErrors,
      completionPercentage
    };
  }

  /**
   * UNIVERSAL DOCUMENT GENERATION
   * Generates documents using the appropriate strategy
   */
  async generateDocument(
    strategy: DocumentStrategy,
    formData: Record<string, any>
  ): Promise<{
    success: boolean;
    documentBuffer?: ArrayBuffer;
    error?: string;
    requiresPayment?: boolean;
  }> {
    try {
      // Check if payment is required
      if (strategy.monetization.paymentRequired === 'before_download') {
        return {
          success: false,
          requiresPayment: true,
          error: 'Payment required for document generation'
        };
      }

      // Process form data
      const { processedData, validationErrors } = this.processFormData(strategy, formData);
      
      if (validationErrors.length > 0) {
        return {
          success: false,
          error: `Validation errors: ${validationErrors.join(', ')}`
        };
      }

      // Generate document based on strategy type
      switch (strategy.formType) {
        case 'official-form':
          return await this.generateOfficialFormDocument(strategy, processedData);
        
        case 'custom-template':
          return await this.generateTemplateDocument(strategy, processedData);
        
        case 'hybrid':
          return await this.generateHybridDocument(strategy, processedData);
        
        default:
          return {
            success: false,
            error: 'Unknown form type'
          };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async generateOfficialFormDocument(
    strategy: DocumentStrategy,
    formData: Record<string, any>
  ): Promise<{ success: boolean; documentBuffer?: ArrayBuffer; error?: string }> {
    if (!strategy.officialFormPath) {
      return { success: false, error: 'No official form path configured' };
    }

    try {
      // Load the official form
      const response = await fetch(strategy.officialFormPath);
      if (!response.ok) {
        throw new Error(`Failed to load official form: ${response.status}`);
      }

      const pdfBytes = await response.arrayBuffer();
      
      // Apply form data overlay using the field mappings
      const { overlayFormData } = await import('@/lib/pdf/pdf-overlay-service');
      const filledPdf = await overlayFormData(pdfBytes, formData, strategy.subJurisdiction || '');

      return {
        success: true,
        documentBuffer: filledPdf
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate official form'
      };
    }
  }

  private async generateTemplateDocument(
    strategy: DocumentStrategy,
    formData: Record<string, any>
  ): Promise<{ success: boolean; documentBuffer?: ArrayBuffer; error?: string }> {
    // Use existing template generation logic
    // This would integrate with your existing template system
    return {
      success: true,
      documentBuffer: new ArrayBuffer(0) // Placeholder
    };
  }

  private async generateHybridDocument(
    strategy: DocumentStrategy,
    formData: Record<string, any>
  ): Promise<{ success: boolean; documentBuffer?: ArrayBuffer; error?: string }> {
    // Try official form first, fallback to template
    const officialResult = await this.generateOfficialFormDocument(strategy, formData);
    
    if (officialResult.success) {
      return officialResult;
    }
    
    return await this.generateTemplateDocument(strategy, formData);
  }

  /**
   * STRATEGY REGISTRATION
   * Allows dynamic registration of new document strategies
   */
  registerStrategy(strategy: DocumentStrategy): void {
    const key = `${strategy.documentType}:${strategy.jurisdiction}:${strategy.subJurisdiction}:${strategy.language}`;
    this.strategies.set(key, strategy);
    console.log(`📝 Registered strategy: ${key}`);
  }
}

/**
 * UNIVERSAL FORM WIZARD
 * Manages the user experience for any document type
 */
export class UniversalFormWizardManager implements UniversalFormWizard {
  currentStrategy: DocumentStrategy;
  currentSection: number = 0;
  formData: Record<string, any> = {};
  completionPercentage: number = 0;
  validationErrors: string[] = [];
  
  private engine: DocumentIntelligenceEngine;
  
  constructor(strategy: DocumentStrategy) {
    this.currentStrategy = strategy;
    this.engine = new DocumentIntelligenceEngine();
  }

  nextSection(): void {
    if (this.currentSection < this.currentStrategy.questionFlow.length - 1) {
      this.currentSection++;
      this.updateCompletionStatus();
    }
  }

  previousSection(): void {
    if (this.currentSection > 0) {
      this.currentSection--;
    }
  }

  updateFormData(fieldId: string, value: any): void {
    this.formData[fieldId] = value;
    this.updateCompletionStatus();
  }

  private updateCompletionStatus(): void {
    const result = this.engine.processFormData(this.currentStrategy, this.formData);
    this.completionPercentage = result.completionPercentage;
    this.validationErrors = result.validationErrors;
  }

  validateCurrentSection(): boolean {
    const currentSectionData = this.currentStrategy.questionFlow[this.currentSection];
    const sectionErrors: string[] = [];

    currentSectionData.fields.forEach(field => {
      if (field.required && !this.formData[field.id]) {
        sectionErrors.push(`${field.id} is required`);
      }
    });

    return sectionErrors.length === 0;
  }

  canPreview(): boolean {
    return this.currentStrategy.monetization.allowPreview;
  }

  requiresPayment(): boolean {
    return this.currentStrategy.monetization.paymentRequired === 'before_download';
  }

  getPreviewLimitations(): string[] {
    return this.currentStrategy.monetization.previewLimitations || [];
  }

  async generatePreview(): Promise<ArrayBuffer | null> {
    if (!this.canPreview()) {
      return null;
    }

    const result = await this.engine.generateDocument(this.currentStrategy, this.formData);
    return result.documentBuffer || null;
  }

  async generateFinalDocument(): Promise<{
    success: boolean;
    document?: ArrayBuffer;
    paymentRequired?: boolean;
    error?: string;
  }> {
    return await this.engine.generateDocument(this.currentStrategy, this.formData);
  }
}

// Global instance
export const documentIntelligence = new DocumentIntelligenceEngine();