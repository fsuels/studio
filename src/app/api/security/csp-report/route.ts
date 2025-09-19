import { NextRequest, NextResponse } from 'next/server';

import { persistCspReport, type NormalizedCspReport } from '@/lib/security/csp-report-store';

const VALID_MODES = new Set(['report-only', 'enforce']);
const SECURITY_MODE = (process.env.SECURITY_HEADER_MODE ?? 'report-only').toLowerCase();

function getSecurityMode(): 'report-only' | 'enforce' {
  if (VALID_MODES.has(SECURITY_MODE)) {
    return SECURITY_MODE as 'report-only' | 'enforce';
  }
  return 'report-only';
}

function redactUrl(url: unknown): string | undefined {
  if (typeof url !== 'string' || url.length === 0) {
    return undefined;
  }

  try {
    const parsed = new URL(url);
    parsed.search = '';
    parsed.hash = '';
    return parsed.toString();
  } catch (_error) {
    return undefined;
  }
}

function normalizeReport(payload: unknown): NormalizedCspReport {
  if (!payload || typeof payload !== 'object') {
    return {};
  }

  const report = (payload as Record<string, unknown>)['csp-report'];
  if (report && typeof report === 'object') {
    const body = report as Record<string, unknown>;
    return {
      'blocked-uri': redactUrl(body['blocked-uri']),
      'document-uri': redactUrl(body['document-uri']),
      'effective-directive': body['effective-directive'],
      'violated-directive': body['violated-directive'],
      'original-policy': body['original-policy'],
      'source-file': redactUrl(body['source-file']),
      'line-number': body['line-number'],
      'column-number': body['column-number'],
      disposition: body['disposition'],
      'status-code': body['status-code'],
      referrer: redactUrl(body['referrer']),
    };
  }

  return {};
}

function getClientIp(request: NextRequest): string {
  const candidates = [
    request.ip,
    request.headers.get('cf-connecting-ip'),
    request.headers.get('x-real-ip'),
    (request.headers.get('x-forwarded-for') || '').split(',')[0]?.trim(),
  ];

  return candidates.find((value) => value && value.length > 0) ?? 'unknown';
}

export async function POST(request: NextRequest) {
  const contentType = request.headers.get('content-type') ?? '';
  let bodyText: string;

  try {
    bodyText = await request.text();
  } catch (error) {
    console.warn('[csp-report] failed to read request body', { error });
    return new NextResponse(null, { status: 204 });
  }

  if (!bodyText) {
    return new NextResponse(null, { status: 204 });
  }

  let parsed: unknown = undefined;
  if (
    contentType.includes('application/json') ||
    contentType.includes('application/csp-report') ||
    contentType.includes('application/reports+json')
  ) {
    try {
      parsed = JSON.parse(bodyText);
    } catch (error) {
      console.warn('[csp-report] invalid JSON payload', {
        error,
        mode: getSecurityMode(),
        contentType,
      });
      return new NextResponse(null, { status: 204 });
    }
  }

  const normalized = normalizeReport(parsed ?? {});
  const mode = getSecurityMode();
  const ipAddress = getClientIp(request);
  const userAgent = request.headers.get('user-agent') ?? 'unknown';
  const referer = request.headers.get('referer') ?? undefined;

  const persistResult = await persistCspReport({
    mode,
    report: normalized,
    ipAddress,
    userAgent,
    referer,
    userAuthenticated: Boolean(request.headers.get('authorization')),
  });

  console.warn('[csp-report] received', {
    mode,
    riskLevel: persistResult.riskLevel,
    severity: persistResult.severity,
    stored: persistResult.stored,
    firestoreId: persistResult.firestoreId,
    reason: persistResult.reason,
    blocked: normalized['blocked-uri'],
    violated: normalized['violated-directive'],
  });

  return new NextResponse(null, { status: 204 });
}

export function GET() {
  return NextResponse.json(
    {
      status: 'ready',
      mode: getSecurityMode(),
    },
    { status: 200 },
  );
}