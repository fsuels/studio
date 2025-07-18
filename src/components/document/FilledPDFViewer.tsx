'use client';

import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { overlayFormData } from '@/lib/pdf/pdf-overlay-service';

interface FilledPDFViewerProps {
  pdfPath: string;
  formData: Record<string, any>;
  state: string;
  title?: string;
}

export default function FilledPDFViewer({ pdfPath, formData, state, title }: FilledPDFViewerProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function generateFilledPDF() {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('📄 Generating filled PDF:', { 
          pdfPath, 
          state, 
          formDataKeys: Object.keys(formData),
          formData 
        });
        
        // Fetch the original PDF
        const response = await fetch(pdfPath);
        if (!response.ok) {
          throw new Error(`Failed to load PDF: ${response.status}`);
        }
        
        const pdfBytes = await response.arrayBuffer();
        
        // Apply form data overlay
        const filledPdfBytes = await overlayFormData(pdfBytes, formData, state);
        
        // Create blob URL for display
        const blob = new Blob([filledPdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
        
        console.log('✅ Filled PDF generated successfully');
      } catch (err) {
        console.error('❌ Error generating filled PDF:', err);
        setError(err instanceof Error ? err.message : 'Failed to generate PDF');
      } finally {
        setIsLoading(false);
      }
    }

    if (pdfPath && formData && state) {
      generateFilledPDF();
    }

    // Cleanup blob URL on unmount
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfPath, formData, state]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Generating your document...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 bg-red-50 rounded p-4">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-2">Error loading document</p>
          <p className="text-sm text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!pdfUrl) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded">
        <p className="text-gray-600">No document to display</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {title && (
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
      )}
      <iframe
        src={pdfUrl}
        width="100%"
        height="600"
        className="border rounded"
        title={title || "Filled PDF Document"}
      />
      <div className="mt-4 flex gap-2">
        <a
          href={pdfUrl}
          download={`${state}-vehicle-bill-of-sale-filled.pdf`}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Download Filled PDF
        </a>
      </div>
    </div>
  );
}