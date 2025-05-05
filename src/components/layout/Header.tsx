// src/components/layout/Header.tsx
'use client'; // Make this a client component to use hooks

import React, { useState, useEffect } from 'react';
import { Logo } from '@/components/layout/Logo';
import Nav from '@/components/Nav'; // Import the Nav component
import { useTranslation } from 'react-i18next'; // Import useTranslation
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Import Dropdown
import { Button } from '@/components/ui/button'; // Import Button
import { Check, ChevronDown } from 'lucide-react'; // Icons for dropdown

// Example Language Switcher Flags (can be replaced with images or library)
const FlagEN = () => <span className="mr-2 text-xs" role="img" aria-label="UK Flag">🇬🇧</span>;
const FlagES = () => <span className="mr-2 text-xs" role="img" aria-label="Spain Flag">🇪🇸</span>;


export function Header() {
  const { i18n } = useTranslation();
  const [isHydrated, setIsHydrated] = useState(false); // State to track hydration
  const [currentLanguage, setCurrentLanguage] = useState('EN'); // State for current language display

  // Effect to set hydration state and initialize language
  useEffect(() => {
    setIsHydrated(true);
    setCurrentLanguage(i18n.language.startsWith('es') ? 'ES' : 'EN');
  }, [i18n.language]); // Rerun when language changes

  const handleLanguageChange = (lang: 'en' | 'es') => {
    i18n.changeLanguage(lang).then(() => {
      // Update state after language change is confirmed
      setCurrentLanguage(lang === 'es' ? 'ES' : 'EN');
      console.log(`Language switched to ${lang}`);
    });
  };


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Logo />
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
           <div className="hidden md:flex flex-1 justify-center"> {/* Hide Nav on small screens, center on medium+ */}
              <Nav />
           </div>
          <nav className="flex items-center">
            {/* Language Switcher Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs font-medium text-foreground/80 hover:bg-foreground/5 hover:text-foreground px-3 py-1.5 border-border/50 shadow-sm"
                  aria-label="Select language"
                  disabled={!isHydrated}
                >
                  {isHydrated ? (currentLanguage === 'EN' ? <FlagEN /> : <FlagES />) : null}
                  {isHydrated ? currentLanguage : '...'}
                  <ChevronDown className="ml-1 h-4 w-4 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[8rem]">
                <DropdownMenuItem
                   onSelect={() => handleLanguageChange('en')}
                   className={`text-xs ${currentLanguage === 'EN' ? 'font-medium text-primary' : ''}`}
                >
                   <FlagEN /> English {currentLanguage === 'EN' && <Check className="ml-auto h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                   onSelect={() => handleLanguageChange('es')}
                   className={`text-xs ${currentLanguage === 'ES' ? 'font-medium text-primary' : ''}`}
                >
                   <FlagES /> Español {currentLanguage === 'ES' && <Check className="ml-auto h-4 w-4" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* Add Auth/User button here later */}
          </nav>
        </div>
      </div>
    </header>
  );
}
