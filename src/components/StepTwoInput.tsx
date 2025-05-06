tsx
"use client";

"use client";

import React, { useState, useMemo } from "react";
import { documentLibrary, LegalDocument, findMatchingDocuments, usStates } from '@/lib/document-library';
import { FiSearch } from 'react-icons/fi';

interface Props {
  category: string;
  stateCode: string;
  onStateChange: (state: string) => void;
  onSelectTemplate: (templateId: string) => void;
}

export const StepTwoInput: React.FC<Props> = ({ category, stateCode, onStateChange, onSelectTemplate }) => {
  // Filter docs by category
  const docsByCategory = useMemo<LegalDocument[]>(() => findMatchingDocuments(category), [category]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Optionally show search if many
  const showSearch = docsByCategory.length > 7;

  // Filter by search
  const filteredDocs = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return term
      ? docsByCategory.filter(doc => doc.name.toLowerCase().includes(term))
      : docsByCategory;
  }, [docsByCategory, searchTerm]);

  return ( <div className="overflow-x-hidden">
    {/* Header */}
    <h2 className="text-xl font-semibold">Step 2: Choose Document</h2>
    <p className="mt-2 text-gray-700">Select your state and then choose a document template.</p>

    {/* State selector */}
    <div className="mt-4">
      <label htmlFor="state" className="block text-sm font-medium text-gray-800">
        State
      </label>
      <select
        id="state"
        value={stateCode}
        onChange={e => onStateChange(e.target.value)}
        className="mt-1 block w-full max-w-xs bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select a state</option>
        {usStates.map(st => (
          <option key={st} value={st}>{st}</option>
        ))}
      </select>
    </div>

    {/* Search field */}
    {showSearch && (
      <div className="mt-4 relative max-w-sm">
        <FiSearch className="absolute top-3 left-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search templates..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    )}

    {/* Templates grid */}
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {filteredDocs.map(doc => (
        <button
          key={doc.id}
          onClick={() => onSelectTemplate(doc.id)}
          className="flex flex-col items-start p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <h3 className="text-md font-medium text-gray-800">{doc.name}</h3>
          <p className="mt-1 text-sm text-gray-600">${doc.basePrice.toFixed(2)}</p>
        </button>
      ))}
    </div>

    {/* View All link */}
    {showSearch && (
      <div className="mt-4 text-center">
        <button className="text-blue-600 hover:underline" onClick={() => window.scrollTo({ top: 0 })}>View All Forms</button>
      </div>
    )}
  </div>
  );
};
          <button
            key={doc.id}
            onClick={() => handleSelectTemplate(doc.id)}
            className="flex items-center p-4 border rounded-lg hover:shadow-md transition"
          >
            <span className="text-2xl mr-3">📄</span>
            <div className="flex-1 text-left">
              <h3 className="font-medium">{doc.name}</h3>
              <p className="text-sm text-gray-500">${doc.basePrice.toFixed(2)}</p>
            </div>
            <ArrowRight className="text-gray-400" />
          </button>
        ))}
      </div>

      {docs.length > 6 && (
        <button
          onClick={() => setShowAll(x => !x)}
          className="mt-4 text-primary-600 hover:underline"
        >
          {showAll ? 'Show Less' : 'View All Forms'}
        </button>
      )}
    </div>
  );
};