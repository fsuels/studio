import { securityAuditLogger } from '@/lib/security-audit-logger';
import type { CspAlertPayload } from '@/lib/security/csp-alerts';

export type CspAlertMetricResult = 'delivered' | 'skipped' | 'failed';

interface RecordCspAlertMetricOptions extends CspAlertPayload {
  result: CspAlertMetricResult;
  reason?: string;
  webhookUrlConfigured: boolean;
}

interface CspAlertMetricEvent {
  timestamp: string;
  result: CspAlertMetricResult;
  severity: CspAlertPayload['severity'];
  riskLevel: CspAlertPayload['riskLevel'];
  reason?: string;
  mode: CspAlertPayload['mode'];
  webhookUrlConfigured: boolean;
  environment?: string;
}

const counters: Record<CspAlertMetricResult, number> = {
  delivered: 0,
  skipped: 0,
  failed: 0,
};

let lastEvent: CspAlertMetricEvent | undefined;

function buildEvent(
  options: RecordCspAlertMetricOptions,
): CspAlertMetricEvent {
  return {
    timestamp: new Date().toISOString(),
    result: options.result,
    severity: options.severity,
    riskLevel: options.riskLevel,
    reason: options.reason,
    mode: options.mode,
    webhookUrlConfigured: options.webhookUrlConfigured,
    environment: options.environment,
  };
}

export async function recordCspAlertMetric(
  options: RecordCspAlertMetricOptions,
): Promise<void> {
  counters[options.result] += 1;

  const event = buildEvent(options);
  lastEvent = event;

  try {
    console.log('[CSP Alert Metrics]', JSON.stringify(event));
  } catch (_error) {
    // Ignore serialization issues to keep logging best-effort.
  }

  try {
    await securityAuditLogger.logEvent({
      eventType: 'security_incident',
      severity: options.severity,
      category: 'security',
      actor: {
        ipAddress: options.ipAddress ?? 'unknown',
        userAgent: options.userAgent ?? 'system',
      },
      action: 'csp_alert_dispatch',
      resource: {
        type: 'system',
        name: options.documentUri,
        path: options.blockedUri,
      },
      context: {
        method: 'POST',
        endpoint: 'csp_alert_webhook',
        statusCode: options.result === 'delivered' ? 200 : undefined,
      },
      security: {
        riskLevel: options.riskLevel,
        threatIndicators: options.violatedDirective
          ? [options.violatedDirective]
          : undefined,
        mitigationActions: ['monitor_csp_alerts'],
      },
      result:
        options.result === 'delivered'
          ? 'success'
          : options.result === 'skipped'
            ? 'blocked'
            : 'failure',
      metadata: {
        sourceSystem: 'security-alerting',
        dataClassification: 'internal',
        reason: options.reason,
        mode: options.mode,
        webhookConfigured: options.webhookUrlConfigured,
        environment: options.environment,
      },
    });
  } catch (error) {
    console.error('[csp-alert-metrics] failed to record audit event', { error });
  }
}

export function getCspAlertMetricsSnapshot(): Readonly<{
  delivered: number;
  skipped: number;
  failed: number;
  lastEvent?: CspAlertMetricEvent;
}> {
  return {
    delivered: counters.delivered,
    skipped: counters.skipped,
    failed: counters.failed,
    lastEvent,
  };
}

export function resetCspAlertMetrics() {
  counters.delivered = 0;
  counters.skipped = 0;
  counters.failed = 0;
  lastEvent = undefined;
}
