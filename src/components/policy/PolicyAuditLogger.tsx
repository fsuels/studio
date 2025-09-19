'use client';

import { useEffect } from 'react';

export type PolicyAuditType =
  | 'terms_of_service'
  | 'privacy_policy'
  | 'disclaimer'
  | 'refund_policy';

export default function PolicyAuditLogger({
  locale,
  policyType,
  lastUpdated,
}: {
  locale: 'en' | 'es';
  policyType: PolicyAuditType;
  lastUpdated?: string;
}) {
  useEffect(() => {
    const log = async () => {
      try {
        const { auditService } = await import('@/services/firebase-audit-service');
        await auditService.logComplianceEvent('policy_viewed', {
          policyType,
          locale,
          lastUpdated,
          userAgent: navigator.userAgent,
          referrer: document.referrer,
          timestamp: new Date().toISOString(),
          pageUrl: window.location.href,
        });
      } catch (err) {
        console.error('PolicyAuditLogger error:', err);
      }
    };
    log();
  }, [locale, policyType, lastUpdated]);

  return null;
}
