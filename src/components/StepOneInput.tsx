"use client";

import React from 'react';
import { FiFile } from 'react-icons/fi';


interface Props {
  onSelectCategory: (category: string) => void;
}

// Define the six main categories
  const categories = [
    { id: 'finance', name: 'Finance' },
    { id: 'business', name: 'Business' },
    { id: 'realEstate', name: 'Real Estate' },
    { id: 'family', name: 'Family' },
    { id: 'personal', name: 'Personal' },
    { id: 'estatePlanning', name: 'Estate Planning' },
  ];

export const StepOneInput: React.FC<Props> = ({ onSelectCategory }) => {
  return ( <div className="overflow-x-hidden">
    {/* Header with step indicator */}
    <div className="flex items-center space-x-2">
      <div className="bg-gray-100 p-2 rounded-full">
        <FiFile size={24} />
      </div>
      <h2 className="text-xl font-semibold">Step 1: Select Category</h2>
    </div>

    {/* Instruction text */}
    <p className="mt-2 text-gray-700">
      Choose the legal area that best fits your needs.
    </p>

    {/* Category grid */}
    <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelectCategory(cat.id)}
          className="flex flex-col items-center p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {/* Placeholder icon circle */}
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-2">
            <span className="text-blue-600 font-bold text-lg">
              {cat.name.charAt(0)}
            </span>
          </div>
          <span className="text-center text-sm font-medium text-gray-800">
            {cat.name}
          </span>
        </button>
      ))}
    </div>
  </div>

);
};
