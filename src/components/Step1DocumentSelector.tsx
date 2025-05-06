// src/components/Step1DocumentSelector.tsx
'use client';

import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { documentLibrary, usStates, type LegalDocument } from "@/lib/document-library";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// Select component is removed from here as state selection is now global
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, Search, Landmark, Briefcase, Home, Users, User, ScrollText, Handshake, ShieldQuestion, GraduationCap, FileIcon as PaperIcon } from "lucide-react"; 
import { Label } from "@/components/ui/label"; // Label might still be useful for local search

// User-friendly category definitions with icons
const CATEGORY_LIST = [
  { key: 'Finance', label: 'Finance', icon: Landmark },
  { key: 'Business', label: 'Business', icon: Briefcase },
  { key: 'Real Estate', label: 'Real Estate', icon: Home },
  { key: 'Family', label: 'Family', icon: Users },
  { key: 'Personal', label: 'Personal', icon: User },
  { key: 'Estate Planning', label: 'Estate Planning', icon: ScrollText },
  { key: 'Miscellaneous', label: 'General', icon: FileText }, 
];


interface Step1DocumentSelectorProps {
  selectedCategory: string | null;
  onCategorySelect: (categoryKey: string | null) => void;
  // onStateSelect is removed as it's handled globally
  onDocumentSelect: (doc: LegalDocument) => void;
  isReadOnly?: boolean;
  globalSearchTerm: string; // New prop for global search
  globalSelectedState: string; // New prop for global state
}

