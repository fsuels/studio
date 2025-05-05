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

// Inline SVG Flags for better portability and less dependency on external files
const FlagUS = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="16" viewBox="0 0 750 500" className="w-6 h-4 mr-2">
    <rect width="750" height="500" fill="#fff"/>
    <path fill="#b22234" d="M0 0h750v38.46H0zm0 76.92h750v38.46H0zm0 76.92h750v38.46H0zm0 76.93h750v38.46H0zm0 76.92h750v38.46H0zm0 76.92h750v38.46H0zm0 76.93h750v38.46H0z"/>
    <path fill="#3c3b6e" d="M0 0h300v269.23H0z"/>
    <path fill="#fff" d="m60 19.23 6.18 19-16.18-11.74h19.99L53.82 38.23zm60 0 6.18 19-16.18-11.74h19.99L113.82 38.23zm60 0 6.18 19-16.18-11.74h19.99L173.82 38.23zm60 0 6.18 19-16.18-11.74h19.99L233.82 38.23zm-180 38.46 6.18 19-16.18-11.74h19.99L53.82 76.69zm60 0 6.18 19-16.18-11.74h19.99L113.82 76.69zm60 0 6.18 19-16.18-11.74h19.99L173.82 76.69zm60 0 6.18 19-16.18-11.74h19.99L233.82 76.69zm-150 38.46 6.18 19-16.18-11.74h19.99L83.82 115.15zm60 0 6.18 19-16.18-11.74h19.99L143.82 115.15zm60 0 6.18 19-16.18-11.74h19.99L203.82 115.15zm-180 38.46 6.18 19-16.18-11.74h19.99L53.82 153.61zm60 0 6.18 19-16.18-11.74h19.99L113.82 153.61zm60 0 6.18 19-16.18-11.74h19.99L173.82 153.61zm60 0 6.18 19-16.18-11.74h19.99L233.82 153.61zm-150 38.46 6.18 19-16.18-11.74h19.99L83.82 192.07zm60 0 6.18 19-16.18-11.74h19.99L143.82 192.07zm60 0 6.18 19-16.18-11.74h19.99L203.82 192.07zm-180 38.46 6.18 19-16.18-11.74h19.99L53.82 230.53zm60 0 6.18 19-16.18-11.74h19.99L113.82 230.53zm60 0 6.18 19-16.18-11.74h19.99L173.82 230.53zm60 0 6.18 19-16.18-11.74h19.99L233.82 230.53z"/>
  </svg>
);

const FlagES = () => (
   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="16" viewBox="0 0 750 500" className="w-6 h-4 mr-2">
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
         <path d="M7.5 1c.38 0 .7.1.96.28.21.14.38.33.49.55.11.22.15.46.15.72 0 .26-.04.5.15.72-.11.22-.28.41-.49.55-.26.17-.58.28-.96.28s-.7-.1-.96-.28c-.21-.14-.38-.33-.49-.55-.11-.22-.15-.46-.15-.72 0 .26.04.5.15-.72.11-.22.28-.41.49-.55.26-.17.58-.28.96-.28zm0 6c.38 0 .7.1.96.28.21.14.38.33.49.55.11.22.15.46.15.72 0 .26-.04.5.15.72-.11.22-.28.41-.49-.55-.26.17-.58.28-.96.28s-.7-.1-.96-.28c-.21-.14-.38-.33-.49-.55-.11-.22-.15-.46-.15-.72 0 .26.04.5.15-.72.11-.22.28-.41.49-.55.26-.17.58-.28.96-.28z" fill="#fff"/>
         <path d="M7.5 7C8.08 7 8.4.6 8.4 1.2V5.8C8.4 6.4 8.08 7 7.5 7S6.6 6.4 6.6 5.8V1.2C6.6.6 6.92 0 7.5 0c.58 0 .9.6.9 1.2z" fill="#ad1519"/>
         <path d="M7.5 13c.58 0 .9-.6.9-1.2V7.8c0-.6-.32-1.2-.9-1.2s-.9.6-.9 1.2v4c0 .6.32 1.2.9 1.2z" fill="#75aadb"/>
         <path d="M9.03 5.5H5.97c-.48 0-.78-.27-.78-.6 0-.33.3-.6.78-.6h3.06c.48 0 .78.27.78.6 0 .33-.3.6-.78.6z" fill="#ffc400"/>
      </g>
   </svg>
);


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
                   {/* Show correct flag based on current language */}
                  {isHydrated ? (currentLanguage === 'EN' ? <FlagUS /> : <FlagES />) : <div className="w-6 h-4 mr-2 bg-muted rounded-sm animate-pulse"></div>}
                  {isHydrated ? currentLanguage : '...'}
                  <ChevronDown className="ml-1 h-4 w-4 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[8rem]">
                <DropdownMenuItem
                   onSelect={() => handleLanguageChange('en')}
                   className={`text-xs ${currentLanguage === 'EN' ? 'font-medium text-primary' : ''}`}
                >
                   <FlagUS /> English {currentLanguage === 'EN' && <Check className="ml-auto h-4 w-4" />}
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
