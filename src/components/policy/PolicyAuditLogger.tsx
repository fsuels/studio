'use client';

import { useEffect } from 'react';

export default function PolicyAuditLogger({
  locale,
  policyType,
}: {
  locale: 'en' | 'es';
  policyType: 'terms_of_service' | 'privacy_policy';
}) {
  useEffect(() => {
    const log = async () => {
      try {
        const { auditService } = await import('@/services/firebase-audit-service');
        await auditService.logComplianceEvent('privacy_viewed', {
          policyType,
          locale,
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
  }, [locale, policyType]);

  return null;
}

