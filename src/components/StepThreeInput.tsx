// src/components/StepThreeInput.tsx
"use client";

import React, { useState } from 'react';
import { documentLibrary } from '@/lib/document-library';
import { LegalDocument } from '@/lib/document-library';

interface Props {
  templateId: string;
  stateCode: string;
}

export function StepThreeInput({ templateId, stateCode }: Props) {
  const template = documentLibrary.find(doc => doc.id === templateId)!;
  const [formData, setFormData] = useState<Record<string,string>>({});
  const [upsells, setUpsells] = useState({
    notarize: false,
    record: false,
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Step 3: Customize & Download</h2>
      <p className="mb-6 text-gray-700">Fill in the details below and preview your document.</p>

      {/* Dynamically render each placeholder question */}
      {template.questions?.map(q => (
        <div key={q.id} className="mb-4">
          <label className="block font-medium mb-1">{q.label}</label>
          {q.type === 'textarea' ? (
            <textarea
              className="w-full border rounded p-2"
              value={formData[q.id] || ''}
              onChange={e => handleChange(q.id, e.target.value)}
            />
          ) : (
            <input
              type="text"
              className="w-full border rounded p-2"
              value={formData[q.id] || ''}
              onChange={e => handleChange(q.id, e.target.value)}
            />
          )}
        </div>
      ))}

      {/* Preview pane + form side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>{/* The form is on the left */}</div>
        <div className="bg-gray-50 rounded shadow h-80 flex items-center justify-center">
          <span className="text-gray-500">PDF Preview Loading…</span>
        </div>
      </div>

      {/* Upsells */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">Optional Services</h3>
        <label className="inline-flex items-center mr-6">
          <input
            type="checkbox"
            checked={upsells.notarize}
            onChange={() => setUpsells(prev => ({ ...prev, notarize: !prev.notarize }))}
          />
          <span className="ml-2">Notarization ($10)</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={upsells.record}
            onChange={() => setUpsells(prev => ({ ...prev, record: !prev.record }))}
          />
          <span className="ml-2">Recording Assistance ($15)</span>
        </label>
      </div>

      {/* Final action */}
      <button className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700">
        Pay & Download
      </button>
    </div>
  );
}