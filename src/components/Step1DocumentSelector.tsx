// src/components/Step1DocumentSelector.tsx
'use client';

import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { documentLibrary, usStates, type LegalDocument } from "@/lib/document-library";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, Search, Landmark, Briefcase, Home, Users, User, ScrollText, Handshake, ShieldQuestion, GraduationCap, FileIcon as PaperIcon, Loader2 } from "lucide-react"; 
import { track } from "@/lib/analytics";
import { useToast } from "@/hooks/use-toast";

// User-friendly category definitions with icons
const CATEGORY_LIST = [
  { key: 'Finance', labelKey: 'Finance', icon: Landmark },
  { key: 'Business', labelKey: 'Business', icon: Briefcase },
  { key: 'Real Estate', labelKey: 'Real Estate', icon: Home },
  { key: 'Family', labelKey: 'Family', icon: Users },
  { key: 'Personal', labelKey: 'Personal', icon: User },
  { key: 'Estate Planning', labelKey: 'Estate Planning', icon: ScrollText },
  { key: 'Miscellaneous', labelKey: 'General', icon: FileText }, 
];


interface Step1DocumentSelectorProps {
  selectedCategory: string | null; // Prop to externally set/get category
  onCategorySelect: (categoryKey: string | null) => void; // Callback for category selection
  onDocumentSelect: (doc: LegalDocument) => void;
  isReadOnly?: boolean;
  globalSearchTerm: string; 
  globalSelectedState: string; 
}

