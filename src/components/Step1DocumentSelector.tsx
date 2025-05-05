// src/components/Step1DocumentSelector.tsx
"use client";

import React, { useState, useEffect } from "react"; // Ensure useEffect is imported if needed
import { useTranslation } from "react-i18next";
import { documentLibrary, usStates } from "@/lib/document-library";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, Search } from "lucide-react";

// User-friendly category definitions derived from the library or predefined
const CATEGORY_LIST = [
  { key: 'Finance', label: 'Finance' },
  { key: 'Business', label: 'Business' },
  { key: 'Real Estate', label: 'Real Estate' },
  { key: 'Family', label: 'Family' },
  { key: 'Personal', label: 'Personal' }, // Adjusted from "Personal Affairs" for consistency
  { key: 'Estate Planning', label: 'Estate Planning' },
  { key: 'Employment', label: 'Employment' }, // Added from library
  { key: 'Court & Litigation', label: 'Litigation' }, // Added from library
  { key: 'Immigration', label: 'Immigration' }, // Added from library
  { key: 'Miscellaneous', label: 'General' }, // Adjusted from "General Legal" etc.
].sort((a, b) => a.label.localeCompare(b.label)); // Sort alphabetically

// Define the props expected by the component
interface Step1DocumentSelectorProps {
  onDocumentSelect: (doc: any) => void; // Function called when a document is selected
  onStateChange: (state: string) => void; // Function called when state selection changes
}


export default function Step1DocumentSelector({ onDocumentSelect, onStateChange }: Step1DocumentSelectorProps) {
  const { t } = useTranslation();
  const [view, setView] = useState<'categories' | 'documents'>('categories');
  const [currentCategory, setCurrentCategory] = useState<string>('');
  const [categorySearch, setCategorySearch] = useState<string>('');
  const [docSearch, setDocSearch] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true); // Set hydration flag on client
  }, []);

  // Filtered categories based on search term
  const filteredCategories = CATEGORY_LIST.filter(cat =>
    t(cat.label).toLowerCase().includes(categorySearch.toLowerCase())
  );

  // Documents filtered by selected category and document search term
  const docsInCategory = documentLibrary.filter(doc =>
     doc.category === currentCategory && doc.id !== 'general-inquiry' && // Exclude general inquiry from listing
    (docSearch.trim() === '' || t(doc.name).toLowerCase().includes(docSearch.toLowerCase()) || doc.aliases?.some(alias => alias.toLowerCase().includes(docSearch.toLowerCase())) )
  );

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
   const categoryPlaceholder = t('docTypeSelector.searchCategories', 'Search categories...');
   const documentPlaceholder = t('docTypeSelector.searchPlaceholder', 'Search documents...');
   const noCategoriesPlaceholder = t('docTypeSelector.noCategoriesFound', 'No categories match your search.');
   const noDocumentsPlaceholder = t('docTypeSelector.noResults', 'No documents match your search in this category.');
   const statePlaceholder = t('docTypeSelector.statePlaceholder', 'Select State...');


  return (
    <div className="space-y-6">
      {view === 'categories' ? (
        <>
          {/* Category Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder={isHydrated ? categoryPlaceholder : 'Loading...'}
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
                   {/* Optional: Add an icon based on category key */}
                   {/* <Home className="h-6 w-6 mb-2 text-primary" /> */}
                   <span className="font-medium text-card-foreground text-sm">{isHydrated ? t(cat.label) : '...'}</span>
                 </Button>
              ))}
            </div>
          ) : (
             <p className="text-muted-foreground italic text-center py-4">{isHydrated ? noCategoriesPlaceholder : 'Loading...'}</p>
          )}
        </>
      ) : (
        <>
          {/* Back Button & Title */}
          <div className="flex items-center justify-between mb-4">
            <Button variant="outline" size="sm" onClick={goBack}>
              <ArrowLeft className="mr-2 h-4 w-4" /> {isHydrated ? t('docTypeSelector.backToCategories') : '...'}
            </Button>
            {/* Title showing the current category */}
            {/* <h3 className="text-lg font-semibold text-muted-foreground">{t(CATEGORY_LIST.find(c => c.key === currentCategory)?.label || currentCategory)}</h3> */}
          </div>

          {/* Document Search & State Select */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={isHydrated ? documentPlaceholder : 'Loading...'}
                  value={docSearch}
                  onChange={e => setDocSearch(e.target.value)}
                  className="w-full pl-10 bg-background"
                  aria-label={documentPlaceholder}
                />
             </div>
             <Select value={selectedState} onValueChange={handleStateSelection}>
                <SelectTrigger className="w-full bg-background">
                    <SelectValue placeholder={isHydrated ? statePlaceholder : 'Loading...'} />
                </SelectTrigger>
                <SelectContent>
                     <SelectItem value="">{isHydrated ? statePlaceholder : 'Loading...'}</SelectItem>
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
                            <CardTitle className="text-base font-semibold text-card-foreground">{isHydrated ? t(doc.name) : '...'}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs text-muted-foreground flex-grow">
                            {isHydrated ? t(doc.description) || t('docTypeSelector.noDescription') : '...'}
                        </CardContent>
                        <CardFooter className="pt-2 pb-3 text-xs text-muted-foreground flex justify-between items-center border-t border-border mt-auto">
                           <span>💲{doc.basePrice}</span>
                           <div className="flex gap-2">
                               {doc.requiresNotarization && <span title={isHydrated ? t('docTypeSelector.requiresNotarization') : ''}>📝</span>}
                               {doc.canBeRecorded && <span title={isHydrated ? t('docTypeSelector.canBeRecorded') : ''}>🏛️</span>}
                           </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
          ) : (
              <p className="text-muted-foreground italic text-center py-6">{isHydrated ? noDocumentsPlaceholder : 'Loading...'}</p>
          )}
        </>
      )}
    </div>
  );
}
