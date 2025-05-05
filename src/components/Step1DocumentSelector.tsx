// src/components/Step1DocumentSelector.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { documentLibrary, usStates, type LegalDocument } from "@/lib/document-library"; // Use usStates from library
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Import ShadCN Select components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, Search, Building, Briefcase, Home, Users, User, BookOpen, Handshake, GraduationCap, Landmark, ShieldQuestion, ScrollText } from "lucide-react"; // Added more icons

// Updated CATEGORY_LIST with more specific categories and icons
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


// Define the props expected by the component
interface Step1DocumentSelectorProps {
  selectedCategory: string | null;
  selectedState: string;
  onCategorySelect: (categoryKey: string | null) => void; // Allow null to go back
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
  const [categorySearch, setCategorySearch] = useState<string>('');
  const [docSearch, setDocSearch] = useState<string>('');
  const [isHydrated, setIsHydrated] = useState(false);

  // Fetch hydrated state
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Filtered categories based on search
  const filteredCategories = useMemo(() => {
    return CATEGORY_LIST.filter(cat =>
        (isHydrated && t ? t(cat.label, cat.label).toLowerCase() : cat.label.toLowerCase()).includes(categorySearch.toLowerCase())
    );
   // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categorySearch, t, i18n.language, isHydrated]);

  // Documents filtered by selected category and document search term
  const docsInCategory = useMemo(() => {
     if (!selectedCategory) return [];
     return documentLibrary.filter(doc =>
         doc.category === selectedCategory &&
         doc.id !== 'general-inquiry' &&
        (docSearch.trim() === '' ||
         (isHydrated && t ? t(doc.name, doc.name).toLowerCase().includes(docSearch.toLowerCase()) : doc.name.toLowerCase().includes(docSearch.toLowerCase())) ||
         (doc.aliases?.some(alias => alias.toLowerCase().includes(docSearch.toLowerCase()))))
      );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, docSearch, t, i18n.language, isHydrated]);

  const handleCategoryClick = (key: string) => {
    if (isReadOnly) return;
    onCategorySelect(key);
    setDocSearch(''); // Clear doc search when category changes
  };

  const handleBackToCategories = () => {
    if (isReadOnly) return;
    onCategorySelect(null); // Pass null to signal going back
    setCategorySearch(''); // Clear category search
    setDocSearch('');
  };

   // Placeholders for SSR/initial hydration
   const categoryPlaceholder = t('docTypeSelector.searchCategories', 'Search categories...');
   const documentPlaceholder = t('docTypeSelector.searchPlaceholder', 'Search documents...');
   const noDocumentsPlaceholder = t('docTypeSelector.noResults', 'No documents match your search in this category.');
   const statePlaceholder = t('stepOne.statePlaceholder', 'Select State...'); // Required now
   const stateLabel = t('stepOne.stateLabel', 'Relevant U.S. State'); // Updated label

  // Show loading state if not hydrated
  if (!isHydrated) {
    return <div className="h-96 animate-pulse bg-muted rounded-lg shadow-lg border border-border"></div>;
  }

  // Main return statement using Card component
  return (
     <Card className={`shadow-lg rounded-lg bg-card border border-border transition-opacity duration-500 ease-in-out ${isReadOnly ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'opacity-100'}`}>
        <CardHeader>
             {/* Header changes based on view */}
             {!selectedCategory ? (
                 <>
                     <div className="flex items-center space-x-2">
                        <FileText className="h-6 w-6 text-primary" />
                        <CardTitle className="text-2xl">{t('progressStepper.step1')}</CardTitle>
                     </div>
                     <CardDescription>{t('stepOne.categoryDescription')}</CardDescription>
                 </>
             ) : (
                 <div className="flex items-center justify-between">
                     <Button variant="outline" size="sm" onClick={handleBackToCategories} disabled={isReadOnly}>
                       <ArrowLeft className="mr-2 h-4 w-4" /> {t('docTypeSelector.backToCategories')}
                     </Button>
                      <h3 className="text-lg font-semibold text-muted-foreground">
                        {t(CATEGORY_LIST.find(c => c.key === selectedCategory)?.label || selectedCategory)}
                      </h3>
                 </div>
             )}
        </CardHeader>
        <CardContent className="space-y-6">
            {/* --- Category View --- */}
             {!selectedCategory ? (
                <div className="animate-fade-in space-y-4">
                    {/* Category Search */}
                    <div className="relative">
                         <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                         <Input
                            type="text"
                            placeholder={categoryPlaceholder}
                            value={categorySearch}
                            onChange={e => !isReadOnly && setCategorySearch(e.target.value)}
                            disabled={isReadOnly}
                            className={`w-full pl-10 ${isReadOnly ? 'bg-muted/50 border-dashed' : 'bg-background'}`}
                            aria-label={categoryPlaceholder}
                         />
                     </div>

                     {/* Category Grid */}
                     {filteredCategories.length > 0 ? (
                         <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                             {filteredCategories.map(cat => (
                                 <Button
                                     key={cat.key}
                                     variant="outline"
                                     onClick={() => handleCategoryClick(cat.key)}
                                     disabled={isReadOnly}
                                     className={`h-auto min-h-[90px] p-4 border-border shadow-sm hover:shadow-md transition text-center flex flex-col justify-center items-center bg-card hover:bg-muted ${isReadOnly ? 'cursor-not-allowed' : ''}`}
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
                 <div className="animate-fade-in space-y-4">
                    {/* Mandatory State Select */}
                     <Select
                       value={selectedState}
                       onValueChange={value => {
                           if (isReadOnly) return;
                           // Ensure value is not empty string before calling onStateSelect
                           if (value) {
                             onStateSelect(value);
                           }
                       }}
                       required
                       disabled={isReadOnly}
                     >
                        <SelectTrigger className={`w-full ${!selectedState ? 'text-muted-foreground' : ''} ${isReadOnly ? 'bg-muted/50 border-dashed' : 'bg-background'}`}>
                            <SelectValue placeholder={statePlaceholder} />
                        </SelectTrigger>
                        <SelectContent>
                            {/* No explicit placeholder item */}
                            {usStates.map(state => (
                               // Ensure state.value is never an empty string for SelectItem
                               <SelectItem key={state.value} value={state.value}>
                                 {state.label} ({state.value})
                               </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>


                     {/* Document Search (Conditional) */}
                     {selectedState && docsInCategory.length > 7 && ( // Show search only if state selected and many docs
                         <div className="relative">
                             <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                             <Input
                                type="text"
                                placeholder={documentPlaceholder}
                                value={docSearch}
                                onChange={e => !isReadOnly && setDocSearch(e.target.value)}
                                disabled={isReadOnly}
                                className={`w-full pl-10 ${isReadOnly ? 'bg-muted/50 border-dashed' : 'bg-background'}`}
                                aria-label={documentPlaceholder}
                             />
                         </div>
                     )}

                     {/* Document Grid (Show only if state is selected) */}
                      {selectedState && (
                         <>
                            {docsInCategory.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 animate-fade-in">
                                {docsInCategory.map(doc => (
                                    <Card
                                        key={doc.id}
                                        onClick={() => !isReadOnly && onDocumentSelect(doc)}
                                        className={`shadow hover:shadow-lg cursor-pointer transition bg-card border-border hover:border-primary/50 flex flex-col ${isReadOnly ? 'pointer-events-none' : ''}`}
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
