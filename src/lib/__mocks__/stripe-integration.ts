export const stripeIntegration = {
  verifyWebhookSignature: jest.fn(() => true),
  createPaymentIntent: jest.fn(),
  createCustomer: jest.fn(),
};
