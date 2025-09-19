export interface CspAlertPayload {
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  severity: 'info' | 'warning' | 'error' | 'critical';
  mode: 'report-only' | 'enforce';
  blockedUri?: string;
  documentUri?: string;
  violatedDirective?: string;
  userAgent?: string;
  ipAddress?: string;
  firestoreId?: string;
  environment?: string;
}

interface DispatchResult {
  delivered: boolean;
  reason?: string;
}

export async function dispatchCspAlert(
  payload: CspAlertPayload,
): Promise<DispatchResult> {
  const webhookUrl = process.env.CSP_ALERT_WEBHOOK_URL;
  if (!webhookUrl) {
    return {
      delivered: false,
      reason: 'webhook-url-not-configured',
    };
  }

  if (payload.riskLevel === 'low' || payload.severity === 'info') {
    return {
      delivered: false,
      reason: 'below-alert-threshold',
    };
  }

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'csp_violation',
        timestamp: new Date().toISOString(),
        payload,
      }),
    });

    if (!res.ok) {
      console.error('[csp-alert] webhook responded with non-200', {
        status: res.status,
        statusText: res.statusText,
      });
      return {
        delivered: false,
        reason: `webhook-status-${res.status}`,
      };
    }

    return { delivered: true };
  } catch (error) {
    console.error('[csp-alert] failed to dispatch webhook', { error });
    return {
      delivered: false,
      reason: 'webhook-network-error',
    };
  }
}