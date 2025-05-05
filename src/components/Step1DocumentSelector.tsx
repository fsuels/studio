// src/components/Step1DocumentSelector.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { documentLibrary, usStates, type LegalDocument } from "@/lib/document-library";
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
import { ArrowLeft, FileText, Search, Landmark, Briefcase, Home, Users, User, ScrollText, Handshake, ShieldQuestion, GraduationCap } from "lucide-react"; // Import icons

// User-friendly category definitions with icons
const CATEGORY_LIST = [
  { key: 'Finance', label: 'Finance', icon: Landmark },
  { key: 'Business', label: 'Business', icon: Briefcase },
  { key: 'Real Estate', label: 'Real Estate', icon: Home },
  { key: 'Family', label: 'Family', icon: Users },
  { key: 'Personal', label: 'Personal', icon: User },
  { key: 'Estate Planning', label: 'Estate Planning', icon: ScrollText },
  { key: 'Contracts & Agreements', label: 'Contracts', icon: Handshake },
  { key: 'Litigation', label: 'Litigation', icon: ShieldQuestion },
  { key: 'Employment', label: 'Employment', icon: GraduationCap },
  // Add other relevant categories like Immigration, Education, etc.
];

// Sort categories alphabetically by label for consistent display
CATEGORY_LIST.sort((a, b) => a.label.localeCompare(b.label));


interface Step1DocumentSelectorProps {
  selectedCategory: string | null;
  selectedState: string;
  onCategorySelect: (categoryKey: string | null) => void;
  onStateSelect: (stateCode: string) => void;
  onDocumentSelect: (doc: LegalDocument) => void;
  isReadOnly?: boolean;
}

