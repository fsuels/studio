// src/components/Step1DocumentSelector.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { documentLibrary, type LegalDocument } from '@/lib/document-library';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ArrowLeft,
  FileText,
  Search,
  Landmark,
  Briefcase,
  Home,
  Users,
  User,
  ScrollText,
  ShieldQuestion,
  AlertTriangle,
} from 'lucide-react';
import { track } from '@/lib/analytics';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Helper type for a simplified translation function used internally
type SimpleT = (
  _key: string,
  _fallback?: string | Record<string, unknown>,
) => string;

export interface CategoryInfo {
  key: string;
  labelKey: string;
  icon: React.ElementType;
}

export const CATEGORY_LIST: CategoryInfo[] = [
  { key: 'Finance', labelKey: 'Finance', icon: Landmark },
  { key: 'Business', labelKey: 'Business', icon: Briefcase },
  { key: 'Real Estate', labelKey: 'Real Estate', icon: Home },
  { key: 'Family', labelKey: 'Family', icon: Users },
  { key: 'Personal', labelKey: 'Personal', icon: User },
  { key: 'Estate Planning', labelKey: 'Estate Planning', icon: ScrollText },
  {
    key: 'Employment',
    labelKey: 'Employment & Labor Documents',
    icon: Briefcase,
  }, // Added from previous update
  { key: 'Miscellaneous', labelKey: 'General', icon: FileText },
];

const getDocName = (
  doc: Pick<LegalDocument, 'translations'>,
  locale: string,
) =>
  locale === 'es'
    ? doc.translations?.es?.name || doc.translations?.en?.name || ''
    : doc.translations?.en?.name || doc.translations?.es?.name || '';

const getDocDescription = (
  doc: Pick<LegalDocument, 'translations'>,
  locale: string,
) =>
  locale === 'es'
    ? doc.translations?.es?.description ||
      doc.translations?.en?.description ||
      ''
    : doc.translations?.en?.description ||
      doc.translations?.es?.description ||
      '';

const getDocAliases = (
  doc: Pick<LegalDocument, 'translations'>,
  locale: string,
) =>
  locale === 'es'
    ? doc.translations?.es?.aliases || []
    : doc.translations?.en?.aliases || [];

interface Step1DocumentSelectorProps {
  selectedCategory: string | null;
  onCategorySelect: (_categoryKey: string | null) => void;
  onDocumentSelect: (_doc: LegalDocument) => void;
  isReadOnly?: boolean;
  globalSearchTerm: string;
  globalSelectedState: string;
}

// Placeholder for top docs - in a real app, this comes from Firestore
const placeholderTopDocs: Array<
  Pick<LegalDocument, 'id' | 'category' | 'translations'> & {
    icon?: React.ElementType;
  }
> = [
  {
    id: 'bill-of-sale-vehicle',
    category: 'Finance',
    translations: {
      en: { name: 'Vehicle Bill of Sale', description: '' },
      es: { name: 'Contrato de Compraventa de Vehículo', description: '' },
    },
    icon: FileText,
  },
  {
    id: 'leaseAgreement',
    category: 'Real Estate',
    translations: {
      en: { name: 'Residential Lease Agreement', description: '' },
      es: { name: 'Contrato de Arrendamiento Residencial', description: '' },
    },
    icon: Home,
  },
  {
    id: 'nda',
    category: 'Business',
    translations: {
      en: { name: 'Non-Disclosure Agreement (NDA)', description: '' },
      es: { name: 'Acuerdo de Confidencialidad (NDA)', description: '' },
    },
    icon: ShieldQuestion,
  },
  {
    id: 'powerOfAttorney',
    category: 'Personal',
    translations: {
      en: { name: 'General Power of Attorney', description: '' },
      es: { name: 'Poder Notarial General', description: '' },
    },
    icon: User,
  },
  {
    id: 'last-will-testament',
    category: 'Estate Planning',
    translations: {
      en: { name: 'Last Will and Testament', description: '' },
      es: { name: 'Última Voluntad y Testamento', description: '' },
    },
    icon: ScrollText,
  },
  {
    id: 'eviction-notice',
    category: 'Real Estate',
    translations: {
      en: { name: 'Eviction Notice', description: '' },
      es: { name: 'Aviso de Desalojo', description: '' },
    },
    icon: AlertTriangle,
  },
];

const MemoizedCategoryCard = React.memo(function CategoryCard({
  category,
  onClick,
  disabled,
  t,
}: {
  category: CategoryInfo;
  onClick: () => void;
  disabled: boolean;
  t: SimpleT;
}) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      disabled={disabled}
      className="category-card h-auto min-h-[110px] p-6 border-border shadow-sm hover:shadow-lg transition text-center flex flex-col justify-center items-center bg-card hover:bg-muted active:scale-95 active:transition-transform active:duration-100 rounded-xl"
    >
      <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
        {React.createElement(category.icon || FileText, {
          className: 'h-6 w-6 text-primary',
        })}
      </span>
      <span className="font-medium text-card-foreground text-base">
        {t(category.labelKey, { defaultValue: category.key })}
      </span>
    </Button>
  );
});

