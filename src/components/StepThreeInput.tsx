// src/components/StepThreeInput.tsx
"use client";

import React, { useState } from 'react';
import { documentLibrary } from '@/lib/document-library/index';
import { analyzeFormData } from '@/ai/flows/analyze-form-data'; // Corrected import

interface Props {
  templateId: string;
  stateCode: string;
}

export function StepThreeInput({ templateId, stateCode }: Props) {
  const template = documentLibrary.find(doc => doc.id === templateId)!;
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [upsells, setUpsells] = useState({ notarize: false, record: false });

  const [aiIssues, setAiIssues] = useState<string[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isReviewing, setIsReviewing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const runAiCheck = async () => {
    setLoading(true);
    setIsReviewing(true);
    try {
      // Call the corrected function name
      const response = await analyzeFormData({ 
        documentType: template.name,
        // schema: template.questions || [], // Pass the schema if your analyzeFormData expects it
        answers: formData,
        // state: stateCode, // Pass state if analyzeFormData expects it
        // language: 'en', // Pass language if analyzeFormData expects it
      });
      // Assuming analyzeFormData returns an array of suggestions/issues objects
      // Adjust this based on the actual return type of analyzeFormData
      // For now, let's assume it returns an array of objects with a 'message' and 'type' (issue/suggestion)
      const issues = response.filter(r => r.importance === 'error' || r.importance === 'warning').map(r => r.message);
      const suggestions = response.filter(r => r.importance === 'info').map(r => r.message);
      
      setAiIssues(issues);
      setAiSuggestions(suggestions);

    } catch (err) {
      console.error("Error during AI check:", err);
      setAiIssues(['Unable to analyze the form. Please try again later.']);
      setAiSuggestions([]);
    }
    setLoading(false);
  };

  const allFieldsFilled = template.questions?.every(q => !q.required || formData[q.id]?.trim()) ?? true;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Step 3: Customize & Download</h2>
      <p className="mb-6 text-gray-700">Fill in the details below and preview your document.</p>

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

      {/* AI Review Panel */}
      {isReviewing && (
        <div className="bg-yellow-50 border border-yellow-300 rounded p-4 my-6">
          <h3 className="font-semibold text-lg text-yellow-800 mb-2">AI Legal Review</h3>

          {loading ? (
            <p className="text-yellow-700">Analyzing form responses...</p>
          ) : (
            <>
              {aiIssues.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-yellow-800">⚠️ Issues:</h4>
                  <ul className="list-disc list-inside text-sm text-yellow-800">
                    {aiIssues.map((issue, i) => (
                      <li key={`issue-${i}`}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
              {aiSuggestions.length > 0 && (
                <div className="mb-2">
                  <h4 className="font-medium text-yellow-800">💡 Suggestions:</h4>
                  <ul className="list-disc list-inside text-sm text-yellow-800">
                    {aiSuggestions.map((sugg, i) => (
                      <li key={`sugg-${i}`}>{sugg}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => setIsReviewing(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Revise Answers
                </button>
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  onClick={() => alert('Proceed to PDF preview...')}
                >
                  Looks Good → Continue
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Preview placeholder */}
      {!isReviewing && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>{/* Form remains here */}</div>
          <div className="bg-gray-50 rounded shadow h-80 flex items-center justify-center">
            <span className="text-gray-500">PDF Preview Loading…</span>
          </div>
        </div>
      )}

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

      {!isReviewing && (
        <button
          className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={!allFieldsFilled}
          onClick={runAiCheck}
        >
          {loading ? 'Reviewing...' : 'Run Legal Health Check'}
        </button>
      )}
    </div>
  );
}
