// src/components/layout/Header.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useParams } from 'next/navigation';
import { Logo } from '@/components/layout/Logo';
import Nav from '@/components/Nav';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from '@/components/ui/button'; 
// import MiniCartDrawer from '@/components/MiniCartDrawer'; // Not currently used
// import { ThemeToggle } from '@/components/ThemeToggle'; // Corrected import path
import { Check, ChevronDown, Globe, UserPlus, LogIn, Search as SearchIcon, ExternalLink, FileText, Menu as MenuIcon, X as CloseIcon, LayoutGrid, ChevronUp, LogOut } from 'lucide-react'; 
import { Input } from '@/components/ui/input';
import { documentLibrary, type LegalDocument } from '@/lib/document-library';
import { CATEGORY_LIST } from '@/components/Step1DocumentSelector';
import MegaMenuContent from '@/components/mega-menu/MegaMenuContent'; // Updated import path
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';


export default function Header() {
  const { i18n, t } = useTranslation();
  const [clientLocale, setClientLocale] = useState<'en' | 'es'>('en');
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
  const { isLoggedIn, logout, user } = useAuth();

  const params = useParams();

  useEffect(() => {
    setMounted(true);
    const pathLocale = params.locale as 'en' | 'es' | undefined;
    const newLocale = pathLocale && ['en', 'es'].includes(pathLocale) ? pathLocale : 'en';

    setClientLocale(newLocale);
    if (i18n.language !== newLocale) {
      i18n.changeLanguage(newLocale);
    }
  }, [params.locale, i18n]);


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

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false); 
    router.push(`/${clientLocale}/`); 
  };


  const placeholderSearch = mounted ? t('nav.searchPlaceholder', { defaultValue: 'Search documents...' }) : "...";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 overflow-visible">
      <div className="container flex h-14 items-center px-4 md:px-6">
        <div className="mr-auto md:mr-4 flex items-center">
           <Logo wrapperClassName="items-center self-center" svgClassName="h-8 w-auto" textClassName="text-lg" />
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
                        className="text-sm font-medium flex items-center gap-1 px-2 text-foreground/80 hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground data-[state=open]:bg-primary data-[state=open]:text-primary-foreground"
                        disabled={!mounted}
                        aria-expanded={isMegaMenuOpen}
                    >
                        <LayoutGrid className="h-4 w-4" />
                        {mounted ? t('nav.documentCategories', { defaultValue: "Make Documents"}) : '...'}
                        {isMegaMenuOpen ? <ChevronUp className="h-4 w-4 opacity-70" /> : <ChevronDown className="h-4 w-4 opacity-70" />}
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    align="center" 
                    side="bottom"
                    sideOffset={10}
                    className="w-[90vw] md:w-[90vw] lg:w-[80rem] xl:w-[1200px] max-w-full bg-card shadow-xl rounded-lg p-0 z-[70] border border-border 
                               absolute left-1/2 -translate-x-1/2 mt-2 overflow-visible" // Centering and width classes
                >
                   <MegaMenuContent categories={CATEGORY_LIST} documents={documentLibrary} onLinkClick={handleMegaMenuLinkClick}/>
                </PopoverContent>
            </Popover>

             <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                    ref={searchInputRef}
                    type="search"
                    placeholder={placeholderSearch}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchQuery.trim().length > 1 && searchResults.length > 0 && setShowResults(true)}
                    className="h-9 pl-10 text-sm rounded-md w-40 md:w-56 bg-background border-input focus:border-primary"
                    disabled={!mounted}
                    aria-label={placeholderSearch}
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
                            className="flex items-center gap-2 px-3 py-2.5 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors w-full text-left"
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

            {/* <ThemeToggle /> */}

            {mounted && (
              isLoggedIn ? (
                <>
                  <Button variant="ghost" size="sm" className="text-xs font-medium px-2 py-1.5 md:px-3 h-9 md:h-8 hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground" asChild>
                    <Link href={`/${clientLocale}/dashboard`}>{t('Dashboard')}</Link>
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleLogout} className="text-xs font-medium px-2 py-1.5 md:px-3 h-9 md:h-8 hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground">
                    <LogOut className="h-4 w-4 mr-1 md:mr-2" /> {t('Logout')}
                  </Button>
                </>
              ) : (
                <>
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-xs font-medium text-foreground/80 hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground px-2 py-1.5 md:px-3 border-border/50 shadow-sm flex items-center h-9 md:h-8"
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
                        className="text-xs font-medium px-2 py-1.5 md:px-3 shadow-sm flex items-center h-9 md:h-8 bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary/90"
                        asChild
                    >
                        <Link href={`/${clientLocale}/signin`}>
                            <LogIn className="h-4 w-4 mr-1 md:mr-2" />
                            <span className="hidden sm:inline">{t('Sign In')}</span>
                        </Link>
                    </Button>
                 </>
              )
            )}
            {/* <MiniCartDrawer /> */}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden ml-auto flex items-center gap-1">
            {/* {mounted && <ThemeToggle />} */}
            {/* <MiniCartDrawer /> */}
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
                     placeholder={placeholderSearch}
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     onFocus={() => searchQuery.trim().length > 1 && searchResults.length > 0 && setShowResults(true)}
                     className="h-10 pl-10 text-sm rounded-md w-full bg-muted border-input focus:border-primary"
                     disabled={!mounted}
                     aria-label={placeholderSearch}
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
                            className="flex items-center gap-2 px-3 py-2.5 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors w-full text-left"
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
              className="w-full justify-between text-base font-medium flex items-center gap-2 px-2 py-3 hover:bg-primary hover:text-primary-foreground data-[state=open]:bg-primary data-[state=open]:text-primary-foreground group"
              onClick={() => setShowMobileCategories(!showMobileCategories)}
              disabled={!mounted}
              aria-expanded={showMobileCategories}
              data-state={showMobileCategories ? 'open' : 'closed'}
            >
              <div className="flex items-center gap-2">
                <LayoutGrid className="h-5 w-5 text-muted-foreground group-data-[state=open]:text-primary-foreground" />
                {mounted ? t('nav.documentCategories', {defaultValue: "Make Documents"}) : '...'}
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
                    { href: "/pricing", labelKey: "nav.pricing", defaultLabel: "Pricing" },
                    { href: "/features", labelKey: "nav.features", defaultLabel: "Features" },
                    { href: "/blog", labelKey: "nav.blog", defaultLabel: "Blog" },
                    { href: "/faq", labelKey: "nav.faq", defaultLabel: "FAQ" },
                    { href: "/support", labelKey: "nav.support", defaultLabel: "Support" },
                ].map(link => (
                    <Button key={link.href} variant="ghost" asChild className="w-full justify-start text-base py-3 hover:bg-primary hover:text-primary-foreground" onClick={() => setIsMobileMenuOpen(false)}>
                        <Link href={`/${clientLocale}${link.href}`}>{mounted ? t(link.labelKey, {defaultValue: link.defaultLabel}) : '...'}</Link>
                    </Button>
                ))}
            </div>

            <div className="border-t pt-4 flex items-center gap-2">
                 {mounted && <LanguageSwitcher />}
            </div>

             <div className="border-t border-border pt-4 space-y-2">
                 {isLoggedIn ? (
                    <Button variant="outline" size="sm" onClick={handleLogout}  className="w-full justify-start text-base py-3 hover:bg-primary hover:text-primary-foreground">
                        <LogOut className="h-5 w-5 mr-2" /> {t('Logout')}
                    </Button>
                 ) : (
                    <>
                        <Button variant="outline" size="sm" className="w-full justify-start text-base py-3 hover:bg-primary hover:text-primary-foreground" asChild onClick={() => setIsMobileMenuOpen(false)}><Link href={`/${clientLocale}/signup`}><UserPlus className="h-5 w-5 mr-2" />{mounted ? t('Sign Up') : '...'}</Link></Button>
                        <Button variant="default" size="sm" className="w-full justify-start text-base py-3 bg-primary text-primary-foreground hover:bg-primary/90" asChild onClick={() => setIsMobileMenuOpen(false)}><Link href={`/${clientLocale}/signin`}><LogIn className="h-5 w-5 mr-2" />{mounted ? t('Sign In') : '...'}</Link></Button>
                    </>
                 )}
             </div>
         </div>
      )}
    </header>
  );
}
