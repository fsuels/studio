// src/components/layout/Header/SmartHeaderSearch.tsx
'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically load the enhanced search to avoid bundling heavy deps (taxonomy, metadata)
const EnhancedHeaderSearch = dynamic(() => import('./EnhancedHeaderSearch'), {
  ssr: false,
  loading: () => null,
});

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

  // Always render the enhanced search shell; it lazy-loads heavy parts only on demand
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
