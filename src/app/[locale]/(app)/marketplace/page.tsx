// src/app/[locale]/(app)/marketplace/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Grid, List, Crown, TrendingUp, Clock, Filter } from 'lucide-react';
import { TemplateCard } from '@/components/marketplace/TemplateCard';
import { MarketplaceSearch } from '@/components/marketplace/MarketplaceSearch';
import type {
  MarketplaceTemplate,
  MarketplaceSearchFilters,
  MarketplaceSearchResult,
} from '@/types/marketplace';

interface MarketplacePageProps {
  params: Promise<{ locale: string }>;
}

export default function MarketplacePage({ params }: MarketplacePageProps) {
  const [templates, setTemplates] = useState<MarketplaceSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [filters, setFilters] = useState<MarketplaceSearchFilters>({
    sortBy: 'relevance',
    sortOrder: 'desc',
  });

  // Mock data for filters - in real app, these would come from API
  const filterOptions = {
    categories: [
      'Business Contracts',
      'Real Estate',
      'Personal Legal',
      'Employment',
      'Intellectual Property',
      'Financial',
      'Family Law',
      'Healthcare',
    ],
    tags: [
      'contract',
      'agreement',
      'lease',
      'employment',
      'nda',
      'invoice',
      'bill-of-sale',
      'power-of-attorney',
      'will',
      'deed',
      'license',
      'waiver',
    ],
    jurisdictions: ['US', 'CA', 'UK', 'AU', 'EU'],
    languages: ['en', 'es', 'fr', 'de'],
  };

  // Featured templates data
  const featuredTemplates = [
    {
      id: 'featured-1',
      title: 'Professional Service Agreement',
      description:
        'Comprehensive service agreement template for professional services',
      category: 'Business Contracts',
      downloads: 15420,
      rating: 4.8,
      price: 2999, // $29.99
      featured: true,
    },
    {
      id: 'featured-2',
      title: 'Residential Lease Agreement',
      description:
        'State-compliant residential lease template with customizable terms',
      category: 'Real Estate',
      downloads: 23150,
      rating: 4.9,
      price: 1999, // $19.99
      featured: true,
    },
    {
      id: 'featured-3',
      title: 'Employee Handbook Template',
      description: 'Complete employee handbook template with HR policies',
      category: 'Employment',
      downloads: 8760,
      rating: 4.7,
      price: 4999, // $49.99
      featured: true,
    },
  ];

  const loadTemplates = useCallback(
    async (page = 1, newFilters = filters) => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: '20',
          ...Object.entries(newFilters).reduce(
            (acc, [key, value]) => {
              if (value !== undefined && value !== null) {
                if (Array.isArray(value)) {
                  acc[key] = value.join(',');
                } else {
                  acc[key] = value.toString();
                }
              }
              return acc;
            },
            {} as Record<string, string>,
          ),
        });

        const response = await fetch(`/api/marketplace/templates?${params}`);
        const data = await response.json();

        if (data.success) {
          if (page === 1) {
            setTemplates(data.data.templates);
          } else {
            setTemplates((prev) => [...prev, ...data.data.templates]);
          }
          setHasMore(data.data.pagination.hasMore);
          setCurrentPage(page);
        }
      } catch (error) {
        console.error('Failed to load templates:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [filters],
  );

  useEffect(() => {
    loadTemplates(1, filters);
  }, [filters]);

  const handleFiltersChange = useCallback(
    (newFilters: MarketplaceSearchFilters) => {
      setFilters(newFilters);
      setCurrentPage(1);
    },
    [],
  );

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      loadTemplates(currentPage + 1, filters);
    }
  };

  const handleTemplateInstall = (templateId: string) => {
    // TODO: Implement template installation
    console.log('Install template:', templateId);
  };

  const handleTemplatePreview = (templateId: string) => {
    // TODO: Implement template preview
    console.log('Preview template:', templateId);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.tags?.length) count += filters.tags.length;
    if (filters.jurisdiction) count++;
    if (filters.language) count++;
    if (filters.priceRange) count++;
    if (filters.rating) count++;
    if (filters.verified) count++;
    if (filters.featured) count++;
    return count;
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Template Marketplace
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover professional legal document templates created by verified
          experts. Get the documents you need, when you need them.
        </p>
      </div>

      {/* Featured Templates Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Crown className="h-5 w-5 text-yellow-500" />
            <h2 className="text-2xl font-bold">Featured Templates</h2>
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
              Editor's Choice
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredTemplates.map((template) => (
              <div key={template.id} className="bg-white rounded-lg p-4 border">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{template.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {template.description}
                    </p>
                  </div>
                  <Crown className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                  <span>{template.category}</span>
                  <div className="flex items-center gap-2">
                    <span>⭐ {template.rating}</span>
                    <span>•</span>
                    <span>{template.downloads.toLocaleString()} downloads</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg">
                    ${(template.price / 100).toFixed(2)}
                  </span>
                  <Button size="sm">Get Template</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">1,200+</div>
            <div className="text-sm text-muted-foreground">
              Templates Available
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">450+</div>
            <div className="text-sm text-muted-foreground">
              Verified Creators
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">2.5M+</div>
            <div className="text-sm text-muted-foreground">Downloads</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">4.8★</div>
            <div className="text-sm text-muted-foreground">Average Rating</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <MarketplaceSearch
        filters={filters}
        onFiltersChange={handleFiltersChange}
        categories={filterOptions.categories}
        tags={filterOptions.tags}
        jurisdictions={filterOptions.jurisdictions}
        languages={filterOptions.languages}
        isLoading={isLoading}
      />

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">
            {filters.query
              ? `Search results for "${filters.query}"`
              : 'All Templates'}
          </h2>
          {getActiveFiltersCount() > 0 && (
            <Badge variant="secondary" className="gap-1">
              <Filter className="h-3 w-3" />
              {getActiveFiltersCount()} filter
              {getActiveFiltersCount() !== 1 ? 's' : ''} applied
            </Badge>
          )}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Templates Grid/List */}
      {isLoading && templates.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                  <div className="h-3 bg-muted rounded w-full" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : templates.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold mb-2">No templates found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or browse our featured
              templates above.
            </p>
            <Button
              onClick={() =>
                handleFiltersChange({ sortBy: 'relevance', sortOrder: 'desc' })
              }
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }
        >
          {templates.map((result) => (
            <TemplateCard
              key={result.template.id}
              template={result.template}
              size={viewMode === 'list' ? 'compact' : 'default'}
              onInstall={handleTemplateInstall}
              onPreview={handleTemplatePreview}
            />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && templates.length > 0 && (
        <div className="text-center">
          <Button
            onClick={handleLoadMore}
            disabled={isLoading}
            size="lg"
            className="gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Loading...
              </>
            ) : (
              <>
                <TrendingUp className="h-4 w-4" />
                Load More Templates
              </>
            )}
          </Button>
        </div>
      )}

      {/* Marketplace Info */}
      <Card className="bg-muted/30">
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">
            Become a Template Creator
          </h3>
          <p className="text-muted-foreground mb-4">
            Share your expertise and earn money by creating professional legal
            templates.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild>
              <a href="/marketplace/submit">Submit Template</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/marketplace/creators">Learn More</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
