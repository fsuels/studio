'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Search, Sparkles, Shield, Clock, ArrowRight } from 'lucide-react';
import { DOCUMENT_REGISTRY, getAllCategories, type DocumentInfo } from '@/lib/document-registry';
import { VirtualizedDocumentList } from '@/components/optimized/VirtualizedList';
import { MemoizedDocumentCard } from '@/components/optimized/MemoizedComponents';

export default function DocumentsListingPageClientWrapper() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [configFilter, setConfigFilter] = useState<string>('all');

  // Memoized expensive calculations
  const categories = useMemo(() => getAllCategories(), []);

  const jsonDocs = useMemo(() =>
    DOCUMENT_REGISTRY.filter(doc => doc.configType === 'json'), []
  );

  const tsDocs = useMemo(() =>
    DOCUMENT_REGISTRY.filter(doc => doc.configType === 'typescript'), []
  );

  // Memoized filter function for better performance
  const filteredDocuments = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    return DOCUMENT_REGISTRY.filter(doc => {
      const matchesSearch = searchTerm === '' ||
        doc.title.toLowerCase().includes(searchLower) ||
        doc.description.toLowerCase().includes(searchLower);
      const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
      const matchesConfigType = configFilter === 'all' || doc.configType === configFilter;

      return matchesSearch && matchesCategory && matchesConfigType;
    });
  }, [searchTerm, selectedCategory, configFilter]);

  // Memoized icon renderer to prevent unnecessary re-renders
  const getDocumentIcon = useCallback((doc: DocumentInfo) => {
    if (doc.configType === 'json') {
      return <Sparkles className="h-5 w-5 text-blue-600" />;
    }
    return <FileText className="h-5 w-5 text-gray-600" />;
  }, []);

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Legal Document Templates</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Generate professionally drafted legal documents with state-specific compliance in minutes
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mt-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{DOCUMENT_REGISTRY.length}</div>
              <div className="text-sm text-muted-foreground">Total Documents</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{jsonDocs.length}</div>
              <div className="text-sm text-muted-foreground">JSON-Driven</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{tsDocs.length}</div>
              <div className="text-sm text-muted-foreground">TypeScript-Based</div>
            </div>
          </div>
        </div>

        {/* New JSON Documents Showcase */}
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-blue-600" />
              <div>
                <CardTitle className="text-blue-900">🎉 New: JSON-Driven Documents</CardTitle>
                <p className="text-blue-700 text-sm mt-1">
                  Experience our next-generation document creation system
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jsonDocs.map(doc => (
                <div key={doc.id} className="bg-white rounded-lg p-4 border">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getDocumentIcon(doc)}
                      <h3 className="font-semibold">{doc.title}</h3>
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      NEW
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{doc.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {doc.requiresNotary && (
                        <Badge variant="outline" className="text-xs">
                          <Shield className="h-3 w-3 mr-1" />
                          Notary
                        </Badge>
                      )}
                      {doc.officialForm && (
                        <Badge variant="outline" className="text-xs">
                          Official Form
                        </Badge>
                      )}
                    </div>
                    <Link href={doc.route}>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Create <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search documents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={configFilter} onValueChange={setConfigFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="json">JSON-Driven</SelectItem>
                  <SelectItem value="typescript">TypeScript-Based</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* All Documents Grid - Virtualized for Performance */}
        {filteredDocuments.length > 20 ? (
          <VirtualizedDocumentList
            documents={filteredDocuments.map(doc => ({
              id: doc.id,
              title: doc.title,
              description: doc.description,
              type: doc.configType === 'json' ? 'JSON' : 'TypeScript',
              updatedAt: new Date().toISOString(),
              status: doc.isNew ? 'published' : 'completed',
              ...doc
            }))}
            onDocumentClick={(doc) => {
              window.location.href = doc.route;
            }}
            className="rounded-lg border"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map(doc => (
              <Card key={doc.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getDocumentIcon(doc)}
                      <CardTitle className="text-lg">{doc.title}</CardTitle>
                    </div>
                    <div className="flex flex-col gap-1">
                      {doc.isNew && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                          NEW
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {doc.configType === 'json' ? 'JSON' : 'TypeScript'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{doc.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <FileText className="h-3 w-3" />
                      <span>{doc.category}</span>
                    </div>
                    {doc.jurisdiction && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Shield className="h-3 w-3" />
                        <span>{doc.jurisdiction}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {doc.requiresNotary && (
                        <Badge variant="outline" className="text-xs">
                          <Shield className="h-3 w-3 mr-1" />
                          Notary
                        </Badge>
                      )}
                      {doc.officialForm && (
                        <Badge variant="outline" className="text-xs">
                          Official
                        </Badge>
                      )}
                    </div>
                    <Link href={doc.route}>
                      <Button size="sm">
                        Create <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredDocuments.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No documents found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or filters
              </p>
            </CardContent>
          </Card>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <Card className="border-green-200 bg-green-50/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-green-900">JSON-Driven System</h3>
              </div>
              <p className="text-sm text-green-700">
                Our new JSON-driven documents use advanced configuration systems for better scalability, 
                easier maintenance, and faster deployment of new legal forms.
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold text-purple-900">Legacy Support</h3>
              </div>
              <p className="text-sm text-purple-700">
                TypeScript-based documents continue to work seamlessly while we gradually migrate 
                to the new JSON system. No disruption to existing workflows.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}