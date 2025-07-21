// src/hooks/useNotary.ts
'use client';

import { useState, useEffect } from 'react';
import { requiredNotaryStates } from '@/lib/stateNotaryRequirements'; // Use the main source

export function useNotary(stateCode: string | undefined | null) {
  const isRequired = !!stateCode && requiredNotaryStates.includes(stateCode); // Use imported list
  const [isChecked, setIsChecked] = useState(isRequired);

  useEffect(() => {
    if (isRequired) {
      setIsChecked(true);
    }
  }, [isRequired, stateCode]);

  const toggleNotary = () => {
    if (!isRequired) {
      setIsChecked((prev) => !prev);
    }
  };

  return {
    isRequired,
    isChecked,
    setIsChecked: toggleNotary,
    setChecked: setIsChecked,
  };
}
