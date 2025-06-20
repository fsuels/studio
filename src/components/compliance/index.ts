// Compliance system exports
export { default as ComplianceGate } from './ComplianceGate';
export { default as DynamicDisclaimer, CheckoutDisclaimer, DocumentDisclaimer, FooterDisclaimer, InlineDisclaimer } from './DynamicDisclaimer';
export { default as WaitlistForm } from './WaitlistForm';
export { default as ComplianceDashboard } from './ComplianceDashboard';
export { ComplianceProvider, useCompliance, withCompliance, useDisclaimerProps } from './ComplianceProvider';

export type { DisclaimerProps } from './DynamicDisclaimer';
export type { ComplianceState } from './ComplianceProvider';