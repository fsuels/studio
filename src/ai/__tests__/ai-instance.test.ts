import { generateText, GuardrailViolationError } from '../ai-instance';

jest.mock('@/ai/guardrails', () => ({
  evaluateGuardrails: jest.fn(),
}));

jest.mock('@/ai/gateway', () => ({
  createChatCompletion: jest.fn(),
  extractMessageContent: jest.fn(),
  getAIGatewayModel: jest.fn().mockReturnValue('gpt-oss-20b'),
  isAIGatewayConfigured: jest.fn().mockReturnValue(true),
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

describe('generateText', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    isAIGatewayConfigured.mockReturnValue(true);
    getAIGatewayModel.mockReturnValue('gpt-oss-20b');
    evaluateGuardrails.mockResolvedValue({
      allowed: true,
      verdict: 'allow',
      stage: 'heuristic',
      events: [],
    });
    createChatCompletion.mockResolvedValue({ choices: [] });
    extractMessageContent.mockReturnValue('result');
  });

  it('throws when AI gateway is not configured', async () => {
    isAIGatewayConfigured.mockReturnValue(false);
    await expect(generateText('hello')).rejects.toThrow('AI gateway is not configured');
    expect(evaluateGuardrails).not.toHaveBeenCalled();
  });

  it('runs guardrails before and after model invocation', async () => {
    await generateText('classify this');

    expect(evaluateGuardrails).toHaveBeenCalledTimes(2);
    expect(createChatCompletion).toHaveBeenCalledWith(
      expect.objectContaining({
        messages: expect.any(Array),
      }),
    );
  });

  it('throws GuardrailViolationError when prompt guard blocks', async () => {
    evaluateGuardrails.mockResolvedValueOnce({
      allowed: false,
      verdict: 'block',
      stage: 'prompt_guard',
      reason: 'blocked',
      events: [],
      escalate: true,
    });

    await expect(generateText('risky prompt')).rejects.toBeInstanceOf(
      GuardrailViolationError,
    );
    expect(createChatCompletion).not.toHaveBeenCalled();
  });

  it('wraps guardrail failures as GuardrailViolationError', async () => {
    evaluateGuardrails.mockRejectedValueOnce(new Error('pipeline down'));

    await expect(generateText('prompt')).rejects.toBeInstanceOf(
      GuardrailViolationError,
    );
  });

  it('returns trimmed content and passes response format through', async () => {
    extractMessageContent.mockReturnValue('  structured  ');

    await expect(
      generateText('prompt', { responseFormat: 'json', model: 'custom-model' }),
    ).resolves.toBe('structured');

    expect(getAIGatewayModel).toHaveBeenCalledWith('custom-model');
    expect(createChatCompletion).toHaveBeenCalledWith(
      expect.objectContaining({
        responseFormat: 'json',
      }),
    );
  });
});