export default function Step1DocumentSelector({
  selectedCategory,
  onCategorySelect,
  onDocumentSelect,
  isReadOnly = false,
  globalSearchTerm,
  globalSelectedState
}: Step1DocumentSelectorProps) {
  const { t, i18n } = useTranslation();
  const [view, setView] = useState<'categories' | 'documents'>(selectedCategory ? 'documents' : 'categories');
  const [currentCategory, setCurrentCategory] = useState<string | null>(selectedCategory);
  const [docSearch, setDocSearch] = useState<string>(''); // Local search within category
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    setCurrentCategory(selectedCategory);
    setView(selectedCategory ? 'documents' : 'categories');
  }, [selectedCategory]);


  const sortedCategories = useMemo(() => {
       const uniqueCategoriesMap = new Map<string, { key: string, label: string, icon: React.ElementType }>();
       CATEGORY_LIST.forEach(catInfo => {
           if (!uniqueCategoriesMap.has(catInfo.key)) {
               uniqueCategoriesMap.set(catInfo.key, catInfo);
           }
       });
       const uniqueCategories = Array.from(uniqueCategoriesMap.values());

      if (!isHydrated) return uniqueCategories;
      return [...uniqueCategories].sort((a, b) =>
         t(a.label, a.label).localeCompare(t(b.label, b.label), i18n.language)
      );
  }, [isHydrated, i18n.language, t]);


  // Filter documents based on selected category, local doc search, global search, and global state
  const filteredDocs = useMemo(() => {
    let docs = documentLibrary;

    // 1. Filter by global search term (applies to all documents if no category selected, or within category if selected)
    if (globalSearchTerm.trim() !== '') {
      const lowerGlobalSearch = globalSearchTerm.toLowerCase();
      docs = docs.filter(doc =>
        (isHydrated ? t(doc.name, doc.name) : doc.name).toLowerCase().includes(lowerGlobalSearch) ||
        (doc.aliases?.some(alias => alias.toLowerCase().includes(lowerGlobalSearch))) ||
        (languageSupportsSpanish(doc.languageSupport) && doc.aliases_es?.some(alias => alias.toLowerCase().includes(lowerGlobalSearch))) ||
        (isHydrated && languageSupportsSpanish(doc.languageSupport) && doc.name_es && t(doc.name_es, doc.name_es).toLowerCase().includes(lowerGlobalSearch)) ||
        (isHydrated ? t(doc.description, doc.description) : doc.description).toLowerCase().includes(lowerGlobalSearch) ||
        (isHydrated && languageSupportsSpanish(doc.languageSupport) && doc.description_es && t(doc.description_es, doc.description_es).toLowerCase().includes(lowerGlobalSearch))
      );
    }
    
    // 2. Filter by global selected state
    if (globalSelectedState && globalSelectedState !== 'all') {
        docs = docs.filter(doc => doc.states === 'all' || doc.states?.includes(globalSelectedState));
    }

    // 3. If a category is selected, filter by that category
    if (currentCategory) {
      docs = docs.filter(doc => doc.category === currentCategory);
    }
    
    // 4. Filter by local document search (within the already filtered list)
    if (view === 'documents' && docSearch.trim() !== '') {
        const lowerDocSearch = docSearch.toLowerCase();
        docs = docs.filter(doc =>
            (isHydrated ? t(doc.name, doc.name) : doc.name).toLowerCase().includes(lowerDocSearch) ||
            (doc.aliases?.some(alias => alias.toLowerCase().includes(lowerDocSearch))) ||
            (languageSupportsSpanish(doc.languageSupport) && doc.aliases_es?.some(alias => alias.toLowerCase().includes(lowerDocSearch))) ||
            (isHydrated && languageSupportsSpanish(doc.languageSupport) && doc.name_es && t(doc.name_es, doc.name_es).toLowerCase().includes(lowerDocSearch))
        );
    }
    
    return docs.filter(doc => doc.id !== 'general-inquiry'); // Always exclude general inquiry
  }, [currentCategory, docSearch, globalSearchTerm, globalSelectedState, view, t, i18n.language, isHydrated]);


   const languageSupportsSpanish = (support: string[]): boolean => support.includes('es');


  const handleCategoryClick = (key: string) => {
    if (isReadOnly) return;
    onCategorySelect(key); // Notify parent of category selection
    // setCurrentCategory(key); // This is now handled by useEffect based on selectedCategory prop
    setDocSearch('');
    setView('documents');
  };

  const handleBackToCategories = () => {
    if (isReadOnly) return;
    onCategorySelect(null); // Reset category in parent
    // setCurrentCategory(null); // Handled by useEffect
    setDocSearch('');
    setView('categories');
  };

  const handleDocSelect = (doc: LegalDocument) => {
    if (isReadOnly || !globalSelectedState) { // Check globalSelectedState
        toast({ 
            title: t('State Required', {defaultValue: "State Required"}), 
            description: t('Please select a state from the filter bar above before choosing a document.', {defaultValue: "Please select a state from the filter bar above before choosing a document."}),
            variant: "destructive" 
        });
        return;
    }
    onDocumentSelect(doc);
  };

  const { toast } = useToast(); // Ensure toast is defined

  if (!isHydrated) {
    return <div className="h-96 animate-pulse bg-muted rounded-lg shadow-lg border border-border"></div>;
  }

  return (
     <Card className={`step-card ${isReadOnly ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'opacity-100'}`}>
        <CardHeader className="step-card__header">
             <PaperIcon className="step-card__icon" />
             <div> 
                <CardTitle className="step-card__title">
                    {t('stepOne.title')} 
                </CardTitle>
                <CardDescription className="step-card__subtitle">
                    {view === 'categories'
                       ? t('stepOne.categoryDescription')
                       : t('stepOne.selectDocDescription')
                     }
                 </CardDescription>
             </div>
        </CardHeader>

        {view === 'documents' && (
            <div className="px-6 pb-4 border-b border-border"> 
                 <div className="flex items-center justify-between">
                     <Button variant="outline" size="sm" onClick={handleBackToCategories} disabled={isReadOnly}>
                       <ArrowLeft className="mr-2 h-4 w-4" /> {t('docTypeSelector.backToCategories')}
                     </Button>
                      <h3 className="text-lg font-semibold text-muted-foreground text-right">
                        {t(CATEGORY_LIST.find(c => c.key === currentCategory)?.label || currentCategory || '')}
                      </h3>
                 </div>
            </div>
        )}

        <CardContent className="step-content space-y-6 pt-6">
             {view === 'categories' ? (
                <div className="animate-fade-in space-y-4">
                     {sortedCategories.length > 0 ? (
                         <div className="category-grid pt-2">
                             {sortedCategories.map(cat => (
                                 <Button
                                     key={cat.key}
                                     variant="outline"
                                     onClick={() => handleCategoryClick(cat.key)}
                                     disabled={isReadOnly}
                                     className="category-card h-auto min-h-[90px] p-4 border-border shadow-sm hover:shadow-md transition text-center flex flex-col justify-center items-center bg-card hover:bg-muted active:scale-95 active:transition-transform active:duration-100"
                                     style={{ minHeight: '56px' }}
                                 >
                                      {(() => {
                                         const IconComponent = cat.icon || FileText;
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
             ) : ( // Document View
                 <div className="animate-fade-in space-y-6">
                    {/* State selector is now global, handled by StickyFilterBar */}
                     
                     {/* Local Document Search within category (if many docs) */}
                     {documentLibrary.filter(d => d.category === currentCategory).length > 7 && globalSelectedState && (
                         <div className="relative mb-4">
                             <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                             <Input
                                type="search" 
                                placeholder={t('docTypeSelector.searchPlaceholder')}
                                value={docSearch}
                                onChange={e => !isReadOnly && setDocSearch(e.target.value)}
                                disabled={isReadOnly || !globalSelectedState}
                                className={`w-full pl-10 text-base md:text-sm ${isReadOnly || !globalSelectedState ? 'bg-muted/50 border-dashed cursor-not-allowed' : 'bg-background'}`}
                                aria-label={t('docTypeSelector.searchPlaceholder')}
                             />
                         </div>
                     )}

                      {globalSelectedState ? ( // Only show documents if a state is selected globally
                         <>
                            {filteredDocs.length > 0 ? (
                                <div className="document-grid pt-4 animate-fade-in">
                                {filteredDocs.map(doc => (
                                    <Card
                                        key={doc.id}
                                        onClick={() => handleDocSelect(doc)}
                                        className={`document-card shadow hover:shadow-lg cursor-pointer transition bg-card border border-border flex flex-col active:scale-95 active:transition-transform active:duration-100 ${isReadOnly ? 'pointer-events-none' : ''}`}
                                         style={{ minHeight: '56px' }}
                                    >
                                        <CardHeader className="pb-2 pt-4 px-4">
                                             <CardTitle className="text-base font-semibold text-card-foreground">
                                                 {i18n.language === 'es' && doc.name_es ? t(doc.name_es, doc.name) : t(doc.name, doc.name)}
                                             </CardTitle>
                                        </CardHeader>
                                        <CardContent className="text-xs text-muted-foreground flex-grow px-4">
                                            {i18n.language === 'es' && doc.description_es ? t(doc.description_es, doc.description) : t(doc.description, doc.description) || t('docTypeSelector.noDescription')}
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
                                <p className="text-muted-foreground italic text-center py-6">{t('docTypeSelector.noResults')}</p>
                            )}
                         </>
                      ) : (
                         <p className="text-muted-foreground italic text-center py-6">{t('Please select a state from the filter bar above to see documents.')}</p>
                      )}
                 </div>
             )}
        </CardContent>
     </Card>
  );
}

// Helper function to get useToast -- ensure it's imported if not globally available
const useToast = () => {
  // This is a placeholder. In a real app, useToast would come from your UI library (e.g., shadcn/ui)
  // or a custom hook that manages toast state.
  return {
    toast: ({ title, description, variant }: { title: string; description?: string; variant?: string }) => {
      console.log(`Toast: ${title} - ${description} (${variant})`);
      // alert(`${title}\n${description}`); // Simple alert for demo
    },
  };
};
