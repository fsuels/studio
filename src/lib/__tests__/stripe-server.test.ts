jest.mock('stripe', () => {
  return jest.fn().mockImplementation((_key: string, options: any) => ({
    __options: options,
  }));
});

describe('getStripeServerClient', () => {
  const ORIGINAL_ENV = { ...process.env };

  afterEach(() => {
    jest.resetModules();
    const StripeConstructor = require('stripe') as jest.Mock;
    StripeConstructor.mockClear();
    process.env = { ...ORIGINAL_ENV };
  });

  it('throws when STRIPE_SECRET_KEY is missing', () => {
    delete process.env.STRIPE_SECRET_KEY;

    jest.isolateModules(() => {
      const { getStripeServerClient } = require('../stripe-server');
      expect(() => getStripeServerClient()).toThrow('STRIPE_SECRET_KEY is not configured');
      const StripeConstructor = require('stripe') as jest.Mock;
      expect(StripeConstructor).not.toHaveBeenCalled();
    });
  });

  it('returns cached client when secret is configured', () => {
    process.env.STRIPE_SECRET_KEY = 'sk_test_unit';

    jest.isolateModules(() => {
      const { getStripeServerClient } = require('../stripe-server');
      const StripeConstructor = require('stripe') as jest.Mock;

      const first = getStripeServerClient();
      const second = getStripeServerClient();

      expect(first).toBe(second);
      expect(StripeConstructor).toHaveBeenCalledTimes(1);
      expect(StripeConstructor).toHaveBeenCalledWith(
        'sk_test_unit',
        expect.objectContaining({ apiVersion: expect.any(String) }),
      );
    });
  });
});
