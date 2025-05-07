// src/components/layout/Header.tsx
'use client'; 

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/layout/Logo';
import Nav from '@/components/Nav'; 
import { useTranslation } from 'react-i18next'; 
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"; 
import { Button } from '@/components/ui/button'; 
import MiniCartDrawer from '@/components/MiniCartDrawer';
import { ThemeToggle } from '@/components/ThemeToggle'; // Corrected import path
import { Check, ChevronDown, Globe, UserPlus, LogIn, Search as SearchIcon, ExternalLink, FileText, Menu as MenuIcon, X as CloseIcon, LayoutGrid } from 'lucide-react'; 
import { Input } from '@/components/ui/input';
import { documentLibrary, LegalDocument } from '@/lib/document-library';
import { useRouter } from 'next/navigation';
import { CATEGORY_LIST } from '@/components/Step1DocumentSelector';
import MegaMenuContent from './MegaMenuContent'; 

// Inline SVG Flags for better portability and less dependency on external files
const FlagUS = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="14" viewBox="0 0 750 500" className="w-5 h-auto mr-2 rounded-sm">
    <rect width="750" height="500" fill="#fff"/>
    <path fill="#b22234" d="M0 0h750v38.46H0zm0 76.92h750v38.46H0zm0 76.92h750v38.46H0zm0 76.93h750v38.46H0zm0 76.92h750v38.46H0zm0 76.92h750v38.46H0zm0 76.93h750v38.46H0z"/>
    <path fill="#3c3b6e" d="M0 0h300v269.23H0z"/>
    <path fill="#fff" d="m60 19.23 6.18 19-16.18-11.74h19.99L53.82 38.23zm60 0 6.18 19-16.18-11.74h19.99L113.82 38.23zm60 0 6.18 19-16.18-11.74h19.99L173.82 38.23zm60 0 6.18 19-16.18-11.74h19.99L233.82 38.23zm-180 38.46 6.18 19-16.18-11.74h19.99L53.82 76.69zm60 0 6.18 19-16.18-11.74h19.99L113.82 76.69zm60 0 6.18 19-16.18-11.74h19.99L173.82 76.69zm60 0 6.18 19-16.18-11.74h19.99L233.82 76.69zm-150 38.46 6.18 19-16.18-11.74h19.99L83.82 115.15zm60 0 6.18 19-16.18-11.74h19.99L143.82 115.15zm60 0 6.18 19-16.18-11.74h19.99L203.82 115.15zm-180 38.46 6.18 19-16.18-11.74h19.99L53.82 153.61zm60 0 6.18 19-16.18-11.74h19.99L113.82 153.61zm60 0 6.18 19-16.18-11.74h19.99L173.82 153.61zm60 0 6.18 19-16.18-11.74h19.99L233.82 153.61zm-150 38.46 6.18 19-16.18-11.74h19.99L83.82 192.07zm60 0 6.18 19-16.18-11.74h19.99L143.82 192.07zm60 0 6.18 19-16.18-11.74h19.99L203.82 192.07zm-180 38.46 6.18 19-16.18-11.74h19.99L53.82 230.53zm60 0 6.18 19-16.18-11.74h19.99L113.82 230.53zm60 0 6.18 19-16.18-11.74h19.99L173.82 230.53zm60 0 6.18 19-16.18-11.74h19.99L233.82 230.53z"/>
  </svg>
);

