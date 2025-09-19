import { NextResponse } from 'next/server';

import { getCspAlertPromRegistry } from '@/lib/security/csp-alert-metrics';

export const runtime = 'nodejs';

export async function GET() {
  const registry = getCspAlertPromRegistry();

  if (!registry) {
    return new NextResponse('prom-client unavailable', {
      status: 503,
      headers: {
        'content-type': 'text/plain; charset=utf-8',
        'cache-control': 'no-store',
      },
    });
  }

  const body = await registry.metrics();

  return new NextResponse(body, {
    status: 200,
    headers: {
      'content-type': registry.contentType,
      'cache-control': 'no-store',
    },
  });
}