const MemoizedDocumentCard = React.memo(function DocumentCard({
  doc,
  onSelect,
  disabled,
  t,
  i18nLanguage,
  placeholderNoDescription,
  placeholderRequiresNotarization,
  placeholderCanBeRecorded,
}: {
  doc: LegalDocument;
  onSelect: () => void;
  disabled: boolean;
  t: SimpleT;
  i18nLanguage: string;
  placeholderNoDescription: string;
  placeholderRequiresNotarization: string;
  placeholderCanBeRecorded: string;
}) {
  return (
    <Card
      onClick={onSelect}
      tabIndex={disabled ? -1 : 0}
      role="button"
      aria-label={t(getDocName(doc, i18nLanguage), {
        defaultValue: getDocName(doc, i18nLanguage),
      })}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      className={cn(
        'document-card shadow hover:shadow-lg cursor-pointer transition bg-card border border-border flex flex-col active:scale-95 active:transition-transform active:duration-100',
        disabled ? 'pointer-events-none opacity-50' : '',
      )}
    >
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-base font-semibold text-card-foreground">
          {t(getDocName(doc, i18nLanguage), {
            defaultValue: getDocName(doc, i18nLanguage),
          })}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground flex-grow px-4">
        {t(getDocDescription(doc, i18nLanguage), {
          defaultValue: getDocDescription(doc, i18nLanguage),
        }) || placeholderNoDescription}
      </CardContent>
      <CardFooter className="pt-2 pb-3 px-4 text-xs text-muted-foreground flex justify-between items-center border-t border-border mt-auto">
        <span>💲{doc.basePrice}</span>
        <div className="flex gap-2">
          {doc.requiresNotarization && (
            <span title={placeholderRequiresNotarization}>📝</span>
          )}
          {doc.canBeRecorded && (
            <span title={placeholderCanBeRecorded}>🏛️</span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
});

const MemoizedTopDocChip = React.memo(function TopDocChip({
  doc,
  onSelect,
  disabled,
  t,
  i18nLanguage,
}: {
  doc: Pick<LegalDocument, 'id' | 'translations'> & {
    icon?: React.ElementType;
  };
  onSelect: () => void;
  disabled: boolean;
  t: SimpleT;
  i18nLanguage: string;
}) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onSelect}
      disabled={disabled}
      className="category-card h-auto min-h-[60px] p-4 border-border shadow-sm hover:shadow-lg transition text-center flex items-center justify-center gap-2 bg-card hover:bg-muted active:scale-95 active:transition-transform active:duration-100"
    >
      {doc.icon &&
        React.createElement(doc.icon, { className: 'h-5 w-5 text-primary/80' })}
      <span className="font-medium text-card-foreground text-sm">
        {t(getDocName(doc, i18nLanguage), {
          defaultValue: getDocName(doc, i18nLanguage),
        })}
      </span>
    </Button>
  );
});

