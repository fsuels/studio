// src/components/layout/Header/SmartHeaderSearch.tsx
'use client';

import React from 'react';
import { useDeferredComponent } from '@/hooks/useDeferredComponent';
import { cn } from '@/lib/utils';

const loadEnhancedHeaderSearch = () =>
  import('./EnhancedHeaderSearch').then((mod) => ({ default: mod.default }));

interface SmartHeaderSearchProps {
  clientLocale: 'en' | 'es';
  mounted: boolean;
  className?: string;
}

const SmartHeaderSearch: React.FC<SmartHeaderSearchProps> = ({
  clientLocale,
  mounted,
  className,
}) => {
  // Get user role from localStorage if available
  const [userRole, setUserRole] = React.useState<string | undefined>();

  React.useEffect(() => {
    if (mounted) {
      try {
        const savedRole = localStorage.getItem('userRole');
        if (savedRole) setUserRole(savedRole);
      } catch (error) {
        // localStorage not available
      }
    }
  }, [mounted]);

  const EnhancedHeaderSearch = useDeferredComponent(loadEnhancedHeaderSearch, {
    trigger: mounted,
    preload: mounted,
    idleDelay: 500,
  });

  if (!EnhancedHeaderSearch) {
    return (
      <div
        className={cn(
          'flex h-10 w-full max-w-md items-center rounded-full bg-muted/60 px-4 text-sm text-muted-foreground',
          className,
        )}
      >
        <span className="truncate">Search documents...</span>
      </div>
    );
  }

  return (
    <EnhancedHeaderSearch
      clientLocale={clientLocale}
      mounted={mounted}
      className={className}
      userRole={userRole}
    />
  );
};

export default SmartHeaderSearch;
