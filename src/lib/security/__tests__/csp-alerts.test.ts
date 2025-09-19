jest.mock('@/lib/security-audit-logger', () => ({
  securityAuditLogger: {
    logEvent: jest.fn(async () => 'ok'),
  },
}));

import { securityAuditLogger } from '@/lib/security-audit-logger';
import { dispatchCspAlert } from '../csp-alerts';
import {
  getCspAlertMetricsSnapshot,
  resetCspAlertMetrics,
} from '../csp-alert-metrics';

describe('dispatchCspAlert metrics', () => {
  const logEventMock = securityAuditLogger.logEvent as jest.Mock;

  beforeEach(() => {
    resetCspAlertMetrics();
    logEventMock.mockClear();
    delete (globalThis as Record<string, unknown>).fetch;
    delete process.env.CSP_ALERT_WEBHOOK_URL;
  });

  afterAll(() => {
    delete (globalThis as Record<string, unknown>).fetch;
  });

  const basePayload = {
    riskLevel: 'high' as const,
    severity: 'critical' as const,
    mode: 'report-only' as const,
    blockedUri: 'https://malicious.example.test/script.js',
    documentUri: 'https://example.com/admin',
    violatedDirective: 'script-src',
    userAgent: 'jest',
    ipAddress: '127.0.0.1',
    environment: 'test',
  };

  it('records skipped metrics when webhook URL is not configured', async () => {
    const result = await dispatchCspAlert(basePayload);

    expect(result).toEqual({
      delivered: false,
      reason: 'webhook-url-not-configured',
    });

    const snapshot = getCspAlertMetricsSnapshot();
    expect(snapshot.skipped).toBe(1);
    expect(snapshot.delivered).toBe(0);
    expect(snapshot.failed).toBe(0);
    expect(snapshot.lastEvent?.reason).toBe('webhook-url-not-configured');
    expect(logEventMock).toHaveBeenCalledTimes(1);
  });

  it('skips low-risk events even when webhook is configured', async () => {
    process.env.CSP_ALERT_WEBHOOK_URL = 'https://example.com/hook';
    const fetchMock = jest.fn();
    (globalThis as Record<string, unknown>).fetch = fetchMock as unknown as typeof fetch;

    const result = await dispatchCspAlert({
      ...basePayload,
      riskLevel: 'low',
      severity: 'info',
    });

    expect(fetchMock).not.toHaveBeenCalled();
    expect(result).toEqual({
      delivered: false,
      reason: 'below-alert-threshold',
    });

    const snapshot = getCspAlertMetricsSnapshot();
    expect(snapshot.skipped).toBe(1);
    expect(snapshot.lastEvent?.reason).toBe('below-alert-threshold');
    expect(logEventMock).toHaveBeenCalledTimes(1);
  });

  it('records delivered metrics when webhook succeeds', async () => {
    process.env.CSP_ALERT_WEBHOOK_URL = 'https://example.com/hook';
    const fetchMock = jest.fn().mockResolvedValue({ ok: true });
    (globalThis as Record<string, unknown>).fetch = fetchMock as unknown as typeof fetch;

    const result = await dispatchCspAlert(basePayload);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ delivered: true });

    const snapshot = getCspAlertMetricsSnapshot();
    expect(snapshot.delivered).toBe(1);
    expect(snapshot.skipped).toBe(0);
    expect(snapshot.failed).toBe(0);
    expect(snapshot.lastEvent?.result).toBe('delivered');
    expect(logEventMock).toHaveBeenCalledTimes(1);
  });

  it('records failed metrics when webhook responds with error', async () => {
    process.env.CSP_ALERT_WEBHOOK_URL = 'https://example.com/hook';
    const fetchMock = jest.fn().mockResolvedValue({ ok: false, status: 500, statusText: 'error' });
    (globalThis as Record<string, unknown>).fetch = fetchMock as unknown as typeof fetch;

    const result = await dispatchCspAlert(basePayload);

    expect(result).toEqual({
      delivered: false,
      reason: 'webhook-status-500',
    });

    const snapshot = getCspAlertMetricsSnapshot();
    expect(snapshot.failed).toBe(1);
    expect(snapshot.lastEvent?.reason).toBe('webhook-status-500');
    expect(logEventMock).toHaveBeenCalledTimes(1);
  });

  it('records failed metrics when webhook throws', async () => {
    process.env.CSP_ALERT_WEBHOOK_URL = 'https://example.com/hook';
    const fetchMock = jest.fn().mockRejectedValue(new Error('network down'));
    (globalThis as Record<string, unknown>).fetch = fetchMock as unknown as typeof fetch;

    const result = await dispatchCspAlert(basePayload);

    expect(result).toEqual({
      delivered: false,
      reason: 'webhook-network-error',
    });

    const snapshot = getCspAlertMetricsSnapshot();
    expect(snapshot.failed).toBe(1);
    expect(snapshot.lastEvent?.reason).toBe('webhook-network-error');
    expect(logEventMock).toHaveBeenCalledTimes(1);
  });
});
