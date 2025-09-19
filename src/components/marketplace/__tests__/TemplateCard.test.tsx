// src/components/marketplace/__tests__/TemplateCard.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TemplateCard } from '../TemplateCard';
import type { MarketplaceTemplate } from '@/types/marketplace';

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  Star: ({ className }: { className?: string }) => (
    <div data-testid="star-icon" className={className} />
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
  DollarSign: ({ className }: { className?: string }) => (
    <div data-testid="dollar-icon" className={className} />
  ),
  Clock: ({ className }: { className?: string }) => (
    <div data-testid="clock-icon" className={className} />
  ),
}));

const mockTemplate: MarketplaceTemplate = {
  id: 'test-template-1',
  name: 'Professional Service Agreement',
  slug: 'professional-service-agreement',
  description:
    'A comprehensive service agreement template for professional services',
  createdBy: 'creator123',
  creatorProfile: {
    userId: 'creator123',
    displayName: 'John Doe',
    bio: 'Professional template creator',
    avatar: 'https://example.com/avatar.jpg',
    verified: true,
    badges: [],
    totalTemplates: 5,
    totalDownloads: 1500,
    totalRevenue: 5000,
    averageRating: 4.8,
  },
  category: 'Business Contracts',
  tags: ['contract', 'business', 'professional'],
  jurisdiction: 'US',
  states: 'all',
  languageSupport: ['en', 'es'],
  visibility: 'public',
  pricing: {
    type: 'one-time',
    basePrice: 2999, // $29.99
    currency: 'USD',
    creatorShare: 70,
    platformFee: 30,
  },
  licenseType: 'premium',
  currentVersion: '1.2.0',
  latestVersionId: 'test-template-1-v1.2.0',
  versions: ['1.0.0', '1.1.0', '1.2.0'],
  stats: {
    totalDownloads: 1250,
    totalInstalls: 1100,
    totalRevenue: 37485,
    uniqueUsers: 950,
    downloadsThisMonth: 150,
    downloadsThisWeek: 35,
    revenueThisMonth: 4485,
    totalRatings: 89,
    averageRating: 4.7,
    completionRate: 92,
    forkCount: 12,
    favoriteCount: 45,
    reportCount: 0,
    versionCount: 3,
    lastVersionDate: new Date('2024-01-15') as any,
    updateFrequency: 30,
  },
  ratings: {
    averageRating: 4.7,
    totalRatings: 89,
    ratingDistribution: { 5: 45, 4: 30, 3: 10, 2: 3, 1: 1 },
    recentTrend: 'improving',
    trendChange: 5.2,
  },
  lastUpdated: new Date('2024-01-15') as any,
  featured: true,
  verified: true,
  moderationStatus: 'approved',
};

