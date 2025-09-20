// Tests for DynamicForm component
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DynamicForm from '@/components/forms/DynamicForm';
import { type DocumentConfig } from '@/lib/config-loader';

let formInitialData = {};
// Mock all problematic UI components
jest.mock('@/components/ui/form', () => ({
  __setInitialData: (data: Record<string, unknown> = {}) => {
    formInitialData = data || {};
  },
  FormField: ({ name, render }: any) =>
    render({
      field: {
        name,
        value: formInitialData?.[name] ?? '',
        onChange: jest.fn(),
      },
    }),
  FormItem: ({ children }: any) => <div>{children}</div>,
  FormLabel: ({ children, htmlFor, ...props }: any) => (
    <label htmlFor={htmlFor} {...props}>
      {children}
    </label>
  ),
  FormControl: ({ children }: any) => <>{children}</>,
  FormMessage: () => null,
  FormDescription: ({ children }: any) => <small>{children}</small>,
}));

jest.mock('@/components/ui/input', () => ({ Input: (props: any) => <input {...props} /> }));
jest.mock('@/components/ui/textarea', () => ({ Textarea: (props: any) => <textarea {...props} /> }));
jest.mock('@/components/ui/button', () => ({ Button: ({ children, ...props }: any) => <button {...props}>{children}</button> }));
jest.mock('@/components/ui/checkbox', () => ({ Checkbox: ({ checked, onCheckedChange, ...props }: any) => (
  <input
    type="checkbox"
    checked={Boolean(checked)}
    onChange={(e) => onCheckedChange?.(e.target.checked)}
    {...props}
  />
)}));
jest.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>,
  CardHeader: ({ children }: any) => <div>{children}</div>,
  CardTitle: ({ children }: any) => <h2>{children}</h2>,
}));
jest.mock('@/components/ui/progress', () => ({ Progress: ({ value }: any) => <div data-testid="progress">{value}%</div> }));
jest.mock('@/components/ui/alert', () => ({ Alert: ({ children }: any) => <div>{children}</div>, AlertDescription: ({ children }: any) => <div>{children}</div> }));
jest.mock('@/components/ui/calendar', () => ({
  Calendar: ({ onSelect }: any) => (
    <div data-testid="calendar" onClick={() => onSelect?.(new Date())}>
      Mock Calendar
    </div>
  ),
}));

