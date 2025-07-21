import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import FieldRenderer from '../FieldRenderer';
import { useNotary } from '@/hooks/useNotary';
import { useVinDecoder } from '@/hooks/useVinDecoder';
import type { LegalDocument } from '@/lib/document-library';

// Mock hooks
jest.mock('@/hooks/useNotary');
jest.mock('@/hooks/useVinDecoder');
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) =>
      options?.defaultValue || key.split('.').pop() || key,
  }),
}));

// Mock components
jest.mock('@/components/forms/wizard/SmartInput', () => {
  return function MockSmartInput({ rhfProps, ...props }: any) {
    return <input {...props} {...rhfProps} data-testid="smart-input" />;
  };
});

jest.mock('../AddressField', () => {
  return function MockAddressField({ onChange, value, ...props }: any) {
    return (
      <input
        {...props}
        data-testid="address-field"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  };
});

const mockUseNotary = useNotary as jest.MockedFunction<typeof useNotary>;
const mockUseVinDecoder = useVinDecoder as jest.MockedFunction<
  typeof useVinDecoder
>;

// Test wrapper component
function TestWrapper({
  children,
  defaultValues = {},
}: {
  children: React.ReactNode;
  defaultValues?: any;
}) {
  const methods = useForm({ defaultValues });
  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe('FieldRenderer', () => {
  const mockDocument: LegalDocument = {
    id: 'test-doc',
    category: 'Test',
    languageSupport: ['en'],
    requiresNotarization: false,
    canBeRecorded: false,
    offerNotarization: false,
    offerRecordingHelp: false,
    basePrice: 10,
    states: 'all',
    schema: z.object({
      name: z.string().min(1, 'Name is required'),
      email: z.string().email('Invalid email'),
      age: z.number().min(18, 'Must be 18 or older'),
      state: z.enum(['CA', 'NY', 'TX']),
      address: z.string(),
      isActive: z.boolean(),
      description: z.string().optional(),
    }),
    questions: [
      {
        id: 'name',
        label: 'Full Name',
        type: 'text',
        required: true,
      },
      {
        id: 'email',
        label: 'Email Address',
        type: 'email',
        required: true,
        tooltip: 'Enter your email address',
      },
      {
        id: 'age',
        label: 'Age',
        type: 'number',
        required: true,
      },
      {
        id: 'state',
        label: 'State',
        type: 'select',
        required: true,
        options: [
          { value: 'CA', label: 'California' },
          { value: 'NY', label: 'New York' },
          { value: 'TX', label: 'Texas' },
        ],
      },
      {
        id: 'address',
        label: 'Address',
        type: 'address',
        required: false,
      },
      {
        id: 'isActive',
        label: 'Active Status',
        type: 'boolean',
        required: false,
      },
      {
        id: 'description',
        label: 'Description',
        type: 'textarea',
        required: false,
        placeholder: 'Enter description...',
      },
    ],
    upsellClauses: [],
    translations: {
      en: {
        name: 'Test Document',
        description: 'A test document',
        aliases: ['test'],
      },
    },
  };

  beforeEach(() => {
    mockUseNotary.mockReturnValue({
      isRequired: false,
      fee: 0,
      details: null,
    });

    mockUseVinDecoder.mockReturnValue({
      decode: jest.fn(),
      data: null,
      loading: false,
      error: null,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders text input field correctly', () => {
    render(
      <TestWrapper>
        <FieldRenderer fieldKey="name" doc={mockDocument} />
      </TestWrapper>,
    );

    expect(screen.getByLabelText(/Full Name/)).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument(); // Required indicator
    expect(screen.getByTestId('smart-input')).toBeInTheDocument();
  });

  it('renders email input field with tooltip', () => {
    render(
      <TestWrapper>
        <FieldRenderer fieldKey="email" doc={mockDocument} />
      </TestWrapper>,
    );

    expect(screen.getByLabelText(/Email Address/)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Info for Email Address/ }),
    ).toBeInTheDocument();
  });

  it('renders number input field', () => {
    render(
      <TestWrapper>
        <FieldRenderer fieldKey="age" doc={mockDocument} />
      </TestWrapper>,
    );

    const input = screen.getByTestId('smart-input');
    expect(input).toHaveAttribute('type', 'number');
    expect(input).toHaveAttribute('inputMode', 'numeric');
  });

  it('renders select field with options', () => {
    render(
      <TestWrapper>
        <FieldRenderer fieldKey="state" doc={mockDocument} />
      </TestWrapper>,
    );

    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('Select...')).toBeInTheDocument();
  });

  it('renders address field', () => {
    render(
      <TestWrapper>
        <FieldRenderer fieldKey="address" doc={mockDocument} />
      </TestWrapper>,
    );

    expect(screen.getByTestId('address-field')).toBeInTheDocument();
  });

  it('renders textarea field', () => {
    render(
      <TestWrapper>
        <FieldRenderer fieldKey="description" doc={mockDocument} />
      </TestWrapper>,
    );

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Enter description...'),
    ).toBeInTheDocument();
  });

  it('shows validation error', async () => {
    const TestComponent = () => {
      const methods = useForm({
        defaultValues: { name: '' },
        mode: 'onBlur',
      });

      return (
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(() => {})}>
            <FieldRenderer fieldKey="name" doc={mockDocument} />
            <button type="submit">Submit</button>
          </form>
        </FormProvider>
      );
    };

    const user = userEvent.setup();
    render(<TestComponent />);

    const submitButton = screen.getByText('Submit');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Name is required/)).toBeInTheDocument();
    });
  });

  it('handles VIN field with decoder', async () => {
    const mockDecode = jest.fn();
    const vinDocument = {
      ...mockDocument,
      questions: [
        {
          id: 'vin',
          label: 'VIN Number',
          type: 'text',
          required: true,
        },
      ],
    };

    mockUseVinDecoder.mockReturnValue({
      decode: mockDecode,
      data: {
        year: '2020',
        make: 'Toyota',
        model: 'Camry',
        bodyClass: 'Sedan',
      },
      loading: false,
      error: null,
    });

    const user = userEvent.setup();
    render(
      <TestWrapper>
        <FieldRenderer fieldKey="vin" doc={vinDocument} />
      </TestWrapper>,
    );

    const vinInput = screen.getByTestId('smart-input');
    await user.type(vinInput, '1234567890');
    await user.tab(); // Trigger onBlur

    expect(mockDecode).toHaveBeenCalledWith('1234567890');
    expect(
      screen.getByText(/Decoded: 2020 Toyota Camry \(Sedan\)/),
    ).toBeInTheDocument();
  });

  it('shows VIN loading state', () => {
    const vinDocument = {
      ...mockDocument,
      questions: [
        {
          id: 'vin',
          label: 'VIN Number',
          type: 'text',
          required: true,
        },
      ],
    };

    mockUseVinDecoder.mockReturnValue({
      decode: jest.fn(),
      data: null,
      loading: true,
      error: null,
    });

    render(
      <TestWrapper>
        <FieldRenderer fieldKey="vin" doc={vinDocument} />
      </TestWrapper>,
    );

    expect(screen.getByText(/Decoding VIN/)).toBeInTheDocument();
  });

  it('shows VIN error state', () => {
    const vinDocument = {
      ...mockDocument,
      questions: [
        {
          id: 'vin',
          label: 'VIN Number',
          type: 'text',
          required: true,
        },
      ],
    };

    mockUseVinDecoder.mockReturnValue({
      decode: jest.fn(),
      data: null,
      loading: false,
      error: 'Invalid VIN number',
    });

    render(
      <TestWrapper>
        <FieldRenderer fieldKey="vin" doc={vinDocument} />
      </TestWrapper>,
    );

    expect(screen.getByText('Invalid VIN number')).toBeInTheDocument();
  });

  it('handles notarization toggle when required by state', () => {
    const notaryDocument = {
      ...mockDocument,
      offerNotarization: true,
    };

    mockUseNotary.mockReturnValue({
      isRequired: true,
      fee: 25,
      details: null,
    });

    render(
      <TestWrapper defaultValues={{ state: 'CA' }}>
        <FieldRenderer fieldKey="notarizationToggle" doc={notaryDocument} />
      </TestWrapper>,
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
    expect(checkbox).toBeDisabled();
    expect(
      screen.getByText(/Notarization \(Required by State\)/),
    ).toBeInTheDocument();
  });

  it('handles as_is toggle field', async () => {
    const billOfSaleDoc = {
      ...mockDocument,
      questions: [
        {
          id: 'as_is',
          label: 'Sold As-Is',
          type: 'boolean',
          required: false,
        },
      ],
    };

    const user = userEvent.setup();
    render(
      <TestWrapper>
        <FieldRenderer fieldKey="as_is" doc={billOfSaleDoc} />
      </TestWrapper>,
    );

    expect(screen.getByText('Sold As-Is')).toBeInTheDocument();

    const toggle = screen.getByRole('switch');
    await user.click(toggle);

    expect(screen.getByText('Warranty Included')).toBeInTheDocument();
  });

  it('shows warranty text field when not sold as-is', () => {
    render(
      <TestWrapper defaultValues={{ as_is: false }}>
        <FieldRenderer fieldKey="warranty_text" doc={mockDocument} />
      </TestWrapper>,
    );

    expect(
      screen.getByPlaceholderText(/Describe warranty/),
    ).toBeInTheDocument();
  });

  it('hides warranty text field when sold as-is', () => {
    render(
      <TestWrapper defaultValues={{ as_is: true }}>
        <FieldRenderer fieldKey="warranty_text" doc={mockDocument} />
      </TestWrapper>,
    );

    expect(
      screen.queryByPlaceholderText(/Describe warranty/),
    ).not.toBeInTheDocument();
  });

  it('renders odometer status radio group', () => {
    const vehicleDoc = {
      ...mockDocument,
      questions: [
        {
          id: 'odo_status',
          label: 'Odometer Status',
          type: 'select',
          required: true,
          options: [
            { value: 'actual', label: 'Actual Mileage' },
            { value: 'not_actual', label: 'Not Actual Mileage' },
            { value: 'exempt', label: 'Exempt from Disclosure' },
          ],
        },
      ],
    };

    render(
      <TestWrapper>
        <FieldRenderer fieldKey="odo_status" doc={vehicleDoc} />
      </TestWrapper>,
    );

    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    expect(screen.getByText('Actual Mileage')).toBeInTheDocument();
    expect(screen.getByText('Not Actual Mileage')).toBeInTheDocument();
    expect(screen.getByText('Exempt from Disclosure')).toBeInTheDocument();
  });

  it('handles field from Zod schema without questions definition', () => {
    const schemaOnlyDoc = {
      ...mockDocument,
      questions: [], // No questions defined
    };

    render(
      <TestWrapper>
        <FieldRenderer fieldKey="name" doc={schemaOnlyDoc} />
      </TestWrapper>,
    );

    // Should render based on Zod schema
    expect(screen.getByLabelText(/Name/)).toBeInTheDocument();
    expect(screen.getByTestId('smart-input')).toBeInTheDocument();
  });

  it('returns null for unknown field keys', () => {
    const { container } = render(
      <TestWrapper>
        <FieldRenderer fieldKey="unknown_field" doc={mockDocument} />
      </TestWrapper>,
    );

    expect(container.firstChild).toBeNull();
  });

  it('applies error styling when field has validation errors', async () => {
    const TestComponent = () => {
      const methods = useForm({
        defaultValues: { email: 'invalid-email' },
        mode: 'onBlur',
      });

      return (
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(() => {})}>
            <FieldRenderer fieldKey="email" doc={mockDocument} />
            <button type="submit">Submit</button>
          </form>
        </FormProvider>
      );
    };

    const user = userEvent.setup();
    render(<TestComponent />);

    const submitButton = screen.getByText('Submit');
    await user.click(submitButton);

    await waitFor(() => {
      const input = screen.getByTestId('smart-input');
      expect(input).toHaveClass('border-destructive');
    });
  });
});
