'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, FileText, CheckCircle } from 'lucide-react';
import { loadDocumentConfig, type DocumentConfig } from '@/lib/config-loader';
import DynamicForm from '@/components/forms/DynamicForm';

export default function BasicNDAPageClientWrapper() {
  const [config, setConfig] = useState<DocumentConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('BasicNDAPageClientWrapper: Loading basic-nda configuration');
        const documentConfig = await loadDocumentConfig('basic-nda', 'us/generic');
        
        setConfig(documentConfig);
        console.log('✅ BasicNDAPageClientWrapper: Loaded configuration:', documentConfig);
      } catch (err) {
        console.error('❌ BasicNDAPageClientWrapper: Failed to load configuration:', err);
        setError(err instanceof Error ? err.message : 'Failed to load document configuration');
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  const handleSave = (data: Record<string, any>) => {
    setFormData(data);
    console.log('BasicNDAPageClientWrapper: Form data saved:', data);
    
    // Save to localStorage for persistence
    localStorage.setItem('basic-nda-draft', JSON.stringify(data));
  };

  const handleSubmit = (data: Record<string, any>) => {
    console.log('BasicNDAPageClientWrapper: Form submitted:', data);
    setFormData(data);
    
    // Here you would typically:
    // 1. Generate the PDF
    // 2. Save the completed document
    // 3. Redirect to download/payment page
    alert('NDA generation would happen here! (Demo mode)');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading NDA configuration...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !config) {
    return (
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="py-8">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error || 'Failed to load document configuration'}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <CardTitle className="text-2xl">Basic Non-Disclosure Agreement</CardTitle>
                <p className="text-muted-foreground mt-1">
                  Create a professional NDA to protect your confidential information
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>JSON-driven configuration</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>State-specific compliance</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Mutual & unilateral options</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <DynamicForm
              config={config}
              onSave={handleSave}
              onSubmit={handleSubmit}
              autoSave={true}
              showProgress={true}
              className="space-y-6"
            />
          </div>
          
          {/* Preview/Info Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Document Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-medium">Disclosing Party</h4>
                    <p className="text-muted-foreground">
                      {formData.disclosing_party_name || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Receiving Party</h4>
                    <p className="text-muted-foreground">
                      {formData.receiving_party_name || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Type</h4>
                    <p className="text-muted-foreground">
                      {formData.mutual ? 'Mutual NDA' : 'Unilateral NDA'}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Information Type</h4>
                    <p className="text-muted-foreground">
                      {formData.information_type ? 
                        config.questions.find(q => q.id === 'information_type')?.options?.find(opt => opt.value === formData.information_type)?.label 
                        : 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Duration</h4>
                    <p className="text-muted-foreground">
                      {formData.duration_years ? `${formData.duration_years} years` : 'Not specified'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Legal Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>No notarization required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Valid in all US states</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Attorney-reviewed template</span>
                  </div>
                </div>
                
                {config.compliance.specialNotes && (
                  <Alert className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      {config.compliance.specialNotes}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}