const Step1DocumentSelector = React.memo(function Step1DocumentSelector({
  selectedCategory: initialSelectedCategory, // Renamed to avoid conflict
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
  // 'top-docs', 'all-categories', 'documents-in-category', 'search-results'
  const [currentView, setCurrentView] = useState<
    'top-docs' | 'all-categories' | 'documents-in-category' | 'search-results'
  >(initialSelectedCategory ? 'documents-in-category' : 'top-docs');
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
      setSelectedCategoryInternal(null); // Clear category when global search is active
    } else if (
      currentView === 'search-results' &&
      globalSearchTerm.trim() === ''
    ) {
      // Revert to top-docs or selected category view when search is cleared
      setCurrentView(
        selectedCategoryInternal ? 'documents-in-category' : 'top-docs',
      );
    }
  }, [globalSearchTerm, currentView, selectedCategoryInternal]);

  // Effect to update internal selected category when prop changes (e.g., from URL param)
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
      // If prop clears category, revert to top-docs unless searching
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
    const uniqueCategoriesMap = new Map<string, CategoryInfo>();
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

  const languageSupportsSpanish = (support: string[] | undefined): boolean =>
    !!support && support.includes('es');

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
      // For 'top-docs' or 'all-categories' view, no doc filtering here, handled by dedicated rendering
      return []; // Or return all docs if 'all-categories' has its own full list rendering
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
    onCategorySelect(key); // Notify parent about category selection for URL update etc.
    setDocSearch('');
    track('select_item_category', { item_category: key });
  };

  const handleBackToAllCategories = () => {
    if (isReadOnly || !isHydrated) return;
    setSelectedCategoryInternal(null);
    setCurrentView('all-categories');
    onCategorySelect(null); // Notify parent
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

  let cardTitle = '';
  let cardDescription = '';

  if (currentView === 'search-results') {
    cardTitle = t('Search Results');
    cardDescription = t(
      'Showing documents matching your search and state criteria.',
    );
  } else if (currentView === 'top-docs') {
    cardTitle = t('stepOne.topDocumentsTitle', 'Top Documents This Week');
    cardDescription = placeholderCategoryDesc; // Or a specific description for top docs
  } else if (currentView === 'all-categories') {
    cardTitle = t('stepOne.categoryDescription');
    cardDescription = placeholderCategoryDesc;
  } else if (currentView === 'documents-in-category') {
    cardTitle = t('stepOne.selectDocDescription');
    cardDescription = placeholderSelectDocDesc;
  }

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
        {currentView === 'search-results' ? (
          <div className="animate-fade-in space-y-6">
            {globalSelectedState ? (
              <>
                {documentsToDisplay.length > 0 ? (
                  <div className="document-grid pt-4 animate-fade-in">
                    {documentsToDisplay.map((doc) => (
                      <MemoizedDocumentCard
                        key={doc.id}
                        doc={doc}
                        onSelect={() => handleDocSelect(doc)}
                        disabled={isReadOnly || !isHydrated}
                        t={tSimple}
                        i18nLanguage={i18n.language}
                        placeholderNoDescription={placeholderNoDescription}
                        placeholderRequiresNotarization={
                          placeholderRequiresNotarization
                        }
                        placeholderCanBeRecorded={placeholderCanBeRecorded}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground italic text-center py-6">
                    {placeholderNoResults}
                  </p>
                )}
              </>
            ) : (
              <p className="text-muted-foreground italic text-center py-6">
                {isHydrated
                  ? t(
                      'Please select a state from the filter bar above to see documents.',
                    )
                  : 'Loading...'}
              </p>
            )}
          </div>
        ) : currentView === 'top-docs' ? (
          <div className="animate-fade-in space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {placeholderTopDocs.map((doc) => (
                <MemoizedTopDocChip
                  key={doc.id}
                  doc={doc}
                  onSelect={() => handleDocSelect(doc)}
                  disabled={isReadOnly || !isHydrated}
                  t={tSimple}
                  i18nLanguage={i18n.language}
                />
              ))}
            </div>
            <Button
              variant="link"
              onClick={() => setCurrentView('all-categories')}
              className="w-full justify-center text-primary"
            >
              {t(
                'stepOne.exploreAllCategoriesButton',
                'Explore All Document Categories',
              )}{' '}
              →
            </Button>
          </div>
        ) : currentView === 'all-categories' ? (
          <div className="animate-fade-in space-y-4">
            {sortedCategories.length > 0 ? (
              <div className="category-grid pt-2">
                {sortedCategories.map((cat) => (
                  <MemoizedCategoryCard
                    key={cat.key}
                    category={cat}
                    onClick={() => handleCategoryClick(cat.key)}
                    disabled={isReadOnly || !isHydrated}
                    t={tSimple}
                  />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground italic text-center py-6">
                {placeholderNoCategories}
              </p>
            )}
          </div>
        ) : (
          // documents-in-category view
          <div className="animate-fade-in space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder={placeholderSearchDocuments}
                value={docSearch}
                onChange={(e) => setDocSearch(e.target.value)}
                className="w-full pl-10 h-10 text-sm"
                aria-label={placeholderSearchDocuments}
                disabled={isReadOnly || !isHydrated}
              />
            </div>
            {globalSelectedState ? (
              <>
                {documentsToDisplay.length > 0 ? (
                  <div className="document-grid pt-4 animate-fade-in">
                    {documentsToDisplay.map((doc) => (
                      <MemoizedDocumentCard
                        key={doc.id}
                        doc={doc}
                        onSelect={() => handleDocSelect(doc)}
                        disabled={isReadOnly || !isHydrated}
                        t={tSimple}
                        i18nLanguage={i18n.language}
                        placeholderNoDescription={placeholderNoDescription}
                        placeholderRequiresNotarization={
                          placeholderRequiresNotarization
                        }
                        placeholderCanBeRecorded={placeholderCanBeRecorded}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground italic text-center py-6">
                    {placeholderNoResults}
                  </p>
                )}
              </>
            ) : (
              <p className="text-muted-foreground italic text-center py-6">
                {isHydrated
                  ? t(
                      'Please select a state from the filter bar above to see documents.',
                    )
                  : 'Loading...'}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
});
export default Step1DocumentSelector;
