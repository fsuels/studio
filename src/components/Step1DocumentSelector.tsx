'use client';

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
import { Label } from "@/components/ui/label"; //Import Label component

// User-friendly category definitions with icons
// Reverted to original categories from documentLibrary
const CATEGORY_LIST = [
  { key: 'Finance', label: 'Finance', icon: Landmark },
  { key: 'Business', label: 'Business', icon: Briefcase },
  { key: 'Real Estate', label: 'Real Estate', icon: Home },
  { key: 'Family', label: 'Family', icon: Users },
  { key: 'Personal', label: 'Personal', icon: User }, // Combined Personal & Family
  { key: 'Estate Planning', label: 'Estate Planning', icon: ScrollText },
  { key: 'Transactions', label: 'Transactions', icon: Handshake }, // Added Transactions
  // { key: 'Contracts & Agreements', label: 'Contracts', icon: Handshake }, // Keeping this broader one or use Transactions?
  // { key: 'Court & Litigation', label: 'Litigation', icon: ShieldQuestion }, // Kept this
  { key: 'Miscellaneous', label: 'General' }, // Fallback / Misc
  // { key: 'Identification & Immigration', label: 'Identification & Immigration' }, // Added category
  // { key: 'Employment & Labor', label: 'Employment & Labor' } // Added category
];


interface Step1DocumentSelectorProps {
  selectedCategory: string | null;
  selectedState: string;
  onCategorySelect: (categoryKey: string | null) => void;
  onStateSelect: (stateCode: string) => void;
  onDocumentSelect: (doc: LegalDocument) => void; // Change to pass the whole doc object
  // setCurrentStep: (step: number) => void; // Receive setCurrentStep - REMOVED, handled in parent
  isReadOnly?: boolean; // Keep isReadOnly
}

