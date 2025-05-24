
// src/hooks/useNotary.ts
'use client';

import { useState, useEffect } from 'react';
import { requiredNotaryStates } from '@/lib/stateNotaryRequirements'; // Use the main source

type ComplianceMap = Record<string, { requireNotary?: boolean }>;
export function useNotary(stateCode: string | undefined | null, compliance?: ComplianceMap) {
  const isRequired = !!stateCode && (
    compliance?.[stateCode]?.requireNotary ?? compliance?.DEFAULT?.requireNotary ??
    requiredNotaryStates.includes(stateCode)
  );
  const [isChecked, setIsChecked] = useState(isRequired);

  useEffect(() => {
    if (isRequired) {
      setIsChecked(true);
    }
  }, [isRequired, stateCode]);

  const toggleNotary = () => {
    if (!isRequired) {
      setIsChecked(prev => !prev);
    }
  };
  
  return { isRequired, isChecked, setIsChecked: toggleNotary, setChecked: setIsChecked };
}
