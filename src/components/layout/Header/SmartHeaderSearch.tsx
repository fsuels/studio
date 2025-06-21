// src/components/layout/Header/SmartHeaderSearch.tsx
'use client';

import React from 'react';
import { taxonomy } from '@/config/taxonomy';
import EnhancedHeaderSearch from './EnhancedHeaderSearch';
import HeaderSearch from './HeaderSearch';

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
        if (savedRole && taxonomy.roles[savedRole]) {
          setUserRole(savedRole);
        }
      } catch (error) {
        // localStorage not available
      }
    }
  }, [mounted]);

  // Check if enhanced search features are enabled
  const useEnhancedSearch = taxonomy.feature_flags?.wizard_v4?.enabled;

  if (useEnhancedSearch) {
    return (
      <EnhancedHeaderSearch
        clientLocale={clientLocale}
        mounted={mounted}
        className={className}
        userRole={userRole}
      />
    );
  }

  // Fallback to original search
  return (
    <HeaderSearch
      clientLocale={clientLocale}
      mounted={mounted}
      className={className}
    />
  );
};

export default SmartHeaderSearch;
