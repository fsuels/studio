import { explainClause } from '../explain-clause';

jest.mock('@/ai/guardrails', () => ({
  evaluateGuardrails: jest.fn(),
}));

jest.mock('@/ai/gateway', () => ({
  createChatCompletion: jest.fn(),
  extractMessageContent: jest.fn(),
  getAIGatewayModel: jest.fn().mockReturnValue('gpt-oss-20b'),
  isAIGatewayConfigured: jest.fn(),
}));

const { evaluateGuardrails } = jest.requireMock('@/ai/guardrails') as {
  evaluateGuardrails: jest.Mock;
};
const {
  createChatCompletion,
  extractMessageContent,
  getAIGatewayModel,
  isAIGatewayConfigured,
} = jest.requireMock('@/ai/gateway') as {
  createChatCompletion: jest.Mock;
  extractMessageContent: jest.Mock;
  getAIGatewayModel: jest.Mock;
  isAIGatewayConfigured: jest.Mock;
};

describe('explainClause guardrails', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getAIGatewayModel.mockReturnValue('gpt-oss-20b');
  });

  it('requires clause text', async () => {
    const result = await explainClause('   ');
    expect(result).toBe('Clause text is required.');
    expect(evaluateGuardrails).not.toHaveBeenCalled();
  });

  it('refuses when gateway disabled', async () => {
    isAIGatewayConfigured.mockReturnValue(false);
    const result = await explainClause('text');
    expect(result).toBe('AI explanation service is currently unavailable.');
  });

  it('refuses when pre-guardrail blocks prompt', async () => {
    isAIGatewayConfigured.mockReturnValue(true);
    evaluateGuardrails.mockResolvedValue({
      allowed: false,
      verdict: 'block',
      stage: 'prompt_guard',
      events: [],
    });

    const result = await explainClause('text');

    expect(result).toBe(
      'Unable to explain this clause right now. A specialist will review it.',
    );
    expect(createChatCompletion).not.toHaveBeenCalled();
  });

  it('refuses when post-guardrail blocks output', async () => {
    isAIGatewayConfigured.mockReturnValue(true);
    evaluateGuardrails.mockResolvedValueOnce({
      allowed: true,
      verdict: 'allow',
      stage: 'prompt_guard',
      events: [],
    });
    evaluateGuardrails.mockResolvedValueOnce({
      allowed: false,
      verdict: 'review',
      stage: 'llama_guard',
      events: [],
    });
    createChatCompletion.mockResolvedValue({ choices: [] });
    extractMessageContent.mockReturnValue('Explanation');

    const result = await explainClause('text');

    expect(result).toBe(
      'Unable to explain this clause right now. A specialist will review it.',
    );
  });

  it('returns explanation when guardrails allow', async () => {
    isAIGatewayConfigured.mockReturnValue(true);
    evaluateGuardrails.mockResolvedValueOnce({
      allowed: true,
      verdict: 'allow',
      stage: 'prompt_guard',
      events: [],
    });
    evaluateGuardrails.mockResolvedValueOnce({
      allowed: true,
      verdict: 'allow',
      stage: 'llama_guard',
      events: [],
    });
    createChatCompletion.mockResolvedValue({ choices: [] });
    extractMessageContent.mockReturnValue('Explanation');

    const result = await explainClause('text');

    expect(result).toBe('Explanation');
    expect(createChatCompletion).toHaveBeenCalled();
  });
});
