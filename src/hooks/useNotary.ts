
// src/hooks/useNotary.ts
'use client';

import { useState, useEffect } from 'react';
import { requiredNotaryStates } from '@/lib/stateNotaryRequirements'; // Use the main source
import type { LegalDocument } from '@/types/documents';
export function useNotary(stateCode: string | undefined | null, doc?: Pick<LegalDocument, 'compliance'>) {
  const complianceRequired = stateCode && doc?.compliance?.[stateCode]?.requireNotary;
  const defaultRequired = stateCode && doc?.compliance?.DEFAULT?.requireNotary;
  const isRequired = !!(complianceRequired ?? defaultRequired ?? (stateCode && requiredNotaryStates.includes(stateCode)));
  const [isChecked, setIsChecked] = useState(isRequired);

  useEffect(() => {
    if (isRequired) {
      setIsChecked(true);
    }
  }, [isRequired, stateCode, doc]);

  const toggleNotary = () => {
    if (!isRequired) {
      setIsChecked(prev => !prev);
    }
  };
  
  return { isRequired, isChecked, setIsChecked: toggleNotary, setChecked: setIsChecked };
}
