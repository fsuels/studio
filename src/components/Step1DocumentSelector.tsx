// src/components/Step1DocumentSelector.tsx
'use client';

import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { documentLibrary, usStates, type LegalDocument } from "@/lib/document-library";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Keep Select for state
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, Search, Landmark, Briefcase, Home, Users, User, ScrollText, Handshake, ShieldQuestion, GraduationCap, FileIcon as PaperIcon, Loader2 } from "lucide-react"; 
import { Label } from "@/components/ui/label";
import { track } from "@/lib/analytics";
import { useToast } from "@/hooks/use-toast"; // Import useToast

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
  selectedCategory: string | null;
  onCategorySelect: (categoryKey: string | null) => void;
  onDocumentSelect: (doc: LegalDocument) => void;
  isReadOnly?: boolean;
  globalSearchTerm: string; 
  globalSelectedState: string; 
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
  const [currentCategoryKey, setCurrentCategoryKey] = useState<string | null>(selectedCategory); // Store key for consistency
  const [docSearch, setDocSearch] = useState<string>(''); 
  const [isHydrated, setIsHydrated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    setCurrentCategoryKey(selectedCategory);
    setView(selectedCategory ? 'documents' : 'categories');
  }, [selectedCategory]);


  const sortedCategories = useMemo(() => {
       const uniqueCategoriesMap = new Map<string, { key: string, labelKey: string, icon: React.ElementType }>();
       CATEGORY_LIST.forEach(catInfo => {
           if (!uniqueCategoriesMap.has(catInfo.key)) {
               uniqueCategoriesMap.set(catInfo.key, catInfo);
           }
       });
       const uniqueCategories = Array.from(uniqueCategoriesMap.values());

      if (!isHydrated) return uniqueCategories; // Return unsorted during hydration
      return [...uniqueCategories].sort((a, b) =>
         t(a.labelKey, a.key).localeCompare(t(b.labelKey, b.key), i18n.language)
      );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated, i18n.language, t]); // t is now a dependency


  const filteredDocs = useMemo(() => {
    let docs = documentLibrary;
    if (!isHydrated) return []; // Return empty or placeholder during hydration

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
    }
    
    if (globalSelectedState && globalSelectedState !== 'all') {
        docs = docs.filter(doc => doc.states === 'all' || doc.states?.includes(globalSelectedState));
    }

    if (currentCategoryKey) {
      docs = docs.filter(doc => doc.category === currentCategoryKey);
    }
    
    if (view === 'documents' && docSearch.trim() !== '') {
        const lowerDocSearch = docSearch.toLowerCase();
        docs = docs.filter(doc =>
            (t(doc.name, doc.name)).toLowerCase().includes(lowerDocSearch) ||
            (doc.aliases?.some(alias => alias.toLowerCase().includes(lowerDocSearch))) ||
            (languageSupportsSpanish(doc.languageSupport) && doc.aliases_es?.some(alias => alias.toLowerCase().includes(lowerDocSearch))) ||
            (languageSupportsSpanish(doc.languageSupport) && doc.name_es && t(doc.name_es, doc.name_es).toLowerCase().includes(lowerDocSearch))
        );
    }
    
    return docs.filter(doc => doc.id !== 'general-inquiry'); 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCategoryKey, docSearch, globalSearchTerm, globalSelectedState, view, t, i18n.language, isHydrated]);


   const languageSupportsSpanish = (support: string[] | undefined): boolean => !!support && support.includes('es');


  const handleCategoryClick = (key: string) => {
    if (isReadOnly || !isHydrated) return;
    onCategorySelect(key); 
    setDocSearch('');
    setView('documents');
    track('select_item', { category: key });
  };

  const handleBackToCategories = () => {
    if (isReadOnly || !isHydrated) return;
    onCategorySelect(null); 
    setDocSearch('');
    setView('categories');
  };

  const handleDocSelect = (doc: LegalDocument) => {
    if (!isHydrated) return;
    if (isReadOnly || !globalSelectedState) { 
        toast({ 
            title: t('State Required', {defaultValue: "State Required"}), 
            description: t('Please select a state from the filter bar above before choosing a document.', {defaultValue: "Please select a state from the filter bar above before choosing a document."}),
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
  const placeholderSearchDocuments = isHydrated ? t('docTypeSelector.searchPlaceholder') : "Searching...";
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

  return (
     <Card className={`step-card ${isReadOnly ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'opacity-100'}`}>
        <CardHeader className="step-card__header">
             <PaperIcon className="step-card__icon" />
             <div> 
                <CardTitle className="step-card__title">
                    {placeholderTitle} 
                </CardTitle>
                <CardDescription className="step-card__subtitle">
                    {view === 'categories'
                       ? placeholderCategoryDesc
                       : placeholderSelectDocDesc
                     }
                 </CardDescription>
             </div>
        </CardHeader>

        {view === 'documents' && (
            <div className="px-6 pb-4 border-b border-border"> 
                 <div className="flex items-center justify-between">
                     <Button variant="outline" size="sm" onClick={handleBackToCategories} disabled={isReadOnly || !isHydrated}>
                       <ArrowLeft className="mr-2 h-4 w-4" /> {placeholderBackToCategories}
                     </Button>
                      <h3 className="text-lg font-semibold text-muted-foreground text-right">
                        {t(CATEGORY_LIST.find(c => c.key === currentCategoryKey)?.labelKey || currentCategoryKey || '')}
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
                                     disabled={isReadOnly || !isHydrated}
                                     className="category-card h-auto min-h-[90px] p-4 border-border shadow-sm hover:shadow-md transition text-center flex flex-col justify-center items-center bg-card hover:bg-muted active:scale-95 active:transition-transform active:duration-100"
                                     style={{ minHeight: '56px' }}
                                 >
                                      {(() => {
                                         const IconComponent = cat.icon || FileText;
                                         return <IconComponent className="h-6 w-6 mb-2 text-primary/80" />;
                                      })()}
                                     <span className="font-medium text-card-foreground text-sm">{t(cat.labelKey, cat.key)}</span>
                                 </Button>
                             ))}
                         </div>
                     ) : (
                         <p className="text-muted-foreground italic text-center py-6">{placeholderNoCategories}</p>
                     )}
                </div>
             ) : ( 
                 <div className="animate-fade-in space-y-6">
                     {globalSelectedState ? ( 
                         <>
                            {filteredDocs.length > 0 ? (
                                <div className="document-grid pt-4 animate-fade-in">
                                {filteredDocs.map(doc => (
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

