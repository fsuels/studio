import { inferDocumentTypeFlow } from '../infer-document-type';
import { GuardrailViolationError } from '@/ai/ai-instance';

jest.mock('@/ai/ai-instance', () => {
  const actual = jest.requireActual('@/ai/ai-instance');
  return {
    ...actual,
    generateText: jest.fn(),
  };
});

jest.mock('@/lib/internal-linking', () => ({
  getLinkableDocuments: jest.fn(),
}));

const { generateText } = jest.requireMock('@/ai/ai-instance') as {
  generateText: jest.Mock;
};
const { getLinkableDocuments } = jest.requireMock('@/lib/internal-linking') as {
  getLinkableDocuments: jest.Mock;
};

const mockDocs = [
  {
    id: 'service-agreement',
    name: 'Service Agreement',
    category: 'Business',
    tags: ['services'],
    translations: {
      en: { name: 'Service Agreement' },
      es: { name: 'Acuerdo de Servicios' },
    },
  },
];

describe('inferDocumentTypeFlow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getLinkableDocuments.mockReturnValue(mockDocs);
  });

  it('returns gateway suggestions filtered to known documents', async () => {
    generateText.mockResolvedValue(
      JSON.stringify({
        suggestions: [
          { documentType: 'Service Agreement', confidence: 0.9, reasoning: 'Match' },
        ],
      }),
    );

    const result = await inferDocumentTypeFlow({
      description: 'I need a contract for services',
      language: 'en',
    });

    expect(result.suggestions).toHaveLength(1);
    expect(result.suggestions[0].documentType).toBe('Service Agreement');
    expect(generateText).toHaveBeenCalled();
  });

  it('falls back to General Inquiry when guardrails block the request', async () => {
    const decision = {
      allowed: false,
      verdict: 'block' as const,
      stage: 'prompt_guard' as const,
      reason: 'Guardrail policy triggered',
      escalate: true,
      events: [],
    };

    generateText.mockRejectedValue(
      new GuardrailViolationError('blocked', decision, 'prompt'),
    );

    const result = await inferDocumentTypeFlow({
      description: 'Need complex advice',
      language: 'en',
    });

    expect(result.suggestions[0].documentType).toBe('General Inquiry');
    expect(result.suggestions[0].reasoning).toContain('Guardrail policy triggered');
  });

  it('handles invalid JSON responses by returning a safe fallback', async () => {
    generateText.mockResolvedValue('not-json');

    const result = await inferDocumentTypeFlow({
      description: 'I want to transfer property to my sibling',
      language: 'en',
    });

    expect(result.suggestions[0].documentType).toBe('General Inquiry');
    expect(result.suggestions[0].reasoning).toContain('Unable to classify automatically');
  });
});
