// src/components/StepOneInput.tsx
'use client';

import React from 'react';
import { File } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LegalDocument } from '@/types/documents';
import documentLibrary, { getDocumentsByCountry } from '@/lib/document-library';

interface StepOneInputProps {
  onSelectCategory: (_category: string) => void;
}

export function StepOneInput({ onSelectCategory }: StepOneInputProps) {
  const deriveCategories = React.useCallback((docs: LegalDocument[]) => {
    return Array.from(
      new Set(
        docs
          .filter((doc) => doc.id !== 'general-inquiry')
          .map((doc) => doc.category),
      ),
    );
  }, []);

  const [categories, setCategories] = React.useState<string[]>(
    deriveCategories(documentLibrary),
  );

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const docs = await getDocumentsByCountry('us');
        if (!cancelled && docs.length) {
          setCategories(deriveCategories(docs));
        }
      } catch (_) {
        if (!cancelled) {
          setCategories(deriveCategories(documentLibrary));
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [deriveCategories]);

  return (
    <div className="max-w-3xl mx-auto py-8 overflow-x-hidden">
      <h2 className="text-2xl font-bold mb-2">Step 1: Select Category</h2>
      <p className="mb-6">Choose the legal area that best fits your needs.</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={cn(
              'flex flex-col items-center p-4 border rounded-lg shadow-sm hover:shadow-md transition',
              'hover:-translate-y-1 hover:shadow-glass transition-all duration-200',
              'active:scale-95 motion-reduce:transform-none',
            )}
          >
            <File className="w-6 h-6 mb-2 text-blue-600" />
            <span className="text-center">{category}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
