// State-based UPL compliance checking system
// Combines geolocation with state regulations for purchase decisions

import {
  getLocationFromIP,
  getCachedLocationFromIP,
  type LocationResult,
} from './geolocation';
import {
  stateRegulations,
  getStateRisk,
  canPurchaseInState,
  getDisclaimerLevel,
  getStateRequirements,
  createComplianceEvent,
  type RiskLevel,
  type ComplianceEvent,
  type StateRegulation,
} from './state-regulations';

export interface ComplianceResult {
  allowed: boolean;
  riskLevel: RiskLevel;
  disclaimerLevel: 'basic' | 'enhanced' | 'strict';
  reason: string;
  requirements: string[];
  location: LocationResult;
  blockingFactors?: string[];
  recommendations?: string[];
  waitlistEligible: boolean;
  complianceEvent: ComplianceEvent;
}

export interface ComplianceCheckOptions {
  userIP: string;
  sessionId: string;
  userAgent: string;
  bypassGeoblock?: boolean; // For admin/testing
  mockState?: string; // For development
}

// Main compliance checking function
export async function checkUserCompliance(
  options: ComplianceCheckOptions,
): Promise<ComplianceResult> {
  try {
    // Get user location
    let location: LocationResult;

    if (options.mockState) {
      // Development/testing mode
      location = {
        ip: options.userIP,
        country: 'United States',
        countryCode: 'US',
        state: options.mockState,
        stateCode: options.mockState.toUpperCase(),
        city: 'Test City',
        provider: 'mock',
        confidence: 'high',
      };
    } else {
      location = await getCachedLocationFromIP(options.userIP);
    }

    // Non-US users - allow with basic disclaimers
    if (location.countryCode !== 'US') {
      const complianceEvent = createComplianceEvent(
        options.userIP,
        location.countryCode,
        'checkout_allowed',
        options.sessionId,
        options.userAgent,
      );

      return {
        allowed: true,
        riskLevel: 'green',
        disclaimerLevel: 'basic',
        reason: 'International user - no US state restrictions apply',
        requirements: ['International terms and conditions'],
        location,
        waitlistEligible: false,
        complianceEvent,
      };
    }

    // Get state-specific regulations
    const stateCode = location.stateCode.toUpperCase();
    const regulation = stateRegulations[stateCode];

    if (!regulation) {
      // Unknown state - err on side of caution
      const complianceEvent = createComplianceEvent(
        options.userIP,
        stateCode,
        'checkout_blocked',
        options.sessionId,
        options.userAgent,
      );

      return {
        allowed: false,
        riskLevel: 'red',
        disclaimerLevel: 'strict',
        reason: `State ${stateCode} not found in compliance database`,
        requirements: ['Manual review required'],
        location,
        blockingFactors: ['Unknown state regulations'],
        recommendations: ['Contact support for assistance'],
        waitlistEligible: true,
        complianceEvent,
      };
    }

    // Check if purchase is allowed
    const purchaseAllowed =
      options.bypassGeoblock || canPurchaseInState(stateCode);
    const action: ComplianceEvent['action'] = purchaseAllowed
      ? 'checkout_allowed'
      : 'checkout_blocked';

    const complianceEvent = createComplianceEvent(
      options.userIP,
      stateCode,
      action,
      options.sessionId,
      options.userAgent,
    );

    if (!purchaseAllowed) {
      return {
        allowed: false,
        riskLevel: regulation.risk,
        disclaimerLevel: regulation.disclaimerLevel,
        reason: regulation.reason,
        requirements: regulation.specialRequirements || [],
        location,
        blockingFactors: getBlockingFactors(regulation),
        recommendations: getRecommendations(regulation),
        waitlistEligible: true,
        complianceEvent,
      };
    }

    // Purchase allowed - return requirements and disclaimers
    return {
      allowed: true,
      riskLevel: regulation.risk,
      disclaimerLevel: regulation.disclaimerLevel,
      reason: regulation.reason,
      requirements: regulation.specialRequirements || [],
      location,
      recommendations: getRecommendations(regulation),
      waitlistEligible: false,
      complianceEvent,
    };
  } catch (error) {
    // Geolocation failed - block purchase for safety
    const complianceEvent = createComplianceEvent(
      options.userIP,
      'UNKNOWN',
      'checkout_blocked',
      options.sessionId,
      options.userAgent,
    );

    return {
      allowed: false,
      riskLevel: 'red',
      disclaimerLevel: 'strict',
      reason: `Geolocation failed: ${(error as Error).message}`,
      requirements: ['Location verification required'],
      location: {
        ip: options.userIP,
        country: 'Unknown',
        countryCode: 'UNK',
        state: 'Unknown',
        stateCode: 'UNK',
        city: 'Unknown',
        provider: 'error',
        confidence: 'low',
      },
      blockingFactors: ['Geolocation service unavailable'],
      recommendations: ['Try again later', 'Contact support if issue persists'],
      waitlistEligible: true,
      complianceEvent,
    };
  }
}

