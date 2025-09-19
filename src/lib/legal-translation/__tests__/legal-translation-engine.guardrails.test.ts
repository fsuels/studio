import { translateLegalText } from '@/lib/legal-translation/LegalTranslationEngine';

describe('translateLegalText guardrails', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
    global.fetch = originalFetch;
  });

  it('flags fallback translations and surfaces warnings', async () => {
    const fetchMock = global.fetch as jest.Mock;

    fetchMock.mockImplementation((input: RequestInfo) => {
      const url = typeof input === 'string' ? input : input.toString();

      if (url.includes('/api/ai/identify-legal-terms')) {
        return Promise.resolve({
          json: () => Promise.resolve({ legalTerms: [] }),
        } as ResponseLike);
      }

      if (url.includes('/api/ai/legal-translate')) {
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              translatedText: 'Texto fallback',
              metadata: {
                source: 'fallback',
                warnings: ['Guardrail blocked translation request'],
              },
            }),
        } as ResponseLike);
      }

      throw new Error(`Unexpected fetch call to ${url}`);
    });

    const result = await translateLegalText('Sample text', {
      documentType: 'contract',
      jurisdiction: 'US-ALL',
      sourceLanguage: 'en',
      targetLanguage: 'es',
    });

    expect(result.translatedText).toBe('Texto fallback');
    expect(
      result.warnings.some((warning) =>
        warning.message.includes('Guardrail blocked translation request'),
      ),
    ).toBe(true);
    expect(result.metadata.method).toBe('dictionary_lookup');
    expect(result.metadata.reviewRequired).toBe(true);
  });
});

type ResponseLike = {
  json: () => Promise<any>;
};
