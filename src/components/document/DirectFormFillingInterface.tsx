'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Download, 
  CreditCard, 
  CheckCircle, 
  AlertCircle, 
  Shield,
  Eye,
  Zap,
  MousePointer,
  Save
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select';
  required: boolean;
  placeholder?: string;
  options?: string[];
  validation?: {
    pattern?: string;
    min?: number;
    max?: number;
  };
  coordinates: {
    x: number;
    y: number;
    width: number;
    height: number;
    page: number;
  };
}

interface DirectFormFillingInterfaceProps {
  state: string;
  formName: string;
  pdfUrl: string;
  formFields: FormField[];
  onComplete: (formData: Record<string, any>) => void;
  onPaymentRequired: (formData: Record<string, any>) => void;
  requiresNotary?: boolean;
  basePrice: number;
  initialFormData?: Record<string, any>;
}

export default function DirectFormFillingInterface({
  state,
  formName,
  pdfUrl,
  formFields,
  onComplete,
  onPaymentRequired,
  requiresNotary = false,
  basePrice,
  initialFormData = {}
}: DirectFormFillingInterfaceProps) {
  const [formData, setFormData] = useState<Record<string, any>>(initialFormData);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [completedFields, setCompletedFields] = useState<Set<string>>(new Set());
  const [showPayment, setShowPayment] = useState(false);
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Initialize form data and completed fields from initial data
  useEffect(() => {
    if (initialFormData && Object.keys(initialFormData).length > 0) {
      setFormData(initialFormData);
      
      // Mark fields as completed if they have values
      const completed = new Set<string>();
      Object.entries(initialFormData).forEach(([key, value]) => {
        if (value && value.toString().trim()) {
          completed.add(key);
        }
      });
      setCompletedFields(completed);
    }
  }, [initialFormData]);

  // Calculate completion percentage
  const completionPercentage = (completedFields.size / formFields.length) * 100;
  const requiredFields = formFields.filter(f => f.required);
  const requiredCompleted = requiredFields.filter(f => completedFields.has(f.id)).length;
  const canSubmit = requiredCompleted === requiredFields.length;

  const updateField = useCallback((fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    
    if (value && value.toString().trim()) {
      setCompletedFields(prev => new Set([...prev, fieldId]));
    } else {
      setCompletedFields(prev => {
        const updated = new Set(prev);
        updated.delete(fieldId);
        return updated;
      });
    }
  }, []);

  const handleFieldClick = useCallback((fieldId: string) => {
    setActiveField(fieldId);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!canSubmit) return;
    
    setShowPayment(true);
    onPaymentRequired(formData);
  }, [canSubmit, formData, onPaymentRequired]);

  const handlePayment = useCallback(() => {
    // This would trigger your payment system
    // After successful payment, call onComplete
    onComplete(formData);
  }, [formData, onComplete]);

  // Auto-save functionality
  useEffect(() => {
    const saveTimer = setTimeout(() => {
      if (Object.keys(formData).length > 0) {
        localStorage.setItem(`form_draft_${state}`, JSON.stringify(formData));
      }
    }, 1000);

    return () => clearTimeout(saveTimer);
  }, [formData, state]);

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem(`form_draft_${state}`);
    if (draft) {
      try {
        const draftData = JSON.parse(draft);
        setFormData(draftData);
        
        // Mark fields as completed
        const completed = new Set<string>();
        Object.entries(draftData).forEach(([key, value]) => {
          if (value && value.toString().trim()) {
            completed.add(key);
          }
        });
        setCompletedFields(completed);
      } catch (e) {
        console.warn('Failed to load draft:', e);
      }
    }
  }, [state]);

  const renderFormField = (field: FormField) => {
    const value = formData[field.id] || '';
    const isActive = activeField === field.id;
    const isCompleted = completedFields.has(field.id);

    return (
      <div
        key={field.id}
        className={cn(
          "mb-4 p-3 border rounded-lg transition-all duration-200",
          isActive && "border-blue-500 bg-blue-50 shadow-md",
          isCompleted && !isActive && "border-green-500 bg-green-50",
          field.required && !isCompleted && "border-orange-300"
        )}
        onClick={() => handleFieldClick(field.id)}
      >
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium flex items-center gap-2">
            {field.label}
            {field.required && <span className="text-red-500">*</span>}
            {isCompleted && <CheckCircle className="h-4 w-4 text-green-500" />}
          </label>
          <div className="flex items-center gap-1">
            <MousePointer className="h-3 w-3 text-gray-400" />
            <span className="text-xs text-gray-500">Page {field.coordinates.page}</span>
          </div>
        </div>

        {field.type === 'select' ? (
          <select
            value={value}
            onChange={(e) => updateField(field.id, e.target.value)}
            className={cn(
              "w-full p-2 border rounded-md text-sm",
              isActive && "border-blue-500 focus:ring-2 focus:ring-blue-200"
            )}
          >
            <option value="">Select...</option>
            {field.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        ) : field.type === 'date' ? (
          <input
            type="date"
            value={value}
            onChange={(e) => updateField(field.id, e.target.value)}
            className={cn(
              "w-full p-2 border rounded-md text-sm",
              isActive && "border-blue-500 focus:ring-2 focus:ring-blue-200"
            )}
          />
        ) : (
          <input
            type={field.type}
            value={value}
            onChange={(e) => updateField(field.id, e.target.value)}
            placeholder={field.placeholder}
            className={cn(
              "w-full p-2 border rounded-md text-sm",
              isActive && "border-blue-500 focus:ring-2 focus:ring-blue-200"
            )}
          />
        )}

        {field.required && !isCompleted && (
          <p className="text-xs text-orange-600 mt-1">Required field</p>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Left Panel - Form Fields */}
      <div className="space-y-6">
        {/* Header */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">{state.toUpperCase()} Official Form</CardTitle>
                <p className="text-sm text-muted-foreground">{formName}</p>
              </div>
              <div className="flex items-center gap-2">
                {requiresNotary && (
                  <Badge variant="destructive" className="text-xs">
                    <Shield className="h-3 w-3 mr-1" />
                    Notary Required
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs">
                  Official Form
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Progress */}
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Completion Progress</span>
              <span className="text-sm text-muted-foreground">
                {completedFields.size} of {formFields.length} fields
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Save className="h-3 w-3" />
              <span>Auto-saved as you type</span>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Alert>
          <Zap className="h-4 w-4" />
          <AlertDescription>
            <strong>How to fill this form:</strong> Click on any field below to see exactly where it appears on the official form. 
            Fill out all required fields (*) to proceed with download.
          </AlertDescription>
        </Alert>

        {/* Form Fields */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Form Fields</CardTitle>
            <p className="text-sm text-muted-foreground">
              Complete all required fields to generate your document
            </p>
          </CardHeader>
          <CardContent className="space-y-1">
            {formFields.map(renderFormField)}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Document Price</p>
                <p className="text-2xl font-bold text-green-600">${basePrice.toFixed(2)}</p>
              </div>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  disabled={completedFields.size === 0}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pay & Download
                </Button>
              </div>
            </div>
            
            {!canSubmit && (
              <p className="text-sm text-orange-600 mt-2">
                Complete {requiredFields.length - requiredCompleted} more required fields to proceed
              </p>
            )}
          </CardContent>
        </Card>

        {/* Payment Modal */}
        {showPayment && (
          <Alert>
            <CreditCard className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <span>Ready to complete your {state} vehicle bill of sale?</span>
                <Button onClick={handlePayment} size="sm" className="bg-green-600 hover:bg-green-700">
                  Pay ${basePrice.toFixed(2)}
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Right Panel - PDF Preview */}
      <div className="h-full">
        <Card className="h-full">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Official Form Preview</CardTitle>
              <Badge variant="secondary" className="text-xs">
                Live Preview
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Your answers appear automatically on the official form
            </p>
          </CardHeader>
          <CardContent className="p-4 h-full">
            <div className="relative h-full">
              {!pdfLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground">Loading official form...</p>
                  </div>
                </div>
              )}
              
              <iframe
                ref={iframeRef}
                src={pdfUrl}
                className="w-full h-full border-0 rounded-lg"
                title="Official Form Preview"
                onLoad={() => setPdfLoaded(true)}
                style={{ minHeight: '600px' }}
              />
              
              {/* Field Indicators */}
              {activeField && (
                <div className="absolute top-2 left-2 bg-blue-600 text-white px-3 py-1 rounded-md text-sm">
                  Editing: {formFields.find(f => f.id === activeField)?.label}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}