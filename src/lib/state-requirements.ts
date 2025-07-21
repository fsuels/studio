// Automated State-Specific Legal Requirements System
// This system provides state-specific legal requirements for documents

interface StateRequirement {
  documentType: string;
  state: string;
  requirements: {
    notarization: boolean;
    witnessRequired: boolean;
    witnessCount?: number;
    recordingRequired: boolean;
    specificForms?: string[];
    additionalFields?: Array<{
      id: string;
      label: string;
      type: string;
      required: boolean;
      description: string;
    }>;
    restrictions?: string[];
    validityPeriod?: string;
    fees?: Array<{
      type: string;
      amount: number;
      description: string;
    }>;
  };
  lastUpdated: string;
  source: string;
}

// Comprehensive state requirements database
export const STATE_REQUIREMENTS: StateRequirement[] = [
  // Vehicle Bill of Sale Requirements
  {
    documentType: 'vehicle-bill-of-sale',
    state: 'CA',
    requirements: {
      notarization: false,
      witnessRequired: false,
      recordingRequired: false,
      additionalFields: [
        {
          id: 'smogCertificate',
          label: 'Smog Certificate Number',
          type: 'text',
          required: true,
          description: 'Required for vehicles over 4 years old',
        },
      ],
      fees: [
        {
          type: 'registration',
          amount: 65,
          description: 'Base registration fee',
        },
        { type: 'title', amount: 23, description: 'Title transfer fee' },
      ],
    },
    lastUpdated: '2024-01-15',
    source: 'California DMV',
  },
  {
    documentType: 'vehicle-bill-of-sale',
    state: 'TX',
    requirements: {
      notarization: true,
      witnessRequired: false,
      recordingRequired: false,
      additionalFields: [
        {
          id: 'txInspection',
          label: 'Texas Inspection Certificate',
          type: 'text',
          required: true,
          description: 'Required safety inspection certificate',
        },
      ],
      fees: [
        { type: 'title', amount: 33, description: 'Title application fee' },
        {
          type: 'registration',
          amount: 50.75,
          description: 'Registration fee',
        },
      ],
    },
    lastUpdated: '2024-01-15',
    source: 'Texas DMV',
  },
  {
    documentType: 'vehicle-bill-of-sale',
    state: 'NY',
    requirements: {
      notarization: true,
      witnessRequired: false,
      recordingRequired: false,
      additionalFields: [
        {
          id: 'nyEmissions',
          label: 'NY Emissions Certificate',
          type: 'text',
          required: true,
          description: 'Required for vehicles in certain counties',
        },
      ],
      restrictions: [
        'Sales tax must be paid within 60 days',
        'Insurance must be obtained before registration',
      ],
      fees: [
        { type: 'title', amount: 50, description: 'Title certificate fee' },
        { type: 'registration', amount: 26, description: 'Registration fee' },
      ],
    },
    lastUpdated: '2024-01-15',
    source: 'New York DMV',
  },

  // Real Estate Requirements
  {
    documentType: 'lease-agreement',
    state: 'CA',
    requirements: {
      notarization: false,
      witnessRequired: false,
      recordingRequired: false,
      additionalFields: [
        {
          id: 'leadDisclosure',
          label: 'Lead Paint Disclosure',
          type: 'checkbox',
          required: true,
          description: 'Required for properties built before 1978',
        },
        {
          id: 'seismicDisclosure',
          label: 'Seismic Hazard Disclosure',
          type: 'checkbox',
          required: true,
          description: 'Required in earthquake fault zones',
        },
      ],
      restrictions: [
        'Rent control laws apply in certain cities',
        'Security deposit cannot exceed 2 months rent (unfurnished) or 3 months (furnished)',
      ],
    },
    lastUpdated: '2024-01-15',
    source: 'California Department of Real Estate',
  },

  // Business Formation Requirements
  {
    documentType: 'llc-operating-agreement',
    state: 'DE',
    requirements: {
      notarization: false,
      witnessRequired: false,
      recordingRequired: false,
      additionalFields: [
        {
          id: 'registeredAgent',
          label: 'Registered Agent Name',
          type: 'text',
          required: true,
          description: 'Delaware registered agent required',
        },
      ],
      fees: [
        { type: 'formation', amount: 90, description: 'LLC formation fee' },
        { type: 'franchise', amount: 300, description: 'Annual franchise tax' },
      ],
    },
    lastUpdated: '2024-01-15',
    source: 'Delaware Division of Corporations',
  },

  // Estate Planning Requirements
  {
    documentType: 'last-will-testament',
    state: 'FL',
    requirements: {
      notarization: false,
      witnessRequired: true,
      witnessCount: 2,
      recordingRequired: false,
      restrictions: [
        'Witnesses must be present at time of signing',
        'Witnesses cannot be beneficiaries',
        'Self-proving affidavit recommended',
      ],
      additionalFields: [
        {
          id: 'selfProvingAffidavit',
          label: 'Self-Proving Affidavit',
          type: 'checkbox',
          required: false,
          description: 'Recommended to expedite probate process',
        },
      ],
    },
    lastUpdated: '2024-01-15',
    source: 'Florida Probate Rules',
  },
];

// State Requirements Service
export class StateRequirementsService {
  private static instance: StateRequirementsService;
  private requirements: Map<string, StateRequirement[]> = new Map();

