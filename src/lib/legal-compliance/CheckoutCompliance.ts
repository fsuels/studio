// src/lib/legal-compliance/CheckoutCompliance.ts

interface ComplianceConfig {
  state: string;
  jurisdiction: string;
  requiresWarrantyDisclaimer: boolean;
  requiresVenueClause: boolean;
  requiresAdditionalDisclaimer: boolean;
  courtVenue: string;
  applicableLaw: string;
}

interface ComplianceRules {
  uplCompliance: UPLRules;
  stateSpecific: Record<string, StateSpecificRules>;
  ftcCompliance: FTCRules;
}

interface UPLRules {
  requiresNoLegalAdviceDisclaimer: boolean;
  requiresNoAttorneyClientDisclaimer: boolean;
  requiresNotLawFirmDisclaimer: boolean;
  requiresTermsAcceptance: boolean;
}

interface StateSpecificRules {
  state: string;
  overrides: {
    warrantyDisclaimer: boolean;
    venueClause: boolean;
    additionalNotices: string[];
  };
  courtVenue: string;
  applicableLaw: string;
}

interface FTCRules {
  requiresScrollTracking: boolean;
  requiresPriceTransparency: boolean;
  requiresNoHiddenFees: boolean;
  requiresReasonableOpportunityToRead: boolean;
}

class CheckoutComplianceEngine {
  private complianceRules: ComplianceRules;

  constructor() {
    this.complianceRules = this.initializeComplianceRules();
  }

  /**
   * Get compliance configuration for a specific state
   */
  getStateCompliance(state: string): ComplianceConfig {
    const stateRules = this.complianceRules.stateSpecific[state];
    const isNorthCarolina = state === 'NC';

    return {
      state,
      jurisdiction: stateRules?.applicableLaw || 'Delaware',
      requiresWarrantyDisclaimer: !isNorthCarolina, // NC prohibits warranty disclaimers
      requiresVenueClause: true,
      requiresAdditionalDisclaimer: isNorthCarolina,
      courtVenue: stateRules?.courtVenue || 'Delaware',
      applicableLaw: stateRules?.applicableLaw || 'Delaware',
    };
  }

  /**
   * Generate state-specific terms text
   */
  generateTermsText(
    state: string,
    documentType: string,
  ): {
    disclaimerText: string;
    warrantyText: string;
    venueText: string;
    additionalNotices: string[];
  } {
    const config = this.getStateCompliance(state);
    const isNC = state === 'NC';

    const disclaimerText = this.generateDisclaimerText();
    const warrantyText = config.requiresWarrantyDisclaimer
      ? this.generateWarrantyText()
      : '';
    const venueText = this.generateVenueText(config);
    const additionalNotices = this.generateAdditionalNotices(
      state,
      documentType,
    );

    return {
      disclaimerText,
      warrantyText,
      venueText,
      additionalNotices,
    };
  }

  /**
   * Validate checkout compliance
   */
  validateCheckoutCompliance(params: {
    state: string;
    termsAccepted: boolean;
    scrolledToBottom: boolean;
    priceDisclosed: boolean;
    taxCalculated: boolean;
  }): {
    compliant: boolean;
    violations: string[];
    warnings: string[];
  } {
    const violations: string[] = [];
    const warnings: string[] = [];

    // UPL Compliance
    if (!params.termsAccepted) {
      violations.push(
        'Terms must be accepted before purchase (UPL compliance)',
      );
    }

    // FTC Compliance
    if (!params.scrolledToBottom) {
      warnings.push(
        'User may not have had reasonable opportunity to read terms',
      );
    }

    if (!params.priceDisclosed) {
      violations.push(
        'Total price must be clearly disclosed (FTC requirement)',
      );
    }

    // State-specific compliance
    const stateCompliance = this.validateStateCompliance(params.state);
    violations.push(...stateCompliance.violations);
    warnings.push(...stateCompliance.warnings);

    return {
      compliant: violations.length === 0,
      violations,
      warnings,
    };
  }

  /**
   * Generate checkout copy for different use cases
   */
  getCheckoutCopy(): {
    checkboxLabels: Record<string, string>;
    modalHeadings: Record<string, string>;
    disclaimerSentences: Record<string, string>;
    warrantyLines: Record<string, string>;
  } {
    return {
      checkboxLabels: {
        short: 'Self-help template, no legal advice — I accept.',
        standard: 'I agree to the Terms & Disclaimer',
        detailed:
          'I understand this is a DIY legal template and agree to the terms',
      },
      modalHeadings: {
        warning: 'Important: Read Before You Buy',
        informational: 'Terms & Disclaimer',
        friendly: 'Quick Legal Notes',
      },
      disclaimerSentences: {
        core: '123LegalDoc is not a law firm; no attorney-client relationship is created.',
        extended:
          'This platform provides self-help legal document templates for informational purposes only. The information and templates are not legal advice.',
        simple: 'DIY legal template · Not legal advice',
      },
      warrantyLines: {
        standard:
          'Product provided as-is, without implied warranties of merchantability or fitness.',
        nonNC:
          'THE TEMPLATE IS PROVIDED "AS-IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.',
        ncOverride:
          'The above warranty disclaimer does not apply to North Carolina purchasers.',
      },
    };
  }

