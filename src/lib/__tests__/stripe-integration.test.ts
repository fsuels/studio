function createIntegration(secret: string) {
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = 'pk_test_unit';
  process.env.STRIPE_SECRET_KEY = 'sk_test_unit';
  process.env.STRIPE_WEBHOOK_SECRET = secret;

  let integration: any;
  jest.isolateModules(() => {
    integration = require('../stripe-integration').stripeIntegration;
  });
  return integration;
}

import crypto from 'node:crypto';

describe('StripeIntegration webhook signature verification', () => {
  const ORIGINAL_ENV = { ...process.env };

  afterEach(() => {
    jest.resetModules();
    process.env = { ...ORIGINAL_ENV };
  });

  it('accepts a valid Stripe signature', () => {
    const secret = 'whsec_unit_test';
    const integration = createIntegration(secret);
    const payload = JSON.stringify({ id: 'evt_test', type: 'payment_intent.succeeded' });
    const timestamp = '1726761600';
    const signature = crypto
      .createHmac('sha256', secret)
      .update(`${timestamp}.${payload}`, 'utf8')
      .digest('hex');
    const header = `t=${timestamp},v1=${signature}`;

    expect((integration as any).verifyWebhookSignature(payload, header)).toBe(true);
  });

  it('rejects tampered signatures', () => {
    const secret = 'whsec_unit_test';
    const integration = createIntegration(secret);
    const payload = JSON.stringify({ id: 'evt_test', type: 'payment_intent.succeeded' });
    const timestamp = '1726761600';
    const badSignature = crypto
      .createHmac('sha256', secret)
      .update(`${timestamp}.${payload}tampered`, 'utf8')
      .digest('hex');
    const header = `t=${timestamp},v1=${badSignature}`;

    expect((integration as any).verifyWebhookSignature(payload, header)).toBe(false);
  });

  it('rejects missing headers', () => {
    const secret = 'whsec_unit_test';
    const integration = createIntegration(secret);
    const payload = JSON.stringify({ id: 'evt_test', type: 'payment_intent.succeeded' });

    expect((integration as any).verifyWebhookSignature(payload, '')).toBe(false);
    expect((integration as any).verifyWebhookSignature(payload, undefined as unknown as string)).toBe(
      false,
    );
  });
});


describe('StripeIntegration handleWebhook', () => {
  const ORIGINAL_ENV = { ...process.env };

  afterEach(() => {
    jest.resetModules();
    process.env = { ...ORIGINAL_ENV };
  });

  it('returns received=false when payload is invalid JSON', async () => {
    const secret = 'whsec_unit_test';
    const integration = createIntegration(secret);
    const payload = 'not-json';
    const timestamp = '1726761600';
    const signature = crypto
      .createHmac('sha256', secret)
      .update(`${timestamp}.${payload}`, 'utf8')
      .digest('hex');
    const header = `t=${timestamp},v1=${signature}`;

    const result = await integration.handleWebhook(payload, header);
    expect(result).toEqual({ received: false });
  });

  it('returns processed type when event succeeds', async () => {
    const secret = 'whsec_unit_test';
    const integration = createIntegration(secret);
    jest.spyOn(integration, 'handlePaymentSucceeded').mockResolvedValue();

    const payload = JSON.stringify({
      id: 'evt_test',
      type: 'payment_intent.succeeded',
      data: { object: { id: 'pi_test' } },
    });
    const timestamp = '1726761600';
    const signature = crypto
      .createHmac('sha256', secret)
      .update(`${timestamp}.${payload}`, 'utf8')
      .digest('hex');
    const header = `t=${timestamp},v1=${signature}`;

    const result = await integration.handleWebhook(payload, header);
    expect(result).toEqual({ received: true, processed: 'payment_intent.succeeded' });
    expect(integration.handlePaymentSucceeded).toHaveBeenCalledWith({ id: 'pi_test' });
  });
});

  it('processes checkout.session.completed events', async () => {
    const secret = 'whsec_unit_test';
    const integration = createIntegration(secret);
    jest.spyOn(integration, 'handleCheckoutSessionCompleted').mockResolvedValue();

    const payload = JSON.stringify({
      id: 'evt_test',
      type: 'checkout.session.completed',
      data: { object: { id: 'cs_test' } },
    });
    const timestamp = '1726761600';
    const signature = crypto
      .createHmac('sha256', secret)
      .update(`${timestamp}.${payload}`, 'utf8')
      .digest('hex');
    const header = `t=${timestamp},v1=${signature}`;

    const result = await integration.handleWebhook(payload, header);
    expect(result).toEqual({ received: true, processed: 'checkout.session.completed' });
    expect(integration.handleCheckoutSessionCompleted).toHaveBeenCalledWith({ id: 'cs_test' });
  });
