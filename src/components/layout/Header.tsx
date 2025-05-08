// src/components/layout/Header.tsx
'use client'; 

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; 
import { Logo } from '@/components/layout/Logo';
import Nav from '@/components/Nav'; 
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"; 
import { Button } from '@/components/ui/button'; 
import MiniCartDrawer from '@/components/MiniCartDrawer';
import { ThemeToggle } from '@/components/ThemeToggle'; // Corrected import path
import { Check, ChevronDown, Globe, UserPlus, LogIn, Search as SearchIcon, ExternalLink, FileText, Menu as MenuIcon, X as CloseIcon, LayoutGrid, ChevronUp } from 'lucide-react'; 
import { Input } from '@/components/ui/input';
import { documentLibrary, LegalDocument } from '@/lib/document-library';
import { useRouter } from 'next/navigation';
import { CATEGORY_LIST } from '@/components/Step1DocumentSelector';
import MegaMenuContent from './MegaMenuContent'; 
import { useTranslation } from 'react-i18next';


export default function Header() { 
  const { i18n, t } = useTranslation(); 
  const [clientLocale, setClientLocale] = useState<'en'|'es'>('en'); 
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LegalDocument[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false); 
  const [showMobileCategories, setShowMobileCategories] = useState(false); 
  
  const pathname = usePathname(); 

  useEffect(() => {
    setMounted(true);
    const segments = pathname.split('/');
    const pathLocale = segments[1];
    if (pathLocale === 'es') {
      setClientLocale('es');
      if (i18n.language !== 'es') i18n.changeLanguage('es');
    } else {
      setClientLocale('en'); 
      if (i18n.language !== 'en') i18n.changeLanguage('en');
    }
  }, [pathname, i18n]);


  useEffect(() => {
    if (!mounted) return; 

    const performSearch = () => {
      if (searchQuery.trim().length > 1) { 
        const lowerQuery = searchQuery.toLowerCase();
        const lang = clientLocale; 
        
        const results = documentLibrary.filter(doc => {
          const name = lang === 'es' && doc.name_es ? doc.name_es : doc.name;
          const description = lang === 'es' && doc.description_es ? doc.description_es : doc.description;
          const aliases = lang === 'es' && doc.aliases_es ? doc.aliases_es : (doc.aliases || []);

          return (
            name.toLowerCase().includes(lowerQuery) ||
            (description && description.toLowerCase().includes(lowerQuery)) ||
            aliases.some(alias => alias.toLowerCase().includes(lowerQuery))
          );
        });
        setSearchResults(results.slice(0, 5)); 
        setShowResults(true);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    };
    
    const debounceTimeout = setTimeout(performSearch, 300); 
    return () => clearTimeout(debounceTimeout);

  }, [searchQuery, clientLocale, mounted]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchResultsRef.current &&
        !searchResultsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    }
    if (typeof window !== 'undefined') {
        document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
        if (typeof window !== 'undefined') {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    };
  }, []);


  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/${clientLocale}/?search=${encodeURIComponent(searchQuery)}#workflow-start`); 
    }
    setSearchQuery('');
    setShowResults(false); 
    setIsMobileMenuOpen(false);
    setIsMegaMenuOpen(false);
  };
  
  const handleResultClick = (docId: string) => {
    setSearchQuery('');
    setShowResults(false);
    setIsMobileMenuOpen(false);
    setIsMegaMenuOpen(false);
    router.push(`/${clientLocale}/docs/${docId}`); 
  };

  const handleMegaMenuLinkClick = () => {
    setIsMegaMenuOpen(false);
    setIsMobileMenuOpen(false);
    setShowMobileCategories(false); 
  }


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 overflow-visible">
      <div className="container flex h-14 items-center px-4 md:px-6"> 
        <div className="mr-auto md:mr-4 flex">
          <Logo />
        </div>

        <div className="hidden md:flex flex-1 items-center justify-start">
            <Nav /> 
        </div>
       
        <nav className="hidden md:flex items-center gap-2 ml-auto">
            <Popover open={isMegaMenuOpen} onOpenChange={setIsMegaMenuOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-sm font-medium flex items-center gap-1 px-2 text-foreground/80 hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground" 
                        disabled={!mounted}
                    >
                        <LayoutGrid className="h-4 w-4" /> 
                        {mounted ? t('nav.documentCategories') : '...'}
                        <ChevronDown className="h-4 w-4 opacity-70" /> 
                    </Button>
                </PopoverTrigger>
                <PopoverContent 
                    align="center"
                    side="bottom"
                    sideOffset={10} 
                    className="absolute left-1/2 -translate-x-1/2 mt-2 w-[calc(100vw-4rem)] lg:w-[80rem] max-w-[1200px] bg-popover p-0 rounded-lg shadow-xl z-[70] border border-border" 
                >
                   <MegaMenuContent categories={CATEGORY_LIST} documents={documentLibrary} onLinkClick={handleMegaMenuLinkClick}/>
                </PopoverContent>
            </Popover>

             <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                    ref={searchInputRef}
                    type="search"
                    placeholder={mounted ? t('nav.searchPlaceholder', { defaultValue: 'Search documents...' }) : "..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchQuery.trim().length > 1 && searchResults.length > 0 && setShowResults(true)}
                    className="h-9 pl-10 text-sm rounded-md w-40 md:w-56 bg-background border-input focus:border-primary"
                    disabled={!mounted}
                    aria-label={mounted ? t('nav.searchPlaceholder', {defaultValue: 'Search documents...'}) : "Search documents"}
                />
                {showResults && searchResults.length > 0 && (
                  <div 
                    ref={searchResultsRef}
                    className="absolute top-full mt-2 w-full md:w-72 max-h-80 overflow-y-auto bg-popover border border-border rounded-md shadow-lg z-[70]"
                  >
                    <ul>
                      {searchResults.map((doc) => (
                        <li key={doc.id}>
                          <button 
                            onClick={() => handleResultClick(doc.id)} 
                            className="flex items-center gap-2 px-3 py-2.5 text-sm text-popover-foreground hover:bg-accent transition-colors w-full text-left"
                          >
                            <FileText className="h-4 w-4 shrink-0 text-muted-foreground"/>
                            <span className="truncate">
                               {clientLocale === 'es' && doc.name_es ? doc.name_es : doc.name}
                            </span>
                            <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground/70"/>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
             </form>
            
            {mounted && <LanguageSwitcher />} 

            {mounted && (
                <>
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-xs font-medium text-foreground/80 hover:bg-foreground/5 hover:text-foreground px-2 py-1.5 md:px-3 border-border/50 shadow-sm flex items-center h-9 md:h-8"
                        asChild
                    >
                        <Link href={`/${clientLocale}/signup`}> 
                        <UserPlus className="h-4 w-4 mr-1 md:mr-2" />
                        <span className="hidden sm:inline">{t('Sign Up')}</span>
                        </Link>
                    </Button>
                    <Button
                        variant="default" 
                        size="sm"
                        className="text-xs font-medium px-2 py-1.5 md:px-3 shadow-sm flex items-center h-9 md:h-8"
                        asChild
                    >
                        <Link href={`/${clientLocale}/signin`}>
                            <LogIn className="h-4 w-4 mr-1 md:mr-2" />
                            <span className="hidden sm:inline">{t('Sign In')}</span>
                        </Link>
                    </Button>
                    {/* <MiniCartDrawer /> */} {/* Temporarily removed MiniCartDrawer */}
                    <ThemeToggle />
                </>
            )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden ml-auto flex items-center gap-1">
            {/* {mounted && <MiniCartDrawer />} */} {/* Temporarily removed MiniCartDrawer */}
            {mounted && <ThemeToggle />}
             <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} disabled={!mounted}>
                {isMobileMenuOpen ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
             </Button>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {isMobileMenuOpen && mounted && (
         <div className="md:hidden absolute top-14 left-0 right-0 bg-background shadow-lg border-t border-border p-4 space-y-4 animate-fade-in z-[60] max-h-[calc(100vh-3.5rem)] overflow-y-auto">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full">
                 <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                 <Input
                     ref={searchInputRef} 
                     type="search"
                     placeholder={mounted ? t('nav.searchPlaceholder', { defaultValue: 'Search documents...' }) : "..."}
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     onFocus={() => searchQuery.trim().length > 1 && searchResults.length > 0 && setShowResults(true)}
                     className="h-10 pl-10 text-sm rounded-md w-full bg-muted border-input focus:border-primary"
                     disabled={!mounted}
                     aria-label={mounted ? t('nav.searchPlaceholder', {defaultValue: 'Search documents...'}) : "Search documents"}
                 />
                 {showResults && searchResults.length > 0 && (
                  <div 
                    ref={searchResultsRef} 
                    className="absolute top-full mt-1 w-full max-h-60 overflow-y-auto bg-popover border border-border rounded-md shadow-lg z-[70]"
                  >
                    <ul>
                      {searchResults.map((doc) => (
                        <li key={doc.id}>
                          <button 
                            onClick={() => handleResultClick(doc.id)} 
                            className="flex items-center gap-2 px-3 py-2.5 text-sm text-popover-foreground hover:bg-accent transition-colors w-full text-left"
                          >
                            <FileText className="h-4 w-4 shrink-0 text-muted-foreground"/>
                            <span className="truncate">
                               {clientLocale === 'es' && doc.name_es ? doc.name_es : doc.name}
                            </span>
                            <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground/70"/>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </form>
            
            <Button
              variant="ghost"
              className="w-full justify-between text-base font-medium flex items-center gap-2 px-2 py-3 hover:text-primary"
              onClick={() => setShowMobileCategories(!showMobileCategories)}
              disabled={!mounted}
              aria-expanded={showMobileCategories}
            >
              <div className="flex items-center gap-2">
                <LayoutGrid className="h-5 w-5 text-muted-foreground" />
                {mounted ? t('nav.documentCategories') : '...'}
              </div>
              {showMobileCategories ? <ChevronUp className="h-5 w-5 opacity-70" /> : <ChevronDown className="h-5 w-5 opacity-70" />}
            </Button>
            {showMobileCategories && (
              <div className="pl-4 mt-0 border-l-2 border-muted/70">
                 <MegaMenuContent categories={CATEGORY_LIST} documents={documentLibrary} onLinkClick={handleMegaMenuLinkClick}/>
              </div>
            )}
            
            <div className="border-t border-border pt-4 space-y-1">
                {[
                    { href: "/pricing", labelKey: "nav.pricing" },
                    { href: "/features", labelKey: "nav.features" },
                    { href: "/blog", labelKey: "nav.blog" },
                    { href: "/faq", labelKey: "nav.faq" },
                    { href: "/support", labelKey: "nav.support" },
                ].map(link => (
                    <Button key={link.href} variant="ghost" asChild className="w-full justify-start text-base py-3" onClick={() => setIsMobileMenuOpen(false)}>
                        <Link href={`/${clientLocale}${link.href}`}>{mounted ? t(link.labelKey) : '...'}</Link>
                    </Button>
                ))}
            </div>

            <div className="border-t pt-4 flex items-center gap-2">
                 {mounted && <LanguageSwitcher />}
            </div>

             <div className="border-t border-border pt-4 space-y-2">
                 <Button variant="outline" size="sm" className="w-full justify-start text-base py-3" asChild onClick={() => setIsMobileMenuOpen(false)}><Link href={`/${clientLocale}/signup`}><UserPlus className="h-5 w-5 mr-2" />{mounted ? t('Sign Up') : '...'}</Link></Button>
                 <Button variant="default" size="sm" className="w-full justify-start text-base py-3" asChild onClick={() => setIsMobileMenuOpen(false)}><Link href={`/${clientLocale}/signin`}><LogIn className="h-5 w-5 mr-2" />{mounted ? t('Sign In') : '...'}</Link></Button>
             </div>
         </div>
      )}
    </header>
  );
}

