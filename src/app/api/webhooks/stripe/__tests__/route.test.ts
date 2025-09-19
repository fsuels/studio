import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

jest.mock('@/lib/stripe-integration', () => ({
  stripeIntegration: {
    handleWebhook: jest.fn(),
  },
}));

const { stripeIntegration } = require('@/lib/stripe-integration');
const { POST } = require('../route');

describe('POST /api/webhooks/stripe', () => {
  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  function createRequest({ payload, signature }: { payload?: string; signature?: string }): NextRequest {
    const value = (payload ?? '');
    const headerValue = signature ?? null;
    const headers = new Map<string, string>();
    if (signature) {
      headers.set('stripe-signature', signature);
    }

    return {
      headers: {
        get: (key: string) => headers.get(key.toLowerCase()) ?? headers.get(key) ?? headerValue,
      },
      text: jest.fn().mockResolvedValue(value),
    } as unknown as NextRequest;
  }

  it('returns 400 when signature header is missing', async () => {
    const request = createRequest({ payload: '{}', signature: undefined });

    const response = await POST(request);
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe('Missing Stripe signature header');
    expect(stripeIntegration.handleWebhook).not.toHaveBeenCalled();
  });

  it('returns 400 when payload is empty', async () => {
    const request = createRequest({ payload: '', signature: 't=123,v1=abc' });

    const response = await POST(request);
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe('Empty Stripe webhook payload');
    expect(stripeIntegration.handleWebhook).not.toHaveBeenCalled();
  });

  it('returns 400 when signature verification fails', async () => {
    (stripeIntegration.handleWebhook as jest.Mock).mockResolvedValue({ received: false });

    const request = createRequest({ payload: '{"id":"evt_123"}', signature: 't=123,v1=abc' });
    const response = await POST(request);

    expect(stripeIntegration.handleWebhook).toHaveBeenCalledWith('{"id":"evt_123"}', 't=123,v1=abc');
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe('Invalid Stripe signature');
  });

  it('returns 200 when webhook is processed successfully', async () => {
    (stripeIntegration.handleWebhook as jest.Mock).mockResolvedValue({ received: true, processed: 'payment_intent.succeeded' });

    const request = createRequest({ payload: '{"id":"evt_123"}', signature: 't=123,v1=abc' });
    const response = await POST(request);

    expect(stripeIntegration.handleWebhook).toHaveBeenCalledWith('{"id":"evt_123"}', 't=123,v1=abc');
    expect(response.status).toBe(200);
  });
});
