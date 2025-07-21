// src/app/api/health/metrics/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { operationalHealth } from '@/lib/operational-health';
import { requireAuth } from '@/lib/server-auth';

export async function GET(request: NextRequest) {
  try {
    // Check admin access for detailed metrics
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) {
      // For public health check, return basic status only
      const url = new URL(request.url);
      if (url.searchParams.get('public') === 'true') {
        return NextResponse.json({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          uptime: 99.9,
          version: process.env.npm_package_version || '1.0.0',
        });
      }
      return authResult;
    }

    const user = authResult;
    const isAdmin =
      user.email?.endsWith('@123legaldoc.com') || user.uid === 'admin-user-id';

    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required for detailed metrics' },
        { status: 403 },
      );
    }

    const metrics = await operationalHealth.getOperationalMetrics();
    const alerts = operationalHealth.getActiveAlerts();

    return NextResponse.json({
      metrics,
      alerts,
      timestamp: new Date().toISOString(),
      summary: {
        healthy: metrics.systemHealth.status === 'healthy',
        score: metrics.systemHealth.score,
        activeAlerts: alerts.length,
        criticalAlerts: alerts.filter((a) => a.severity === 'critical').length,
      },
    });
  } catch (error) {
    console.error('Health metrics error:', error);
    return NextResponse.json(
      {
        status: 'error',
        error: 'Failed to fetch health metrics',
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) return authResult;

    const user = authResult;
    const isAdmin =
      user.email?.endsWith('@123legaldoc.com') || user.uid === 'admin-user-id';

    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { action, alertId } = body;

    switch (action) {
      case 'resolve_alert':
        if (alertId) {
          await operationalHealth.resolveAlert(alertId);
          return NextResponse.json({
            success: true,
            message: 'Alert resolved',
          });
        }
        break;

      case 'test_alert':
        // Create a test alert for testing notification systems
        await operationalHealth.recordMetric({
          metricType: 'error_rate',
          value: 0.15, // 15% error rate to trigger alert
          endpoint: '/api/test',
          metadata: { test: true },
        });
        return NextResponse.json({
          success: true,
          message: 'Test alert triggered',
        });

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Health metrics action error:', error);
    return NextResponse.json(
      { error: 'Failed to process action' },
      { status: 500 },
    );
  }
}
