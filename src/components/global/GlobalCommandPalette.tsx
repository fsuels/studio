'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useCommandPalette } from '@/hooks/useCommandPalette';
import CommandPalette from './CommandPalette';

interface GlobalCommandPaletteProps {
  locale?: 'en' | 'es';
  userRole?: string;
}

export default function GlobalCommandPalette({
  locale = 'en',
  userRole,
}: GlobalCommandPaletteProps) {
  const { isOpen, close } = useCommandPalette();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Extract locale from pathname if not provided
  const detectedLocale = React.useMemo(() => {
    if (locale) return locale;

    // Extract locale from pathname (e.g., /en/dashboard -> 'en')
    const pathSegments = pathname?.split('/') || [];
    const firstSegment = pathSegments[1];

    if (firstSegment === 'en' || firstSegment === 'es') {
      return firstSegment as 'en' | 'es';
    }

    return 'en'; // fallback
  }, [locale, pathname]);

  // Get user role from localStorage if not provided and mounted
  const [detectedUserRole, setDetectedUserRole] = useState<string | undefined>(
    userRole,
  );

  useEffect(() => {
    setMounted(true);

    if (!userRole && typeof window !== 'undefined') {
      try {
        const savedRole = localStorage.getItem('userRole');
        if (savedRole) {
          setDetectedUserRole(savedRole);
        }
      } catch (error) {
        // localStorage not available or failed
      }
    }
  }, [userRole]);

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return null;
  }

  return (
    <CommandPalette
      isOpen={isOpen}
      onClose={close}
      locale={detectedLocale}
      userRole={detectedUserRole}
    />
  );
}