export default function Step1DocumentSelector({
  selectedCategory,
  selectedState,
  onCategorySelect,
  onStateSelect,
  onDocumentSelect,
  isReadOnly = false
}: Step1DocumentSelectorProps) {
  const { t, i18n } = useTranslation();
  const [view, setView] = useState<'categories' | 'documents'>('categories');
  const [currentCategory, setCurrentCategory] = useState<string | null>(selectedCategory);
  const [categorySearch, setCategorySearch] = useState<string>('');
  const [docSearch, setDocSearch] = useState<string>('');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Sync internal state with prop changes (e.g., if parent resets selection)
  useEffect(() => {
    setCurrentCategory(selectedCategory);
    setView(selectedCategory ? 'documents' : 'categories');
  }, [selectedCategory]);


  // Filtered categories based on search
  const filteredCategories = useMemo(() => {
    return CATEGORY_LIST.filter(cat =>
      (isHydrated ? t(cat.label, cat.label) : cat.label).toLowerCase().includes(categorySearch.toLowerCase())
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categorySearch, t, i18n.language, isHydrated]);


  // Documents filtered by selected category and document search term
  const docsInCategory = useMemo(() => {
    if (!currentCategory) return [];
    return documentLibrary.filter(doc =>
        doc.category === currentCategory &&
        doc.id !== 'general-inquiry' &&
       (docSearch.trim() === '' ||
        (isHydrated ? t(doc.name, doc.name) : doc.name).toLowerCase().includes(docSearch.toLowerCase()) ||
        (doc.aliases?.some(alias => alias.toLowerCase().includes(docSearch.toLowerCase()))))
     );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCategory, docSearch, t, i18n.language, isHydrated]);


  const handleCategoryClick = (key: string) => {
    if (isReadOnly) return;
    onCategorySelect(key); // Inform parent
    setCurrentCategory(key); // Update internal state
    setDocSearch('');
    setView('documents');
  };

  const handleBackToCategories = () => {
    if (isReadOnly) return;
    onCategorySelect(null); // Inform parent
    setCurrentCategory(null); // Update internal state
    setCategorySearch('');
    setDocSearch('');
    setView('categories');
  };

  const handleDocSelect = (doc: LegalDocument) => {
    if (isReadOnly || !selectedState) return; // Require state before doc selection
    onDocumentSelect(doc);
    // Auto-advance is handled by parent component's useEffect
  };


   // Placeholders for SSR/initial hydration
   const categorySearchPlaceholder = t('docTypeSelector.searchCategories', 'Search categories...');
   const documentSearchPlaceholder = t('docTypeSelector.searchPlaceholder', 'Search documents...');
   const noDocumentsPlaceholder = t('docTypeSelector.noResults', 'No documents match your search in this category.');
   const statePlaceholder = t('stepOne.statePlaceholder', 'Select State...');
   const stateLabel = t('stepOne.stateLabel', 'Relevant U.S. State');


  // Show loading state if not hydrated
  if (!isHydrated) {
    return <div className="h-96 animate-pulse bg-muted rounded-lg shadow-lg border border-border"></div>;
  }

  // Main return statement using Card component
  return (
     <Card className={`shadow-lg rounded-lg bg-card border border-border transition-opacity duration-500 ease-in-out step-card ${isReadOnly ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'opacity-100'}`}>
        <CardHeader className="step-card__header">
             {/* Header changes based on view */}
             {!currentCategory ? (
                 <>
                     <div className="flex items-center space-x-2">
                        <FileText className="h-6 w-6 text-primary" />
                         {/* Use translated keys for title/subtitle */}
                         <CardTitle className="text-xl sm:text-2xl step-card__title">{t('progressStepper.step1', 'Select Document')}</CardTitle>
                     </div>
                     <CardDescription className="step-card__subtitle">{t('stepOne.categoryDescription', 'Choose the legal area that best fits your need.')}</CardDescription>
                 </>
             ) : (
                 <div className="flex items-center justify-between">
                     <Button variant="outline" size="sm" onClick={handleBackToCategories} disabled={isReadOnly}>
                       <ArrowLeft className="mr-2 h-4 w-4" /> {t('docTypeSelector.backToCategories')}
                     </Button>
                      <h3 className="text-lg font-semibold text-muted-foreground text-right">
                        {t(CATEGORY_LIST.find(c => c.key === currentCategory)?.label || currentCategory)}
                      </h3>
                 </div>
             )}
        </CardHeader>
        <CardContent className="space-y-6">
            {/* --- Category View --- */}
             {view === 'categories' ? (
                <div className="animate-fade-in space-y-4">
                    {/* Category Search */}
                     {CATEGORY_LIST.length > 7 && ( // Only show search if many categories
                         <div className="relative">
                             <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                             <Input
                                type="text"
                                placeholder={categorySearchPlaceholder}
                                value={categorySearch}
                                onChange={e => !isReadOnly && setCategorySearch(e.target.value)}
                                disabled={isReadOnly}
                                className={`w-full pl-10 mb-4 ${isReadOnly ? 'bg-muted/50 border-dashed' : 'bg-background'}`}
                                aria-label={categorySearchPlaceholder}
                             />
                         </div>
                     )}

                     {/* Category Grid */}
                     {filteredCategories.length > 0 ? (
                         <div className="category-grid pt-2">
                             {filteredCategories.map(cat => (
                                 <Button
                                     key={cat.key}
                                     variant="outline"
                                     onClick={() => handleCategoryClick(cat.key)}
                                     disabled={isReadOnly}
                                     className={`h-auto min-h-[90px] p-4 border-border shadow-sm hover:shadow-md transition text-center flex flex-col justify-center items-center bg-card hover:bg-muted category-card active:scale-95 active:transition-transform active:duration-100 ${isReadOnly ? 'cursor-not-allowed' : ''}`}
                                     style={{ minHeight: '44px' }} // Ensure min touch target
                                 >
                                     <cat.icon className="h-6 w-6 mb-2 text-primary/80" />
                                     <span className="font-medium text-card-foreground text-sm">{t(cat.label, cat.label)}</span>
                                 </Button>
                             ))}
                         </div>
                     ) : (
                         <p className="text-muted-foreground italic text-center py-6">{t('docTypeSelector.noCategoriesFound')}</p>
                     )}
                </div>
             ) : (
                 // --- Document View ---
                 <div className="animate-fade-in space-y-6">
                    {/* Mandatory State Select */}
                    <div className="mb-4"> {/* Added margin-bottom */}
                        <Select
                          value={selectedState}
                          onValueChange={value => {
                              if (isReadOnly || !value || value === "_placeholder_") return;
                              onStateSelect(value);
                          }}
                          required
                          disabled={isReadOnly}
                          name="state" // Add name for forms
                        >
                           <SelectTrigger className={`w-full text-base md:text-sm ${!selectedState ? 'text-muted-foreground' : ''} ${isReadOnly ? 'bg-muted/50 border-dashed' : 'bg-background'}`} style={{ minHeight: '44px' }}>
                               <SelectValue placeholder={statePlaceholder} />
                           </SelectTrigger>
                           <SelectContent>
                               {/* Placeholder Item - ensure it has a non-empty value */}
                               <SelectItem value="_placeholder_" disabled>{statePlaceholder}</SelectItem>
                               {usStates.map(state => (
                                  <SelectItem key={state.value} value={state.value}>
                                    {state.label} ({state.value})
                                  </SelectItem>
                               ))}
                           </SelectContent>
                       </Select>
                        <p className="text-xs text-muted-foreground mt-1">{t('stepOne.stateHelp', 'Helps tailor the document to your jurisdiction.')}</p>
                     </div>


                     {/* Document Search (Conditional) */}
                     {docsInCategory.length > 7 && selectedState && ( // Show only if state selected & many docs
                         <div className="relative mb-4"> {/* Added margin-bottom */}
                             <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                             <Input
                                type="text"
                                placeholder={documentSearchPlaceholder}
                                value={docSearch}
                                onChange={e => !isReadOnly && setDocSearch(e.target.value)}
                                disabled={isReadOnly}
                                className={`w-full pl-10 text-base md:text-sm ${isReadOnly ? 'bg-muted/50 border-dashed' : 'bg-background'}`}
                                aria-label={documentSearchPlaceholder}
                             />
                         </div>
                     )}

                     {/* Document Grid (Show only if state is selected) */}
                      {selectedState && (
                         <>
                            {docsInCategory.length > 0 ? (
                                <div className="document-grid pt-4 animate-fade-in">
                                {docsInCategory.map(doc => (
                                    <Card
                                        key={doc.id}
                                        onClick={() => handleDocSelect(doc)}
                                        className={`shadow hover:shadow-lg cursor-pointer transition bg-card border-border hover:border-primary/50 flex flex-col document-card active:scale-95 active:transition-transform active:duration-100 ${isReadOnly ? 'pointer-events-none' : ''}`}
                                         style={{ minHeight: '44px' }} // Ensure min touch target
                                    >
                                        <CardHeader className="pb-2 pt-4 px-4">
                                            <CardTitle className="text-base font-semibold text-card-foreground">{t(doc.name, doc.name)}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="text-xs text-muted-foreground flex-grow px-4">
                                            {t(doc.description, doc.description) || t('docTypeSelector.noDescription', 'No description available.')}
                                        </CardContent>
                                        <CardFooter className="pt-2 pb-3 px-4 text-xs text-muted-foreground flex justify-between items-center border-t border-border mt-auto">
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
                                <p className="text-muted-foreground italic text-center py-6">{noDocumentsPlaceholder}</p>
                            )}
                         </>
                      )}
                 </div>
             )}

        </CardContent>
        {/* Footer can be added if needed */}
        {/* <CardFooter> ... </CardFooter> */}
     </Card>
  );
}
