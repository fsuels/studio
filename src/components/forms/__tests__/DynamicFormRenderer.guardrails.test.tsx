import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import DynamicFormRenderer from '@/components/forms/DynamicFormRenderer';
import { analyzeFormData } from '@/ai/flows/analyze-form-data';
import { saveFormProgress, loadFormProgress } from '@/lib/firestore/saveFormProgress';

jest.mock('@/ai/flows/analyze-form-data', () => ({
  analyzeFormData: jest.fn(),
}));

jest.mock('@/lib/firestore/saveFormProgress', () => ({
  saveFormProgress: jest.fn(),
  loadFormProgress: jest.fn().mockResolvedValue(null),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('DynamicFormRenderer guardrail banner', () => {
  const mockAnalyze = analyzeFormData as jest.MockedFunction<typeof analyzeFormData>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows a global guardrail alert when analyzeFormData returns a general warning', async () => {
    mockAnalyze.mockResolvedValue([
      {
        fieldId: 'general',
        importance: 'error',
        message: 'Guardrail blocked this submission.',
      },
    ]);

    render(
      <DynamicFormRenderer
        documentType="service-agreement"
        schema={[
          {
            id: 'fullName',
            label: 'Full Name',
            type: 'text',
            required: true,
          },
        ]}
        onSubmit={jest.fn()}
      />,
    );

    fireEvent.change(screen.getByRole('textbox', { name: /Full Name/i }), {
      target: { value: 'Alice Example' },
    });

    fireEvent.click(
      screen.getByRole('button', { name: 'dynamicForm.confirmAnswersButton' }),
    );

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Guardrail blocked this submission.',
    );
  });
});