export default function Step1DocumentSelector({
  selectedCategory,
  selectedState,
  onCategorySelect,
  onStateSelect,
  onDocumentSelect,
  // setCurrentStep, // Removed
  isReadOnly = false
}: Step1DocumentSelectorProps) {
  const { t, i18n } = useTranslation();
  const [view, setView] = useState<'categories' | 'documents'>('categories'); // Corrected useState typing
  const [currentCategory, setCurrentCategory] = useState<string | null>(selectedCategory);
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


  const sortedCategories = useMemo(() => {
       const uniqueCategoriesMap = new Map<string, { key: string, label: string, icon: React.ElementType }>();
       documentLibrary.forEach(doc => {
           if (doc.id !== 'general-inquiry' && !uniqueCategoriesMap.has(doc.category)) {
               const categoryInfo = CATEGORY_LIST.find(c => c.key === doc.category) || { key: doc.category, label: doc.category, icon: FileText };
               uniqueCategoriesMap.set(doc.category, categoryInfo);
           }
       });
       const uniqueCategories = Array.from(uniqueCategoriesMap.values());

      if (!isHydrated) return uniqueCategories; // Return unsorted during hydration
      return [...uniqueCategories].sort((a, b) =>
         t(a.label, a.label).localeCompare(t(b.label, b.label), i18n.language)
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated, i18n.language, t]);


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
      const lowerSearch = docSearch.toLowerCase();
      return docsInCategory.filter(doc =>
         (isHydrated ? t(doc.name, doc.name) : doc.name).toLowerCase().includes(lowerSearch) ||
         (doc.aliases?.some(alias => alias.toLowerCase().includes(lowerSearch))) ||
         (languageSupportsSpanish(doc.languageSupport) && doc.aliases_es?.some(alias => alias.toLowerCase().includes(lowerSearch))) || // Check Spanish aliases
         (isHydrated && languageSupportsSpanish(doc.languageSupport) && doc.name_es && t(doc.name_es, doc.name_es).toLowerCase().includes(lowerSearch)) // Check Spanish name
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docsInCategory, docSearch, t, i18n.language, isHydrated]);

  // Helper function to check if Spanish is supported
   const languageSupportsSpanish = (support: string[]): boolean => support.includes('es');


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
       // Use '_placeholder_' or similar non-empty value for the placeholder item
       const actualValue = value === '_placeholder_' ? '' : value;
       if (isReadOnly) return;
       setInternalState(actualValue); // Update internal dropdown state
       onStateSelect(actualValue); // Inform parent
  }

  const handleDocSelect = (doc: LegalDocument) => {
    if (isReadOnly || !internalState) return; // State selection is now mandatory BEFORE doc selection

    onDocumentSelect(doc); // Pass the selected doc object

    // Auto-advance handled by parent component's useEffect based on selectedDoc change
     /*
     setTimeout(() => {
        setCurrentStep(2); // Removed - parent handles this
     }, 150);
     */
  };


   // Placeholders for SSR/initial hydration
   const documentSearchPlaceholder = t('docTypeSelector.searchPlaceholder', 'Search documents...');
   const noDocumentsPlaceholder = t('docTypeSelector.noResults', 'No documents found for your criteria.');
   const statePlaceholder = t('stepOne.statePlaceholder', 'Select State...'); // Mandatory state prompt
   const categorySearchPlaceholder = t('docTypeSelector.searchCategories', 'Search categories...');


  // Show loading state if not hydrated
  if (!isHydrated) {
    return <div className="h-96 animate-pulse bg-muted rounded-lg shadow-lg border border-border"></div>;
  }

  // Main return statement using Card component
  // Use step-card class for consistent padding/styling from globals.css
  return (
     <Card className={`step-card ${isReadOnly ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'opacity-100'}`}>
        <CardHeader className="step-card__header">
            {/* Use consistent header structure */}
             <div className="flex items-center space-x-2">
                <FileText className="h-6 w-6 text-primary" />
                 {/* Conditional Title based on view */}
                 <CardTitle className="step-card__title">
                    {view === 'categories'
                       ? t('stepOne.categoryDescription') // Use i18n key for title
                       : t('stepOne.selectDocDescription') // Use i18n key for title
                     }
                 </CardTitle>
             </div>
             {/* Conditional Subtitle/Back Button */}
              {view === 'categories' ? (
                null // No subtitle needed here, title covers it
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
                     {/* Category Search (Show only if > 7 categories) */}
                     {sortedCategories.length > 7 && (
                          <div className="relative mb-4">
                               <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                               <Input
                                  type="text"
                                  placeholder={categorySearchPlaceholder}
                                  value={docSearch} // Use docSearch state temporarily, maybe rename state?
                                  onChange={e => !isReadOnly && setDocSearch(e.target.value)}
                                  disabled={isReadOnly}
                                  className={`w-full pl-10 text-base md:text-sm ${isReadOnly ? 'bg-muted/50 border-dashed cursor-not-allowed' : 'bg-background'}`}
                                  aria-label={categorySearchPlaceholder}
                               />
                          </div>
                     )}

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
                                         const IconComponent = cat.icon || FileText; // Use category icon or fallback
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
                        <Label htmlFor="state-select-step1" className="block text-sm font-medium text-foreground mb-1"> {/* Changed text-gray-700 to text-foreground */}
                           {t('stepOne.stateLabel', 'Relevant U.S. State')} <span className="text-destructive">*</span> {/* Mark as required */}
                        </Label>
                        <Select
                          value={internalState || '_placeholder_'} // Use placeholder value if internalState is empty
                          onValueChange={handleStateChange} // Use internal handler
                          required // Mark as required
                          disabled={isReadOnly}
                          name="state-select-step1" // Unique name
                        >
                           <SelectTrigger id="state-select-step1" className={`w-full text-base md:text-sm ${!internalState ? 'text-muted-foreground' : ''} ${isReadOnly ? 'bg-muted/50 border-dashed' : 'bg-background'}`} style={{ minHeight: '44px' }}>
                               <SelectValue placeholder={statePlaceholder} />
                           </SelectTrigger>
                           <SelectContent>
                               {/* Placeholder Item - Use a specific, non-empty value */}
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


                     {/* Document Search (Conditional on > 7 docs and state selected) */}
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
                                        className={`document-card shadow hover:shadow-lg cursor-pointer transition bg-card border border-border flex flex-col active:scale-95 active:transition-transform active:duration-100 ${isReadOnly ? 'pointer-events-none' : ''}`} // Use document-card class
                                         style={{ minHeight: '56px' }} // Ensure min touch target
                                    >
                                        <CardHeader className="pb-2 pt-4 px-4">
                                             {/* Translate document name, fallback to English */}
                                             <CardTitle className="text-base font-semibold text-card-foreground">
                                                 {i18n.language === 'es' && doc.name_es ? t(doc.name_es, doc.name) : t(doc.name, doc.name)}
                                             </CardTitle>
                                        </CardHeader>
                                        <CardContent className="text-xs text-muted-foreground flex-grow px-4">
                                            {/* Translate description, fallback to English */}
                                            {i18n.language === 'es' && doc.description_es ? t(doc.description_es, doc.description) : t(doc.description, doc.description) || t('docTypeSelector.noDescription', 'No description available.')}
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
