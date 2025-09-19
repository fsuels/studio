import { NextResponse } from 'next/server';

import { getCspAlertMetricsSnapshot } from '@/lib/security/csp-alert-metrics';

export const runtime = 'nodejs';

export async function GET() {
  const snapshot = getCspAlertMetricsSnapshot();

  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    counters: {
      delivered: snapshot.delivered,
      skipped: snapshot.skipped,
      failed: snapshot.failed,
    },
    lastEvent: snapshot.lastEvent ?? null,
  });
}
