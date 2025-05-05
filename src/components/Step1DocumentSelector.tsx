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
   { key: 'Miscellaneous', label: 'General' } // Fallback
];

// Sort categories alphabetically by label for consistent display
// This needs to be done inside the component after `t` is available for translated sorting
// or sort keys directly if labels are simple enough not to need translation sorting

interface Step1DocumentSelectorProps {
  selectedCategory: string | null;
  selectedState: string;
  onCategorySelect: (categoryKey: string | null) => void;
  onStateSelect: (stateCode: string) => void;
  onDocumentSelect: (doc: LegalDocument) => void; // Change to pass the whole doc object
  setCurrentStep: (step: number) => void; // Add setCurrentStep prop
  isReadOnly?: boolean; // Keep isReadOnly
}

export default function Step1DocumentSelector({
  selectedCategory,
  selectedState,
  onCategorySelect,
  onStateSelect,
  onDocumentSelect,
  setCurrentStep, // Receive setCurrentStep
  isReadOnly = false
}: Step1DocumentSelectorProps) {
  const { t, i18n } = useTranslation();
  const [view, setView] = useState<'categories' | 'documents'>('categories');
  const [currentCategory, setCurrentCategory] = useState<string | null>(selectedCategory);
  // Removed category search state as per requirement
  const [docSearch, setDocSearch] = useState<string>('');
  const [internalState, setInternalState] = useState<string>(selectedState); // Internal state for the dropdown
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Sync internal states with prop changes
  useEffect(() => {
    setCurrentCategory(selectedCategory);
    setView(selectedCategory ? 'documents' : 'categories');
  }, [selectedCategory]);

   useEffect(() => {
    setInternalState(selectedState);
  }, [selectedState]);


  // Sort categories based on translated labels if hydrated
  const sortedCategories = useMemo(() => {
      if (!isHydrated) return CATEGORY_LIST; // Return unsorted during hydration
      return [...CATEGORY_LIST].sort((a, b) =>
         t(a.label, a.label).localeCompare(t(b.label, b.label), i18n.language)
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language, t, isHydrated]);


  // Documents filtered by selected category and document search term
  const docsInCategory = useMemo(() => {
    if (!currentCategory) return [];
    return documentLibrary.filter(doc =>
        doc.category === currentCategory &&
        doc.id !== 'general-inquiry'
     );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCategory]);

   // Further filter documents based on search query
  const filteredDocs = useMemo(() => {
      if (docSearch.trim() === '') return docsInCategory;
      return docsInCategory.filter(doc =>
         (isHydrated ? t(doc.name, doc.name) : doc.name).toLowerCase().includes(docSearch.toLowerCase()) ||
         (doc.aliases?.some(alias => alias.toLowerCase().includes(docSearch.toLowerCase())))
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docsInCategory, docSearch, t, i18n.language, isHydrated]);


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
    setDocSearch('');
    setView('categories');
  };

  const handleStateChange = (value: string) => {
      if (isReadOnly || !value || value === "_placeholder_") return;
      setInternalState(value); // Update internal dropdown state
      onStateSelect(value); // Inform parent
  }

  const handleDocSelect = (doc: LegalDocument) => {
    if (isReadOnly || !internalState) return; // State selection is now mandatory BEFORE doc selection

    onDocumentSelect(doc); // Pass the selected doc object

    // Auto-advance to Step 2 after a short delay for visual feedback
     setTimeout(() => {
        setCurrentStep(2);
        // Scrolling is handled in the parent component's useEffect
     }, 150);
  };


   // Placeholders for SSR/initial hydration
   const documentSearchPlaceholder = t('docTypeSelector.searchPlaceholder', 'Search documents...');
   const noDocumentsPlaceholder = t('docTypeSelector.noResults', 'No documents match your search in this category.');
   const statePlaceholder = t('stepOne.statePlaceholder', 'Select State...'); // Mandatory state prompt


  // Show loading state if not hydrated
  if (!isHydrated) {
    return <div className="h-96 animate-pulse bg-muted rounded-lg shadow-lg border border-border"></div>;
  }

  // Main return statement using Card component
  return (
     // Use step-card class for consistent padding/styling from globals.css
     <Card className={`step-card ${isReadOnly ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'opacity-100'}`}>
        <CardHeader className="step-card__header">
            {/* Use consistent header structure */}
             <div className="flex items-center space-x-2">
                <FileText className="h-6 w-6 text-primary" />
                 {/* Conditional Title based on view */}
                 <CardTitle className="step-card__title">
                    {view === 'categories'
                       ? t('Step 1: Select a Category') // Simplified title
                       : t('Select Document') // Changed title for document view
                     }
                 </CardTitle>
             </div>
             {/* Conditional Subtitle/Back Button */}
              {view === 'categories' ? (
                 <CardDescription className="step-card__subtitle">
                    {t('Choose the legal area that best fits your need.')}
                 </CardDescription>
             ) : (
                 <div className="flex items-center justify-between mt-2">
                     <Button variant="outline" size="sm" onClick={handleBackToCategories} disabled={isReadOnly}>
                       <ArrowLeft className="mr-2 h-4 w-4" /> {t('docTypeSelector.backToCategories')}
                     </Button>
                      <h3 className="text-lg font-semibold text-muted-foreground text-right">
                        {t(CATEGORY_LIST.find(c => c.key === currentCategory)?.label || currentCategory)}
                      </h3>
                 </div>
             )}
        </CardHeader>
        <CardContent className="step-content space-y-6"> {/* Use step-content class */}
            {/* --- Category View --- */}
             {view === 'categories' ? (
                <div className="animate-fade-in space-y-4">
                    {/* Category Search - Removed as per requirement */}
                    {/* Category Grid - Use category-grid class from globals.css */}
                     {sortedCategories.length > 0 ? (
                         <div className="category-grid pt-2">
                             {sortedCategories.map(cat => (
                                 <Button
                                     key={cat.key}
                                     variant="outline"
                                     onClick={() => handleCategoryClick(cat.key)}
                                     disabled={isReadOnly}
                                     className="category-card h-auto min-h-[90px] p-4 border-border shadow-sm hover:shadow-md transition text-center flex flex-col justify-center items-center bg-card hover:bg-muted active:scale-95 active:transition-transform active:duration-100" // Use category-card class
                                     style={{ minHeight: '56px' }} // Ensure min touch target
                                 >
                                      {/* Find the icon component dynamically */}
                                      {(() => {
                                         const IconComponent = CATEGORY_LIST.find(c => c.key === cat.key)?.icon || FileText; // Fallback icon
                                         return <IconComponent className="h-6 w-6 mb-2 text-primary/80" />;
                                      })()}
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
                    <div className="mb-4">
                        <Label htmlFor="state-select-step1" className="block text-sm font-medium text-gray-700 mb-1">
                           {t('stepOne.stateLabel', 'Relevant U.S. State')} <span className="text-destructive">*</span> {/* Mark as required */}
                        </Label>
                        <Select
                          value={internalState}
                          onValueChange={handleStateChange} // Use internal handler
                          required // Mark as required
                          disabled={isReadOnly}
                          name="state-select-step1" // Unique name
                        >
                           <SelectTrigger id="state-select-step1" className={`w-full text-base md:text-sm ${!internalState ? 'text-muted-foreground' : ''} ${isReadOnly ? 'bg-muted/50 border-dashed' : 'bg-background'}`} style={{ minHeight: '44px' }}>
                               <SelectValue placeholder={statePlaceholder} />
                           </SelectTrigger>
                           <SelectContent>
                               {/* Placeholder Item - ensure it has a non-empty value */}
                               <SelectItem value="_placeholder_" disabled>{statePlaceholder}</SelectItem>
                               {usStates.map(state => (
                                  <SelectItem key={state.value} value={state.value}>
                                    {t(state.label, state.label)} ({state.value}) {/* Translate state name */}
                                  </SelectItem>
                               ))}
                           </SelectContent>
                       </Select>
                        <p className="text-xs text-muted-foreground mt-1">{t('stepOne.stateHelp', 'Helps tailor the document to your jurisdiction.')}</p>
                     </div>


                     {/* Document Search (Conditional on > 7 docs) */}
                     {docsInCategory.length > 7 && internalState && ( // Show only if state selected & many docs
                         <div className="relative mb-4">
                             <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                             <Input
                                type="text"
                                placeholder={documentSearchPlaceholder}
                                value={docSearch}
                                onChange={e => !isReadOnly && setDocSearch(e.target.value)}
                                disabled={isReadOnly || !internalState} // Disable if state not selected
                                className={`w-full pl-10 text-base md:text-sm ${isReadOnly || !internalState ? 'bg-muted/50 border-dashed cursor-not-allowed' : 'bg-background'}`}
                                aria-label={documentSearchPlaceholder}
                             />
                         </div>
                     )}

                     {/* Document Grid (Show only if state is selected) */}
                      {internalState ? ( // Render grid only when state is selected
                         <>
                            {filteredDocs.length > 0 ? (
                                // Use document-grid class from globals.css
                                <div className="document-grid pt-4 animate-fade-in">
                                {filteredDocs.map(doc => (
                                    <Card
                                        key={doc.id}
                                        onClick={() => handleDocSelect(doc)} // Pass the whole doc object
                                        className={`document-card shadow hover:shadow-lg cursor-pointer transition bg-card border-border hover:border-primary/50 flex flex-col active:scale-95 active:transition-transform active:duration-100 ${isReadOnly ? 'pointer-events-none' : ''}`} // Use document-card class
                                         style={{ minHeight: '56px' }} // Ensure min touch target
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
                      ) : (
                         // Prompt to select state if not yet selected
                         <p className="text-muted-foreground italic text-center py-6">{t('Please select a state first.')}</p>
                      )}
                 </div>
             )}

        </CardContent>
     </Card>
  );
}
