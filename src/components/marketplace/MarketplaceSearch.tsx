// src/components/marketplace/MarketplaceSearch.tsx
'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import {
  Search,
  Filter,
  X,
  Star,
  DollarSign,
  Globe,
  Shield,
  Crown,
} from 'lucide-react';
import type { MarketplaceSearchFilters } from '@/types/marketplace';

interface MarketplaceSearchProps {
  filters: MarketplaceSearchFilters;
  onFiltersChange: (filters: MarketplaceSearchFilters) => void;
  categories: string[];
  tags: string[];
  jurisdictions: string[];
  languages: string[];
  isLoading?: boolean;
}

export function MarketplaceSearch({
  filters,
  onFiltersChange,
  categories,
  tags,
  jurisdictions,
  languages,
  isLoading = false,
}: MarketplaceSearchProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([
    filters.priceRange?.min || 0,
    filters.priceRange?.max || 10000,
  ]);

  // Update search query
  const handleSearchChange = useCallback(
    (query: string) => {
      onFiltersChange({
        ...filters,
        query: query || undefined,
      });
    },
    [filters, onFiltersChange],
  );

  // Update category
  const handleCategoryChange = useCallback(
    (category: string) => {
      onFiltersChange({
        ...filters,
        category: category === 'all' ? undefined : category,
      });
    },
    [filters, onFiltersChange],
  );

  // Update sorting
  const handleSortChange = useCallback(
    (sortBy: string) => {
      const [field, order] = sortBy.split('-');
      onFiltersChange({
        ...filters,
        sortBy: field as any,
        sortOrder: order as 'asc' | 'desc',
      });
    },
    [filters, onFiltersChange],
  );

  // Toggle tag
  const handleTagToggle = useCallback(
    (tag: string) => {
      const currentTags = filters.tags || [];
      const newTags = currentTags.includes(tag)
        ? currentTags.filter((t) => t !== tag)
        : [...currentTags, tag];

      onFiltersChange({
        ...filters,
        tags: newTags.length > 0 ? newTags : undefined,
      });
    },
    [filters, onFiltersChange],
  );

  // Update price range
  const handlePriceRangeChange = useCallback(
    (range: number[]) => {
      setPriceRange(range);
      onFiltersChange({
        ...filters,
        priceRange: {
          min: range[0],
          max: range[1],
        },
      });
    },
    [filters, onFiltersChange],
  );

  // Clear all filters
  const clearFilters = useCallback(() => {
    onFiltersChange({
      sortBy: 'relevance',
      sortOrder: 'desc',
    });
    setPriceRange([0, 10000]);
  }, [onFiltersChange]);

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.category) count++;
    if (filters.tags?.length) count += filters.tags.length;
    if (filters.jurisdiction) count++;
    if (filters.language) count++;
    if (filters.priceRange) count++;
    if (filters.rating) count++;
    if (filters.verified !== undefined) count++;
    if (filters.featured !== undefined) count++;
    return count;
  }, [filters]);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search templates by name, description, or tags..."
          value={filters.query || ''}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 pr-4"
          disabled={isLoading}
        />
      </div>

      {/* Quick Filters Row */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Category Filter */}
        <Select
          value={filters.category || 'all'}
          onValueChange={handleCategoryChange}
          disabled={isLoading}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort Filter */}
        <Select
          value={`${filters.sortBy || 'relevance'}-${filters.sortOrder || 'desc'}`}
          onValueChange={handleSortChange}
          disabled={isLoading}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance-desc">Most Relevant</SelectItem>
            <SelectItem value="rating-desc">Highest Rated</SelectItem>
            <SelectItem value="downloads-desc">Most Popular</SelectItem>
            <SelectItem value="newest-desc">Newest First</SelectItem>
            <SelectItem value="updated-desc">Recently Updated</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>

        {/* Advanced Filters Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          disabled={isLoading}
        >
          <Filter className="h-4 w-4 mr-1" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        {/* Clear Filters */}
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            disabled={isLoading}
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.category && (
            <Badge variant="secondary" className="gap-1">
              Category: {filters.category}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleCategoryChange('all')}
              />
            </Badge>
          )}

          {filters.tags?.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1">
              {tag}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleTagToggle(tag)}
              />
            </Badge>
          ))}

          {filters.verified && (
            <Badge variant="secondary" className="gap-1">
              <Shield className="h-3 w-3" />
              Verified Only
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() =>
                  onFiltersChange({ ...filters, verified: undefined })
                }
              />
            </Badge>
          )}

          {filters.featured && (
            <Badge variant="secondary" className="gap-1">
              <Crown className="h-3 w-3" />
              Featured Only
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() =>
                  onFiltersChange({ ...filters, featured: undefined })
                }
              />
            </Badge>
          )}
        </div>
      )}

      {/* Advanced Filters Panel */}
      {showAdvancedFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Advanced Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Price Range */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <label className="text-sm font-medium">Price Range</label>
              </div>
              <div className="px-3">
                <Slider
                  value={priceRange}
                  onValueChange={handlePriceRangeChange}
                  max={10000}
                  step={100}
                  className="w-full"
                  disabled={isLoading}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>${priceRange[0] / 100}</span>
                  <span>${priceRange[1] / 100}</span>
                </div>
              </div>
            </div>

            {/* Minimum Rating */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                <label className="text-sm font-medium">Minimum Rating</label>
              </div>
              <Select
                value={filters.rating?.min?.toString() || 'any'}
                onValueChange={(value) =>
                  onFiltersChange({
                    ...filters,
                    rating:
                      value === 'any' ? undefined : { min: parseFloat(value) },
                  })
                }
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any rating</SelectItem>
                  <SelectItem value="4">4+ stars</SelectItem>
                  <SelectItem value="3">3+ stars</SelectItem>
                  <SelectItem value="2">2+ stars</SelectItem>
                  <SelectItem value="1">1+ stars</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Jurisdiction */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <label className="text-sm font-medium">Jurisdiction</label>
              </div>
              <Select
                value={filters.jurisdiction || 'any'}
                onValueChange={(value) =>
                  onFiltersChange({
                    ...filters,
                    jurisdiction: value === 'any' ? undefined : value,
                  })
                }
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any jurisdiction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any jurisdiction</SelectItem>
                  {jurisdictions.map((jurisdiction) => (
                    <SelectItem key={jurisdiction} value={jurisdiction}>
                      {jurisdiction}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Language */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Language</label>
              <Select
                value={filters.language || 'any'}
                onValueChange={(value) =>
                  onFiltersChange({
                    ...filters,
                    language: value === 'any' ? undefined : value,
                  })
                }
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any language</SelectItem>
                  {languages.map((language) => (
                    <SelectItem key={language} value={language}>
                      {language.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quality Filters */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Quality</label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="verified"
                    checked={filters.verified || false}
                    onCheckedChange={(checked) =>
                      onFiltersChange({
                        ...filters,
                        verified: checked ? true : undefined,
                      })
                    }
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="verified"
                    className="text-sm flex items-center gap-1"
                  >
                    <Shield className="h-3 w-3" />
                    Verified creators only
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={filters.featured || false}
                    onCheckedChange={(checked) =>
                      onFiltersChange({
                        ...filters,
                        featured: checked ? true : undefined,
                      })
                    }
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="featured"
                    className="text-sm flex items-center gap-1"
                  >
                    <Crown className="h-3 w-3" />
                    Featured templates only
                  </label>
                </div>
              </div>
            </div>

            {/* Popular Tags */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Popular Tags</label>
              <div className="flex flex-wrap gap-2">
                {tags.slice(0, 12).map((tag) => (
                  <Badge
                    key={tag}
                    variant={
                      filters.tags?.includes(tag) ? 'default' : 'outline'
                    }
                    className="cursor-pointer"
                    onClick={() => handleTagToggle(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
