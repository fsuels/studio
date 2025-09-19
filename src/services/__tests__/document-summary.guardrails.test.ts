import { summarizeDocument } from '../document-summary';

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

describe('summarizeDocument guardrails', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getAIGatewayModel.mockReturnValue('gpt-oss-20b');
  });

  it('returns configured message when gateway unavailable', async () => {
    isAIGatewayConfigured.mockReturnValue(false);

    const result = await summarizeDocument('text');

    expect(result).toBe('AI summary service not configured.');
    expect(evaluateGuardrails).not.toHaveBeenCalled();
  });

  it('refuses when pre-guardrail blocks prompt', async () => {
    isAIGatewayConfigured.mockReturnValue(true);
    evaluateGuardrails.mockResolvedValue({
      allowed: false,
      verdict: 'block',
      stage: 'prompt_guard',
      events: [],
    });

    const result = await summarizeDocument('text');

    expect(result).toBe(
      'Unable to summarize this document right now. A specialist will review it.',
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
    extractMessageContent.mockReturnValue('summary');

    const result = await summarizeDocument('text');

    expect(result).toBe(
      'Unable to summarize this document right now. A specialist will review it.',
    );
  });

  it('returns summary when guardrails allow', async () => {
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
    extractMessageContent.mockReturnValue('Summary');

    const result = await summarizeDocument('text');

    expect(result).toBe('Summary');
    expect(createChatCompletion).toHaveBeenCalled();
  });
});
