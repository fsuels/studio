// src/components/StepTwoInput.tsx
'use client';

import React, { useState } from 'react';
import type { LegalDocument } from '@/types/documents';
import { usStates } from '@/lib/usStates';
import documentLibrary, { getDocumentsByCountry } from '@/lib/document-library';

interface StepTwoInputProps {
  category: string;
  onStateChange: (_state: string) => void;
  onSelectTemplate: (_templateId: string) => void;
}

export function StepTwoInput({
  category,
  onStateChange,
  onSelectTemplate,
}: StepTwoInputProps) {
  const [stateCode, setStateCode] = useState<string>('');

  // Memoize list of docs in this category
  const selectDocsForCategory = React.useCallback(
    (docs: LegalDocument[], currentCategory: string) =>
      docs.filter((doc) => doc.category === currentCategory),
    [],
  );

  const [docsInCategory, setDocsInCategory] = useState<LegalDocument[]>(
    selectDocsForCategory(documentLibrary, category),
  );

  React.useEffect(() => {
    setDocsInCategory(selectDocsForCategory(documentLibrary, category));
  }, [category, selectDocsForCategory]);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const docs = await getDocumentsByCountry('us');
        if (!cancelled) {
          setDocsInCategory(selectDocsForCategory(docs, category));
        }
      } catch (_) {
        if (!cancelled) {
          setDocsInCategory(selectDocsForCategory(documentLibrary, category));
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [category, selectDocsForCategory]);

  // Handle state dropdown change
  const handleStateChange = (code: string) => {
    setStateCode(code);
    onStateChange(code);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">
        Step 2: Choose Your Document
      </h2>
      <p className="text-gray-700 mb-6">
        Fill in the details for your <strong>{category}</strong> document.
      </p>

      {/* State selector */}
      <label
        htmlFor="state"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        State <span className="text-red-500">*</span>
      </label>
      <select
        id="state"
        value={stateCode}
        onChange={(e) => handleStateChange(e.target.value)}
        className="mb-6 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
      >
        <option value="">-- Select your state --</option>
        {usStates.map((s) => {
          // support string[] or { value,label }[]
          const code = typeof s === 'string' ? s : s.value;
          const name = typeof s === 'string' ? s : s.label;
          return (
            <option key={code} value={code}>
              {name}
            </option>
          );
        })}
      </select>

      {/* Document grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {docsInCategory.map((doc) => (
          <button
            key={doc.id}
            onClick={() => onSelectTemplate(doc.id)}
            className="flex flex-col items-center p-4 border rounded-lg shadow-sm hover:shadow-md transition"
          >
            {/* Replace with your icon component */}
            <div className="mb-2 text-blue-600">📄</div>
            <span className="text-center font-medium">{doc.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
