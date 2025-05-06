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
import { ArrowLeft, FileText, Search, Landmark, Briefcase, Home, Users, User, ScrollText, Handshake, ShieldQuestion, GraduationCap, FileIcon as PaperIcon } from "lucide-react"; // Added PaperIcon
import { Label } from "@/components/ui/label";

// User-friendly category definitions with icons
const CATEGORY_LIST = [
  { key: 'Finance', label: 'Finance', icon: Landmark },
  { key: 'Business', label: 'Business', icon: Briefcase },
  { key: 'Real Estate', label: 'Real Estate', icon: Home },
  { key: 'Family', label: 'Family', icon: Users },
  { key: 'Personal', label: 'Personal', icon: User },
  { key: 'Estate Planning', label: 'Estate Planning', icon: ScrollText },
  { key: 'Transactions', label: 'Transactions', icon: Handshake },
  { key: 'Miscellaneous', label: 'General', icon: FileText }, // Fallback / Misc
];


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
  const [view, setView] = useState<'categories' | 'documents'>(selectedCategory ? 'documents' : 'categories');
  const [currentCategory, setCurrentCategory] = useState<string | null>(selectedCategory);
  const [docSearch, setDocSearch] = useState<string>('');
  const [internalState, setInternalState] = useState<string>(selectedState);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    setCurrentCategory(selectedCategory);
    setView(selectedCategory ? 'documents' : 'categories');
  }, [selectedCategory]);

   useEffect(() => {
    setInternalState(selectedState);
  }, [selectedState]);


  const sortedCategories = useMemo(() => {
       const uniqueCategoriesMap = new Map<string, { key: string, label: string, icon: React.ElementType }>();
       // Use CATEGORY_LIST as the source for categories to display
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


  const docsInCategory = useMemo(() => {
    if (!currentCategory) return [];
    return documentLibrary.filter(doc =>
        doc.category === currentCategory &&
        doc.id !== 'general-inquiry'
     );
  }, [currentCategory]);

  const filteredDocs = useMemo(() => {
      if (docSearch.trim() === '') return docsInCategory;
      const lowerSearch = docSearch.toLowerCase();
      return docsInCategory.filter(doc =>
         (isHydrated ? t(doc.name, doc.name) : doc.name).toLowerCase().includes(lowerSearch) ||
         (doc.aliases?.some(alias => alias.toLowerCase().includes(lowerSearch))) ||
         (languageSupportsSpanish(doc.languageSupport) && doc.aliases_es?.some(alias => alias.toLowerCase().includes(lowerSearch))) ||
         (isHydrated && languageSupportsSpanish(doc.languageSupport) && doc.name_es && t(doc.name_es, doc.name_es).toLowerCase().includes(lowerSearch))
      );
  }, [docsInCategory, docSearch, t, i18n.language, isHydrated]);

   const languageSupportsSpanish = (support: string[]): boolean => support.includes('es');


  const handleCategoryClick = (key: string) => {
    if (isReadOnly) return;
    onCategorySelect(key);
    setCurrentCategory(key);
    setDocSearch('');
    setView('documents');
  };

  const handleBackToCategories = () => {
    if (isReadOnly) return;
    onCategorySelect(null);
    setCurrentCategory(null);
    setDocSearch('');
    setView('categories');
  };

  const handleStateChange = (value: string) => {
       const actualValue = value === '_placeholder_' ? '' : value;
       if (isReadOnly) return;
       setInternalState(actualValue);
       onStateSelect(actualValue);
  }

  const handleDocSelect = (doc: LegalDocument) => {
    if (isReadOnly || !internalState) {
        // Optionally, show a toast or alert message if state is required
        // toast({ title: "State Required", description: "Please select a state before choosing a document." });
        return;
    }
    onDocumentSelect(doc);
    // Auto-advance is handled by parent component's useEffect
  };

   const statePlaceholder = t('stepOne.statePlaceholder', 'Select State...');

  if (!isHydrated) {
    return <div className="h-96 animate-pulse bg-muted rounded-lg shadow-lg border border-border"></div>;
  }

  return (
     <Card className={`step-card ${isReadOnly ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'opacity-100'}`}>
        <CardHeader className="step-card__header">
             <PaperIcon className="step-card__icon" />
             <div> {/* Wrapper for title and subtitle to ensure correct layout with icon */}
                <CardTitle className="step-card__title">
                    {t('stepOne.title')} {/* Always "Step 1: Select a Category" */}
                </CardTitle>
                <CardDescription className="step-card__subtitle">
                    {view === 'categories'
                       ? t('stepOne.categoryDescription')
                       : t('stepOne.selectDocDescription')
                     }
                 </CardDescription>
             </div>
        </CardHeader>

        {/* Conditional Back Button for Document View - Placed below header */}
        {view === 'documents' && (
            <div className="px-6 pb-4 border-b border-border"> {/* Added padding and border */}
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
                     {/* Category Search REMOVED for initial category view as per instruction */}
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
             ) : (
                 <div className="animate-fade-in space-y-6">
                    <div className="mb-4">
                        <Label htmlFor="state-select-step1" className="block text-sm font-medium text-foreground mb-1">
                           {t('stepOne.stateLabel')} <span className="text-destructive">*</span>
                        </Label>
                        <Select
                          value={internalState || '_placeholder_'}
                          onValueChange={handleStateChange}
                          required
                          disabled={isReadOnly}
                          name="state-select-step1"
                        >
                           <SelectTrigger id="state-select-step1" className={`w-full text-base md:text-sm ${!internalState ? 'text-muted-foreground' : ''} ${isReadOnly ? 'bg-muted/50 border-dashed' : 'bg-background'}`} style={{ minHeight: '44px' }}>
                               <SelectValue placeholder={statePlaceholder} />
                           </SelectTrigger>
                           <SelectContent>
                               <SelectItem value="_placeholder_" disabled>{statePlaceholder}</SelectItem>
                               {usStates.map(state => (
                                  <SelectItem key={state.value} value={state.value}>
                                    {t(state.label, state.label)} ({state.value})
                                  </SelectItem>
                               ))}
                           </SelectContent>
                       </Select>
                        <p className="text-xs text-muted-foreground mt-1">{t('stepOne.stateHelp')}</p>
                     </div>

                     {docsInCategory.length > 7 && internalState && (
                         <div className="relative mb-4">
                             <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                             <Input
                                type="search" /* Changed to search for better semantics */
                                placeholder={t('docTypeSelector.searchPlaceholder')}
                                value={docSearch}
                                onChange={e => !isReadOnly && setDocSearch(e.target.value)}
                                disabled={isReadOnly || !internalState}
                                className={`w-full pl-10 text-base md:text-sm ${isReadOnly || !internalState ? 'bg-muted/50 border-dashed cursor-not-allowed' : 'bg-background'}`}
                                aria-label={t('docTypeSelector.searchPlaceholder')}
                             />
                         </div>
                     )}

                      {internalState ? (
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
                         <p className="text-muted-foreground italic text-center py-6">{t('Please select a state first.')}</p>
                      )}
                 </div>
             )}
        </CardContent>
     </Card>
  );
}