  private initializeComplianceRules(): ComplianceRules {
    return {
      uplCompliance: {
        requiresNoLegalAdviceDisclaimer: true,
        requiresNoAttorneyClientDisclaimer: true,
        requiresNotLawFirmDisclaimer: true,
        requiresTermsAcceptance: true,
      },
      stateSpecific: {
        NC: {
          state: 'NC',
          overrides: {
            warrantyDisclaimer: false, // NC prohibits warranty disclaimers
            venueClause: true,
            additionalNotices: [
              'North Carolina purchasers: Standard warranty disclaimers do not apply.',
              'Disputes will be resolved in North Carolina courts under North Carolina law.',
            ],
          },
          courtVenue: 'North Carolina',
          applicableLaw: 'North Carolina',
        },
        DE: {
          state: 'DE',
          overrides: {
            warrantyDisclaimer: true,
            venueClause: true,
            additionalNotices: [],
          },
          courtVenue: 'Delaware',
          applicableLaw: 'Delaware',
        },
      },
      ftcCompliance: {
        requiresScrollTracking: true,
        requiresPriceTransparency: true,
        requiresNoHiddenFees: true,
        requiresReasonableOpportunityToRead: true,
      },
    };
  }

  private generateDisclaimerText(): string {
    return (
      '123LegalDoc is not a law firm; no attorney-client relationship is created. ' +
      'This platform provides self-help legal document templates for informational purposes only. ' +
      'The information and templates are not legal advice and should not be used as a substitute ' +
      'for competent legal counsel.'
    );
  }

  private generateWarrantyText(): string {
    return (
      'THE TEMPLATE IS PROVIDED "AS-IS" WITHOUT WARRANTIES OF ANY KIND, ' +
      'EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF ' +
      'MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. ' +
      'We do not warrant that the template will meet your specific legal needs ' +
      'or that it will be suitable for your particular jurisdiction or situation.'
    );
  }

  private generateVenueText(config: ComplianceConfig): string {
    return (
      `These terms are governed by ${config.applicableLaw} law. ` +
      `Any disputes will be resolved in ${config.courtVenue} courts.`
    );
  }

  private generateAdditionalNotices(
    state: string,
    documentType: string,
  ): string[] {
    const notices: string[] = [];
    const stateRules = this.complianceRules.stateSpecific[state];

    if (stateRules?.overrides.additionalNotices) {
      notices.push(...stateRules.overrides.additionalNotices);
    }

    // Document-type specific notices
    if (this.isHighRiskDocument(documentType)) {
      notices.push(
        'This document type may have complex legal requirements. ' +
          'Consider consulting with a licensed attorney before use.',
      );
    }

    return notices;
  }

  private validateStateCompliance(state: string): {
    violations: string[];
    warnings: string[];
  } {
    const violations: string[] = [];
    const warnings: string[] = [];
    const stateRules = this.complianceRules.stateSpecific[state];

    if (!stateRules) {
      warnings.push(`No specific compliance rules found for state: ${state}`);
    }

    if (state === 'NC') {
      // Additional NC-specific validations could go here
      warnings.push(
        'North Carolina has specific UPL restrictions - ensure compliance',
      );
    }

    return { violations, warnings };
  }

  private isHighRiskDocument(documentType: string): boolean {
    const highRiskDocuments = [
      'will',
      'trust',
      'power_of_attorney',
      'divorce_agreement',
      'custody_agreement',
      'real_estate_contract',
      'business_formation',
    ];

    return highRiskDocuments.some((type) =>
      documentType.toLowerCase().includes(type.toLowerCase()),
    );
  }
}

// Singleton instance
export const checkoutCompliance = new CheckoutComplianceEngine();

// Convenience functions
export const getStateCompliance = (state: string) =>
  checkoutCompliance.getStateCompliance(state);

export const generateTermsText = (state: string, documentType: string) =>
  checkoutCompliance.generateTermsText(state, documentType);

export const validateCheckout = (params: any) =>
  checkoutCompliance.validateCheckoutCompliance(params);

export const getCheckoutCopy = () => checkoutCompliance.getCheckoutCopy();

export default CheckoutComplianceEngine;
