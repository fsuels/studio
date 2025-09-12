// src/components/marketplace/__tests__/MarketplaceSearch.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MarketplaceSearch } from '../MarketplaceSearch';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Search: ({ className }: { className?: string }) => (
    <div data-testid="search-icon" className={className} />
  ),
  Filter: ({ className }: { className?: string }) => (
    <div data-testid="filter-icon" className={className} />
  ),
  X: ({ className }: { className?: string }) => (
    <div data-testid="x-icon" className={className} />
  ),
  ChevronDown: ({ className }: { className?: string }) => (
    <div data-testid="chevron-down-icon" className={className} />
  ),
  Star: ({ className }: { className?: string }) => (
    <div data-testid="star-icon" className={className} />
  ),
  DollarSign: ({ className }: { className?: string }) => (
    <div data-testid="dollar-icon" className={className} />
  ),
  Globe: ({ className }: { className?: string }) => (
    <div data-testid="globe-icon" className={className} />
  ),
  Shield: ({ className }: { className?: string }) => (
    <div data-testid="shield-icon" className={className} />
  ),
  Crown: ({ className }: { className?: string }) => (
    <div data-testid="crown-icon" className={className} />
  ),
}));

// Mock UI components
jest.mock('@/components/ui/input', () => ({
  Input: React.forwardRef<HTMLInputElement, any>(
    function MockInput({ className, ...props }, ref) {
      return <input ref={ref} className={className} {...props} />;
    }
  ),
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, variant, size, className, ...props }: any) => (
    <button onClick={onClick} className={className} {...props}>
      {children}
    </button>
  ),
}));

jest.mock('@/components/ui/select', () => ({
  Select: ({ children, onValueChange }: any) => (
    <div data-testid="select" onClick={() => onValueChange?.('test-value')}>
      {children}
    </div>
  ),
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ children, value }: any) => (
    <option value={value}>{children}</option>
  ),
  SelectTrigger: ({ children, className }: any) => (
    <div className={className}>{children}</div>
  ),
  SelectValue: ({ placeholder }: any) => <span>{placeholder}</span>,
}));

jest.mock('@/components/ui/popover', () => ({
  Popover: ({ children }: any) => <div>{children}</div>,
  PopoverContent: ({ children, className }: any) => (
    <div className={className}>{children}</div>
  ),
  PopoverTrigger: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('@/components/ui/checkbox', () => ({
  Checkbox: ({ checked, onCheckedChange, id }: any) => (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      id={id}
    />
  ),
}));

jest.mock('@/components/ui/label', () => ({
  Label: ({ children, htmlFor, className }: any) => (
    <label htmlFor={htmlFor} className={className}>
      {children}
    </label>
  ),
}));

jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children, className }: any) => (
    <span className={className}>{children}</span>
  ),
}));

jest.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => (
    <div className={className}>{children}</div>
  ),
  CardContent: ({ children, className }: any) => (
    <div className={className}>{children}</div>
  ),
  CardHeader: ({ children, className }: any) => (
    <div className={className}>{children}</div>
  ),
  CardTitle: ({ children, className }: any) => (
    <h3 className={className}>{children}</h3>
  ),
}));

jest.mock('@/components/ui/slider', () => ({
  Slider: ({ value, onValueChange, min, max, step, className }: any) => (
    <input
      type="range"
      value={value?.[0] || 0}
      onChange={(e) => onValueChange?.([parseInt(e.target.value)])}
      min={min}
      max={max}
      step={step}
      className={className}
      data-testid="slider"
    />
  ),
}));