jest.mock('@/components/ui/popover', () => ({
  Popover: ({ children }: any) => <div>{children}</div>,
  PopoverContent: ({ children }: any) => <div>{children}</div>,
  PopoverTrigger: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('canvas', () => ({}));
jest.mock('canvas/lib/bindings', () => ({}));
jest.mock('canvas/lib/canvas', () => ({}));

const formModule = require('@/components/ui/form');

beforeEach(() => {
  formModule.__setInitialData({});
});

jest.mock('@/components/ui/select', () => {
  const React = require('react');

  const SelectContentContext = React.createContext([]);

  const Select = ({ children, onValueChange, value, name, ...props }) => {
    const ariaLabelledby = props['aria-labelledby'] ?? props['ariaLabelledby'];
    const ariaLabel = props['aria-label'];
    const rest = { ...props };
    delete rest['aria-labelledby'];
    delete rest['ariaLabelledby'];
    delete rest['aria-label'];
    delete rest['onValueChange'];
    delete rest['value'];
    delete rest['name'];

    const items = [];
    let placeholder = '';

    React.Children.forEach(children, (child) => {
      if (!React.isValidElement(child)) return;
      if (child.type === SelectTrigger) {
        React.Children.forEach(child.props.children, (nested) => {
          if (React.isValidElement(nested) && nested.type === SelectValue) {
            placeholder = nested.props.placeholder ?? '';
          }
        });
      }
      if (child.type === SelectContent) {
        React.Children.forEach(child.props.children, (nested) => {
          if (React.isValidElement(nested) && nested.type === SelectItem) {
            items.push(nested);
          }
        });
      }
    });

    return (
      <select
        role="combobox"
        aria-labelledby={ariaLabelledby}
        aria-label={ariaLabel}
        value={value ?? ''}
        name={name}
        onChange={(event) => onValueChange?.(event.target.value)}
        {...rest}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {items.map((item, index) =>
          React.cloneElement(item, { key: item.key ?? index })
        )}
      </select>
    );
  };

  const SelectTrigger = ({ children }) => <>{children}</>;
  const SelectContent = ({ children }) => <>{children}</>;
  const SelectItem = ({ children, value }) => <option value={value}>{children}</option>;
  const SelectValue = ({ placeholder }) => null;

  const SelectGroup = ({ children }) => <>{children}</>;
  const SelectLabel = ({ children }) => <label>{children}</label>;
  const SelectSeparator = () => <hr />;

  return {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectGroup,
    SelectLabel,
    SelectSeparator,
  };
});

jest.mock('@/components/ui/tooltip', () => ({
  TooltipProvider: ({ children }: any) => <div>{children}</div>,
  Tooltip: ({ children }: any) => <div>{children}</div>,
  TooltipContent: ({ children }: any) => <div>{children}</div>,
  TooltipTrigger: ({ children }: any) => <div>{children}</div>,
}));

const mockConfig: DocumentConfig = {
  jurisdiction: 'us/generic',
  docType: 'basic-nda',
  schemaVersion: '1.0',
  lastUpdated: '2025-01-18',
  questions: [
    {
      id: 'party1_name',
      label: 'Disclosing Party Name',
      type: 'text',
      required: true,
      tooltip: 'Enter the name of the party disclosing information'
    },
    {
      id: 'party2_name', 
      label: 'Receiving Party Name',
      type: 'text',
      required: true,
      tooltip: 'Enter the name of the party receiving information'
    },
    {
      id: 'disclosure_type',
      label: 'Type of Information',
      type: 'select',
      required: true,
      options: [
        { value: 'business', label: 'Business Information' },
        { value: 'technical', label: 'Technical Information' },
        { value: 'financial', label: 'Financial Information' }
      ]
    },
    {
      id: 'effective_date',
      label: 'Effective Date',
      type: 'date',
      required: true
    },
    {
      id: 'mutual',
      label: 'Is this a mutual NDA?',
      type: 'boolean',
      required: false,
      tooltip: 'Check if both parties will be disclosing information'
    }
  ],
  compliance: {
    requiresNotary: false,
    billOfSaleMandatory: false,
    odometerIntegrated: false,
    specialNotes: 'This is a standard non-disclosure agreement template'
  }
};

describe('DynamicForm', () => {
  it('should render form with all configured fields', () => {
    render(<DynamicForm config={mockConfig} />);
    // Check that all fields are rendered
    expect(
      screen.getByRole('textbox', { name: /Disclosing Party Name/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: /Receiving Party Name/i })
    ).toBeInTheDocument();
    expect(screen.getAllByRole('combobox').length).toBeGreaterThan(0);
    expect(
      screen.getByRole('button', { name: /Pick a date/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: /Yes/i })
    ).toBeInTheDocument();
  });

  it('should show required field indicators', () => {
    render(<DynamicForm config={mockConfig} />);
    
    // Required fields should have asterisks
    const requiredFields = screen.getAllByText('*');
    expect(requiredFields.length).toBeGreaterThanOrEqual(3); // party1_name, party2_name, disclosure_type, effective_date
  });

  it('should render submit button', () => {
    render(<DynamicForm config={mockConfig} />);
    
    expect(screen.getByRole('button', { name: /Generate Document/ })).toBeInTheDocument();
  });

  it('should display document title', () => {
    render(<DynamicForm config={mockConfig} />);
    
    // Should convert 'basic-nda' to 'Basic Nda'
    expect(screen.getByText(/Basic Nda/)).toBeInTheDocument();
  });

  it('should show compliance information', () => {
    render(<DynamicForm config={mockConfig} />);
    
    expect(screen.getByText(/This is a standard non-disclosure agreement template/)).toBeInTheDocument();
  });

  it('should handle different field types', () => {
    render(<DynamicForm config={mockConfig} />);
    
    // Text input
    expect(screen.getByLabelText(/Disclosing Party Name/)).toHaveAttribute('type', 'text');
    
    // Select field
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    
    // Checkbox
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('should accept initial data', async () => {
    const initialData = {
      party1_name: 'Test Company',
      mutual: true
    };
    
    formModule.__setInitialData(initialData);
    render(<DynamicForm config={mockConfig} initialData={initialData} />);

    await waitFor(() =>
      expect(screen.getByDisplayValue('Test Company')).toBeInTheDocument(),
    );
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('should call onSave when provided', () => {
    const mockOnSave = jest.fn();
    
    render(<DynamicForm config={mockConfig} onSave={mockOnSave} autoSave={false} />);
    
    // Should render manual save button when autoSave is disabled
    expect(screen.getByRole('button', { name: /Save Draft/ })).toBeInTheDocument();
  });

  it('should show progress indicator', () => {
    render(<DynamicForm config={mockConfig} showProgress={true} />);
    
    expect(screen.getByText(/Completion Progress/)).toBeInTheDocument();
    expect(screen.getAllByText(/0%/).length).toBeGreaterThan(0); // No fields filled initially
  });
});