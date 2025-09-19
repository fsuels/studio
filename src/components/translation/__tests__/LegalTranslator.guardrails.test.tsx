import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

jest.mock('@/components/ui/card', () => ({
  Card: ({ children }) => <div>{children}</div>,
  CardHeader: ({ children }) => <div>{children}</div>,
  CardTitle: ({ children }) => <div>{children}</div>,
  CardContent: ({ children }) => <div>{children}</div>,
  CardFooter: ({ children }) => <div>{children}</div>,
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }) => <button {...props}>{children}</button>,
}));

jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children }) => <span>{children}</span>,
}));

jest.mock('@/components/ui/textarea', () => ({
  Textarea: ({ children, ...props }) => <textarea {...props}>{children}</textarea>,
}));

jest.mock('@/components/ui/select', () => ({
  Select: ({ children }) => <div>{children}</div>,
  SelectTrigger: ({ children, ...props }) => <div {...props}>{children}</div>,
  SelectValue: ({ children }) => <div>{children}</div>,
  SelectContent: ({ children }) => <div>{children}</div>,
  SelectItem: ({ children, ...props }) => <div {...props}>{children}</div>,
}));

jest.mock('@/components/ui/accordion', () => ({
  Accordion: ({ children }) => <div>{children}</div>,
  AccordionItem: ({ children, ...props }) => <div {...props}>{children}</div>,
  AccordionTrigger: ({ children, ...props }) => <div {...props}>{children}</div>,
  AccordionContent: ({ children }) => <div>{children}</div>,
}));

jest.mock('@/components/ui/tooltip', () => ({
  TooltipProvider: ({ children }) => <div>{children}</div>,
  Tooltip: ({ children }) => <>{children}</>,
  TooltipTrigger: ({ children }) => <>{children}</>,
  TooltipContent: ({ children }) => <>{children}</>,
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('@/lib/legal-translation/LegalTranslationEngine', () => ({
  translateLegalText: jest.fn(),
}));

const { translateLegalText } = require('@/lib/legal-translation/LegalTranslationEngine');
const { default: LegalTranslator } = require('@/components/translation/LegalTranslator');

describe('LegalTranslator guardrail fallback banner', () => {
  const mockTranslate = translateLegalText as jest.MockedFunction<typeof translateLegalText>;
  const originalFetch = global.fetch;

  beforeEach(() => {
    mockTranslate.mockReset();
    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({ language: 'en', confidence: 0.5 }),
    }) as unknown as typeof fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('shows fallback alert when translation metadata indicates dictionary lookup', async () => {
    mockTranslate.mockResolvedValue({
      translatedText: 'Texto fallback',
      confidence: 0.45,
      warnings: [
        {
          type: 'system_warning',
          message: 'Guardrail blocked translation request',
          severity: 'high',
        },
      ],
      suggestions: [],
      legalTerms: [],
      preservedTerms: [],
      metadata: {
        processingTime: 120,
        method: 'dictionary_lookup',
        reviewRequired: true,
      },
    });

    render(
      <LegalTranslator
        documentType="contract"
        sourceText="Sample text"
        jurisdiction="US-ALL"
      />,
    );

    fireEvent.click(
      screen.getByRole('button', { name: /translate with legal accuracy/i }),
    );

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    expect(screen.getByRole('alert')).toHaveTextContent(
      'AI translation was blocked; showing fallback text for review.',
    );
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Guardrail blocked translation request',
    );
  });
});
