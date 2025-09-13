'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { getVehicleBillOfSaleCompliance, requiresNotaryForVehicleBillOfSale } from '@/lib/compliance-helper';
import { DynamicForm } from '@/components/forms/SimpleDynamicForm';
import { generateVehicleBillOfSalePDF } from '@/lib/pdf/vehicle-bill-of-sale-generator';
import { getQuestionsForState, requiresOfficialPdfForm, getStateDisplayName } from './vehicle-bill-of-sale/state-question-router';
import { fillStateOfficialForm } from '@/lib/pdf/state-form-filler';

export const VehicleBillOfSalePageClient: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<any>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPDF, setGeneratedPDF] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string>('');
  const [stateQuestionConfig, setStateQuestionConfig] = useState<any>(null);

  const form = useForm<any>({
    defaultValues: formData,
    mode: 'onChange'
  });

  const compliance = selectedState ? getVehicleBillOfSaleCompliance(selectedState) : null;
  const requiresNotary = selectedState ? requiresNotaryForVehicleBillOfSale(selectedState) : false;

  // Update questions when state changes
  React.useEffect(() => {
    if (selectedState) {
      const config = getQuestionsForState(selectedState);
      setStateQuestionConfig(config);
      setFormData(prev => ({ ...prev, state: selectedState }));
    }
  }, [selectedState]);

  const onSubmit = async (data: any) => {
    setIsGenerating(true);
    try {
      let pdfUrl: string;

      // Check if state requires official form
      if (stateQuestionConfig?.requiresSpecialHandling && stateQuestionConfig?.pdfPath) {
        // Use official state form
        pdfUrl = await fillStateOfficialForm(
          stateQuestionConfig.pdfPath,
          { ...formData, ...data },
          selectedState
        );
      } else {
        // Use generic bill of sale
        pdfUrl = await generateVehicleBillOfSalePDF({ ...formData, ...data });
      }

      setGeneratedPDF(pdfUrl);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(`Error generating PDF: ${error.message}. Please try again.`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const progress = ((currentStep + 1) / 4) * 100;

  if (generatedPDF) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">✅ Vehicle Bill of Sale Generated</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p>Your vehicle bill of sale has been successfully generated!</p>
            {compliance && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold mb-2">State Compliance Information:</h3>
                {requiresNotary && (
                  <Badge variant="outline" className="mr-2">
                    ⚠️ Notarization Required
                  </Badge>
                )}
                {compliance.officialForm && (
                  <Badge variant="outline" className="mr-2">
                    📋 Official State Form
                  </Badge>
                )}
                {compliance.specialNotes && (
                  <p className="text-sm mt-2">{compliance.specialNotes}</p>
                )}
              </div>
            )}
            <div className="space-y-2">
              <a
                href={generatedPDF}
                download="vehicle-bill-of-sale.pdf"
                className="inline-block"
              >
                <Button size="lg" className="w-full">
                  📄 Download PDF
                </Button>
              </a>
              <Button
                variant="outline"
                onClick={() => {
                  setGeneratedPDF(null);
                  setCurrentStep(0);
                  form.reset();
                }}
                className="w-full"
              >
                Create Another Document
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-4">
          Vehicle Bill of Sale Generator
        </h1>
        <p className="text-center text-muted-foreground mb-6">
          {selectedState
            ? `Create a legally compliant vehicle bill of sale for ${getStateDisplayName(selectedState)}`
            : 'Create a legally compliant vehicle bill of sale for all 50 states'
          }
        </p>

        <div className="max-w-md mx-auto mb-8">
          <Progress value={progress} className="mb-2" />
          <p className="text-sm text-center text-muted-foreground">
            Step {currentStep + 1} of 4
          </p>
        </div>

        {/* State Selection First */}
        {!selectedState && (
          <div className="max-w-md mx-auto mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Step 1: Select Your State</CardTitle>
              </CardHeader>
              <CardContent>
                <select
                  className="w-full border rounded-md px-3 py-2"
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                >
                  <option value="">Choose your state...</option>
                  {['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'].map(state => (
                    <option key={state} value={state}>{getStateDisplayName(state)}</option>
                  ))}
                </select>
                <p className="text-sm text-muted-foreground mt-2">
                  State selection determines compliance requirements and form type.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedState && compliance && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold mb-2">
              State Compliance: {getStateDisplayName(selectedState)}
              {stateQuestionConfig?.requiresSpecialHandling && (
                <span className="ml-2 text-sm text-blue-600">(Official Form Required)</span>
              )}
            </h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {requiresNotary ? (
                <Badge variant="destructive">⚠️ Notarization Required</Badge>
              ) : (
                <Badge variant="default">✅ No Notarization Required</Badge>
              )}
              {compliance.officialForm && (
                <Badge variant="outline">📋 Official State Form: {compliance.officialForm}</Badge>
              )}
              {compliance.billOfSaleMandatory && (
                <Badge variant="outline">📝 Bill of Sale Mandatory</Badge>
              )}
              {stateQuestionConfig?.requiresSpecialHandling && (
                <Badge variant="secondary">🎯 State-Specific Questions</Badge>
              )}
            </div>
            {compliance.specialNotes && (
              <p className="text-sm text-muted-foreground">{compliance.specialNotes}</p>
            )}
            <button
              onClick={() => setSelectedState('')}
              className="text-sm text-blue-600 hover:underline mt-2"
            >
              Change State
            </button>
          </div>
        )}
      </div>

      {selectedState && stateQuestionConfig && (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {currentStep === 0 && 'Step 2: Document & Vehicle Information'}
                {currentStep === 1 && 'Step 3: Seller Information'}
                {currentStep === 2 && 'Step 4: Buyer Information'}
                {currentStep === 3 && 'Step 5: Sale Terms & Review'}
                {stateQuestionConfig.requiresSpecialHandling && (
                  <span className="ml-2 text-sm text-green-600">
                    (Using Official {getStateDisplayName(selectedState)} Form)
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DynamicForm
                form={form}
                questions={stateQuestionConfig.questions.filter((q: any, index: number) => {
                  const totalQuestions = stateQuestionConfig.questions.length;
                  const questionsPerStep = Math.ceil(totalQuestions / 4);

                  const startIndex = currentStep * questionsPerStep;
                  const endIndex = (currentStep + 1) * questionsPerStep;

                  return index >= startIndex && index < endIndex;
                })}
                values={formData}
                onChange={(data) => setFormData(data)}
              />
            </CardContent>
          </Card>

        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevStep}
            disabled={currentStep === 0}
          >
            Previous
          </Button>

          {currentStep < 3 ? (
            <Button
              type="button"
              onClick={handleNextStep}
            >
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isGenerating}
              className="min-w-32"
            >
              {isGenerating ? 'Generating...' :
                stateQuestionConfig?.requiresSpecialHandling
                  ? `Generate Official ${getStateDisplayName(selectedState)} Form`
                  : 'Generate PDF'
              }
            </Button>
          )}
        </div>
        </form>
      )}
    </div>
  );
};

export const VehicleFaqSection: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h2 className="text-2xl font-bold text-center mb-6">Frequently Asked Questions</h2>
      <div className="space-y-4">
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">Do I need to notarize my vehicle bill of sale?</h3>
            <p className="text-muted-foreground">
              Notarization requirements vary by state. Our system automatically checks your state's requirements and will alert you if notarization is needed.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">Is this bill of sale legally binding?</h3>
            <p className="text-muted-foreground">
              Yes, our bill of sale templates are designed to be legally compliant in all 50 states when properly completed and executed.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">What if my state requires an official form?</h3>
            <p className="text-muted-foreground">
              For states that require official DMV forms, our system will provide you with the correct state-specific form pre-filled with your information.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