const FlagES = () => (
   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="14" viewBox="0 0 750 500" className="w-5 h-auto mr-2 rounded-sm">
      <rect width="750" height="500" fill="#c60b1e"/>
      <rect width="750" height="125" y="125" fill="#ffc400"/>
      <g transform="translate(206.25 212.5) scale(7.5)">
         <g fill="#fff">
            <path d="M7 0h1v13H7zM9 0h1v13H9z"/>
            <path d="M10 13v1h3v-1zm-6 0v1h3v-1z"/>
         </g>
         <path d="M7 15h2v2H7zM7 17h2v1H7zM9 17H7v1h2zm0 1H7v1h2z" fill="#c60b1e"/>
         <path d="M10.14 13.48a.15.15 0 0 0-.14-.15H6a.15.15 0 0 0-.14.15L5.1 15.91c-.07.2.07.4.29.4h.32c.1 0 .18-.05.22-.13L6 15.8h4l.07.38c.04.08.12.13.22.13h.32c.22 0 .36-.2.29-.4z" fill="#ffc400"/>
         <path d="M10 13h.8a.15.15 0 0 0 .15-.15V0h-2v12.85c0 .08.06.15.15.15zM6 13h.8c.09 0 .15-.07.15-.15V0H5v12.85c0 .08.07.15.15.15z" fill="#ad1519"/>
         <path d="M7 13h2v1H7z" fill="#ffc400"/>
         <g fill="#006a44">
            <path d="M13 13v-1h.15c.2 0 .35-.15.35-.35V9h1v3h1v1zm-10 0v-1h-.15c-.2 0-.35-.15-.35-.35V9H2v3H1v1z"/>
            <circle cx="7.5" cy="3.5" r="2"/>
            <circle cx="7.5" cy="9.5" r="2"/>
         </g>
         <g fill="#75aadb">
            <path d="M8.5 13v-1h.15c.2 0 .35-.15.35-.35V9h1v3h1v1z"/>
            <path d="M4.5 13v-1H4.35c-.2 0-.35-.15-.35-.35V9H5v3H6v1z"/>
         </g>
         <path d="M7.5 1c.38 0 .7.1.96.28.21.14.38.33.49.55.11.22.15.46.15.72 0 .26-.04.5.15.72-.11.22-.28.41-.49.55-.26.17-.58.28-.96.28s-.7-.1-.96-.28c-.21-.14-.38-.33-.49-.55-.11-.22-.15-.46-.15-.72 0 .26.04.5.15.72.11.22.28.41.49.55.26.17.58.28.96.28zm0 6c.38 0 .7.1.96.28.21.14.38.33.49.55.11.22.15.46.15.72 0 .26-.04.5.15.72-.11.22-.28.41-.49.55-.26.17-.58.28-.96.28s-.7-.1-.96-.28c-.21-.14-.38-.33-.49-.55-.11-.22-.15-.46-.15-.72 0 .26.04.5.15.72.11.22.28.41.49.55.26.17.58.28.96.28z" fill="#fff"/>
         <path d="M7.5 7C8.08 7 8.4.6 8.4 1.2V5.8C8.4 6.4 8.08 7 7.5 7S6.6 6.4 6.6 5.8V1.2C6.6.6 6.92 0 7.5 0c.58 0 .9.6.9 1.2z" fill="#ad1519"/>
         <path d="M7.5 13c.58 0 .9-.6.9-1.2V7.8c0-.6-.32-1.2-.9-1.2s-.9.6-.9 1.2v4c0 .6.32 1.2.9 1.2z" fill="#75aadb"/>
         <path d="M9.03 5.5H5.97c-.48 0-.78-.27-.78-.6 0-.33.3-.6.78-.6h3.06c.48 0 .78.27.78.6 0 .33-.3.6-.78.6z" fill="#ffc400"/>
      </g>
   </svg>
);