// Get blocking factors for red states
function getBlockingFactors(regulation: StateRegulation): string[] {
  const factors: string[] = [];

  if (regulation.risk === 'red') {
    factors.push('High UPL enforcement risk');

    if (
      regulation.specialRequirements?.includes(
        'Named in-state attorney review required',
      )
    ) {
      factors.push('Attorney review mandatory');
    }

    if (
      regulation.specialRequirements?.includes('State registration required')
    ) {
      factors.push('Business registration required');
    }

    if (regulation.reason.includes('settlement')) {
      factors.push('Legal settlement compliance required');
    }
  }

  return factors;
}

// Get recommendations based on state regulations
function getRecommendations(regulation: StateRegulation): string[] {
  const recommendations: string[] = [];

  switch (regulation.risk) {
    case 'green':
      if (regulation.requiresRegistration) {
        recommendations.push(
          'Consider regulatory sandbox registration for enhanced compliance',
        );
      }
      recommendations.push(
        'Enhanced legal protections available in this state',
      );
      break;

    case 'amber':
      recommendations.push('Review all disclaimers carefully');
      recommendations.push(
        'Save your session - you can complete purchase anytime',
      );
      break;

    case 'red':
      recommendations.push(
        'Join our waitlist for priority access when available',
      );
      recommendations.push('Consider consulting with a local attorney');
      if (
        regulation.specialRequirements?.includes(
          'Attorney involvement required',
        )
      ) {
        recommendations.push(
          'We are working on attorney partnerships in your state',
        );
      }
      break;
  }

  return recommendations;
}

// Get disclaimer text based on compliance level
export function getDisclaimerText(
  level: 'basic' | 'enhanced' | 'strict',
  stateCode?: string,
): string {
  const baseDisclaimer =
    '123LegalDoc provides do-it-yourself legal document templates. We are not a law firm and do not provide legal advice.';

  switch (level) {
    case 'basic':
      return `${baseDisclaimer} Use is subject to our Terms of Service.`;

    case 'enhanced':
      return `${baseDisclaimer} These templates are for informational purposes only and should not substitute for advice from a licensed attorney. You are responsible for ensuring the document meets your specific needs and complies with applicable laws. Use is subject to our Terms of Service (Delaware law, arbitration clause applies).`;

    case 'strict':
      return `${baseDisclaimer} WARNING: Legal document preparation without attorney supervision may constitute unauthorized practice of law in some jurisdictions. These templates are provided for informational purposes only and should not be used without consulting a licensed attorney in your state. You assume all risks associated with using these documents. Refunds available within 30 days. Use is subject to our Terms of Service (Delaware law, arbitration clause applies).`;

    default:
      return baseDisclaimer;
  }
}

// Generate state-specific terms additions
export function getStateSpecificTerms(stateCode: string): string[] {
  const regulation = stateRegulations[stateCode.toUpperCase()];
  const terms: string[] = [];

  if (!regulation) return terms;

  if (regulation.risk === 'red') {
    terms.push(
      'This service is not currently available in your state due to regulatory restrictions.',
    );
    terms.push(
      'By joining our waitlist, you agree to be notified when service becomes available.',
    );
  }

  if (regulation.requiresRegistration) {
    terms.push(
      'This service operates under regulatory oversight in your state.',
    );
  }

  if (regulation.specialRequirements?.includes('Refund policy compliance')) {
    terms.push('Enhanced refund protections apply to users in your state.');
  }

  return terms;
}

// Compliance monitoring and reporting
export interface ComplianceMetrics {
  totalChecks: number;
  allowedPurchases: number;
  blockedPurchases: number;
  byRiskLevel: Record<RiskLevel, number>;
  byState: Record<string, number>;
  geolocationFailures: number;
  lastUpdated: string;
}

export class ComplianceMonitor {
  private events: ComplianceEvent[] = [];

  addEvent(event: ComplianceEvent): void {
    this.events.push(event);

    // Keep only last 1000 events to prevent memory issues
    if (this.events.length > 1000) {
      this.events = this.events.slice(-1000);
    }
  }

  getMetrics(since?: Date): ComplianceMetrics {
    const cutoff = since || new Date(Date.now() - 24 * 60 * 60 * 1000); // Last 24 hours
    const recentEvents = this.events.filter(
      (e) => new Date(e.timestamp) >= cutoff,
    );

    const metrics: ComplianceMetrics = {
      totalChecks: recentEvents.length,
      allowedPurchases: recentEvents.filter(
        (e) => e.action === 'checkout_allowed',
      ).length,
      blockedPurchases: recentEvents.filter(
        (e) => e.action === 'checkout_blocked',
      ).length,
      byRiskLevel: { green: 0, amber: 0, red: 0 },
      byState: {},
      geolocationFailures: recentEvents.filter((e) => e.userState === 'UNKNOWN')
        .length,
      lastUpdated: new Date().toISOString(),
    };

    recentEvents.forEach((event) => {
      metrics.byRiskLevel[event.riskLevel]++;
      metrics.byState[event.userState] =
        (metrics.byState[event.userState] || 0) + 1;
    });

    return metrics;
  }

  getBlockedStates(): string[] {
    const recentBlocked = this.events
      .filter((e) => e.action === 'checkout_blocked')
      .map((e) => e.userState);

    return [...new Set(recentBlocked)];
  }
}

// Global compliance monitor instance
export const complianceMonitor = new ComplianceMonitor();
