'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Download, 
  CreditCard,
  AlertCircle,
  Shield,
  Clock
} from 'lucide-react';
import { documentIntelligence, UniversalFormWizardManager } from '@/lib/document-intelligence/engine';
import { DocumentStrategy, DocumentType, Jurisdiction, SubJurisdiction } from '@/lib/document-intelligence/types';
import { floridaVehicleBillOfSaleStrategy } from '@/lib/document-intelligence/strategies/vehicle-bill-of-sale-us';
import EnhancedStatePDFPreview from './EnhancedStatePDFPreview';

interface UniversalDocumentWizardProps {
  documentType: DocumentType;
  jurisdiction: Jurisdiction;
  subJurisdiction?: SubJurisdiction;
  language?: string;
  onComplete?: (document: ArrayBuffer) => void;
  onPaymentRequired?: (strategy: DocumentStrategy, formData: Record<string, unknown>) => void;
}

export default function UniversalDocumentWizard({
  documentType,
  jurisdiction,
  subJurisdiction,
  language = 'en',
  onComplete,
  onPaymentRequired
}: UniversalDocumentWizardProps) {
  const [strategy, setStrategy] = useState<DocumentStrategy | null>(null);
  const [wizard, setWizard] = useState<UniversalFormWizardManager | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [paymentRequired, setPaymentRequired] = useState(false);

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {}
  });

  const { watch, setValue } = methods;
  const formData = watch();

  // Initialize the wizard with the appropriate strategy
  useEffect(() => {
    const initializeWizard = async () => {
      try {
        setLoading(true);
        
        // Register strategies (in production, this would be loaded from database)
        documentIntelligence.registerStrategy(floridaVehicleBillOfSaleStrategy);
        
        // Get the best strategy for this document/jurisdiction combination
        const selectedStrategy = documentIntelligence.getStrategy(
          documentType,
          jurisdiction,
          subJurisdiction,
          language
        );

        if (!selectedStrategy) {
          throw new Error(`No strategy found for ${documentType} in ${jurisdiction}${subJurisdiction ? `:${subJurisdiction}` : ''}`);
        }

        console.log('🎯 Selected strategy:', selectedStrategy.id);
        setStrategy(selectedStrategy);

        // Create wizard manager
        const wizardManager = new UniversalFormWizardManager(selectedStrategy);
        setWizard(wizardManager);

        // Initialize form with default values
        const defaultValues: Record<string, unknown> = {};
        selectedStrategy.questionFlow.forEach(section => {
          section.fields.forEach(field => {
            if (field.id === 'state' && subJurisdiction) {
              defaultValues[field.id] = subJurisdiction;
            }
          });
        });

        Object.keys(defaultValues).forEach(key => {
          setValue(key, defaultValues[key]);
        });

      } catch (err) {
        console.error('Failed to initialize wizard:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize wizard');
      } finally {
        setLoading(false);
      }
    };

    initializeWizard();
  }, [documentType, jurisdiction, subJurisdiction, language, setValue]);

  // Update wizard when form data changes
  useEffect(() => {
    if (wizard) {
      Object.keys(formData).forEach(key => {
        wizard.updateFormData(key, formData[key]);
      });
    }
  }, [formData, wizard]);

  const handleNextSection = useCallback(() => {
    if (wizard && wizard.validateCurrentSection()) {
      wizard.nextSection();
      setShowPreview(true); // Show preview after completing sections
    }
  }, [wizard]);

  const handlePreviousSection = useCallback(() => {
    if (wizard) {
      wizard.previousSection();
    }
  }, [wizard]);

  const handlePreview = useCallback(async () => {
    if (!wizard) return;

    try {
      const preview = await wizard.generatePreview();
      if (preview) {
        setShowPreview(true);
      }
    } catch (err) {
      console.error('Preview failed:', err);
    }
  }, [wizard]);

  const handleDownload = useCallback(async () => {
    if (!wizard || !strategy) return;

    try {
      const result = await wizard.generateFinalDocument();
      
      if (result.requiresPayment) {
        setPaymentRequired(true);
        onPaymentRequired?.(strategy, formData);
        return;
      }

      if (result.success && result.document) {
        onComplete?.(result.document);
      } else {
        setError(result.error || 'Failed to generate document');
      }
    } catch (err) {
      console.error('Download failed:', err);
      setError('Failed to generate document');
    }
  }, [wizard, strategy, formData, onComplete, onPaymentRequired]);

  const handlePayment = useCallback(() => {
    // Trigger payment flow
    if (strategy) {
      onPaymentRequired?.(strategy, formData);
    }
  }, [strategy, formData, onPaymentRequired]);

  const renderComplianceInfo = () => {
    if (!strategy) return null;

    return (
      <Card className="mb-6">
        <CardContent className="pt-4">
          <div className="flex items-start gap-4">
            <Shield className="h-5 w-5 text-blue-500 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-sm mb-2">Legal Requirements for {strategy.subJurisdiction || strategy.jurisdiction}</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {strategy.compliance.requiresNotary && (
                  <Badge variant="destructive" className="text-xs">
                    Notarization Required
                  </Badge>
                )}
                {strategy.compliance.requiresWitness && (
                  <Badge variant="outline" className="text-xs">
                    Witness Required
                  </Badge>
                )}
                {strategy.formType === 'official-form' && (
                  <Badge variant="default" className="text-xs">
                    Official State Form
                  </Badge>
                )}
              </div>
              {strategy.compliance.specialRequirements && (
                <div className="text-sm text-muted-foreground">
                  {strategy.compliance.specialRequirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-2 mt-1">
                      <AlertCircle className="h-3 w-3" />
                      <span>{req.description[language] || req.description.en}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderPricingInfo = () => {
    if (!strategy) return null;

    return (
      <Card className="mb-6">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Document Price</h3>
              <p className="text-2xl font-bold text-green-600">
                ${strategy.pricing.basePrice.toFixed(2)} {strategy.pricing.currency}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">What&apos;s included:</p>
              {strategy.pricing.priceBreakdown?.map((item, index) => (
                <div key={index} className="text-xs text-muted-foreground">
                  {item.description[language] || item.description.en}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderCurrentSection = () => {
    if (!strategy || !wizard) return null;

    const currentSection = strategy.questionFlow[wizard.currentSection];
    if (!currentSection) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>{currentSection.title[language] || currentSection.title.en}</span>
            <Badge variant="outline" className="text-xs">
              {wizard.currentSection + 1} of {strategy.questionFlow.length}
            </Badge>
          </CardTitle>
          {currentSection.description && (
            <p className="text-sm text-muted-foreground">
              {currentSection.description[language] || currentSection.description.en}
            </p>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentSection.fields.map(field => (
              <div key={field.id}>
                <label className="block text-sm font-medium mb-1">
                  {field.label[language] || field.label.en}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                
                {field.type === 'select' ? (
                  <select
                    {...methods.register(field.id, { required: field.required })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select...</option>
                    {field.options?.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label[language] || option.label.en}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea
                    {...methods.register(field.id, { required: field.required })}
                    className="w-full p-2 border rounded-md"
                    rows={3}
                    placeholder={field.placeholder?.[language] || field.placeholder?.en}
                  />
                ) : field.type === 'checkbox' ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      {...methods.register(field.id, { required: field.required })}
                      className="rounded"
                    />
                    <span className="text-sm">
                      {field.label[language] || field.label.en}
                    </span>
                  </div>
                ) : (
                  <input
                    type={field.type}
                    {...methods.register(field.id, { required: field.required })}
                    className="w-full p-2 border rounded-md"
                    placeholder={field.placeholder?.[language] || field.placeholder?.en}
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderPreview = () => {
    if (!strategy || !showPreview) return null;

    // For official forms, show the PDF preview
    if (strategy.formType === 'official-form' && strategy.subJurisdiction) {
      return (
        <div className="h-full">
          <EnhancedStatePDFPreview
            state={strategy.subJurisdiction}
            formData={formData}
            documentType={documentType as 'vehicle-bill-of-sale'}
            showLivePreview={!paymentRequired}
          />
        </div>
      );
    }

    // For custom templates, show markdown preview
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Document Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-6 bg-white min-h-[600px]">
            <h2 className="text-2xl font-bold mb-6">
              {documentType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </h2>
            <div className="space-y-4">
              {Object.entries(formData).map(([key, value]) => (
                <div key={key}>
                  <strong>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong> {String(value)}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Clock className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Loading document wizard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!strategy || !wizard) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Unable to load document wizard</AlertDescription>
      </Alert>
    );
  }

  return (
    <FormProvider {...methods}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        {/* Left Panel - Form */}
        <div className="space-y-6">
          {/* Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">
                {Math.round(wizard.completionPercentage)}% Complete
              </span>
            </div>
            <Progress value={wizard.completionPercentage} className="h-2" />
          </div>

          {/* Compliance Info */}
          {renderComplianceInfo()}

          {/* Current Section */}
          {renderCurrentSection()}

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePreviousSection}
              disabled={wizard.currentSection === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handlePreview}
                disabled={!wizard.canPreview()}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>

              {wizard.currentSection < strategy.questionFlow.length - 1 ? (
                <Button onClick={handleNextSection}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleDownload} className="bg-green-600 hover:bg-green-700">
                  {wizard.requiresPayment() ? (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Pay & Download
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Pricing Info */}
          {renderPricingInfo()}

          {/* Payment Required Alert */}
          {paymentRequired && (
            <Alert>
              <CreditCard className="h-4 w-4" />
              <AlertDescription>
                Complete your purchase to download the final document.
                <Button onClick={handlePayment} className="ml-2" size="sm">
                  Pay Now ${strategy.pricing.basePrice}
                </Button>
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Right Panel - Preview */}
        <div className="h-full">
          {renderPreview()}
        </div>
      </div>
    </FormProvider>
  );
}