export function Header() {
  const { i18n, t } = useTranslation(); 
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentLanguageDisplay, setCurrentLanguageDisplay] = useState('...'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LegalDocument[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);


  useEffect(() => {
    setIsHydrated(true);
    if (i18n.language) {
        setCurrentLanguageDisplay(i18n.language.startsWith('es') ? 'ES' : 'EN');
    } else {
        setCurrentLanguageDisplay('EN'); 
    }
  }, [i18n.language]);

  useEffect(() => {
    if (!isHydrated) return;

    const performSearch = () => {
      if (searchQuery.trim().length > 1) { 
        const lowerQuery = searchQuery.toLowerCase();
        const lang = i18n.language as 'en' | 'es';
        
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

  }, [searchQuery, i18n.language, isHydrated]);

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
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const handleLanguageChange = (lang: 'en' | 'es') => {
    if (!isHydrated) return; 
    i18n.changeLanguage(lang).then(() => {
      setCurrentLanguageDisplay(lang === 'es' ? 'ES' : 'EN');
    });
    setIsMobileMenuOpen(false); // Close mobile menu on language change
    setIsMegaMenuOpen(false); // Close mega menu on language change
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery)}#workflow-start`); 
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
    router.push(`/?docId=${encodeURIComponent(docId)}#workflow-start`);
  };

  const handleMegaMenuLinkClick = () => {
    setIsMegaMenuOpen(false);
    setIsMobileMenuOpen(false);
  }


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 overflow-visible">
      <div className="container flex h-14 items-center px-4 md:px-6"> 
        <div className="mr-auto md:mr-4 flex">
          <Logo />
        </div>

        {/* Desktop Navigation - Main links to the left of "Make Documents" */}
        <div className="hidden md:flex flex-1 items-center justify-start">
            <Nav /> {/* Main navigation links like Pricing, Features, etc. */}
        </div>
       
        {/* Desktop Actions - "Make Documents", Search, Language, Auth, Theme, Cart aligned to the right */}
        <nav className="hidden md:flex items-center gap-2 ml-auto">
            {/* "Make Documents" Popover Trigger - Now on the right */}
            <Popover open={isMegaMenuOpen} onOpenChange={setIsMegaMenuOpen}>
                <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-sm font-medium flex items-center gap-1 px-2 hover:text-primary" disabled={!isHydrated}>
                        <LayoutGrid className="h-4 w-4 text-muted-foreground" />
                        {isHydrated ? t('nav.documentCategories') : '...'}
                        <ChevronDown className="h-4 w-4 opacity-70" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent 
                    className="absolute left-1/2 -translate-x-1/2 mt-2 w-[90vw] lg:w-[80rem] max-w-full bg-card p-6 rounded-lg shadow-lg z-50 overflow-visible"
                    align="center"
                    side="bottom"
                    sideOffset={4}
                >
                   <MegaMenuContent categories={CATEGORY_LIST} documents={documentLibrary} onLinkClick={handleMegaMenuLinkClick}/>
                </PopoverContent>
            </Popover>

             <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                    ref={searchInputRef}
                    type="search"
                    placeholder={t('nav.searchPlaceholder', { defaultValue: 'Search documents...' })}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchQuery.trim().length > 1 && searchResults.length > 0 && setShowResults(true)}
                    className="h-9 pl-10 text-sm rounded-md w-40 md:w-56 bg-background border-input focus:border-primary"
                    disabled={!isHydrated}
                    aria-label={t('nav.searchPlaceholder', {defaultValue: 'Search documents...'})}
                />
                {showResults && searchResults.length > 0 && (
                  <div 
                    ref={searchResultsRef}
                    className="absolute top-full mt-2 w-full md:w-72 max-h-80 overflow-y-auto bg-popover border border-border rounded-md shadow-lg z-[70]" // Increased z-index
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
                               {i18n.language === 'es' && doc.name_es ? doc.name_es : doc.name}
                            </span>
                            <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground/70"/>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
             </form>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs font-medium text-foreground/80 hover:bg-foreground/5 hover:text-foreground px-2 py-1.5 md:px-3 border-border/50 shadow-sm flex items-center" 
                  aria-label="Select language"
                  disabled={!isHydrated} 
                >
                  {isHydrated ? (currentLanguageDisplay === 'EN' ? <FlagUS /> : <FlagES />) : <Globe className="h-4 w-4 mr-1 text-muted-foreground" /> }
                  <span className="hidden sm:inline">{isHydrated ? currentLanguageDisplay : '...'}</span> 
                  <ChevronDown className="ml-1 h-4 w-4 opacity-70" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="min-w-[8rem] p-1 z-[70]"> {/* Increased z-index */}
                <Button
                   onClick={() => handleLanguageChange('en')}
                   variant={currentLanguageDisplay === 'EN' ? 'secondary': 'ghost'}
                   className="w-full justify-start text-xs"
                >
                   <FlagUS /> English {currentLanguageDisplay === 'EN' && <Check className="ml-auto h-4 w-4" />}
                </Button>
                <Button
                   onClick={() => handleLanguageChange('es')}
                   variant={currentLanguageDisplay === 'ES' ? 'secondary': 'ghost'}
                   className="w-full justify-start text-xs"
                >
                   <FlagES /> Español {currentLanguageDisplay === 'ES' && <Check className="ml-auto h-4 w-4" />}
                </Button>
              </PopoverContent>
            </Popover>

             <Button
                variant="outline"
                size="sm"
                className="text-xs font-medium text-foreground/80 hover:bg-foreground/5 hover:text-foreground px-2 py-1.5 md:px-3 border-border/50 shadow-sm flex items-center"
                asChild
                disabled={!isHydrated}
             >
                <Link href="/signup"> 
                   <UserPlus className="h-4 w-4 mr-1 md:mr-2" />
                   <span className="hidden sm:inline">{isHydrated ? t('Sign Up') : '...'}</span>
                </Link>
             </Button>
             <Button
                variant="default" 
                size="sm"
                className="text-xs font-medium px-2 py-1.5 md:px-3 shadow-sm flex items-center"
                asChild
                disabled={!isHydrated}
             >
                <Link href="/signin">
                    <LogIn className="h-4 w-4 mr-1 md:mr-2" />
                    <span className="hidden sm:inline">{isHydrated ? t('Sign In') : '...'}</span>
                </Link>
             </Button>
             <ThemeToggle />
            {isHydrated && <MiniCartDrawer />}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden ml-auto flex items-center gap-2">
            {isHydrated && <MiniCartDrawer />}
            <ThemeToggle />
             <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} disabled={!isHydrated}>
                {isMobileMenuOpen ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
             </Button>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {isMobileMenuOpen && isHydrated && (
         <div className="md:hidden absolute top-14 left-0 right-0 bg-background shadow-lg border-t border-border p-4 space-y-4 animate-fade-in z-[60]"> {/* Ensured z-index */}
            <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full">
                 <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                 <Input
                     ref={searchInputRef} 
                     type="search"
                     placeholder={t('nav.searchPlaceholder', { defaultValue: 'Search documents...' })}
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     onFocus={() => searchQuery.trim().length > 1 && searchResults.length > 0 && setShowResults(true)}
                     className="h-10 pl-10 text-sm rounded-md w-full bg-muted border-input focus:border-primary"
                     disabled={!isHydrated}
                     aria-label={t('nav.searchPlaceholder', {defaultValue: 'Search documents...'})}
                 />
                 {showResults && searchResults.length > 0 && (
                  <div 
                    ref={searchResultsRef} 
                    className="absolute top-full mt-1 w-full max-h-60 overflow-y-auto bg-popover border border-border rounded-md shadow-lg z-[70]" // Increased z-index
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
                               {i18n.language === 'es' && doc.name_es ? doc.name_es : doc.name}
                            </span>
                            <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground/70"/>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </form>
            
            <Popover open={isMegaMenuOpen} onOpenChange={setIsMegaMenuOpen}>
                <PopoverTrigger asChild>
                    <Button variant="ghost" className="w-full justify-start text-sm font-medium flex items-center gap-2 px-2 hover:text-primary" disabled={!isHydrated}>
                        <LayoutGrid className="h-4 w-4 text-muted-foreground" />
                        {isHydrated ? t('nav.documentCategories') : '...'}
                        <ChevronDown className="h-4 w-4 opacity-70 ml-auto" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[calc(100vw-2rem)] max-w-md p-0 z-[70]" align="start" side="bottom"> {/* Increased z-index */}
                   <MegaMenuContent categories={CATEGORY_LIST} documents={documentLibrary} onLinkClick={handleMegaMenuLinkClick}/>
                </PopoverContent>
            </Popover>

            <Nav /> {/* Main navigation links like Pricing, Features, etc. */}

             <div className="border-t border-border pt-4 space-y-2">
                 <Button variant="outline" size="sm" className="w-full justify-start" asChild onClick={() => setIsMobileMenuOpen(false)}><Link href="/signup"><UserPlus className="h-4 w-4 mr-2" />{isHydrated ? t('Sign Up') : '...'}</Link></Button>
                 <Button variant="default" size="sm" className="w-full justify-start" asChild onClick={() => setIsMobileMenuOpen(false)}><Link href="/signin"><LogIn className="h-4 w-4 mr-2" />{isHydrated ? t('Sign In') : '...'}</Link></Button>
             </div>
         </div>
      )}
    </header>
  );
}
    
