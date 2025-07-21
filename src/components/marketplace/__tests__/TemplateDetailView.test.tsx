// src/components/marketplace/__tests__/TemplateDetailView.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TemplateDetailView } from '../TemplateDetailView';
import type { MarketplaceTemplate } from '@/types/marketplace';

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  Star: ({ className, fill }: { className?: string; fill?: string }) => (
    <div data-testid="star-icon" className={className} data-fill={fill} />
  ),
  Download: ({ className }: { className?: string }) => (
    <div data-testid="download-icon" className={className} />
  ),
  Eye: ({ className }: { className?: string }) => (
    <div data-testid="eye-icon" className={className} />
  ),
  Shield: ({ className }: { className?: string }) => (
    <div data-testid="shield-icon" className={className} />
  ),
  Crown: ({ className }: { className?: string }) => (
    <div data-testid="crown-icon" className={className} />
  ),
  Calendar: ({ className }: { className?: string }) => (
    <div data-testid="calendar-icon" className={className} />
  ),
  Globe: ({ className }: { className?: string }) => (
    <div data-testid="globe-icon" className={className} />
  ),
  FileText: ({ className }: { className?: string }) => (
    <div data-testid="file-text-icon" className={className} />
  ),
  Users: ({ className }: { className?: string }) => (
    <div data-testid="users-icon" className={className} />
  ),
  Heart: ({ className }: { className?: string }) => (
    <div data-testid="heart-icon" className={className} />
  ),
  Share2: ({ className }: { className?: string }) => (
    <div data-testid="share-icon" className={className} />
  ),
  ChevronDown: ({ className }: { className?: string }) => (
    <div data-testid="chevron-down-icon" className={className} />
  ),
  ChevronUp: ({ className }: { className?: string }) => (
    <div data-testid="chevron-up-icon" className={className} />
  ),
}));

// Mock UI components
jest.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    onClick,
    variant,
    size,
    className,
    disabled,
    ...props
  }: any) => (
    <button
      onClick={onClick}
      className={className}
      disabled={disabled}
      data-variant={variant}
      data-size={size}
      {...props}
    >
      {children}
    </button>
  ),
}));

jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children, variant, className }: any) => (
    <span className={className} data-variant={variant}>
      {children}
    </span>
  ),
}));

jest.mock('@/components/ui/separator', () => ({
  Separator: ({ className }: any) => <hr className={className} />,
}));

