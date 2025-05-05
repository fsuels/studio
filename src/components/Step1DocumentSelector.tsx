// src/components/Step1DocumentSelector.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react"; // Added useMemo
import { useTranslation } from "react-i18next";
import { documentLibrary, usStates, LegalDocument } from "@/lib/document-library"; // Import usStates and LegalDocument
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
    // Sorting moved to useMemo inside the component
};


// Define the props expected by the component
interface Step1DocumentSelectorProps {
  onDocumentSelect: (doc: LegalDocument) => void; // Use the defined LegalDocument type
  onStateChange: (state: string) => void; // Function called when state selection changes
}

export default function Step1DocumentSelector({ onDocumentSelect, onStateChange }: Step1DocumentSelectorProps) {
  const { t, i18n } = useTranslation(); // Corrected: Added i18n
  const [view, setView] = useState<'categories' | 'documents'>('categories');
  const [currentCategory, setCurrentCategory] = useState<string>('');
  const [categorySearch, setCategorySearch] = useState<string>('');
  const [docSearch, setDocSearch] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('');
  const [isHydrated, setIsHydrated] = useState(false);

  // Derive categories dynamically and sort them using t
   const CATEGORY_LIST = useMemo(() => {
       // Get categories first
       const categories = getCategoriesFromLibrary(documentLibrary);
       // Sort based on the translated label (using t directly for now, ideally use specific keys)
       // Ensure t is defined before using it for sorting
       if (!t || typeof t !== 'function') { // Guard against t being undefined/not a function during initial renders/SSR
            return categories.sort((a, b) => a.label.localeCompare(b.label)); // Fallback sort
       }
       return categories.sort((a, b) => t(a.label).localeCompare(t(b.label)));
   }, [t]); // Depend on t to re-sort if language changes

  useEffect(() => {
    setIsHydrated(true); // Set hydration flag on client
  }, []);

  // Filtered categories based on search term
  const filteredCategories = useMemo(() => {
      if (!t || typeof t !== 'function') { // Ensure t exists before using
        return CATEGORY_LIST.filter(cat =>
           cat.label.toLowerCase().includes(categorySearch.toLowerCase())
        );
      }
      return CATEGORY_LIST.filter(cat =>
        t(cat.label).toLowerCase().includes(categorySearch.toLowerCase())
      );
  }, [CATEGORY_LIST, categorySearch, t]);


  // Documents filtered by selected category and document search term
  const docsInCategory = useMemo(() => {
     return documentLibrary.filter(doc =>
         doc.category === currentCategory && doc.id !== 'general-inquiry' && // Exclude general inquiry from listing
        (docSearch.trim() === '' ||
         (t && typeof t === 'function' ? t(doc.name).toLowerCase().includes(docSearch.toLowerCase()) : doc.name.toLowerCase().includes(docSearch.toLowerCase())) || // Use translated name if t exists
         (doc.aliases?.some(alias => alias.toLowerCase().includes(docSearch.toLowerCase())))) // Check aliases too
      );
  }, [currentCategory, docSearch, t]);


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
      const stateValue = value === "" ? "" : value; // Handle empty string for 'Select State'
      setSelectedState(stateValue);
      onStateChange(stateValue); // Notify parent
  };

   // Placeholders for SSR/initial hydration
   // Guard t usage
   const categoryPlaceholder = (t && typeof t === 'function') ? t('docTypeSelector.searchCategories', 'Search categories...') : 'Search categories...';
   const documentPlaceholder = (t && typeof t === 'function') ? t('docTypeSelector.searchPlaceholder', 'Search documents...') : 'Search documents...';
   const noCategoriesPlaceholder = (t && typeof t === 'function') ? t('docTypeSelector.noCategoriesFound', 'No categories match your search.') : 'No categories match your search.';
   const noDocumentsPlaceholder = (t && typeof t === 'function') ? t('docTypeSelector.noResults', 'No documents match your search in this category.') : 'No documents match your search in this category.';
   const statePlaceholder = (t && typeof t === 'function') ? t('stepOne.statePlaceholder', 'Select State...') : 'Select State...'; // Changed key to match stepOne

   // Show placeholder or nothing if not hydrated
   if (!isHydrated || !t || typeof t !== 'function') { // Check for t function availability as well
     return <div className="h-96 animate-pulse bg-muted rounded-lg shadow-lg border border-border"></div>; // Example placeholder
   }

  // Return statement starts directly - Ensure no hidden characters or syntax errors before this
  return (
    <div className="space-y-6">
      {view === 'categories' ? (
        <>
          {/* Title and Description */}
           <CardHeader className="p-0 mb-4"> {/* Add CardHeader styling consistency */}
               <div className="flex items-center space-x-2">
                  {/* Optionally add an icon */}
                  <FileText className="h-6 w-6 text-primary" />
                  <CardTitle className="text-2xl">{t('stepOne.selectDocDescription')}</CardTitle> {/* Use appropriate key */}
               </div>
                <CardDescription>{t('stepOne.categoryDescription')}</CardDescription> {/* Use appropriate key */}
           </CardHeader>

          {/* Category Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder={categoryPlaceholder}
              value={categorySearch}
              onChange={e => setCategorySearch(e.target.value)}
              className="w-full pl-10 bg-background" // Use theme background
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
                   className="h-auto min-h-[80px] p-4 border-border shadow-sm hover:shadow-md transition text-center flex flex-col justify-center items-center bg-card hover:bg-muted" // Use card/muted background
                 >
                   {/* Optional: Add an icon based on category key */}
                   {/* <Home className="h-6 w-6 mb-2 text-primary" /> */}
                   <span className="font-medium text-card-foreground text-sm">{t(cat.label)}</span>
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
              <ArrowLeft className="mr-2 h-4 w-4" /> {t('docTypeSelector.backToCategories')}
            </Button>
            {/* Title showing the current category - Corrected label lookup */}
             <h3 className="text-xl font-semibold">
                 {t(CATEGORY_LIST.find(c => c.key === currentCategory)?.label || currentCategory)}
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
                  className="w-full pl-10 bg-background" // Use theme background
                  aria-label={documentPlaceholder}
                />
             </div>
             <Select value={selectedState} onValueChange={handleStateSelection}>
                <SelectTrigger className="w-full bg-background"> {/* Use theme background */}
                    <SelectValue placeholder={statePlaceholder} />
                </SelectTrigger>
                <SelectContent>
                     <SelectItem value="">{statePlaceholder}</SelectItem>
                     {/* Use usStates array imported from library */}
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
                        className="shadow hover:shadow-lg cursor-pointer transition bg-card border-border hover:border-primary/50 flex flex-col" // Use theme card/border
                    >
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-semibold text-card-foreground">{t(doc.name)}</CardTitle> {/* Use theme card foreground */}
                        </CardHeader>
                        <CardContent className="text-xs text-muted-foreground flex-grow"> {/* Use theme muted foreground */}
                            {t(doc.description) || t('docTypeSelector.noDescription')}
                        </CardContent>
                        <CardFooter className="pt-2 pb-3 text-xs text-muted-foreground flex justify-between items-center border-t border-border mt-auto"> {/* Use theme muted foreground/border */}
                           <span>💲{doc.basePrice}</span>
                           <div className="flex gap-2">
                               {doc.requiresNotarization && <span title={t('docTypeSelector.requiresNotarization')}>📝</span>}
                               {doc.canBeRecorded && <span title={t('docTypeSelector.canBeRecorded')}>🏛️</span>}
                           </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
          ) : (
              <p className="text-muted-foreground italic text-center py-6">{noDocumentsPlaceholder}</p> {/* Use theme muted foreground */}
          )}
        </>
      )}
    </div>
  ); // End of the return statement
}

// Helper CSS class if needed (e.g., in globals.css)
/*
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
*/
