'use client'

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { documentLibrary, usStates } from "@/lib/document-library"; // Import usStates too
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"; // Import Card components
import { Button } from "@/components/ui/button"; // Import Button
import { Input } from "@/components/ui/input"; // Import Input
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Import Select components

/**
 * Step1DocumentSelector: Static category→document picker using local documentLibrary,
 * bypassing Firestore so categories show instantly.
 */
export default function Step1DocumentSelector({ onDocumentSelect, onStateChange }) {
  const { t } = useTranslation();
  const [view, setView] = useState<'categories' | 'documents'>('categories');
  const [currentCategory, setCurrentCategory] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('');

  // Derive unique sorted categories from library
  const categories = Array.from(
    new Set(documentLibrary.map(doc => doc.category))
  ).sort();

  // Documents filtered by category + search
  const docsInCategory = documentLibrary.filter(doc =>
    doc.category === currentCategory &&
    (search.trim() === '' || doc.name.toLowerCase().includes(search.toLowerCase()))
  );

  // Handlers
  const openCategory = (cat: string) => {
    setCurrentCategory(cat);
    setSearch('');
    setView('documents');
  };
  const goBack = () => {
    setView('categories');
    setCurrentCategory('');
    setSearch('');
  };

  return (
    <Card className="shadow-lg rounded-lg bg-card border border-border">
       {/* CardHeader remains consistent */}
      <CardHeader>
        <CardTitle className="text-2xl">{view === 'categories' ? t('stepOne.title', 'Step 1: Choose Your Category') : `${t('Step 1: Select Document in')} ${currentCategory}`}</CardTitle>
        <CardDescription>{view === 'categories' ? t('stepOne.description', 'Select a legal category to see available documents.') : t('stepOne.selectDocDescription', 'Choose the document that best fits your needs.')}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {view === 'categories' ? (
          <>
            {/* Category Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {categories.map(cat => (
                <Button
                  key={cat}
                  variant="outline"
                  onClick={() => openCategory(cat)}
                  className="h-20 p-4 flex items-center justify-center text-center shadow-sm hover:shadow-md transition border-border bg-card hover:bg-muted"
                >
                  <span className="font-medium text-sm text-card-foreground">{cat}</span>
                </Button>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Document View Header */}
            <div className="flex items-center justify-between mb-4 border-b pb-3 border-border">
              <Button variant="link" onClick={goBack} className="text-primary hover:underline p-0 h-auto">
                ← {t('docTypeSelector.backToCategories', 'Back to Categories')}
              </Button>
              <h3 className="text-lg font-semibold text-foreground">{currentCategory}</h3>
            </div>

            {/* Search and State Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <Input
                type="search" // Use search type
                placeholder={t('docTypeSelector.searchPlaceholder', 'Search documents...')}
                value={search}
                onChange={e => setSearch(e.target.value)}
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
                  <SelectValue placeholder={t('stepOne.statePlaceholder', 'Select State...')} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="none">{t('stepOne.statePlaceholder', 'Select State...')}</SelectItem>
                    {usStates.map(state => (
                        <SelectItem key={state.value} value={state.value}>
                            {state.label} ({state.value})
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
                        <CardTitle className="text-base font-semibold">{doc.name}</CardTitle>
                        <CardDescription className="text-xs text-muted-foreground truncate pt-1">
                            {doc.description || t('docTypeSelector.noDescription', 'No description available.')}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-2 flex justify-between items-center text-xs text-muted-foreground">
                        <span>💲{doc.basePrice}</span>
                        <div className="flex gap-2">
                             {doc.requiresNotarization && <span title={t('docTypeSelector.requiresNotarization', 'Requires Notarization')}>📝</span>}
                             {doc.canBeRecorded && <span title={t('docTypeSelector.canBeRecorded', 'Can Be Recorded')}>🏛️</span>}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
            ) : (
                <p className="text-muted-foreground italic text-center py-4">{t('docTypeSelector.noResults', 'No documents match your search in this category.')}</p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
