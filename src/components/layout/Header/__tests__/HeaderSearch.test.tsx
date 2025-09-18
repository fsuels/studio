import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HeaderSearch from '../HeaderSearch';
import { searchWorkflowDocuments } from '@/lib/workflow/document-workflow';

// Mock the workflow search helper
jest.mock('@/lib/workflow/document-workflow', () => ({
  searchWorkflowDocuments: jest.fn(),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const mockSearchWorkflowDocuments = searchWorkflowDocuments as jest.MockedFunction<
  typeof searchWorkflowDocuments
>;

const mockDocuments = [
  {
    id: 'bill-of-sale',
    translations: {
      en: {
        name: 'Bill of Sale',
        description: 'Document for selling items',
        aliases: ['sale', 'purchase'],
      },
    },
  },
  {
    id: 'rental-agreement',
    translations: {
      en: {
        name: 'Rental Agreement',
        description: 'Property rental contract',
        aliases: ['lease', 'rent'],
      },
    },
  },
];

describe('HeaderSearch', () => {
  beforeEach(() => {
    mockSearchWorkflowDocuments.mockReturnValue(mockDocuments as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders search input when mounted', () => {
    render(<HeaderSearch clientLocale="en" mounted={true} />);

    const searchInput = screen.getByPlaceholderText(/Search documents/i);
    expect(searchInput).toBeInTheDocument();
  });

  it('does not render search input when not mounted', () => {
    render(<HeaderSearch clientLocale="en" mounted={false} />);

    const searchInput = screen.queryByPlaceholderText(/Search documents/i);
    expect(searchInput).not.toBeInTheDocument();
  });

  it('filters documents based on search query', async () => {
    const user = userEvent.setup();
    render(<HeaderSearch clientLocale="en" mounted={true} />);

    const searchInput = screen.getByPlaceholderText(/Search documents/i);
    await user.type(searchInput, 'bill');

    await waitFor(() => {
      expect(screen.getByText('Bill of Sale')).toBeInTheDocument();
      expect(screen.queryByText('Rental Agreement')).not.toBeInTheDocument();
    });
  });

  it('shows search results dropdown when typing', async () => {
    const user = userEvent.setup();
    render(<HeaderSearch clientLocale="en" mounted={true} />);

    const searchInput = screen.getByPlaceholderText(/Search documents/i);
    await user.type(searchInput, 'sale');

    await waitFor(() => {
      const resultsContainer = screen.getByRole('list');
      expect(resultsContainer).toBeInTheDocument();
    });
  });

  it('hides search results when clicking outside', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <HeaderSearch clientLocale="en" mounted={true} />
        <button>Outside element</button>
      </div>,
    );

    const searchInput = screen.getByPlaceholderText(/Search documents/i);
    await user.type(searchInput, 'bill');

    await waitFor(() => {
      expect(screen.getByText('Bill of Sale')).toBeInTheDocument();
    });

    const outsideElement = screen.getByText('Outside element');
    await user.click(outsideElement);

    await waitFor(() => {
      expect(screen.queryByText('Bill of Sale')).not.toBeInTheDocument();
    });
  });

  it('searches document aliases', async () => {
    const user = userEvent.setup();
    render(<HeaderSearch clientLocale="en" mounted={true} />);

    const searchInput = screen.getByPlaceholderText(/Search documents/i);
    await user.type(searchInput, 'lease');

    await waitFor(() => {
      expect(screen.getByText('Rental Agreement')).toBeInTheDocument();
    });
  });

  it('shows no results message when no matches found', async () => {
    const user = userEvent.setup();
    render(<HeaderSearch clientLocale="en" mounted={true} />);

    const searchInput = screen.getByPlaceholderText(/Search documents/i);
    await user.type(searchInput, 'nonexistent');

    await waitFor(() => {
      expect(screen.getByText(/No documents found/i)).toBeInTheDocument();
    });
  });

  it('handles form submission', async () => {
    const user = userEvent.setup();
    render(<HeaderSearch clientLocale="en" mounted={true} />);

    const searchInput = screen.getByPlaceholderText(/Search documents/i);
    await user.type(searchInput, 'bill');

    const form = searchInput.closest('form');
    expect(form).toBeInTheDocument();

    fireEvent.submit(form!);
    // Router push would be called, but we're just testing the form submission doesn't error
  });

  it('applies custom className', () => {
    const { container } = render(
      <HeaderSearch
        clientLocale="en"
        mounted={true}
        className="custom-class"
      />,
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });
});
