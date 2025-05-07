
// src/hooks/useNotary.ts
'use client';

import { useState, useEffect } from 'react';

// This set should ideally come from a shared library or config
// For now, duplicating the list from stateNotaryRequirements.ts
export const requiredNotaryStatesForHook = new Set([
  "AZ", "KY", "LA", "MD", "MT", "NE", "NH", "NC", "OH", "OK", "PA", "WV" // Simplified from original list
]);

export function useNotary(stateCode: string | undefined | null) {
  const isRequired = !!stateCode && requiredNotaryStatesForHook.has(stateCode);
  const [isChecked, setIsChecked] = useState(isRequired);

  useEffect(() => {
    // If the state makes it required, ensure it's checked.
    // If not required, user's choice is preserved unless stateCode changes to a non-requiring one.
    if (isRequired) {
      setIsChecked(true);
    }
    // If stateCode changes and it's no longer required, don't automatically uncheck.
    // Let user decide. But if it becomes required, force check.
  }, [isRequired, stateCode]);

  const toggleNotary = () => {
    // Only allow unchecking if it's not required by the state
    if (!isRequired) {
      setIsChecked(prev => !prev);
    }
  };
  
  return { isRequired, isChecked, setIsChecked: toggleNotary, setChecked: setIsChecked }; // Expose setChecked directly too
}