export default function Step1DocumentSelector({
  selectedCategory, // Use this to reflect externally controlled category
  onCategorySelect, // Use this to inform parent of category selection
  onDocumentSelect,
  isReadOnly = false,
  globalSearchTerm,
  globalSelectedState
}: Step1DocumentSelectorProps) {
  const { t, i18n } = useTranslation();
  // Local view controls what to show IF NOT doing a global search
  const [view, setView] = useState<'categories' | 'documents'>(selectedCategory ? 'documents' : 'categories');
  // Local document search, active only when in 'documents' view and no global search
  const [docSearch, setDocSearch] = useState<string>(''); 
  const [isHydrated, setIsHydrated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // If a category is passed via prop, set the view accordingly
  useEffect(() => {
    if (selectedCategory) {
      setView('documents');
    } else if (!globalSearchTerm.trim()) { // Only switch to categories if not in global search
      setView('categories');
    }
  }, [selectedCategory, globalSearchTerm]);


  const sortedCategories = useMemo(() => {
       const uniqueCategoriesMap = new Map<string, { key: string, labelKey: string, icon: React.ElementType }>();
       CATEGORY_LIST.forEach(catInfo => {
           if (!uniqueCategoriesMap.has(catInfo.key)) {
               uniqueCategoriesMap.set(catInfo.key, catInfo);
           }
       });
       const uniqueCategories = Array.from(uniqueCategoriesMap.values());

      if (!isHydrated) return uniqueCategories; 
      return [...uniqueCategories].sort((a, b) =>
         t(a.labelKey, a.key).localeCompare(t(b.labelKey, b.key), i18n.language)
      );
  }, [isHydrated, i18n.language, t]); 


  const languageSupportsSpanish = (support: string[] | undefined): boolean => !!support && support.includes('es');

  const documentsToDisplay = useMemo(() => {
    let docs = [...documentLibrary]; 
    if (!isHydrated) return [];

    // 1. Global Search Filter (applied first if globalSearchTerm is active)
    if (globalSearchTerm.trim() !== '') {
      const lowerGlobalSearch = globalSearchTerm.toLowerCase();
      docs = docs.filter(doc =>
        (t(doc.name, doc.name)).toLowerCase().includes(lowerGlobalSearch) ||
        (doc.aliases?.some(alias => alias.toLowerCase().includes(lowerGlobalSearch))) ||
        (languageSupportsSpanish(doc.languageSupport) && doc.aliases_es?.some(alias => alias.toLowerCase().includes(lowerGlobalSearch))) ||
        (languageSupportsSpanish(doc.languageSupport) && doc.name_es && t(doc.name_es, doc.name_es).toLowerCase().includes(lowerGlobalSearch)) ||
        (t(doc.description, doc.description)).toLowerCase().includes(lowerGlobalSearch) ||
        (languageSupportsSpanish(doc.languageSupport) && doc.description_es && t(doc.description_es, doc.description_es).toLowerCase().includes(lowerGlobalSearch))
      );
    } else {
      // 2. Category Filter (only if NO global search AND a category is selected via prop)
      if (selectedCategory) {
        docs = docs.filter(doc => doc.category === selectedCategory);
      }
      // 3. Local Document Search (only if NO global search AND in 'documents' view AND docSearch is active)
      if (view === 'documents' && docSearch.trim() !== '') {
          const lowerDocSearch = docSearch.toLowerCase();
          docs = docs.filter(doc =>
              (t(doc.name, doc.name)).toLowerCase().includes(lowerDocSearch) ||
              (doc.aliases?.some(alias => alias.toLowerCase().includes(lowerDocSearch))) ||
              (languageSupportsSpanish(doc.languageSupport) && doc.aliases_es?.some(alias => alias.toLowerCase().includes(lowerDocSearch))) ||
              (languageSupportsSpanish(doc.languageSupport) && doc.name_es && t(doc.name_es, doc.name_es).toLowerCase().includes(lowerDocSearch))
          );
      }
    }
    
    // 4. Always apply State Filter
    if (globalSelectedState && globalSelectedState !== 'all') {
        docs = docs.filter(doc => doc.states === 'all' || (Array.isArray(doc.states) && doc.states.includes(globalSelectedState)));
    }
    
    return docs.filter(doc => doc.id !== 'general-inquiry');
  }, [selectedCategory, docSearch, globalSearchTerm, globalSelectedState, view, t, i18n.language, isHydrated]);


  const handleCategoryClick = (key: string) => {
    if (isReadOnly || !isHydrated) return;
    onCategorySelect(key); // Inform parent about category selection
    setDocSearch(''); // Reset local doc search when category changes
    // View will be updated by useEffect watching selectedCategory prop
    track('select_item', { category: key });
  };

  const handleBackToCategories = () => {
    if (isReadOnly || !isHydrated) return;
    onCategorySelect(null); // Inform parent that category is deselected
    setDocSearch('');
    // View will be updated by useEffect watching selectedCategory prop
  };

  const handleDocSelect = (doc: LegalDocument) => {
    if (!isHydrated) return;
    if (isReadOnly || !globalSelectedState) { 
        toast({ 
            title: t('State Required'), 
            description: t('Please select a state from the filter bar above before choosing a document.'),
            variant: "destructive" 
        });
        return;
    }
    onDocumentSelect(doc);
    track('view_item', {id: doc.id,name: doc.name,category : doc.category,price : doc.basePrice,state : globalSelectedState,});
  };
  
  const placeholderTitle = isHydrated ? t('stepOne.title') : "Loading...";
  const placeholderCategoryDesc = isHydrated ? t('stepOne.categoryDescription') : "Loading...";
  const placeholderSelectDocDesc = isHydrated ? t('stepOne.selectDocDescription') : "Loading...";
  const placeholderSearchCategories = isHydrated ? t('docTypeSelector.searchCategories') : "Searching...";
  const placeholderNoCategories = isHydrated ? t('docTypeSelector.noCategoriesFound') : "Loading...";
  const placeholderBackToCategories = isHydrated ? t('docTypeSelector.backToCategories') : "Back...";
  const placeholderSearchDocuments = isHydrated ? t('docTypeSelector.searchInCategoryPlaceholder', 'Search in this category...') : "Searching...";
  const placeholderNoResults = isHydrated ? t('docTypeSelector.noResults') : "Loading...";
  const placeholderNoDescription = isHydrated ? t('docTypeSelector.noDescription') : "Loading...";
  const placeholderRequiresNotarization = isHydrated ? t('docTypeSelector.requiresNotarization') : "Requires Notarization";
  const placeholderCanBeRecorded = isHydrated ? t('docTypeSelector.canBeRecorded') : "Can Be Recorded";


  if (!isHydrated) {
    return (
      <Card className="step-card opacity-50">
        <CardHeader className="step-card__header">
            <PaperIcon className="step-card__icon animate-pulse" />
            <div> 
              <CardTitle className="step-card__title h-6 bg-muted-foreground/20 rounded w-3/4 mb-1"></CardTitle>
              <CardDescription className="step-card__subtitle h-4 bg-muted-foreground/10 rounded w-full"></CardDescription>
            </div>
        </CardHeader>
        <CardContent className="step-content space-y-6 pt-6">
           <div className="h-10 bg-muted-foreground/10 rounded w-full mb-4"></div>
           <div className="category-grid pt-2">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="category-card h-auto min-h-[90px] p-4 border-border shadow-sm bg-muted flex flex-col justify-center items-center">
                    <div className="h-6 w-6 mb-2 bg-muted-foreground/20 rounded-full"></div>
                    <div className="h-4 bg-muted-foreground/10 rounded w-20"></div>
                </div>
            ))}
           </div>
        </CardContent>
      </Card>
    );
  }

  // Determine current display mode based on global search term
  const isGlobalSearching = globalSearchTerm.trim() !== '';

  return (
     <Card className={`step-card ${isReadOnly ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'opacity-100'}`}>
        <CardHeader className="step-card__header">
             <PaperIcon className="step-card__icon" />
             <div> 
                <CardTitle className="step-card__title">
                    {isGlobalSearching 
                      ? t('Search Results') 
                      : view === 'categories'
                        ? placeholderTitle // "Step 1: Select Category"
                        : t('stepOne.selectDocDescription') // "Choose the document..."
                    } 
                </CardTitle>
                <CardDescription className="step-card__subtitle">
                    {isGlobalSearching
                       ? t('Showing documents matching your search and state criteria.')
                       : view === 'categories'
                         ? placeholderCategoryDesc
                         : placeholderSelectDocDesc
                     }
                 </CardDescription>
             </div>
        </CardHeader>

        {/* Back button and Category Title: Only if NOT global searching AND in documents view */}
        {!isGlobalSearching && view === 'documents' && selectedCategory && (
            <div className="px-6 pb-4 border-b border-border"> 
                 <div className="flex items-center justify-between">
                     <Button variant="outline" size="sm" onClick={handleBackToCategories} disabled={isReadOnly || !isHydrated}>
                       <ArrowLeft className="mr-2 h-4 w-4" /> {placeholderBackToCategories}
                     </Button>
                      <h3 className="text-lg font-semibold text-muted-foreground text-right">
                        {t(CATEGORY_LIST.find(c => c.key === selectedCategory)?.labelKey || selectedCategory || '')}
                      </h3>
                 </div>
            </div>
        )}

        <CardContent className="step-content space-y-6 pt-6">
             {isGlobalSearching ? (
                // GLOBAL SEARCH RESULTS VIEW
                <div className="animate-fade-in space-y-6">
                     {globalSelectedState ? ( 
                         <>
                            {documentsToDisplay.length > 0 ? (
                                <div className="document-grid pt-4 animate-fade-in">
                                {documentsToDisplay.map(doc => (
                                    <Card
                                        key={doc.id}
                                        onClick={() => handleDocSelect(doc)}
                                        className={`document-card shadow hover:shadow-lg cursor-pointer transition bg-card border border-border flex flex-col active:scale-95 active:transition-transform active:duration-100 ${isReadOnly || !isHydrated ? 'pointer-events-none opacity-50' : ''}`}
                                         style={{ minHeight: '56px' }}
                                    >
                                        <CardHeader className="pb-2 pt-4 px-4">
                                             <CardTitle className="text-base font-semibold text-card-foreground">
                                                 {i18n.language === 'es' && doc.name_es ? t(doc.name_es, doc.name) : t(doc.name, doc.name)}
                                             </CardTitle>
                                        </CardHeader>
                                        <CardContent className="text-xs text-muted-foreground flex-grow px-4">
                                            {i18n.language === 'es' && doc.description_es ? t(doc.description_es, doc.description) : t(doc.description, doc.description) || placeholderNoDescription}
                                        </CardContent>
                                        <CardFooter className="pt-2 pb-3 px-4 text-xs text-muted-foreground flex justify-between items-center border-t border-border mt-auto">
                                           <span>💲{doc.basePrice}</span>
                                           <div className="flex gap-2">
                                               {doc.requiresNotarization && <span title={placeholderRequiresNotarization}>📝</span>}
                                               {doc.canBeRecorded && <span title={placeholderCanBeRecorded}>🏛️</span>}
                                           </div>
                                        </CardFooter>
                                    </Card>
                                ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground italic text-center py-6">{placeholderNoResults}</p>
                            )}
                         </>
                      ) : (
                         <p className="text-muted-foreground italic text-center py-6">{isHydrated ? t('Please select a state from the filter bar above to see documents.') : "Loading..."}</p>
                      )}
                 </div>
             ) : view === 'categories' ? (
                // CATEGORY SELECTION VIEW (No global search active)
                <div className="animate-fade-in space-y-4">
                     {sortedCategories.length > 0 ? (
                         <div className="category-grid pt-2">
                             {sortedCategories.map(cat => (
                                 <Button
                                     key={cat.key}
                                     variant="outline"
                                     onClick={() => handleCategoryClick(cat.key)}
                                     disabled={isReadOnly || !isHydrated}
                                     className="category-card h-auto min-h-[90px] p-4 border-border shadow-sm hover:shadow-md transition text-center flex flex-col justify-center items-center bg-card hover:bg-muted active:scale-95 active:transition-transform active:duration-100"
                                     style={{ minHeight: '56px' }}
                                 >
                                      {React.createElement(cat.icon || FileText, { className: "h-6 w-6 mb-2 text-primary/80" })}
                                     <span className="font-medium text-card-foreground text-sm">{t(cat.labelKey, cat.key)}</span>
                                 </Button>
                             ))}
                         </div>
                     ) : (
                         <p className="text-muted-foreground italic text-center py-6">{placeholderNoCategories}</p>
                     )}
                </div>
             ) : ( 
                 // DOCUMENTS WITHIN CATEGORY VIEW (No global search active, category selected)
                 <div className="animate-fade-in space-y-6">
                     {/* Local search input for documents within the category */}
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
                                {documentsToDisplay.map(doc => (
                                    <Card
                                        key={doc.id}
                                        onClick={() => handleDocSelect(doc)}
                                        className={`document-card shadow hover:shadow-lg cursor-pointer transition bg-card border border-border flex flex-col active:scale-95 active:transition-transform active:duration-100 ${isReadOnly || !isHydrated ? 'pointer-events-none opacity-50' : ''}`}
                                         style={{ minHeight: '56px' }}
                                    >
                                        <CardHeader className="pb-2 pt-4 px-4">
                                             <CardTitle className="text-base font-semibold text-card-foreground">
                                                 {i18n.language === 'es' && doc.name_es ? t(doc.name_es, doc.name) : t(doc.name, doc.name)}
                                             </CardTitle>
                                        </CardHeader>
                                        <CardContent className="text-xs text-muted-foreground flex-grow px-4">
                                            {i18n.language === 'es' && doc.description_es ? t(doc.description_es, doc.description) : t(doc.description, doc.description) || placeholderNoDescription}
                                        </CardContent>
                                        <CardFooter className="pt-2 pb-3 px-4 text-xs text-muted-foreground flex justify-between items-center border-t border-border mt-auto">
                                           <span>💲{doc.basePrice}</span>
                                           <div className="flex gap-2">
                                               {doc.requiresNotarization && <span title={placeholderRequiresNotarization}>📝</span>}
                                               {doc.canBeRecorded && <span title={placeholderCanBeRecorded}>🏛️</span>}
                                           </div>
                                        </CardFooter>
                                    </Card>
                                ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground italic text-center py-6">{placeholderNoResults}</p>
                            )}
                         </>
                      ) : (
                         <p className="text-muted-foreground italic text-center py-6">{isHydrated ? t('Please select a state from the filter bar above to see documents.') : "Loading..."}</p>
                      )}
                 </div>
             )}
        </CardContent>
     </Card>
  );
}
