// src/components/Step1DocumentSelector.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { documentLibrary, usStates, LegalDocument } from "@/lib/document-library";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, Search } from "lucide-react";

// User-friendly category definitions derived from the library or predefined
const getCategoriesFromLibrary = (library: LegalDocument[]) => {
  const uniqueCategories = [...new Set(library.map(doc => doc.category))];
  return uniqueCategories
    .map(catKey => ({
      key: catKey,
      label: catKey // Use the category key directly for now, translation can be added if needed
    }));
};

// Define the props expected by the component
interface Step1DocumentSelectorProps {
  onDocumentSelect: (doc: LegalDocument) => void;
  onStateChange: (state: string) => void;
}

export default function Step1DocumentSelector({ onDocumentSelect, onStateChange }: Step1DocumentSelectorProps) {
  const { t, i18n } = useTranslation();
  const [view, setView] = useState<'categories' | 'documents'>('categories');
  const [currentCategory, setCurrentCategory] = useState<string>('');
  const [categorySearch, setCategorySearch] = useState<string>('');
  const [docSearch, setDocSearch] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('');
  const [isHydrated, setIsHydrated] = useState(false);

  // Derive categories dynamically and sort them using t
   const CATEGORY_LIST = useMemo(() => {
       const categories = getCategoriesFromLibrary(documentLibrary);
       if (!t || typeof t !== 'function') {
            return categories.sort((a, b) => a.label.localeCompare(b.label));
       }
       // Sorting requires translation keys to be set up correctly for category labels.
       // If labels are just strings like "Real Estate", t(label) might just return the string itself if no key matches.
       // Assuming direct translation or fallback for sorting:
       return categories.sort((a, b) => t(a.label, a.label).localeCompare(t(b.label, b.label)));
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [t]); // Depend on t

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Filtered categories based on search term
  const filteredCategories = useMemo(() => {
      if (!isHydrated || !t || typeof t !== 'function') {
        return CATEGORY_LIST.filter(cat =>
           cat.label.toLowerCase().includes(categorySearch.toLowerCase())
        );
      }
      return CATEGORY_LIST.filter(cat =>
        t(cat.label, cat.label).toLowerCase().includes(categorySearch.toLowerCase()) // Add fallback value
      );
  }, [CATEGORY_LIST, categorySearch, t, isHydrated]);


  // Documents filtered by selected category and document search term
  const docsInCategory = useMemo(() => {
     if (!currentCategory) return []; // No category selected, return empty
     return documentLibrary.filter(doc =>
         doc.category === currentCategory && doc.id !== 'general-inquiry' &&
        (docSearch.trim() === '' ||
         (isHydrated && t && typeof t === 'function' ? t(doc.name, doc.name).toLowerCase().includes(docSearch.toLowerCase()) : doc.name.toLowerCase().includes(docSearch.toLowerCase())) ||
         (doc.aliases?.some(alias => alias.toLowerCase().includes(docSearch.toLowerCase()))))
      );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCategory, docSearch, t, isHydrated]);


  const openCategory = (key: string) => {
    setCurrentCategory(key);
    setDocSearch(''); // Clear document search when changing category
    setView('documents');
  };

  const goBack = () => {
    setView('categories');
    setCurrentCategory('');
    setCategorySearch(''); // Clear category search when going back
  };

  const handleStateSelection = (value: string) => {
      const stateValue = value === "" ? "" : value;
      setSelectedState(stateValue);
      onStateChange(stateValue); // Notify parent
  };

   // Placeholders for SSR/initial hydration
   const categoryPlaceholder = t('docTypeSelector.searchCategories', 'Search categories...');
   const documentPlaceholder = t('docTypeSelector.searchPlaceholder', 'Search documents...');
   const noCategoriesPlaceholder = t('docTypeSelector.noCategoriesFound', 'No categories match your search.');
   const noDocumentsPlaceholder = t('docTypeSelector.noResults', 'No documents match your search in this category.');
   const statePlaceholder = t('stepOne.statePlaceholder', 'Select State...');

   // Show placeholder or nothing if not hydrated
   if (!isHydrated) {
     return <div className="h-96 animate-pulse bg-muted rounded-lg shadow-lg border border-border"></div>;
   }

  return (
    <div className="space-y-6">
      {view === 'categories' ? (
        <>
          {/* Title and Description */}
           <CardHeader className="p-0 mb-4">
               <div className="flex items-center space-x-2">
                  <FileText className="h-6 w-6 text-primary" />
                  <CardTitle className="text-2xl">{t('stepOne.selectDocDescription', 'Choose the document that best fits your needs.')}</CardTitle>
               </div>
                <CardDescription>{t('stepOne.categoryDescription', 'Choose the legal area that best fits your need.')}</CardDescription>
           </CardHeader>

          {/* Category Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder={categoryPlaceholder}
              value={categorySearch}
              onChange={e => setCategorySearch(e.target.value)}
              className="w-full pl-10 bg-background"
              aria-label={categoryPlaceholder}
            />
          </div>

          {/* Category Grid */}
          {filteredCategories.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 animate-fade-in">
              {filteredCategories.map(cat => (
                 <Button
                   key={cat.key}
                   variant="outline"
                   onClick={() => openCategory(cat.key)}
                   className="h-auto min-h-[80px] p-4 border-border shadow-sm hover:shadow-md transition text-center flex flex-col justify-center items-center bg-card hover:bg-muted"
                 >
                   <span className="font-medium text-card-foreground text-sm">{t(cat.label, cat.label)}</span>
                 </Button>
              ))}
            </div>
          ) : (
             <p className="text-muted-foreground italic text-center py-4">{noCategoriesPlaceholder}</p>
          )}
        </>
      ) : (
        <>
          {/* Back Button & Title */}
          <div className="flex items-center justify-between mb-4">
            <Button variant="outline" size="sm" onClick={goBack}>
              <ArrowLeft className="mr-2 h-4 w-4" /> {t('docTypeSelector.backToCategories', 'Back to Categories')}
            </Button>
            {/* Title showing the current category */}
             <h3 className="text-xl font-semibold">
                 {t(CATEGORY_LIST.find(c => c.key === currentCategory)?.label || currentCategory, CATEGORY_LIST.find(c => c.key === currentCategory)?.label || currentCategory)}
             </h3>
          </div>

          {/* Document Search & State Select */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={documentPlaceholder}
                  value={docSearch}
                  onChange={e => setDocSearch(e.target.value)}
                  className="w-full pl-10 bg-background"
                  aria-label={documentPlaceholder}
                />
             </div>
             <Select value={selectedState} onValueChange={handleStateSelection}>
                <SelectTrigger className="w-full bg-background">
                    <SelectValue placeholder={statePlaceholder} />
                </SelectTrigger>
                <SelectContent>
                     <SelectItem value="">{statePlaceholder}</SelectItem>
                    {usStates.map(state => (
                       <SelectItem key={state.value} value={state.value}>{state.label} ({state.value})</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>

          {/* Document Grid */}
          {docsInCategory.length > 0 ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 animate-fade-in">
                {docsInCategory.map(doc => (
                    <Card
                        key={doc.id}
                        onClick={() => onDocumentSelect(doc)}
                        className="shadow hover:shadow-lg cursor-pointer transition bg-card border-border hover:border-primary/50 flex flex-col"
                    >
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-semibold text-card-foreground">{t(doc.name, doc.name)}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs text-muted-foreground flex-grow">
                            {t(doc.description, doc.description) || t('docTypeSelector.noDescription', 'No description available.')}
                        </CardContent>
                        <CardFooter className="pt-2 pb-3 text-xs text-muted-foreground flex justify-between items-center border-t border-border mt-auto">
                           <span>💲{doc.basePrice}</span>
                           <div className="flex gap-2">
                               {doc.requiresNotarization && <span title={t('docTypeSelector.requiresNotarization', 'Requires Notarization')}>📝</span>}
                               {doc.canBeRecorded && <span title={t('docTypeSelector.canBeRecorded', 'Can Be Recorded')}>🏛️</span>}
                           </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
          ) : (
              <p className="text-muted-foreground italic text-center py-6">{noDocumentsPlaceholder}</p>
          )}
        </>
      )}
    </div>
  );
}
