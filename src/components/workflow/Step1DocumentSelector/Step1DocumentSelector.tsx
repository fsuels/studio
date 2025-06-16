// src/components/workflow/Step1DocumentSelector/Step1DocumentSelector.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { documentLibrary, type LegalDocument } from '@/lib/document-library';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowLeft, FileText } from 'lucide-react';
import { track } from '@/lib/analytics';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Import extracted components
import SearchResultsView from './SearchResultsView';
import TopDocumentsView from './TopDocumentsView';
import AllCategoriesView from './AllCategoriesView';
import DocumentsInCategoryView from './DocumentsInCategoryView';

// Import types and constants
import {
  Step1DocumentSelectorProps,
  ViewType,
  SimpleT,
} from './types';
import {
  CATEGORY_LIST,
  getDocName,
  getDocDescription,
  getDocAliases,
  languageSupportsSpanish,
} from './constants';

const Step1DocumentSelector = React.memo(function Step1DocumentSelector({
  selectedCategory: initialSelectedCategory,
  onCategorySelect,
  onDocumentSelect,
  isReadOnly = false,
  globalSearchTerm,
  globalSelectedState,
}: Step1DocumentSelectorProps) {
  const { t, i18n } = useTranslation('common');
  const tSimple = React.useCallback(
    (key: string, fallback?: string | Record<string, unknown>): string =>
      typeof fallback === 'string'
        ? (t(key, { defaultValue: fallback }) as string)
        : (t(key, fallback as Record<string, unknown>) as string),
    [t],
  );

  const [currentView, setCurrentView] = useState<ViewType>(
    initialSelectedCategory ? 'documents-in-category' : 'top-docs'
  );
  const [selectedCategoryInternal, setSelectedCategoryInternal] = useState<
    string | null
  >(initialSelectedCategory);
  const [docSearch, setDocSearch] = useState<string>('');
  const [isHydrated, setIsHydrated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Effect to switch view if globalSearchTerm is used
  useEffect(() => {
    if (globalSearchTerm.trim() !== '') {
      setCurrentView('search-results');
      setSelectedCategoryInternal(null);
    } else if (
      currentView === 'search-results' &&
      globalSearchTerm.trim() === ''
    ) {
      setCurrentView(
        selectedCategoryInternal ? 'documents-in-category' : 'top-docs',
      );
    }
  }, [globalSearchTerm, currentView, selectedCategoryInternal]);

  // Effect to update internal selected category when prop changes
  useEffect(() => {
    if (
      initialSelectedCategory &&
      initialSelectedCategory !== selectedCategoryInternal
    ) {
      setSelectedCategoryInternal(initialSelectedCategory);
      setCurrentView('documents-in-category');
    } else if (
      !initialSelectedCategory &&
      selectedCategoryInternal &&
      currentView !== 'search-results' &&
      !globalSearchTerm.trim()
    ) {
      setSelectedCategoryInternal(null);
      setCurrentView('top-docs');
    }
  }, [
    initialSelectedCategory,
    selectedCategoryInternal,
    currentView,
    globalSearchTerm,
  ]);

  const sortedCategories = useMemo(() => {
    const uniqueCategoriesMap = new Map();
    CATEGORY_LIST.forEach((catInfo) => {
      if (!uniqueCategoriesMap.has(catInfo.key)) {
        uniqueCategoriesMap.set(catInfo.key, catInfo);
      }
    });
    const uniqueCategories = Array.from(uniqueCategoriesMap.values());

    if (!isHydrated) return uniqueCategories;
    return [...uniqueCategories].sort((a, b) =>
      t(a.labelKey, a.key).localeCompare(t(b.labelKey, b.key), i18n.language),
    );
  }, [isHydrated, i18n.language, t]);

  const documentsToDisplay = useMemo(() => {
    let docs = [...documentLibrary];
    if (!isHydrated) return [];

    if (currentView === 'search-results' && globalSearchTerm.trim() !== '') {
      const lowerGlobalSearch = globalSearchTerm.toLowerCase();
      docs = docs.filter(
        (doc) =>
          t(getDocName(doc, 'en'), { defaultValue: getDocName(doc, 'en') })
            .toLowerCase()
            .includes(lowerGlobalSearch) ||
          getDocAliases(doc, 'en').some((alias) =>
            alias.toLowerCase().includes(lowerGlobalSearch),
          ) ||
          (languageSupportsSpanish(doc.languageSupport) &&
            getDocAliases(doc, 'es').some((alias) =>
              alias.toLowerCase().includes(lowerGlobalSearch),
            )) ||
          (languageSupportsSpanish(doc.languageSupport) &&
            t(getDocName(doc, 'es'), { defaultValue: getDocName(doc, 'es') })
              .toLowerCase()
              .includes(lowerGlobalSearch)) ||
          t(getDocDescription(doc, 'en'), {
            defaultValue: getDocDescription(doc, 'en'),
          })
            .toLowerCase()
            .includes(lowerGlobalSearch) ||
          (languageSupportsSpanish(doc.languageSupport) &&
            t(getDocDescription(doc, 'es'), {
              defaultValue: getDocDescription(doc, 'es'),
            })
              .toLowerCase()
              .includes(lowerGlobalSearch)),
      );
    } else if (
      currentView === 'documents-in-category' &&
      selectedCategoryInternal
    ) {
      docs = docs.filter((doc) => doc.category === selectedCategoryInternal);
      if (docSearch.trim() !== '') {
        const lowerDocSearch = docSearch.toLowerCase();
        docs = docs.filter(
          (doc) =>
            t(getDocName(doc, 'en'), { defaultValue: getDocName(doc, 'en') })
              .toLowerCase()
              .includes(lowerDocSearch) ||
            getDocAliases(doc, 'en').some((alias) =>
              alias.toLowerCase().includes(lowerDocSearch),
            ) ||
            (languageSupportsSpanish(doc.languageSupport) &&
              getDocAliases(doc, 'es').some((alias) =>
                alias.toLowerCase().includes(lowerDocSearch),
              )) ||
            (languageSupportsSpanish(doc.languageSupport) &&
              t(getDocName(doc, 'es'), { defaultValue: getDocName(doc, 'es') })
                .toLowerCase()
                .includes(lowerDocSearch)) ||
            t(getDocDescription(doc, 'en'), {
              defaultValue: getDocDescription(doc, 'en'),
            })
              .toLowerCase()
              .includes(lowerDocSearch) ||
            (languageSupportsSpanish(doc.languageSupport) &&
              t(getDocDescription(doc, 'es'), {
                defaultValue: getDocDescription(doc, 'es'),
              })
                .toLowerCase()
                .includes(lowerDocSearch)),
        );
      }
    } else {
      return [];
    }

    if (globalSelectedState && globalSelectedState !== 'all') {
      docs = docs.filter(
        (doc) =>
          doc.states === 'all' ||
          (Array.isArray(doc.states) &&
            doc.states.includes(globalSelectedState)),
      );
    }

    return docs.filter((doc) => doc.id !== 'general-inquiry');
  }, [
    selectedCategoryInternal,
    docSearch,
    globalSearchTerm,
    globalSelectedState,
    currentView,
    t,
    isHydrated,
  ]);

  const handleCategoryClick = (key: string) => {
    if (isReadOnly || !isHydrated) return;
    setSelectedCategoryInternal(key);
    setCurrentView('documents-in-category');
    onCategorySelect(key);
    setDocSearch('');
    track('select_item_category', { item_category: key });
  };

  const handleBackToAllCategories = () => {
    if (isReadOnly || !isHydrated) return;
    setSelectedCategoryInternal(null);
    setCurrentView('all-categories');
    onCategorySelect(null);
    setDocSearch('');
  };

  const handleBackToTopDocs = () => {
    if (isReadOnly || !isHydrated) return;
    setSelectedCategoryInternal(null);
    setCurrentView('top-docs');
    onCategorySelect(null);
    setDocSearch('');
  };

  const handleDocSelect = (
    doc:
      | LegalDocument
      | Pick<LegalDocument, 'id' | 'category' | 'translations'>,
  ) => {
    if (!isHydrated) return;
    const fullDoc = documentLibrary.find((d) => d.id === doc.id);
    if (!fullDoc) {
      toast({
        title: 'Error',
        description: 'Document details not found.',
        variant: 'destructive',
      });
      return;
    }
    if (isReadOnly || !globalSelectedState) {
      toast({
        title: t('State Required'),
        description: t(
          'Please select a state from the filter bar above before choosing a document.',
        ),
        variant: 'destructive',
      });
      return;
    }
    onDocumentSelect(fullDoc);
    track('select_item', {
      item_id: fullDoc.id,
      item_name: getDocName(fullDoc, i18n.language),
      item_category: fullDoc.category,
      price: fullDoc.basePrice,
      state: globalSelectedState,
    });
  };

  // Placeholder text constants
  const placeholderCategoryDesc = isHydrated
    ? t('stepOne.categoryDescription')
    : 'Loading...';
  const placeholderSelectDocDesc = isHydrated
    ? t('stepOne.selectDocDescription')
    : 'Loading...';
  const placeholderNoCategories = isHydrated
    ? t('docTypeSelector.noCategoriesFound')
    : 'Loading...';
  const placeholderBackToCategories = isHydrated
    ? t('docTypeSelector.backToCategories')
    : 'Back...';
  const placeholderSearchDocuments = isHydrated
    ? t(
        'docTypeSelector.searchInCategoryPlaceholder',
        'Search in this category...',
      )
    : 'Searching...';
  const placeholderNoResults = isHydrated
    ? t('docTypeSelector.noResults')
    : 'Loading...';
  const placeholderNoDescription = isHydrated
    ? t('docTypeSelector.noDescription')
    : 'Loading...';
  const placeholderRequiresNotarization = isHydrated
    ? t('docTypeSelector.requiresNotarization')
    : 'Requires Notarization';
  const placeholderCanBeRecorded = isHydrated
    ? t('docTypeSelector.canBeRecorded')
    : 'Can Be Recorded';

  // Loading state
  if (!isHydrated) {
    return (
      <Card className="step-card opacity-50">
        <CardHeader className="step-card__header">
          <FileText className="step-card__icon animate-pulse" />
          <div>
            <CardTitle className="step-card__title h-6 bg-muted-foreground/20 rounded w-3/4 mb-1"></CardTitle>
            <CardDescription className="step-card__subtitle h-4 bg-muted-foreground/10 rounded w-full"></CardDescription>
          </div>
        </CardHeader>
        <CardContent className="step-content space-y-6 pt-6">
          <div className="h-10 bg-muted-foreground/10 rounded w-full mb-4"></div>
          <div className="category-grid pt-2">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="category-card h-auto min-h-[100px] p-6 border-border shadow-sm bg-muted flex flex-col justify-center items-center"
              >
                <div className="h-8 w-8 mb-3 bg-muted-foreground/20 rounded-full"></div>
                <div className="h-4 bg-muted-foreground/10 rounded w-20"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Determine card title and description
  let cardTitle = '';
  let cardDescription = '';

  if (currentView === 'search-results') {
    cardTitle = t('Search Results');
    cardDescription = t(
      'Showing documents matching your search and state criteria.',
    );
  } else if (currentView === 'top-docs') {
    cardTitle = t('stepOne.topDocumentsTitle', 'Top Documents This Week');
    cardDescription = placeholderCategoryDesc;
  } else if (currentView === 'all-categories') {
    cardTitle = t('stepOne.categoryDescription');
    cardDescription = placeholderCategoryDesc;
  } else if (currentView === 'documents-in-category') {
    cardTitle = t('stepOne.selectDocDescription');
    cardDescription = placeholderSelectDocDesc;
  }

  // Render main component
  return (
    <Card
      className={cn(
        'step-card',
        isReadOnly
          ? 'opacity-50 cursor-not-allowed pointer-events-none'
          : 'opacity-100',
      )}
    >
      <CardHeader className="step-card__header">
        <FileText className="step-card__icon" />
        <div>
          <CardTitle className="step-card__title">{cardTitle}</CardTitle>
          <CardDescription className="step-card__subtitle">
            {cardDescription}
          </CardDescription>
        </div>
      </CardHeader>

      {/* Navigation for documents-in-category view */}
      {currentView === 'documents-in-category' && selectedCategoryInternal && (
        <div className="px-6 pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBackToAllCategories}
              disabled={isReadOnly || !isHydrated}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />{' '}
              {placeholderBackToCategories}
            </Button>
            <h3 className="text-lg font-semibold text-muted-foreground text-right">
              {t(
                CATEGORY_LIST.find((c) => c.key === selectedCategoryInternal)
                  ?.labelKey ||
                  selectedCategoryInternal ||
                  '',
                selectedCategoryInternal || '',
              )}
            </h3>
          </div>
        </div>
      )}

      {/* Navigation for all-categories view */}
      {currentView === 'all-categories' && (
        <div className="px-6 pb-4 border-b border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBackToTopDocs}
            disabled={isReadOnly || !isHydrated}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />{' '}
            {t('stepOne.backToTopDocumentsButton', 'Back to Top Documents')}
          </Button>
        </div>
      )}

      <CardContent className="step-content space-y-6 pt-6">
        {/* Render appropriate view based on currentView */}
        {currentView === 'search-results' && (
          <SearchResultsView
            isReadOnly={isReadOnly}
            isHydrated={isHydrated}
            t={tSimple}
            i18nLanguage={i18n.language}
            documentsToDisplay={documentsToDisplay}
            globalSelectedState={globalSelectedState}
            placeholderNoDescription={placeholderNoDescription}
            placeholderRequiresNotarization={placeholderRequiresNotarization}
            placeholderCanBeRecorded={placeholderCanBeRecorded}
            placeholderNoResults={placeholderNoResults}
            onDocumentSelect={handleDocSelect}
          />
        )}

        {currentView === 'top-docs' && (
          <TopDocumentsView
            isReadOnly={isReadOnly}
            isHydrated={isHydrated}
            t={tSimple}
            i18nLanguage={i18n.language}
            globalSelectedState={globalSelectedState}
            placeholderNoDescription={placeholderNoDescription}
            placeholderRequiresNotarization={placeholderRequiresNotarization}
            placeholderCanBeRecorded={placeholderCanBeRecorded}
            placeholderNoResults={placeholderNoResults}
            onDocumentSelect={handleDocSelect}
            onExploreAllCategories={() => setCurrentView('all-categories')}
          />
        )}

        {currentView === 'all-categories' && (
          <AllCategoriesView
            isReadOnly={isReadOnly}
            isHydrated={isHydrated}
            t={tSimple}
            i18nLanguage={i18n.language}
            globalSelectedState={globalSelectedState}
            placeholderNoDescription={placeholderNoDescription}
            placeholderRequiresNotarization={placeholderRequiresNotarization}
            placeholderCanBeRecorded={placeholderCanBeRecorded}
            placeholderNoResults={placeholderNoResults}
            onDocumentSelect={handleDocSelect}
            sortedCategories={sortedCategories}
            onCategoryClick={handleCategoryClick}
            placeholderNoCategories={placeholderNoCategories}
          />
        )}

        {currentView === 'documents-in-category' && (
          <DocumentsInCategoryView
            isReadOnly={isReadOnly}
            isHydrated={isHydrated}
            t={tSimple}
            i18nLanguage={i18n.language}
            documentsToDisplay={documentsToDisplay}
            globalSelectedState={globalSelectedState}
            placeholderNoDescription={placeholderNoDescription}
            placeholderRequiresNotarization={placeholderRequiresNotarization}
            placeholderCanBeRecorded={placeholderCanBeRecorded}
            placeholderNoResults={placeholderNoResults}
            onDocumentSelect={handleDocSelect}
            docSearch={docSearch}
            onDocSearchChange={setDocSearch}
            placeholderSearchDocuments={placeholderSearchDocuments}
          />
        )}
      </CardContent>
    </Card>
  );
});

export default Step1DocumentSelector;