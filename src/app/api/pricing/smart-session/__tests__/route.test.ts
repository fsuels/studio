import { NextResponse } from 'next/server';

jest.mock('@/lib/smart-pricing-engine', () => ({
  smartPricingEngine: {
    getUserCurrency: jest.fn(),
    getPricingSummary: jest.fn(),
  },
}));

jest.mock('@/lib/stripe-server', () => ({
  getStripeServerClient: jest.fn(),
}));

type MockedStripe = {
  checkout: {
    sessions: {
      create: jest.Mock;
    };
  };
};

const { smartPricingEngine } = require('@/lib/smart-pricing-engine');
const { getStripeServerClient } = require('@/lib/stripe-server');
const { POST } = require('../route');

describe('POST /api/pricing/smart-session', () => {
  const createRequest = (body: any, origin: string | null = null) => {
    return {
      json: jest.fn().mockResolvedValue(body),
      headers: {
        get: (key: string) => (key.toLowerCase() === 'origin' ? origin : null),
      },
      nextUrl: {
        protocol: 'https:',
        host: 'example.com',
      },
    } as any;
  };

  beforeEach(() => {
    jest.resetAllMocks();
    smartPricingEngine.getUserCurrency.mockResolvedValue('USD');
  });

  it('returns purchase order requirement when plan allows it', async () => {
    smartPricingEngine.getPricingSummary.mockResolvedValue({
      availablePlans: [
        {
          id: 'enterprise',
          stripePriceIds: { USD: 'price_enterprise_usd' },
          allowPurchaseOrder: true,
        },
      ],
      taxInfo: { taxRequired: false },
      userLocation: { countryCode: 'US', stateCode: 'CA' },
    });

    const request = createRequest({
      planId: 'enterprise',
      allowPurchaseOrder: true,
      customerEmail: 'user@example.com',
      successPath: '/dashboard',
      cancelPath: '/pricing',
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload).toMatchObject({ requiresPurchaseOrder: true });
    expect(getStripeServerClient).not.toHaveBeenCalled();
  });

  it('creates Stripe checkout session when plan is available', async () => {
    smartPricingEngine.getPricingSummary.mockResolvedValue({
      availablePlans: [
        {
          id: 'starter',
          stripePriceIds: { USD: 'price_starter_usd' },
          allowPurchaseOrder: false,
        },
      ],
      taxInfo: { taxRequired: true },
      userLocation: { countryCode: 'US', stateCode: 'CA' },
    });

    const stripeMock: MockedStripe = {
      checkout: {
        sessions: {
          create: jest.fn().mockResolvedValue({ id: 'cs_123', url: 'https://stripe' }),
        },
      },
    };
    (getStripeServerClient as jest.Mock).mockReturnValue(stripeMock);

    const request = createRequest({
      planId: 'starter',
      allowPurchaseOrder: false,
      customerEmail: 'user@example.com',
      successPath: '/dashboard',
      cancelPath: '/pricing',
    }, 'https://app.example.com');

    const response = await POST(request);
    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload).toEqual({
      sessionId: 'cs_123',
      pricingSummary: expect.any(Object),
      requiresPurchaseOrder: false,
    });

    expect(stripeMock.checkout.sessions.create).toHaveBeenCalledWith({
      automatic_payment_methods: { enabled: true },
      line_items: [
        {
          price: 'price_starter_usd',
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: expect.stringContaining('/dashboard'),
      cancel_url: expect.stringContaining('/pricing'),
      customer_email: 'user@example.com',
      automatic_tax: { enabled: true },
      tax_id_collection: { enabled: true },
      metadata: {
        planId: 'starter',
        currency: 'USD',
        userCountry: 'US',
        userState: 'CA',
      },
    });
  });
});
