import { analyzeFormData } from '../analyze-form-data';
import { GuardrailViolationError } from '@/ai/ai-instance';

jest.mock('@/ai/ai-instance', () => {
  const actual = jest.requireActual('@/ai/ai-instance');
  return {
    ...actual,
    generateText: jest.fn(),
  };
});

jest.mock('@/ai/gateway', () => ({
  isAIGatewayConfigured: jest.fn(),
}));

const { generateText } = jest.requireMock('@/ai/ai-instance') as {
  generateText: jest.Mock;
};
const { isAIGatewayConfigured } = jest.requireMock('@/ai/gateway') as {
  isAIGatewayConfigured: jest.Mock;
};

describe('analyzeFormData', () => {
  const baseParams = {
    documentType: 'Service Agreement',
    schema: [
      {
        id: 'fullName',
        label: 'Full Name',
        type: 'text' as const,
        required: true,
      },
    ],
    answers: {
      fullName: 'John Doe',
    },
    language: 'en' as const,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    isAIGatewayConfigured.mockReturnValue(true);
  });

  it('returns unavailable message when gateway is not configured', async () => {
    isAIGatewayConfigured.mockReturnValue(false);

    const result = await analyzeFormData(baseParams);

    expect(result).toEqual([
      {
        fieldId: 'general',
        importance: 'error',
        message:
          'AI analysis service is unavailable. Please review your answers manually and contact support if you need assistance.',
      },
    ]);
    expect(generateText).not.toHaveBeenCalled();
  });

  it('surfaces guardrail refusal as a safety warning', async () => {
    const decision = {
      allowed: false,
      verdict: 'block' as const,
      stage: 'prompt_guard' as const,
      reason: 'Sensitive personal data detected',
      escalate: true,
      events: [],
    };

    generateText.mockRejectedValue(
      new GuardrailViolationError('blocked', decision, 'prompt'),
    );

    const result = await analyzeFormData(baseParams);

    expect(result[0].message).toContain('Sensitive personal data detected');
    expect(result[0].importance).toBe('error');
  });

  it('parses JSON suggestions when guardrails allow the request', async () => {
    generateText.mockResolvedValue(
      JSON.stringify([
        {
          fieldId: 'fullName',
          importance: 'info',
          message: 'Consider using full legal name including middle initial.',
        },
      ]),
    );

    const result = await analyzeFormData(baseParams);

    expect(result).toHaveLength(1);
    expect(result[0].fieldId).toBe('fullName');
    expect(generateText).toHaveBeenCalled();
  });
});
