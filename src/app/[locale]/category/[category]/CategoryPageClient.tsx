// src/app/[locale]/category/[category]/CategoryPageClient.tsx
'use client';

import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileText,
  ChevronRight,
  Search,
  Grid3X3,
  List,
  ArrowLeft,
  Briefcase,
  Home,
  Users,
  Shield,
  DollarSign,
  Building,
  Heart,
  Gavel,
  Wrench,
  Laptop,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { documentLibrary, type LegalDocument } from '@/lib/document-library';
import { taxonomy } from '@/config/taxonomy';
// Category metadata with icons and colors
const categoryMeta: Record<string, { icon: any; color: string; bgColor: string }> = {
  'business-startups': { 
    icon: Briefcase, 
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  'estate-planning': { 
    icon: Users, 
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  'real-estate-property': { 
    icon: Home, 
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50'
  },
  'legal-process-disputes': { 
    icon: Gavel, 
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  },
  'finance-lending': { 
    icon: DollarSign, 
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  'employment-hr': { 
    icon: Building, 
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  },
  'personal-family': { 
    icon: Heart, 
    color: 'text-pink-600',
    bgColor: 'bg-pink-50'
  },
  'ip-creative-works': { 
    icon: Shield, 
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50'
  },
  'construction-trades': { 
    icon: Wrench, 
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50'
  },
  'technology-digital': { 
    icon: Laptop, 
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50'
  },
};

interface CategoryPageClientProps {
  locale: 'en' | 'es';
  category: string;
}

export default function CategoryPageClient({ locale, category }: CategoryPageClientProps) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const categoryData = taxonomy.categories[category as keyof typeof taxonomy.categories];
  const meta = categoryMeta[category] || {
    icon: FileText,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50'
  };
  
  // Get all documents for this category
  const categoryDocuments = useMemo(() => {
    return documentLibrary.filter(doc => doc.category === category);
  }, [category]);
  
  // Filter documents based on search
  const filteredDocuments = useMemo(() => {
    if (!searchQuery.trim()) return categoryDocuments;
    
    const query = searchQuery.toLowerCase();
    return categoryDocuments.filter(doc => {
      const name = (doc.translations?.[locale]?.name || doc.name || doc.id).toLowerCase();
      const description = (doc.translations?.[locale]?.description || doc.description || '').toLowerCase();
      const aliases = doc.translations?.[locale]?.aliases || [];
      
      return name.includes(query) || 
             description.includes(query) ||
             aliases.some(alias => alias.toLowerCase().includes(query));
    });
  }, [categoryDocuments, searchQuery, locale]);
  
  // Group documents by subcategory
  const documentsBySubcategory = useMemo(() => {
    const grouped: Record<string, LegalDocument[]> = {};
    
    if (categoryData?.subs) {
      Object.entries(categoryData.subs).forEach(([subKey, subData]) => {
        const subDocs = filteredDocuments.filter(doc => 
          subData.docs?.includes(doc.id)
        );
        if (subDocs.length > 0) {
          grouped[subKey] = subDocs;
        }
      });
      
      // Add documents not in any subcategory
      const uncategorized = filteredDocuments.filter(doc => 
        !Object.values(categoryData.subs).some(sub => 
          sub.docs?.includes(doc.id)
        )
      );
      if (uncategorized.length > 0) {
        grouped['other'] = uncategorized;
      }
    } else {
      grouped['all'] = filteredDocuments;
    }
    
    return grouped;
  }, [filteredDocuments, categoryData]);
  
  const CategoryIcon = meta.icon;
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className={cn("py-12", meta.bgColor)}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
              <Link href={`/${locale}`} className="hover:text-primary">
                {t('nav.home', { defaultValue: 'Home' })}
              </Link>
              <ChevronRight className="h-4 w-4" />
              <Link href={`/${locale}/documents`} className="hover:text-primary">
                {t('nav.documents', { defaultValue: 'Documents' })}
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-gray-900 font-medium">
                {categoryData?.displayName || categoryData?.name || category}
              </span>
            </div>
            
            {/* Category Header */}
            <div className="flex items-start gap-4">
              <div className={cn(
                "p-3 rounded-lg bg-white shadow-sm",
                meta.color
              )}>
                <CategoryIcon className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {categoryData?.displayName || categoryData?.name || category}
                </h1>
                <p className="text-lg text-gray-600">
                  {t('category.documentCount', {
                    defaultValue: `${categoryDocuments.length} legal documents available`,
                    count: categoryDocuments.length
                  })}
                </p>
              </div>
            </div>
            
            {/* Search and View Options */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder={t('category.searchPlaceholder', {
                    defaultValue: `Search ${categoryData?.name || category} documents...`
                  })}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Documents Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {Object.entries(documentsBySubcategory).map(([subKey, docs]) => {
            const subData = categoryData?.subs?.[subKey];
            
            return (
              <div key={subKey} className="mb-12">
                {subData && (
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    {subData.displayName || subData.name}
                    <Badge variant="secondary">{docs.length}</Badge>
                  </h2>
                )}
                
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {docs.map((doc) => {
                      const docName = doc.translations?.[locale]?.name || doc.name || doc.id;
                      const docDescription = doc.translations?.[locale]?.description || doc.description || '';
                      
                      return (
                        <Card
                          key={doc.id}
                          className="hover:shadow-lg transition-shadow cursor-pointer"
                          onClick={() => router.push(`/${locale}/docs/${doc.id}`)}
                        >
                          <CardHeader>
                            <CardTitle className="text-lg flex items-start justify-between">
                              <span>{docName}</span>
                              <FileText className="h-5 w-5 text-gray-400 flex-shrink-0 ml-2" />
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                              {docDescription}
                            </p>
                            <Button variant="outline" size="sm" className="w-full">
                              {t('category.customize', { defaultValue: 'Customize' })}
                              <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {docs.map((doc) => {
                      const docName = doc.translations?.[locale]?.name || doc.name || doc.id;
                      const docDescription = doc.translations?.[locale]?.description || doc.description || '';
                      
                      return (
                        <Card
                          key={doc.id}
                          className="hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => router.push(`/${locale}/docs/${doc.id}`)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h3 className="font-medium text-gray-900 mb-1">
                                  {docName}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {docDescription}
                                </p>
                              </div>
                              <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0 ml-4" />
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
          
          {filteredDocuments.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">
                {t('category.noResults', { defaultValue: 'No documents found matching your search.' })}
              </p>
              <Button variant="outline" onClick={() => setSearchQuery('')}>
                {t('category.clearSearch', { defaultValue: 'Clear Search' })}
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Back Button */}
      <div className="container mx-auto px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          <Button
            variant="outline"
            onClick={() => router.push(`/${locale}/documents`)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('category.backToDocuments', { defaultValue: 'Back to All Documents' })}
          </Button>
        </div>
      </div>
    </div>
  );
}