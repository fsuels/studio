// src/components/workflow/Step1DocumentSelector/Step1DocumentSelector.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
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
import type { LegalDocument } from '@/types/documents';

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
  SelectableDocument,
} from './types';
import {
  CATEGORY_LIST,
  PLACEHOLDER_TOP_DOCS,
  getDocName,
  getDocDescription,
  getDocAliases,
  languageSupportsSpanish,
  buildCategoryInfo,
} from './constants';
import { loadWorkflowModule } from '@/lib/workflow/load-workflow-module';
import type { DocumentSummary } from '@/lib/workflow/document-workflow';

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
    initialSelectedCategory ? 'documents-in-category' : 'top-docs',
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

  const stateFilter =
    globalSelectedState && globalSelectedState !== 'all'
      ? globalSelectedState
      : undefined;

  const searchLanguage: 'en' | 'es' =
    i18n.language === 'es' ? 'es' : 'en';

  const [workflowModule, setWorkflowModule] = useState<typeof import('@/lib/workflow/document-workflow') | null>(null);

  useEffect(() => {
    if (workflowModule) {
      return;
    }

    let cancelled = false;
    loadWorkflowModule()
      .then((module) => {
        if (!cancelled) {
          setWorkflowModule(module);
        }
      })
      .catch((error) => {
        if (!cancelled && process.env.NODE_ENV !== 'production') {
          console.error('Failed to load workflow module for Step1 selector', error);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [workflowModule]);

  const workflowDocuments = useMemo(
    () =>
      workflowModule
        ? workflowModule.getWorkflowDocuments({
            jurisdiction: 'us',
            state: stateFilter,
          })
        : [],
    [stateFilter, workflowModule],
  );

  const manifestCategories = useMemo(
    () =>
      workflowModule
        ? workflowModule.getWorkflowCategories({
            jurisdiction: 'us',
            state: stateFilter,
          })
        : [],
    [stateFilter, workflowModule],
  );

  const sortedCategories = useMemo(() => {
    const fallbackCategories = CATEGORY_LIST.map((category) => category.key);
    const categories = manifestCategories.length
      ? manifestCategories
      : fallbackCategories;

    const uniqueCategories = Array.from(new Set(categories));
    const categoryInfos = uniqueCategories.map((categoryName) =>
      buildCategoryInfo(categoryName),
    );

    if (!isHydrated) return categoryInfos;

    return [...categoryInfos].sort((a, b) =>
      t(a.labelKey, { defaultValue: a.key }).localeCompare(
        t(b.labelKey, { defaultValue: b.key }),
        i18n.language,
      ),
    );
  }, [manifestCategories, isHydrated, i18n.language, t]);

  const [loadingDocId, setLoadingDocId] = useState<string | null>(null);
  const loadedDocsRef = React.useRef(new Map<string, LegalDocument>());

  const topDocuments: SelectableDocument[] = useMemo(() => {
    if (!workflowDocuments.length) {
      return PLACEHOLDER_TOP_DOCS;
    }

    const byId = new Map(workflowDocuments.map((doc) => [doc.id, doc]));
    return PLACEHOLDER_TOP_DOCS.map(
      (doc) => byId.get(doc.id) ?? doc,
    ) as SelectableDocument[];
  }, [workflowDocuments]);

  const documentsToDisplay = useMemo(() => {
    if (!isHydrated) return [];

    if (currentView === 'search-results') {
      const trimmedQuery = globalSearchTerm.trim();
      if (!trimmedQuery) {
        return [];
      }

      if (!workflowModule) {
        return [] as DocumentSummary[];
      }

      return workflowModule.searchWorkflowDocuments(trimmedQuery, {
        jurisdiction: 'us',
        state: stateFilter,
        language: searchLanguage,
      });
    }

    if (currentView === 'documents-in-category' && selectedCategoryInternal) {
      const normalizedCategory = selectedCategoryInternal.toLowerCase();
      let docsList = workflowDocuments.filter(
        (doc) => doc.category.toLowerCase() === normalizedCategory,
      );

      const trimmedDocSearch = docSearch.trim();
      if (!trimmedDocSearch) {
        return docsList;
      }

      const lowerDocSearch = trimmedDocSearch.toLowerCase();

      docsList = docsList.filter((doc) => {
        const matchesEnglishName = t(getDocName(doc, 'en'), {
          defaultValue: getDocName(doc, 'en'),
        })
          .toLowerCase()
          .includes(lowerDocSearch);

        const matchesEnglishAliases = getDocAliases(doc, 'en').some((alias) =>
          alias.toLowerCase().includes(lowerDocSearch),
        );

        const matchesEnglishDescription = t(getDocDescription(doc, 'en'), {
          defaultValue: getDocDescription(doc, 'en'),
        })
          .toLowerCase()
          .includes(lowerDocSearch);

        const supportsSpanish = languageSupportsSpanish(doc.languageSupport);
        const matchesSpanish = supportsSpanish
          ? t(getDocName(doc, 'es'), {
              defaultValue: getDocName(doc, 'es'),
            })
              .toLowerCase()
              .includes(lowerDocSearch) ||
            getDocAliases(doc, 'es').some((alias) =>
              alias.toLowerCase().includes(lowerDocSearch),
            ) ||
            t(getDocDescription(doc, 'es'), {
              defaultValue: getDocDescription(doc, 'es'),
            })
              .toLowerCase()
              .includes(lowerDocSearch)
          : false;

        return (
          matchesEnglishName ||
          matchesEnglishAliases ||
          matchesEnglishDescription ||
          matchesSpanish
        );
      });

      return docsList;
    }

    return [];
  }, [
    isHydrated,
    currentView,
    globalSearchTerm,
    docSearch,
    selectedCategoryInternal,
    workflowDocuments,
    stateFilter,
    searchLanguage,
    t,
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

  const handleDocSelect = async (doc: SelectableDocument) => {
    if (!isHydrated) return;

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

    if (loadingDocId) {
      return;
    }

    const cachedDoc = loadedDocsRef.current.get(doc.id);
    if (cachedDoc) {
      onDocumentSelect(cachedDoc);
      track('select_item', {
        item_id: cachedDoc.id,
        item_name: getDocName(cachedDoc, i18n.language),
        item_category: cachedDoc.category,
        price: cachedDoc.basePrice,
        state: globalSelectedState,
      });
      return;
    }

    if (!workflowModule) {
      toast({
        title: t('Templates still loading'),
        description: t(
          'One moment while we finish loading the document library.',
        ),
        variant: 'default',
      });
      return;
    }

    try {
      setLoadingDocId(doc.id);
      const loadedDoc = await workflowModule.loadWorkflowDocument(doc.id);

      if (!loadedDoc) {
        toast({
          title: t('Unable to load document'),
          description: t(
            'We could not load this template. Please try again or select a different document.',
          ),
          variant: 'destructive',
        });
        return;
      }

      loadedDocsRef.current.set(doc.id, loadedDoc);
      onDocumentSelect(loadedDoc);
      track('select_item', {
        item_id: loadedDoc.id,
        item_name: getDocName(loadedDoc, i18n.language),
        item_category: loadedDoc.category,
        price: loadedDoc.basePrice,
        state: globalSelectedState,
      });
    } catch (error) {
      toast({
        title: t('Unexpected error'),
        description: t(
          'Something went wrong while loading this document. Please try again.',
        ),
        variant: 'destructive',
      });
    } finally {
      setLoadingDocId(null);
    }
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
            documents={topDocuments}
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
