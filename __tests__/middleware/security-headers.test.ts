import { NextRequest, NextResponse } from 'next/server';

const tenantMiddlewareMock = jest.fn(async () => NextResponse.next());
const getAdminUserMock = jest.fn();

jest.mock('@/middleware/tenant', () => ({
  tenantMiddleware: tenantMiddlewareMock,
}));

jest.mock('@/lib/admin-auth', () => ({
  getAdminUser: getAdminUserMock,
}));

// Import after mocks so middleware picks up the stubs
import { middleware } from '../../middleware';

describe('middleware security headers', () => {
  beforeEach(() => {
    tenantMiddlewareMock.mockReset();
    tenantMiddlewareMock.mockResolvedValue(NextResponse.next());
    getAdminUserMock.mockReset();
    getAdminUserMock.mockResolvedValue(null);
  });

  it('applies security headers to locale redirects', async () => {
    const request = new NextRequest('https://example.com/', {
      headers: {
        'accept-language': 'es',
      },
    });

    const response = await middleware(request);

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('https://example.com/es');
    expect(
      response.headers.get('content-security-policy-report-only') || '',
    ).toContain("default-src 'self'");
    expect(response.headers.get('report-to')).toContain('csp-endpoint');
  });

  it('applies security headers when redirecting unauthenticated admin access', async () => {
    const request = new NextRequest('https://example.com/admin/settings');

    const response = await middleware(request);

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('https://example.com/admin');
    expect(
      response.headers.get('content-security-policy-report-only') || '',
    ).toContain("default-src 'self'");
  });

  it('applies security headers when tenant middleware rewrites requests', async () => {
    tenantMiddlewareMock.mockResolvedValueOnce(
      NextResponse.rewrite('https://example.com/tenant/acme/path'),
    );

    const request = new NextRequest('https://tenant.123legaldoc.com/dashboard');

    const response = await middleware(request);

    expect(response.headers.get('x-middleware-rewrite')).toBeDefined();
    expect(
      response.headers.get('content-security-policy-report-only') || '',
    ).toContain("default-src 'self'");
  });
});
