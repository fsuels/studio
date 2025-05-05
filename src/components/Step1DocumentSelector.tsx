
'use client'

import React, { useState, useMemo, useEffect } from "react"; // Import useMemo and useEffect
import { useTranslation } from "react-i18next";
import { documentLibrary, usStates } from "@/lib/document-library"; // Import usStates too
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"; // Import Card components
import { Button } from "@/components/ui/button"; // Import Button
import { Input } from "@/components/ui/input"; // Import Input
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Import Select components

/**
 * Step1DocumentSelector: Static category→document picker using local documentLibrary,
 * with predefined categories and search functionality.
 */
export default function Step1DocumentSelector({ onDocumentSelect, onStateChange }) {
  const { t } = useTranslation(); // Call useTranslation at the top level
  const [view, setView] = useState<'categories' | 'documents'>('categories');
  const [currentCategory, setCurrentCategory] = useState<string>('');
  const [categorySearch, setCategorySearch] = useState<string>('');
  const [docSearch, setDocSearch] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('');
  const [isHydrated, setIsHydrated] = useState(false); // State for hydration

  useEffect(() => {
    setIsHydrated(true); // Set hydrated state on client
  }, []);

  // Define categories inside the component and sort using useMemo
  const CATEGORY_LIST = useMemo(() => [
    // Match these keys to the 'category' field in documentLibrary
    { key: 'Court & Litigation', label: 'Court & Litigation Documents' },
    { key: 'Contracts & Agreements', label: 'Contracts & Agreements' },
    { key: 'Real Estate', label: 'Real Estate Documents' },
    { key: 'Financial & Business', label: 'Financial & Business Documents' },
    { key: 'Personal & Family', label: 'Personal & Family Documents' },
    { key: 'Identification & Immigration', label: 'Identification & Immigration Documents' },
    { key: 'Employment & Labor', label: 'Employment & Labor Documents' },
    { key: 'Business', label: 'Business Formation & Operations' },
    { key: 'Estate', label: 'Estate Planning' },
    { key: 'Transactions', label: 'Sales & Transactions' },
    { key: 'Finance', label: 'Finance & Lending' },
    { key: 'Miscellaneous', label: 'Miscellaneous Legal Forms' },
    { key: 'General Legal', label: 'General Legal Statements' },
    // Add other categories as needed
  ].sort((a, b) => t(a.label).localeCompare(t(b.label))), [t]); // Sort by translated label, dependent on t

  // Filtered categories based on search
  const filteredCategories = useMemo(() => CATEGORY_LIST.filter(cat =>
    t(cat.label).toLowerCase().includes(categorySearch.toLowerCase())
  ), [CATEGORY_LIST, categorySearch, t]); // Add dependencies

  // Documents filtered by selected category and search
  const docsInCategory = useMemo(() => documentLibrary.filter(doc =>
    doc.category === currentCategory &&
    (docSearch.trim() === '' || doc.name.toLowerCase().includes(docSearch.toLowerCase()))
  ), [currentCategory, docSearch]); // Add dependencies

  const openCategory = (key: string) => {
    setCurrentCategory(key);
    setDocSearch(''); // Reset doc search when changing category
    setView('documents');
  };

  const goBack = () => {
    setView('categories');
    setCurrentCategory('');
    setCategorySearch(''); // Reset category search when going back
  };

  const currentCategoryLabel = CATEGORY_LIST.find(c => c.key === currentCategory)?.label || currentCategory;

  // Placeholder for hydration
  if (!isHydrated) {
     return <div className="h-96 animate-pulse bg-muted rounded-lg shadow-lg border border-border"></div>;
  }

  return (
     <Card className="shadow-lg rounded-lg bg-card border border-border">
       {/* CardHeader dynamically updates */}
      <CardHeader>
        <CardTitle className="text-2xl">
           {view === 'categories' ? t('stepOne.title') : `${t('Step 1: Select Document in')} ${t(currentCategoryLabel)}`}
        </CardTitle>
        <CardDescription>
            {view === 'categories' ? t('stepOne.categoryDescription') : t('stepOne.selectDocDescription')}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {view === 'categories' ? (
          <>
            {/* Category Search */}
            <Input
              type="search" // Use search type
              placeholder={t('docTypeSelector.searchCategories')}
              value={categorySearch}
              onChange={e => setCategorySearch(e.target.value)}
              className="w-full"
            />
            {/* Category Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredCategories.length > 0 ? filteredCategories.map(cat => (
                <Button
                  key={cat.key}
                  variant="outline"
                  onClick={() => openCategory(cat.key)}
                  className="h-20 p-4 flex items-center justify-center text-center shadow-sm hover:shadow-md transition border-border bg-card hover:bg-muted"
                >
                  <span className="font-medium text-sm text-card-foreground">{t(cat.label)}</span>
                </Button>
              )) : (
                 <p className="text-muted-foreground italic col-span-full text-center py-4">{t('docTypeSelector.noCategoriesFound')}</p>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Document View Header */}
            <div className="flex items-center justify-between mb-4 border-b pb-3 border-border">
              <Button variant="link" onClick={goBack} className="text-primary hover:underline p-0 h-auto">
                ← {t('docTypeSelector.backToCategories')}
              </Button>
              <h3 className="text-lg font-semibold text-foreground">{t(currentCategoryLabel)}</h3>
            </div>

            {/* Document Search and State Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <Input
                type="search" // Use search type
                placeholder={t('docTypeSelector.searchPlaceholder')}
                value={docSearch}
                onChange={e => setDocSearch(e.target.value)}
                className="flex-grow"
              />
              <Select
                 value={selectedState}
                 onValueChange={(value) => {
                     const newState = value === 'none' ? '' : value;
                     setSelectedState(newState);
                     onStateChange(newState);
                 }}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder={t('stepOne.statePlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="none">{t('stepOne.statePlaceholder')}</SelectItem>
                    {usStates.map(state => (
                        <SelectItem key={state.value} value={state.value}>
                            {/* Translate state label if you add translations for them */}
                            {t(state.label, state.label)} ({state.value})
                        </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Document Grid */}
            {docsInCategory.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {docsInCategory.map(doc => (
                    <Card
                      key={doc.id}
                      onClick={() => onDocumentSelect(doc)}
                      className="cursor-pointer hover:shadow-lg transition-all duration-200 border border-border hover:border-primary bg-card"
                    >
                      <CardHeader className="pb-2">
                        {/* Use translated name if available, fallback to English */}
                        <CardTitle className="text-base font-semibold">{t(doc.name_es || doc.name, doc.name)}</CardTitle> {/* Ensure fallback */}
                        {/* Use translated description if available, fallback to English */}
                        <CardDescription className="text-xs text-muted-foreground truncate pt-1">
                            {t(doc.description_es || doc.description, doc.description) || t('docTypeSelector.noDescription')} {/* Ensure fallback */}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-2 flex justify-between items-center text-xs text-muted-foreground">
                        <span>💲{doc.basePrice}</span>
                        <div className="flex gap-2">
                             {doc.requiresNotarization && <span title={t('docTypeSelector.requiresNotarization')}>📝</span>}
                             {doc.canBeRecorded && <span title={t('docTypeSelector.canBeRecorded')}>🏛️</span>}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
            ) : (
                <p className="text-muted-foreground italic text-center py-4">{t('docTypeSelector.noResults')}</p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