describe('TemplateCard', () => {
  const mockOnInstall = jest.fn();
  const mockOnPreview = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders template information correctly', () => {
    render(
      <TemplateCard
        template={mockTemplate}
        onInstall={mockOnInstall}
        onPreview={mockOnPreview}
      />,
    );

    expect(
      screen.getByText('Professional Service Agreement'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'A comprehensive service agreement template for professional services',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('Business Contracts')).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toBeInTheDocument();
  });

  it('displays featured and verified badges', () => {
    render(
      <TemplateCard
        template={mockTemplate}
        onInstall={mockOnInstall}
        onPreview={mockOnPreview}
      />,
    );

    expect(screen.getAllByTestId('crown-icon')).toHaveLength(2); // Featured badge + featured indicator
    expect(screen.getAllByTestId('shield-icon')).toHaveLength(2); // Verified badge + creator verified
  });

  it('shows creator information when showCreator is true', () => {
    render(
      <TemplateCard
        template={mockTemplate}
        showCreator={true}
        onInstall={mockOnInstall}
        onPreview={mockOnPreview}
      />,
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('hides creator information when showCreator is false', () => {
    render(
      <TemplateCard
        template={mockTemplate}
        showCreator={false}
        onInstall={mockOnInstall}
        onPreview={mockOnPreview}
      />,
    );

    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  it('displays correct pricing for free templates', () => {
    const freeTemplate = {
      ...mockTemplate,
      pricing: { ...mockTemplate.pricing, type: 'free' as const, basePrice: 0 },
    };

    render(
      <TemplateCard
        template={freeTemplate}
        onInstall={mockOnInstall}
        onPreview={mockOnPreview}
      />,
    );

    expect(screen.getByText('Free')).toBeInTheDocument();
  });

  it('displays stats correctly', () => {
    render(
      <TemplateCard
        template={mockTemplate}
        onInstall={mockOnInstall}
        onPreview={mockOnPreview}
      />,
    );

    expect(screen.getByText('4.7')).toBeInTheDocument(); // Rating
    expect(screen.getByText('1.3k')).toBeInTheDocument(); // Downloads (1250 -> 1.3k)
  });

  it('displays tags correctly', () => {
    render(
      <TemplateCard
        template={mockTemplate}
        onInstall={mockOnInstall}
        onPreview={mockOnPreview}
      />,
    );

    expect(screen.getByText('contract')).toBeInTheDocument();
    expect(screen.getByText('business')).toBeInTheDocument();
    expect(screen.getByText('professional')).toBeInTheDocument();
  });

  it('displays language support', () => {
    render(
      <TemplateCard
        template={mockTemplate}
        onInstall={mockOnInstall}
        onPreview={mockOnPreview}
      />,
    );

    expect(screen.getByText('Languages:')).toBeInTheDocument();
    expect(screen.getByText(/EN.*ES/)).toBeInTheDocument();
  });

  it('calls onPreview when preview button is clicked', () => {
    render(
      <TemplateCard
        template={mockTemplate}
        onInstall={mockOnInstall}
        onPreview={mockOnPreview}
      />,
    );

    const previewButton = screen.getByRole('button', { name: /preview/i });
    fireEvent.click(previewButton);

    expect(mockOnPreview).toHaveBeenCalledWith('test-template-1');
  });

  it('calls onInstall when install button is clicked', () => {
    render(
      <TemplateCard
        template={mockTemplate}
        onInstall={mockOnInstall}
        onPreview={mockOnPreview}
      />,
    );

    const installButton = screen.getByRole('button', { name: /buy now/i });
    fireEvent.click(installButton);

    expect(mockOnInstall).toHaveBeenCalledWith('test-template-1');
  });

  it('shows "Install" button text for free templates', () => {
    const freeTemplate = {
      ...mockTemplate,
      pricing: { ...mockTemplate.pricing, type: 'free' as const, basePrice: 0 },
    };

    render(
      <TemplateCard
        template={freeTemplate}
        onInstall={mockOnInstall}
        onPreview={mockOnPreview}
      />,
    );

    expect(
      screen.getByRole('button', { name: /install/i }),
    ).toBeInTheDocument();
  });

  it('shows "Buy Now" button text for paid templates', () => {
    render(
      <TemplateCard
        template={mockTemplate}
        onInstall={mockOnInstall}
        onPreview={mockOnPreview}
      />,
    );

    expect(
      screen.getByRole('button', { name: /buy now/i }),
    ).toBeInTheDocument();
  });

  it('applies correct styling for different sizes', () => {
    const { rerender } = render(
      <TemplateCard
        template={mockTemplate}
        size="compact"
        onInstall={mockOnInstall}
        onPreview={mockOnPreview}
      />,
    );

    const cardEl = screen.getByTestId('template-card');
    expect(cardEl).toHaveClass('h-auto');

    rerender(
      <TemplateCard
        template={mockTemplate}
        size="featured"
        onInstall={mockOnInstall}
        onPreview={mockOnPreview}
      />,
    );

    const featuredCard = screen.getByTestId('template-card');
    expect(featuredCard).toHaveClass('ring-2', 'ring-primary/20');
  });

  it('truncates long tag lists', () => {
    const templateWithManyTags = {
      ...mockTemplate,
      tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'],
    };

    render(
      <TemplateCard
        template={templateWithManyTags}
        onInstall={mockOnInstall}
        onPreview={mockOnPreview}
      />,
    );

    expect(screen.getByText('+2')).toBeInTheDocument(); // Shows +2 for remaining tags
  });

  it('formats numbers correctly', () => {
    const templateWithLargeNumbers = {
      ...mockTemplate,
      stats: {
        ...mockTemplate.stats,
        totalDownloads: 1500000, // 1.5M
      },
      ratings: {
        ...mockTemplate.ratings,
        totalRatings: 2500, // 2.5k
      },
    };

    render(
      <TemplateCard
        template={templateWithLargeNumbers}
        onInstall={mockOnInstall}
        onPreview={mockOnPreview}
      />,
    );

    expect(screen.getByText('1.5M')).toBeInTheDocument();
    expect(screen.getByText('(2.5k)')).toBeInTheDocument();
  });
});
