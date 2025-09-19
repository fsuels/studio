jest.mock('@/lib/security-audit-logger', () => ({
  securityAuditLogger: {
    logEvent: jest.fn(async () => 'ok'),
  },
}));

import { GET as getMetricsJson } from '@/app/api/security/csp-metrics/route';
import { GET as getMetricsProm } from '@/app/api/security/csp-metrics/prom/route';
import {
  getCspAlertPromRegistry,
  recordCspAlertMetric,
  resetCspAlertMetrics,
} from '@/lib/security/csp-alert-metrics';

describe('csp metrics routes', () => {
  beforeEach(() => {
    resetCspAlertMetrics();
  });

  it('returns structured counters snapshot', async () => {
    await recordCspAlertMetric({
      result: 'delivered',
      severity: 'critical',
      riskLevel: 'high',
      mode: 'report-only',
      webhookUrlConfigured: true,
      blockedUri: 'https://example.com/script.js',
      documentUri: 'https://example.com',
      ipAddress: '127.0.0.1',
      userAgent: 'jest',
      environment: 'test',
    });

    const response = await getMetricsJson();
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.counters.delivered).toBe(1);
    expect(body.counters.skipped).toBe(0);
    expect(body.counters.failed).toBe(0);
    expect(body.lastEvent).not.toBeNull();
    expect(body.lastEvent.result).toBe('delivered');
    expect(typeof body.generatedAt).toBe('string');
  });

  it('returns prometheus metrics text when registry exists', async () => {
    const registry = getCspAlertPromRegistry();
    if (!registry) {
      // prom-client unavailable in this runtime; skip assertion
      return;
    }

    await recordCspAlertMetric({
      result: 'failed',
      severity: 'error',
      riskLevel: 'critical',
      mode: 'report-only',
      webhookUrlConfigured: true,
      reason: 'webhook-status-500',
      blockedUri: 'https://malicious.example.invalid',
      documentUri: 'https://example.com',
      ipAddress: '127.0.0.1',
      userAgent: 'jest',
    });

    const response = await getMetricsProm();
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toMatch(/text\/plain/);

    const text = await response.text();
    expect(text).toContain('csp_alerts_total');
  });
});
