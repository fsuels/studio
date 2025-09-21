'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';

function getSearchString() {
  if (typeof window === 'undefined') {
    return '';
  }
  return window.location.search || '';
}

export function useCurrentSearchString() {
  const pathname = usePathname();
  const [search, setSearch] = useState(() => getSearchString());

  useEffect(() => {
    setSearch(getSearchString());
  }, [pathname]);

  return search;
}

export function useCurrentSearchParams() {
  const search = useCurrentSearchString();

  return useMemo(() => new URLSearchParams(search), [search]);
}
