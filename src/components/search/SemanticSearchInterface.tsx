// src/components/search/SemanticSearchInterface.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Download, Save, Clock, FileText, Tag, MapPin, Scale, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useDebounce } from '@/hooks/use-debounce';

interface SearchResult {
  id: string;
  score: number;
  metadata: {
    title: string;
    category: string;
    complexity: string;
    jurisdiction?: string;
    governingLaw?: string;
    createdAt: string;
    lastModified: string;
    tags: string[];
    parties?: string[];
    amounts?: string[];
    dates?: string[];
    content?: string;
  };
  explanation?: string;
}

interface SearchFilters {
  category: string[];
  complexity: string[];
  jurisdiction: string[];
  governingLaw: string[];
  tags: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  minScore: number;
}

interface SearchFacets {
  categories: { [key: string]: number };
  complexities: { [key: string]: number };
  jurisdictions: { [key: string]: number };
  governingLaws: { [key: string]: number };
  tags: { [key: string]: number };
}

interface SavedView {
  id: string;
  name: string;
  query: string;
  filters: SearchFilters;
}

const SemanticSearchInterface: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [facets, setFacets] = useState<SearchFacets>({
    categories: {},
    complexities: {},
    jurisdictions: {},
    governingLaws: {},
    tags: {},
  });
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({
    category: [],
    complexity: [],
    jurisdiction: [],
    governingLaw: [],
    tags: [],
    minScore: 0.7,
  });
  const [savedViews, setSavedViews] = useState<SavedView[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  const debouncedQuery = useDebounce(query, 300);

  // Perform search when query or filters change
  useEffect(() => {
    if (debouncedQuery.trim()) {
      performSearch();
    } else {
      setResults([]);
      setTotalResults(0);
      setFacets({
        categories: {},
        complexities: {},
        jurisdictions: {},
        governingLaws: {},
        tags: {},
      });
    }
  }, [debouncedQuery, filters]);

  const performSearch = useCallback(async () => {
    if (!debouncedQuery.trim()) return;

    setLoading(true);
    try {
      const searchParams = new URLSearchParams({
        q: debouncedQuery,
        minScore: filters.minScore.toString(),
        includeFacets: 'true',
      });

      // Add filter parameters
      filters.category.forEach(cat => searchParams.append('category', cat));
      filters.complexity.forEach(comp => searchParams.append('complexity', comp));
      filters.jurisdiction.forEach(jur => searchParams.append('jurisdiction', jur));
      filters.governingLaw.forEach(law => searchParams.append('governingLaw', law));
      filters.tags.forEach(tag => searchParams.append('tags', tag));

      if (filters.dateRange) {
        searchParams.append('dateStart', filters.dateRange.start);
        searchParams.append('dateEnd', filters.dateRange.end);
      }

      const response = await fetch(`/api/search/semantic?${searchParams}`);
      const data = await response.json();

      if (response.ok) {
        setResults(data.results || []);
        setTotalResults(data.totalResults || 0);
        setFacets(data.facets || {});
        setSuggestions(data.suggestions || []);
      } else {
        console.error('Search error:', data.error);
      }
    } catch (error) {
      console.error('Search request failed:', error);
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, filters]);

  const handleFilterChange = (filterType: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const toggleFilterValue = (filterType: keyof SearchFilters, value: string) => {
    setFilters(prev => {
      const currentValues = prev[filterType] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      
      return {
        ...prev,
        [filterType]: newValues,
      };
    });
  };

  const clearFilters = () => {
    setFilters({
      category: [],
      complexity: [],
      jurisdiction: [],
      governingLaw: [],
      tags: [],
      minScore: 0.7,
    });
  };

  const saveCurrentView = async () => {
    const name = prompt('Enter a name for this search view:');
    if (!name) return;

    try {
      const response = await fetch('/api/search/semantic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_view',
          name,
          query: debouncedQuery,
          filters,
          userId: 'current-user', // Replace with actual user ID
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSavedViews(prev => [...prev, data.savedView]);
      }
    } catch (error) {
      console.error('Failed to save view:', error);
    }
  };

  const loadSavedView = (view: SavedView) => {
    setQuery(view.query);
    setFilters(view.filters);
  };

  const exportResults = async (format: 'csv' | 'json' = 'csv') => {
    if (!debouncedQuery.trim()) return;

    setExportLoading(true);
    try {
      const response = await fetch('/api/exports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          userId: 'current-user', // Replace with actual user ID
          query: debouncedQuery,
          filters,
          options: {
            format,
            includeContent: true,
            includeMetadata: true,
            maxResults: Math.min(totalResults, 10000),
          },
        }),
      });

      const data = await response.json();
      if (data.success) {
        // Poll for completion
        pollExportStatus(data.job.id);
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExportLoading(false);
    }
  };

  const pollExportStatus = async (jobId: string) => {
    const poll = async () => {
      try {
        const response = await fetch(`/api/exports?jobId=${jobId}&action=status`);
        const data = await response.json();
        
        if (data.job.status === 'completed' && data.job.downloadUrl) {
          // Trigger download
          window.open(data.job.downloadUrl, '_blank');
        } else if (data.job.status === 'failed') {
          console.error('Export failed:', data.job.errorMessage);
        } else {
          // Continue polling
          setTimeout(poll, 2000);
        }
      } catch (error) {
        console.error('Export status check failed:', error);
      }
    };
    
    poll();
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Search Header */}
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search legal documents semantically (e.g., 'NDAs with California governing law')"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {Object.values(filters).some(f => Array.isArray(f) ? f.length > 0 : f !== 0.7) && (
              <Badge variant="secondary" className="ml-1">
                Active
              </Badge>
            )}
          </Button>
          <Button
            onClick={() => exportResults('csv')}
            disabled={!results.length || exportLoading}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            onClick={saveCurrentView}
            disabled={!debouncedQuery.trim()}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save View
          </Button>
        </div>

        {/* Active Filters */}
        {Object.entries(filters).some(([key, value]) => 
          Array.isArray(value) ? value.length > 0 : (key === 'minScore' && value !== 0.7)
        ) && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-gray-600">Active filters:</span>
            {filters.category.map(cat => (
              <Badge key={cat} variant="secondary" className="cursor-pointer" 
                onClick={() => toggleFilterValue('category', cat)}>
                Category: {cat} ×
              </Badge>
            ))}
            {filters.complexity.map(comp => (
              <Badge key={comp} variant="secondary" className="cursor-pointer"
                onClick={() => toggleFilterValue('complexity', comp)}>
                Complexity: {comp} ×
              </Badge>
            ))}
            {filters.jurisdiction.map(jur => (
              <Badge key={jur} variant="secondary" className="cursor-pointer"
                onClick={() => toggleFilterValue('jurisdiction', jur)}>
                Jurisdiction: {jur} ×
              </Badge>
            ))}
            {filters.minScore !== 0.7 && (
              <Badge variant="secondary">
                Min Score: {filters.minScore}
              </Badge>
            )}
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear All
            </Button>
          </div>
        )}

        {/* Search Suggestions */}
        {suggestions.length > 0 && (
          <div className="space-y-2">
            <span className="text-sm text-gray-600">Suggestions:</span>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuery(suggestion)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        {showFilters && (
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Search Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Relevance Score */}
                <div className="space-y-2">
                  <Label>Minimum Relevance Score: {filters.minScore}</Label>
                  <Slider
                    value={[filters.minScore]}
                    onValueChange={([value]) => handleFilterChange('minScore', value)}
                    min={0.1}
                    max={1.0}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                {/* Category Facets */}
                {Object.keys(facets.categories).length > 0 && (
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Categories
                    </Label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {Object.entries(facets.categories)
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 10)
                        .map(([category, count]) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox
                            id={`cat-${category}`}
                            checked={filters.category.includes(category)}
                            onCheckedChange={() => toggleFilterValue('category', category)}
                          />
                          <Label htmlFor={`cat-${category}`} className="text-sm flex-1 cursor-pointer">
                            {category} ({count})
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Complexity Facets */}
                {Object.keys(facets.complexities).length > 0 && (
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Scale className="h-4 w-4" />
                      Complexity
                    </Label>
                    <div className="space-y-2">
                      {Object.entries(facets.complexities).map(([complexity, count]) => (
                        <div key={complexity} className="flex items-center space-x-2">
                          <Checkbox
                            id={`comp-${complexity}`}
                            checked={filters.complexity.includes(complexity)}
                            onCheckedChange={() => toggleFilterValue('complexity', complexity)}
                          />
                          <Label htmlFor={`comp-${complexity}`} className="text-sm flex-1 cursor-pointer">
                            {complexity} ({count})
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Jurisdiction Facets */}
                {Object.keys(facets.jurisdictions).length > 0 && (
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Jurisdictions
                    </Label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {Object.entries(facets.jurisdictions)
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 10)
                        .map(([jurisdiction, count]) => (
                        <div key={jurisdiction} className="flex items-center space-x-2">
                          <Checkbox
                            id={`jur-${jurisdiction}`}
                            checked={filters.jurisdiction.includes(jurisdiction)}
                            onCheckedChange={() => toggleFilterValue('jurisdiction', jurisdiction)}
                          />
                          <Label htmlFor={`jur-${jurisdiction}`} className="text-sm flex-1 cursor-pointer">
                            {jurisdiction} ({count})
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Results */}
        <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
          <Tabs defaultValue="results" className="space-y-4">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="results">
                  Search Results ({totalResults})
                </TabsTrigger>
                <TabsTrigger value="saved-views">
                  Saved Views ({savedViews.length})
                </TabsTrigger>
              </TabsList>
              
              {loading && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4 animate-spin" />
                  Searching...
                </div>
              )}
            </div>

            <TabsContent value="results" className="space-y-4">
              {results.length === 0 && !loading && debouncedQuery && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                    <p className="text-gray-600">
                      Try adjusting your search query or filters to find what you're looking for.
                    </p>
                  </CardContent>
                </Card>
              )}

              {results.map((result, index) => (
                <Card key={result.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-xs">
                          {(result.score * 100).toFixed(1)}% match
                        </Badge>
                        <Badge variant="secondary">
                          {result.metadata.category}
                        </Badge>
                        <Badge 
                          variant={result.metadata.complexity === 'easy' ? 'default' : 
                                  result.metadata.complexity === 'medium' ? 'secondary' : 'destructive'}
                        >
                          {result.metadata.complexity}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm">
                        View Document
                      </Button>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {result.metadata.title}
                    </h3>

                    {result.explanation && (
                      <p className="text-sm text-blue-600 mb-3">
                        <strong>Why this matches:</strong> {result.explanation}
                      </p>
                    )}

                    {result.metadata.content && (
                      <p className="text-gray-700 mb-3 line-clamp-3">
                        {result.metadata.content}
                      </p>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      {result.metadata.jurisdiction && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {result.metadata.jurisdiction}
                        </div>
                      )}
                      {result.metadata.parties && result.metadata.parties.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {result.metadata.parties.length} parties
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(result.metadata.createdAt).toLocaleDateString()}
                      </div>
                      {result.metadata.tags.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          {result.metadata.tags.slice(0, 2).join(', ')}
                          {result.metadata.tags.length > 2 && '...'}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="saved-views" className="space-y-4">
              {savedViews.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Save className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No saved views</h3>
                    <p className="text-gray-600">
                      Save your search queries and filters for quick access later.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                savedViews.map((view) => (
                  <Card key={view.id} className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => loadSavedView(view)}>
                    <CardContent className="p-4">
                      <h4 className="font-medium text-gray-900 mb-2">{view.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">"{view.query}"</p>
                      <div className="flex flex-wrap gap-1">
                        {view.filters.category.map(cat => (
                          <Badge key={cat} variant="outline" className="text-xs">
                            {cat}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SemanticSearchInterface;