jest.mock('@/components/ui/avatar', () => ({
  Avatar: ({ children, className }: any) => (
    <div className={className}>{children}</div>
  ),
  AvatarImage: ({ src, alt }: any) => <img src={src} alt={alt} />,
  AvatarFallback: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('@/components/ui/tabs', () => ({
  Tabs: ({ children, defaultValue, className }: any) => (
    <div className={className} data-default-value={defaultValue}>
      {children}
    </div>
  ),
  TabsList: ({ children, className }: any) => (
    <div className={className}>{children}</div>
  ),
  TabsTrigger: ({ children, value, className }: any) => (
    <button className={className} data-value={value}>
      {children}
    </button>
  ),
  TabsContent: ({ children, value, className }: any) => (
    <div className={className} data-value={value}>
      {children}
    </div>
  ),
}));

jest.mock('@/components/ui/collapsible', () => ({
  Collapsible: ({ children }: any) => <div>{children}</div>,
  CollapsibleTrigger: ({ children, onClick }: any) => (
    <button onClick={onClick}>{children}</button>
  ),
  CollapsibleContent: ({ children }: any) => <div>{children}</div>,
}));

// Mock version history component
jest.mock('../VersionHistory', () => ({
  VersionHistory: ({ templateId }: { templateId: string }) => (
    <div data-testid="version-history">Version History for {templateId}</div>
  ),
}));

// Mock template reviews component
jest.mock('../TemplateReviews', () => ({
  TemplateReviews: ({ templateId }: { templateId: string }) => (
    <div data-testid="template-reviews">Reviews for {templateId}</div>
  ),
}));

const mockTemplate: MarketplaceTemplate = {
  id: 'template-123',
  name: 'Professional Service Agreement',
  slug: 'professional-service-agreement',
  description:
    'A comprehensive service agreement template for professional services. This template includes all necessary clauses for service delivery, payment terms, and legal protection.',
  createdBy: 'creator-456',
  creatorProfile: {
    userId: 'creator-456',
    displayName: 'John Doe',
    bio: 'Professional template creator with 10 years of legal experience',
    avatar: 'https://example.com/avatar.jpg',
    verified: true,
    badges: ['top_creator', 'legal_expert'],
    totalTemplates: 25,
    totalDownloads: 5000,
    totalRevenue: 25000,
    averageRating: 4.9,
  },
  category: 'Business Contracts',
  tags: ['contract', 'business', 'professional', 'service'],
  jurisdiction: 'US',
  states: 'all',
  languageSupport: ['en', 'es', 'fr'],
  visibility: 'public',
  pricing: {
    type: 'one-time',
    basePrice: 2999, // $29.99
    currency: 'USD',
    creatorShare: 70,
    platformFee: 30,
  },
  licenseType: 'premium',
  currentVersion: '1.3.0',
  latestVersionId: 'template-123-v1.3.0',
  versions: ['1.0.0', '1.1.0', '1.2.0', '1.3.0'],
  stats: {
    totalDownloads: 2500,
    totalInstalls: 2300,
    totalRevenue: 74970,
    uniqueUsers: 2100,
    downloadsThisMonth: 250,
    downloadsThisWeek: 65,
    revenueThisMonth: 7485,
    totalRatings: 234,
    averageRating: 4.8,
    completionRate: 95,
    forkCount: 15,
    favoriteCount: 156,
    reportCount: 0,
    versionCount: 4,
    lastVersionDate: new Date('2024-01-20') as any,
    updateFrequency: 45,
  },
  ratings: {
    averageRating: 4.8,
    totalRatings: 234,
    ratingDistribution: { 5: 150, 4: 60, 3: 18, 2: 4, 1: 2 },
    recentTrend: 'stable',
    trendChange: 0.1,
  },
  lastUpdated: new Date('2024-01-20') as any,
  featured: true,
  verified: true,
  moderationStatus: 'approved',
};

describe('TemplateDetailView', () => {
  const mockOnInstall = jest.fn();
  const mockOnPreview = jest.fn();
  const mockOnFavorite = jest.fn();
  const mockOnShare = jest.fn();

  const defaultProps = {
    template: mockTemplate,
    onInstall: mockOnInstall,
    onPreview: mockOnPreview,
    onFavorite: mockOnFavorite,
    onShare: mockOnShare,
    isLoading: false,
    isFavorited: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders template information correctly', () => {
    render(<TemplateDetailView {...defaultProps} />);

    expect(
      screen.getByText('Professional Service Agreement'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/A comprehensive service agreement template/),
    ).toBeInTheDocument();
    expect(screen.getByText('Business Contracts')).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toBeInTheDocument();
    expect(screen.getByText('v1.3.0')).toBeInTheDocument();
  });

  it('displays creator information with verification badge', () => {
    render(<TemplateDetailView {...defaultProps} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(
      screen.getByText(/Professional template creator/),
    ).toBeInTheDocument();
    expect(screen.getByTestId('shield-icon')).toBeInTheDocument(); // Verified badge
  });

  it('shows featured and verified badges', () => {
    render(<TemplateDetailView {...defaultProps} />);

    expect(screen.getByTestId('crown-icon')).toBeInTheDocument(); // Featured
    expect(screen.getAllByTestId('shield-icon')).toHaveLength(2); // Template verified + creator verified
  });

  it('displays rating with stars', () => {
    render(<TemplateDetailView {...defaultProps} />);

    expect(screen.getByText('4.8')).toBeInTheDocument();
    expect(screen.getByText('(234 reviews)')).toBeInTheDocument();

    // Should have 5 star icons (filled and unfilled)
    const starIcons = screen.getAllByTestId('star-icon');
    expect(starIcons).toHaveLength(5);
  });

  it('displays template statistics', () => {
    render(<TemplateDetailView {...defaultProps} />);

    expect(screen.getByText('2.5k')).toBeInTheDocument(); // Downloads
    expect(screen.getByText('2.3k')).toBeInTheDocument(); // Installs
    expect(screen.getByText('156')).toBeInTheDocument(); // Favorites
    expect(screen.getByText('15')).toBeInTheDocument(); // Forks
  });

  it('displays tags correctly', () => {
    render(<TemplateDetailView {...defaultProps} />);

    expect(screen.getByText('contract')).toBeInTheDocument();
    expect(screen.getByText('business')).toBeInTheDocument();
    expect(screen.getByText('professional')).toBeInTheDocument();
    expect(screen.getByText('service')).toBeInTheDocument();
  });

  it('shows language support', () => {
    render(<TemplateDetailView {...defaultProps} />);

    expect(screen.getByText('EN')).toBeInTheDocument();
    expect(screen.getByText('ES')).toBeInTheDocument();
    expect(screen.getByText('FR')).toBeInTheDocument();
  });

  it('calls onInstall when buy button is clicked', () => {
    render(<TemplateDetailView {...defaultProps} />);

    const buyButton = screen.getByRole('button', { name: /buy now/i });
    fireEvent.click(buyButton);

    expect(mockOnInstall).toHaveBeenCalledWith('template-123');
  });

  it('calls onPreview when preview button is clicked', () => {
    render(<TemplateDetailView {...defaultProps} />);

    const previewButton = screen.getByRole('button', { name: /preview/i });
    fireEvent.click(previewButton);

    expect(mockOnPreview).toHaveBeenCalledWith('template-123');
  });

  it('calls onFavorite when favorite button is clicked', () => {
    render(<TemplateDetailView {...defaultProps} />);

    const favoriteButton = screen.getByRole('button', {
      name: /add to favorites/i,
    });
    fireEvent.click(favoriteButton);

    expect(mockOnFavorite).toHaveBeenCalledWith('template-123');
  });

  it('calls onShare when share button is clicked', () => {
    render(<TemplateDetailView {...defaultProps} />);

    const shareButton = screen.getByRole('button', { name: /share/i });
    fireEvent.click(shareButton);

    expect(mockOnShare).toHaveBeenCalledWith('template-123');
  });

  it('shows "Remove from favorites" when template is favorited', () => {
    render(<TemplateDetailView {...defaultProps} isFavorited={true} />);

    expect(
      screen.getByRole('button', { name: /remove from favorites/i }),
    ).toBeInTheDocument();
  });

  it('shows "Install" for free templates', () => {
    const freeTemplate = {
      ...mockTemplate,
      pricing: { ...mockTemplate.pricing, type: 'free' as const, basePrice: 0 },
    };

    render(<TemplateDetailView {...defaultProps} template={freeTemplate} />);

    expect(screen.getByText('Free')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /install/i }),
    ).toBeInTheDocument();
  });

  it('displays loading state', () => {
    render(<TemplateDetailView {...defaultProps} isLoading={true} />);

    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it('renders tabs correctly', () => {
    render(<TemplateDetailView {...defaultProps} />);

    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Reviews')).toBeInTheDocument();
    expect(screen.getByText('Version History')).toBeInTheDocument();
    expect(screen.getByText('Creator')).toBeInTheDocument();
  });

  it('shows version history tab content', () => {
    render(<TemplateDetailView {...defaultProps} />);

    expect(screen.getByTestId('version-history')).toBeInTheDocument();
  });

  it('shows template reviews tab content', () => {
    render(<TemplateDetailView {...defaultProps} />);

    expect(screen.getByTestId('template-reviews')).toBeInTheDocument();
  });

  it('displays creator stats in creator tab', () => {
    render(<TemplateDetailView {...defaultProps} />);

    expect(screen.getByText('25')).toBeInTheDocument(); // Total templates
    expect(screen.getByText('5.0k')).toBeInTheDocument(); // Total downloads
    expect(screen.getByText('4.9')).toBeInTheDocument(); // Average rating
  });

  it('shows jurisdiction and states information', () => {
    render(<TemplateDetailView {...defaultProps} />);

    expect(screen.getByText('US')).toBeInTheDocument();
    expect(screen.getByText('All States')).toBeInTheDocument();
  });

  it('displays license type', () => {
    render(<TemplateDetailView {...defaultProps} />);

    expect(screen.getByText('Premium License')).toBeInTheDocument();
  });

  it('shows last updated date', () => {
    render(<TemplateDetailView {...defaultProps} />);

    expect(screen.getByText(/January 20, 2024/)).toBeInTheDocument();
  });

  it('expands and collapses full description', () => {
    const longDescription = 'A'.repeat(500); // Long description
    const templateWithLongDesc = {
      ...mockTemplate,
      description: longDescription,
    };

    render(
      <TemplateDetailView {...defaultProps} template={templateWithLongDesc} />,
    );

    const expandButton = screen.getByRole('button', { name: /show more/i });
    fireEvent.click(expandButton);

    expect(
      screen.getByRole('button', { name: /show less/i }),
    ).toBeInTheDocument();
  });

  it('displays rating distribution', () => {
    render(<TemplateDetailView {...defaultProps} />);

    // Check for rating bars
    expect(screen.getByText('5 stars')).toBeInTheDocument();
    expect(screen.getByText('4 stars')).toBeInTheDocument();
    expect(screen.getByText('3 stars')).toBeInTheDocument();
    expect(screen.getByText('2 stars')).toBeInTheDocument();
    expect(screen.getByText('1 star')).toBeInTheDocument();
  });

  it('shows completion rate', () => {
    render(<TemplateDetailView {...defaultProps} />);

    expect(screen.getByText('95%')).toBeInTheDocument();
    expect(screen.getByText('completion rate')).toBeInTheDocument();
  });

  it('displays update frequency', () => {
    render(<TemplateDetailView {...defaultProps} />);

    expect(screen.getByText(/Updated every.*days/)).toBeInTheDocument();
  });
});
