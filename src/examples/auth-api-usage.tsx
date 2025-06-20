'use client'

// src/examples/auth-api-usage.tsx
// Example component showing how to use authenticated API calls

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { generateAuthenticatedPdf, authenticatedFetch } from '@/lib/client-auth';

export function AuthApiUsageExample() {
  const { isLoggedIn, user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePdf = async () => {
    if (!isLoggedIn) {
      setError('Please log in first');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Example: Generate PDF with authentication
      const pdfBlob = await generateAuthenticatedPdf({
        documentType: 'bill-of-sale-vehicle',
        answers: {
          sellerName: 'John Doe',
          buyerName: 'Jane Smith',
          vehicleYear: '2020',
          vehicleMake: 'Toyota',
          vehicleModel: 'Camry',
          salePrice: '15000'
        },
        state: 'CA'
      });

      // Create download link
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'vehicle-bill-of-sale.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

    } catch (err) {
      console.error('PDF generation failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCustomApiCall = async () => {
    if (!isLoggedIn) {
      setError('Please log in first');
      return;
    }

    try {
      // Example: Make any authenticated API call
      const response = await authenticatedFetch('/api/some-protected-endpoint', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('API response:', data);
      
    } catch (err) {
      console.error('API call failed:', err);
      setError(err instanceof Error ? err.message : 'API call failed');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="p-4 border border-yellow-300 bg-yellow-50 rounded-md">
        <p className="text-yellow-800">Please log in to use authenticated API features.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Authenticated API Usage</h2>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Logged in as: <strong>{user?.email}</strong>
        </p>
        <p className="text-sm text-gray-600">
          User ID: <strong>{user?.uid}</strong>
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="space-y-3">
        <button
          onClick={handleGeneratePdf}
          disabled={isGenerating}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isGenerating ? 'Generating PDF...' : 'Generate Authenticated PDF'}
        </button>

        <button
          onClick={handleCustomApiCall}
          className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Make Custom API Call
        </button>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded text-sm">
        <h3 className="font-semibold mb-2">How it works:</h3>
        <ul className="space-y-1 text-gray-700">
          <li>• API calls automatically include Firebase ID token</li>
          <li>• Server verifies token using Firebase Admin SDK</li>
          <li>• User identity is available in API route handlers</li>
          <li>• Secure and scalable authentication pattern</li>
        </ul>
      </div>
    </div>
  );
}

export default AuthApiUsageExample;