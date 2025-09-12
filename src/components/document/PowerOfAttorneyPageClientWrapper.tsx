'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertCircle, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { loadDocumentConfig, type DocumentConfig } from '@/lib/config-loader';
import DynamicForm from '@/components/forms/DynamicForm';
import StatePDFPreview from './StatePDFPreview';

export default function PowerOfAttorneyPageClientWrapper() {
  const [config, setConfig] = useState<DocumentConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, unknown>>({});

  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('PowerOfAttorneyPageClientWrapper: Loading power-of-attorney configuration');
        const documentConfig = await loadDocumentConfig('power-of-attorney', 'us/colorado');
        
        setConfig(documentConfig);
        console.log('✅ PowerOfAttorneyPageClientWrapper: Loaded configuration:', documentConfig);
      } catch (err) {
        console.error('❌ PowerOfAttorneyPageClientWrapper: Failed to load configuration:', err);
        setError(err instanceof Error ? err.message : 'Failed to load document configuration');
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  const handleSave = (data: Record<string, unknown>) => {
    setFormData(data);
    console.log('PowerOfAttorneyPageClientWrapper: Form data saved:', data);
    
    // Save to localStorage for persistence
    localStorage.setItem('power-of-attorney-draft', JSON.stringify(data));
  };

  const handleSubmit = (data: Record<string, unknown>) => {
    console.log('PowerOfAttorneyPageClientWrapper: Form submitted:', data);
    setFormData(data);
    
    // Here you would typically:
    // 1. Generate the PDF with overlay
    // 2. Save the completed document
    // 3. Redirect to download/payment page
    alert('Power of Attorney generation would happen here! (Demo mode)');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading Power of Attorney configuration...</p>
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
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              <div className="flex-1">
                <CardTitle className="text-2xl">Colorado Power of Attorney</CardTitle>
                <p className="text-muted-foreground mt-1">
                  Create a legally compliant power of attorney document for Colorado
                </p>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline">Colorado Form</Badge>
                {config.compliance.requiresNotary && (
                  <Badge variant="destructive">Notary Required</Badge>
                )}
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
                <span>Official Colorado form</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Smart PDF overlay</span>
              </div>
            </div>
            
            {/* Colorado-specific requirements alert */}
            <Alert className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Colorado Requirements:</strong> This power of attorney must be notarized and witnessed by two adults. 
                The document complies with Colorado Revised Statutes § 15-14-501 et seq.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Form and Preview */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="xl:col-span-1 space-y-6">
            <DynamicForm
              config={config}
              onSave={handleSave}
              onSubmit={handleSubmit}
              autoSave={true}
              showProgress={true}
              className="space-y-6"
            />
          </div>
          
          {/* Preview Section */}
          <div className="xl:col-span-2 space-y-6">
            {/* Live PDF Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Live Document Preview</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Your data will be overlaid on the official Colorado form
                </p>
              </CardHeader>
              <CardContent>
                {config.compliance.localFormPath ? (
                  <StatePDFPreview
                    state="CO"
                    formData={formData}
                    documentType="power-of-attorney"
                  />
                ) : (
                  <div className="border rounded-lg bg-muted/50 p-8 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      PDF preview will appear here when form data is entered
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Form Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Document Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-medium">Principal (Grantor)</h4>
                    <p className="text-muted-foreground">
                      {formData.principal_name || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Agent (Attorney-in-Fact)</h4>
                    <p className="text-muted-foreground">
                      {formData.agent_name || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Powers Granted</h4>
                    <p className="text-muted-foreground">
                      {formData.powers_granted ? 
                        config.questions.find(q => q.id === 'powers_granted')?.options?.find(opt => opt.value === formData.powers_granted)?.label 
                        : 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Durable Power</h4>
                    <p className="text-muted-foreground">
                      {formData.durability_clause ? 'Yes - Remains valid if incapacitated' : 'Standard power of attorney'}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Effective Date</h4>
                    <p className="text-muted-foreground">
                      {formData.effective_date || 'Not specified'}
                    </p>
                  </div>
                  {formData.successor_agent_name && (
                    <div>
                      <h4 className="font-medium">Successor Agent</h4>
                      <p className="text-muted-foreground">
                        {formData.successor_agent_name}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Legal Compliance Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Legal Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <span>Notarization required in Colorado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <span>Two witnesses required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Official Colorado statutory form</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Complies with C.R.S. § 15-14-501</span>
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