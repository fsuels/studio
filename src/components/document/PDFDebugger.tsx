'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { getStateFormPath } from '@/lib/pdf/state-form-manager';

const TEST_STATES = [
  'AL', 'CO', 'FL', 'GA', 'ID', 'KS', 'MD', 'MT', 'ND', 'WV'
];

interface PDFTestResult {
  state: string;
  path: string;
  accessible: boolean;
  error?: string;
  size?: number;
  contentType?: string;
}

export default function PDFDebugger() {
  const [testResults, setTestResults] = useState<PDFTestResult[]>([]);
  const [testing, setTesting] = useState(false);
  const [selectedState, setSelectedState] = useState<string>('FL');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const testPDFAccess = async (state: string): Promise<PDFTestResult> => {
    const path = getStateFormPath(state);
    
    if (!path) {
      return {
        state,
        path: 'No path found',
        accessible: false,
        error: 'No form path configured'
      };
    }

    try {
      const response = await fetch(path);
      
      return {
        state,
        path,
        accessible: response.ok,
        error: response.ok ? undefined : `${response.status} ${response.statusText}`,
        size: response.ok ? parseInt(response.headers.get('content-length') || '0') : undefined,
        contentType: response.headers.get('content-type') || undefined
      };
    } catch (error) {
      return {
        state,
        path,
        accessible: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };

  const runAllTests = async () => {
    setTesting(true);
    setTestResults([]);
    
    for (const state of TEST_STATES) {
      const result = await testPDFAccess(state);
      setTestResults(prev => [...prev, result]);
    }
    
    setTesting(false);
  };

  const previewPDF = async (state: string) => {
    const path = getStateFormPath(state);
    if (!path) return;

    try {
      const response = await fetch(path);
      if (!response.ok) return;

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
    } catch (error) {
      console.error('Preview failed:', error);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>PDF State Form Debugger</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Button onClick={runAllTests} disabled={testing}>
              {testing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                'Test All State PDFs'
              )}
            </Button>
            
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              {TEST_STATES.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            
            <Button 
              onClick={() => previewPDF(selectedState)}
              variant="outline"
            >
              Preview {selectedState}
            </Button>
          </div>

          {testResults.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">Test Results:</h3>
              {testResults.map((result) => (
                <div key={result.state} className="flex items-center gap-2 p-2 border rounded">
                  {result.accessible ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                  <Badge variant={result.accessible ? "default" : "destructive"}>
                    {result.state}
                  </Badge>
                  <span className="text-sm font-mono">{result.path}</span>
                  {result.size && (
                    <span className="text-xs text-gray-500">
                      {(result.size / 1024).toFixed(1)}KB
                    </span>
                  )}
                  {result.error && (
                    <span className="text-xs text-red-500">{result.error}</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {previewUrl && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">PDF Preview:</h3>
              <div className="border rounded-lg">
                <iframe
                  src={previewUrl}
                  className="w-full h-96"
                  title="PDF Preview"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}