describe('MarketplaceSearch', () => {
  const mockOnFiltersChange = jest.fn();

  const defaultProps = {
    filters: {
      query: '',
      priceRange: { min: 0, max: 10000 },
    },
    onFiltersChange: mockOnFiltersChange,
    categories: ['contract', 'agreement', 'form'],
    tags: ['legal', 'business', 'personal'],
    jurisdictions: ['US', 'UK', 'CA'],
    languages: ['en', 'es'],
    isLoading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders search input correctly', () => {
    render(<MarketplaceSearch {...defaultProps} />);

    expect(
      screen.getByPlaceholderText('Search templates...'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('search-icon')).toBeInTheDocument();
  });

  it('calls onFiltersChange when typing in search input', async () => {
    render(<MarketplaceSearch {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText('Search templates...');
    fireEvent.change(searchInput, { target: { value: 'contract' } });

    await waitFor(
      () => {
        expect(mockOnFiltersChange).toHaveBeenCalledWith({
          ...defaultProps.filters,
          query: 'contract',
        });
      },
      { timeout: 600 },
    ); // Wait for debounce
  });

  it('shows clear button when search has value', () => {
    const propsWithQuery = {
      ...defaultProps,
      filters: { ...defaultProps.filters, query: 'test' },
    };
    render(<MarketplaceSearch {...propsWithQuery} />);

    expect(screen.getByTestId('x-icon')).toBeInTheDocument();
  });

  it('clears search when clear button is clicked', () => {
    const propsWithQuery = {
      ...defaultProps,
      filters: { ...defaultProps.filters, query: 'test' },
    };
    render(<MarketplaceSearch {...propsWithQuery} />);

    const clearButton = screen.getByTestId('x-icon').closest('button');
    fireEvent.click(clearButton!);

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...defaultProps.filters,
      query: undefined,
    });
  });

  it('renders filter controls', () => {
    render(<MarketplaceSearch {...defaultProps} />);

    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Price')).toBeInTheDocument();
    expect(screen.getByText('Rating')).toBeInTheDocument();
    expect(screen.getByText('Sort by')).toBeInTheDocument();
  });

  it('calls onFilterChange when category filter changes', () => {
    render(<MarketplaceSearch {...defaultProps} />);

    const categorySelect = screen.getByTestId('select');
    fireEvent.click(categorySelect);

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      category: 'test-value',
      priceRange: { min: 0, max: 1000 },
      minRating: 0,
      sortBy: 'relevance',
      sortOrder: 'desc',
      tags: [],
      jurisdiction: 'all',
      languages: [],
      licenseType: 'all',
      verified: false,
      featured: false,
    });
  });

  it('shows loading state', () => {
    render(<MarketplaceSearch {...defaultProps} isLoading={true} />);

    const searchInput = screen.getByPlaceholderText('Search templates...');
    expect(searchInput).toBeDisabled();
  });

  it('displays filter chips for active filters', () => {
    const filters = {
      category: 'Business Contracts',
      minRating: 4,
      verified: true,
      tags: ['contract', 'business'],
      priceRange: { min: 10, max: 100 },
      sortBy: 'rating' as const,
      sortOrder: 'desc' as const,
      jurisdiction: 'US',
      languages: ['en'],
      licenseType: 'premium' as const,
      featured: false,
    };

    render(<MarketplaceSearch {...defaultProps} initialFilters={filters} />);

    expect(screen.getByText('Business Contracts')).toBeInTheDocument();
    expect(screen.getByText('4+ stars')).toBeInTheDocument();
    expect(screen.getByText('Verified only')).toBeInTheDocument();
    expect(screen.getByText('contract')).toBeInTheDocument();
    expect(screen.getByText('business')).toBeInTheDocument();
  });

  it('removes filter when filter chip is clicked', () => {
    const filters = {
      category: 'Business Contracts',
      minRating: 0,
      verified: false,
      tags: [],
      priceRange: { min: 0, max: 1000 },
      sortBy: 'relevance' as const,
      sortOrder: 'desc' as const,
      jurisdiction: 'all',
      languages: [],
      licenseType: 'all' as const,
      featured: false,
    };

    render(<MarketplaceSearch {...defaultProps} initialFilters={filters} />);

    const filterChip = screen.getByText('Business Contracts').closest('div');
    const removeButton = filterChip?.querySelector('[data-testid="x-icon"]');

    if (removeButton) {
      fireEvent.click(removeButton);
      expect(mockOnFilterChange).toHaveBeenCalledWith({
        ...filters,
        category: 'all',
      });
    }
  });

  it('clears all filters when clear all button is clicked', () => {
    const filters = {
      category: 'Business Contracts',
      minRating: 4,
      verified: true,
      tags: ['contract'],
      priceRange: { min: 10, max: 100 },
      sortBy: 'rating' as const,
      sortOrder: 'desc' as const,
      jurisdiction: 'US',
      languages: ['en'],
      licenseType: 'premium' as const,
      featured: true,
    };

    render(<MarketplaceSearch {...defaultProps} initialFilters={filters} />);

    const clearAllButton = screen.getByText('Clear all');
    fireEvent.click(clearAllButton);

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      category: 'all',
      priceRange: { min: 0, max: 1000 },
      minRating: 0,
      sortBy: 'relevance',
      sortOrder: 'desc',
      tags: [],
      jurisdiction: 'all',
      languages: [],
      licenseType: 'all',
      verified: false,
      featured: false,
    });
  });

  it('handles tag input and addition', () => {
    render(<MarketplaceSearch {...defaultProps} />);

    // Find and interact with tag input
    const tagInput = screen.getByPlaceholderText('Add tags...');
    fireEvent.change(tagInput, { target: { value: 'newTag' } });
    fireEvent.keyDown(tagInput, { key: 'Enter' });

    expect(mockOnFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({
        tags: ['newTag'],
      }),
    );
  });

  it('prevents duplicate tags', () => {
    const filters = {
      category: 'all',
      minRating: 0,
      verified: false,
      tags: ['existing'],
      priceRange: { min: 0, max: 1000 },
      sortBy: 'relevance' as const,
      sortOrder: 'desc' as const,
      jurisdiction: 'all',
      languages: [],
      licenseType: 'all' as const,
      featured: false,
    };

    render(<MarketplaceSearch {...defaultProps} initialFilters={filters} />);

    const tagInput = screen.getByPlaceholderText('Add tags...');
    fireEvent.change(tagInput, { target: { value: 'existing' } });
    fireEvent.keyDown(tagInput, { key: 'Enter' });

    // Should not call onFilterChange since tag already exists
    expect(mockOnFilterChange).not.toHaveBeenCalled();
  });

  it('removes tag when tag chip is clicked', () => {
    const filters = {
      category: 'all',
      minRating: 0,
      verified: false,
      tags: ['tag1', 'tag2'],
      priceRange: { min: 0, max: 1000 },
      sortBy: 'relevance' as const,
      sortOrder: 'desc' as const,
      jurisdiction: 'all',
      languages: [],
      licenseType: 'all' as const,
      featured: false,
    };

    render(<MarketplaceSearch {...defaultProps} initialFilters={filters} />);

    const tag1Chip = screen.getByText('tag1').closest('div');
    const removeButton = tag1Chip?.querySelector('[data-testid="x-icon"]');

    if (removeButton) {
      fireEvent.click(removeButton);
      expect(mockOnFilterChange).toHaveBeenCalledWith({
        ...filters,
        tags: ['tag2'],
      });
    }
  });

  it('updates price range filter', () => {
    render(<MarketplaceSearch {...defaultProps} />);

    // Find price range inputs
    const minPriceInput = screen.getByPlaceholderText('Min');
    const maxPriceInput = screen.getByPlaceholderText('Max');

    fireEvent.change(minPriceInput, { target: { value: '50' } });
    fireEvent.change(maxPriceInput, { target: { value: '200' } });

    expect(mockOnFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({
        priceRange: { min: 50, max: 200 },
      }),
    );
  });
});
