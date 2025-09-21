// src/components/StepTwoInput.tsx
'use client';

import React, { useState } from 'react';
import { usStates } from '@/lib/usStates';
import type { DocumentSummary } from '@/lib/workflow/document-workflow';
import { loadWorkflowModule } from '@/lib/workflow/load-workflow-module';

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
  const [workflowModule, setWorkflowModule] = useState<typeof import('@/lib/workflow/document-workflow') | null>(null);

  React.useEffect(() => {
    if (workflowModule) return;

    let cancelled = false;
    loadWorkflowModule()
      .then((module) => {
        if (!cancelled) {
          setWorkflowModule(module);
        }
      })
      .catch((error) => {
        if (!cancelled && process.env.NODE_ENV !== 'production') {
          console.error('Failed to load workflow module for StepTwoInput', error);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [workflowModule]);

  // Memoize list of docs in this category
  const docsInCategory: DocumentSummary[] = React.useMemo(
    () =>
      workflowModule
        ? workflowModule.getWorkflowDocumentsByCategory(category, {
            jurisdiction: 'us',
            state: stateCode || undefined,
          })
        : [],
    [category, stateCode, workflowModule],
  );

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[6rem]">
        {!stateCode ? (
          <div className="col-span-full text-sm text-gray-600">
            Select your state to see templates tailored to local requirements.
          </div>
        ) : docsInCategory.length === 0 ? (
          <div className="col-span-full text-sm text-gray-600">
            No templates available for this category in {stateCode.toUpperCase()}. Try a different
            state or category.
          </div>
        ) : (
          docsInCategory.map((doc) => (
            <button
              key={doc.id}
              onClick={() => onSelectTemplate(doc.id)}
              className="flex flex-col items-center p-4 border rounded-lg shadow-sm hover:shadow-md transition"
            >
              {/* Replace with your icon component */}
              <div className="mb-2 text-blue-600">📄</div>
              <span className="text-center font-medium">{doc.title}</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