  constructor() {
    this.loadRequirements();
  }

  static getInstance(): StateRequirementsService {
    if (!StateRequirementsService.instance) {
      StateRequirementsService.instance = new StateRequirementsService();
    }
    return StateRequirementsService.instance;
  }

  private loadRequirements() {
    STATE_REQUIREMENTS.forEach((req) => {
      const key = `${req.documentType}-${req.state}`;
      if (!this.requirements.has(key)) {
        this.requirements.set(key, []);
      }
      this.requirements.get(key)!.push(req);
    });
  }

  // Get requirements for specific document type and state
  getRequirements(
    documentType: string,
    state: string,
  ): StateRequirement | null {
    const key = `${documentType}-${state}`;
    const requirements = this.requirements.get(key);
    return requirements ? requirements[0] : null;
  }

  // Get all requirements for a document type across all states
  getDocumentRequirements(documentType: string): StateRequirement[] {
    const results: StateRequirement[] = [];
    this.requirements.forEach((reqs, key) => {
      if (key.startsWith(documentType + '-')) {
        results.push(...reqs);
      }
    });
    return results;
  }

  // Check if notarization is required
  requiresNotarization(documentType: string, state: string): boolean {
    const requirement = this.getRequirements(documentType, state);
    return requirement?.requirements.notarization || false;
  }

  // Check if witnesses are required
  requiresWitnesses(
    documentType: string,
    state: string,
  ): { required: boolean; count?: number } {
    const requirement = this.getRequirements(documentType, state);
    if (!requirement) return { required: false };

    return {
      required: requirement.requirements.witnessRequired,
      count: requirement.requirements.witnessCount,
    };
  }

  // Get additional fields required for state
  getAdditionalFields(documentType: string, state: string) {
    const requirement = this.getRequirements(documentType, state);
    return requirement?.requirements.additionalFields || [];
  }

  // Get state-specific restrictions
  getRestrictions(documentType: string, state: string): string[] {
    const requirement = this.getRequirements(documentType, state);
    return requirement?.requirements.restrictions || [];
  }

  // Get fee information
  getFees(documentType: string, state: string) {
    const requirement = this.getRequirements(documentType, state);
    return requirement?.requirements.fees || [];
  }

  // Validate document against state requirements
  validateDocument(
    documentType: string,
    state: string,
    documentData: any,
  ): {
    valid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const requirement = this.getRequirements(documentType, state);
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!requirement) {
      warnings.push(
        `No specific requirements found for ${documentType} in ${state}`,
      );
      return { valid: true, errors, warnings };
    }

    // Check required additional fields
    requirement.requirements.additionalFields?.forEach((field) => {
      if (field.required && !documentData[field.id]) {
        errors.push(`${field.label} is required for ${state}`);
      }
    });

    // Check notarization requirement
    if (requirement.requirements.notarization && !documentData.notarized) {
      errors.push(`Document must be notarized in ${state}`);
    }

    // Check witness requirement
    if (requirement.requirements.witnessRequired) {
      const witnessCount = documentData.witnesses?.length || 0;
      const requiredCount = requirement.requirements.witnessCount || 1;

      if (witnessCount < requiredCount) {
        errors.push(
          `${requiredCount} witness(es) required in ${state}, found ${witnessCount}`,
        );
      }
    }

    // Add restriction warnings
    requirement.requirements.restrictions?.forEach((restriction) => {
      warnings.push(`${state} requirement: ${restriction}`);
    });

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  // Get compliance checklist for state
  getComplianceChecklist(documentType: string, state: string) {
    const requirement = this.getRequirements(documentType, state);
    if (!requirement) return [];

    const checklist = [];

    if (requirement.requirements.notarization) {
      checklist.push({
        item: 'Document notarization',
        required: true,
        description: 'Document must be notarized by a licensed notary public',
      });
    }

    if (requirement.requirements.witnessRequired) {
      checklist.push({
        item: `${requirement.requirements.witnessCount || 1} witness(es)`,
        required: true,
        description:
          'Witnesses must be present during signing and not be beneficiaries',
      });
    }

    if (requirement.requirements.recordingRequired) {
      checklist.push({
        item: 'Document recording',
        required: true,
        description:
          'Document must be recorded with appropriate government office',
      });
    }

    requirement.requirements.additionalFields?.forEach((field) => {
      if (field.required) {
        checklist.push({
          item: field.label,
          required: true,
          description: field.description,
        });
      }
    });

    return checklist;
  }

  // Update requirements (for future API integration)
  async updateRequirements(documentType: string, state: string): Promise<void> {
    // In production, this would fetch from a legal database API
    console.log(`Updating requirements for ${documentType} in ${state}`);
  }
}

// Export singleton instance
export const stateRequirements = StateRequirementsService.getInstance();

// Utility functions
export const getStateRequirements = (documentType: string, state: string) => {
  return stateRequirements.getRequirements(documentType, state);
};

export const validateStateCompliance = (
  documentType: string,
  state: string,
  data: any,
) => {
  return stateRequirements.validateDocument(documentType, state, data);
};

export const getStateChecklist = (documentType: string, state: string) => {
  return stateRequirements.getComplianceChecklist(documentType, state);
};
