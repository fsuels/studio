// src/components/DocumentTypeSelector.tsx
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTranslation } from 'react-i18next';
import { usStates } from '@/lib/usStates';
import {
  getWorkflowCategories,
  getWorkflowDocuments,
  searchWorkflowDocuments,
  type DocumentSummary,
} from '@/lib/workflow/document-workflow';

interface Props {
  onSelect: (_documentId: string) => void; // Now accepts the document ID
  selectedDocument?: string; // Optional prop for pre-selecting a document
}

export default function DocumentTypeSelector({
  onSelect,
  selectedDocument,
}: Props) {
  const { t, i18n } = useTranslation('common');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<string | undefined>(
    undefined,
  );

  const language = useMemo(() => (i18n.language === 'es' ? 'es' : 'en'), [i18n.language]) as 'en' | 'es';

  const filteredDocuments: DocumentSummary[] = useMemo(() => {
    const baseOptions = {
      jurisdiction: 'us',
      state: selectedState || undefined,
      language,
    } as const;

    if (!searchQuery.trim()) {
      return getWorkflowDocuments(baseOptions);
    }

    return searchWorkflowDocuments(searchQuery, baseOptions);
  }, [language, searchQuery, selectedState]);

  const categories = useMemo(() => {
    const availableCategories = getWorkflowCategories({
      jurisdiction: 'us',
      state: selectedState || undefined,
    });

    const categoriesInResults = Array.from(
      new Set(filteredDocuments.map((doc) => doc.category)),
    );

    // Preserve manifest ordering but ensure categories present in filtered results.
    return availableCategories.filter((category) =>
      categoriesInResults.includes(category),
    );
  }, [filteredDocuments, selectedState]);

  const docsByCategory = useMemo(() => {
    const map = new Map<string, DocumentSummary[]>();
    filteredDocuments.forEach((doc) => {
      const existing = map.get(doc.category) ?? [];
      existing.push(doc);
      map.set(doc.category, existing);
    });
    return map;
  }, [filteredDocuments]);

  const [activeCategory, setActiveCategory] = useState<string>('');

  useEffect(() => {
    if (categories.length === 0) {
      setActiveCategory('');
      return;
    }

    if (!categories.includes(activeCategory)) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  const documentsForActiveCategory = useMemo(() => {
    if (!activeCategory) return [];
    return docsByCategory.get(activeCategory) ?? [];
  }, [docsByCategory, activeCategory]);

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>{t('docTypeSelector.title')}</CardTitle>
        <CardDescription>{t('docTypeSelector.subtitle')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <Input
            type="search"
            placeholder={t('docTypeSelector.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <Select
            value={selectedState ?? ''}
            onValueChange={(value) => setSelectedState(value || undefined)}
          >
            <SelectTrigger
              aria-label={t('docTypeSelector.selectState', 'Select State')}
            >
              <SelectValue placeholder={t('docTypeSelector.selectState')} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{t('docTypeSelector.statesLabel')}</SelectLabel>
                <SelectItem value="">{t('docTypeSelector.allStates', 'All States')}</SelectItem>
                {usStates.map((state) => (
                  <SelectItem key={state.value} value={state.value}>
                    {state.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        {categories.length === 0 ? (
          <div className="mt-4 text-sm text-gray-600">
            {selectedState
              ? t('docTypeSelector.noResultsState', 'No templates match this state.')
              : t('docTypeSelector.noResults', 'No templates match your search.')}
          </div>
        ) : (
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mt-4">
            <TabsList>
              {categories.map((category) => (
                <TabsTrigger key={category} value={category}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            {categories.map((category) => {
              const docs = docsByCategory.get(category) ?? [];
              return (
                <TabsContent key={category} value={category}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {docs.map((doc) => (
                      <Card
                        key={doc.id}
                        tabIndex={0}
                        role="button"
                        aria-label={doc.title}
                      className={`cursor-pointer hover:shadow-lg transition-all duration-200 ${selectedDocument === doc.id ? 'border-2 border-primary' : ''}`}
                      onClick={() => onSelect(doc.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onSelect(doc.id);
                        }
                      }}
                    >
                      <CardHeader>
                        <CardTitle>{doc.title}</CardTitle>
                        <CardDescription>{doc.description}</CardDescription>
                      </CardHeader>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
