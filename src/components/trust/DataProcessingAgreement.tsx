'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  FileText, 
  Download, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Building,
  MapPin,
  Globe,
  Calendar,
  Shield
} from 'lucide-react';

const dpaFormSchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  legalEntityName: z.string().min(2, 'Legal entity name is required'),
  contactName: z.string().min(2, 'Contact name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  jobTitle: z.string().min(2, 'Job title is required'),
  companyAddress: z.string().min(10, 'Please provide complete company address'),
  country: z.string().min(2, 'Country is required'),
  dataTypes: z.array(z.string()).min(1, 'Please select at least one data type'),
  processingPurpose: z.string().min(10, 'Please describe the processing purpose'),
  effectiveDate: z.string().min(1, 'Effective date is required')
});

type DPAFormData = z.infer<typeof dpaFormSchema>;

interface FormStatus {
  type: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
  downloadUrl?: string;
}

const dataTypeOptions = [
  { id: 'personal_identifiers', label: 'Personal Identifiers (name, email, phone)' },
  { id: 'financial_data', label: 'Financial Data (payment info, billing)' },
  { id: 'document_content', label: 'Document Content and Metadata' },
  { id: 'usage_analytics', label: 'Usage Analytics and Logs' },
  { id: 'authentication_data', label: 'Authentication Data' },
  { id: 'business_data', label: 'Business Information and Records' }
];

export function DataProcessingAgreement() {
  const [formStatus, setFormStatus] = useState<FormStatus>({ type: 'idle' });

  const form = useForm<DPAFormData>({
    resolver: zodResolver(dpaFormSchema),
    defaultValues: {
      companyName: '',
      legalEntityName: '',
      contactName: '',
      email: '',
      jobTitle: '',
      companyAddress: '',
      country: '',
      dataTypes: [],
      processingPurpose: '',
      effectiveDate: ''
    }
  });

  const onSubmit = async (data: DPAFormData) => {
    setFormStatus({ type: 'loading' });

    try {
      const response = await fetch('/api/trust/generate-dpa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate DPA');
      }

      const result = await response.json();
      
      setFormStatus({ 
        type: 'success', 
        message: 'Data Processing Agreement generated successfully.',
        downloadUrl: result.downloadUrl
      });
      
    } catch (error) {
      console.error('DPA generation error:', error);
      setFormStatus({ 
        type: 'error', 
        message: 'Failed to generate DPA. Please try again or contact our compliance team.'
      });
    }
  };

  const handleDataTypeChange = (dataTypeId: string, checked: boolean) => {
    const currentDataTypes = form.getValues('dataTypes');
    if (checked) {
      form.setValue('dataTypes', [...currentDataTypes, dataTypeId]);
    } else {
      form.setValue('dataTypes', currentDataTypes.filter(id => id !== dataTypeId));
    }
  };

  if (formStatus.type === 'success') {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <CardTitle>DPA Generated</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">{formStatus.message}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="flex-1" asChild>
              <a href={formStatus.downloadUrl} download>
                <Download className="h-4 w-4" />
                Download DPA
              </a>
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setFormStatus({ type: 'idle' })}
            >
              Generate Another DPA
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground">
            The download link will expire in 24 hours. Please save the document locally.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          <CardTitle>Data Processing Agreement</CardTitle>
        </div>
        <CardDescription>
          Generate a customized DPA for GDPR compliance and data processing transparency
        </CardDescription>
        <div className="flex gap-2 mt-2">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <Shield className="h-3 w-3 mr-1" />
            GDPR Compliant
          </Badge>
          <Badge variant="outline">Auto-Generated</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <Building className="h-3 w-3" />
                      Company Name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Acme Corporation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="legalEntityName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Legal Entity Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Acme Corporation Inc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Data Protection Officer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="dpo@acme.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="companyAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      Company Address
                    </FormLabel>
                    <FormControl>
                      <textarea
                        className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="123 Main St, Suite 100, New York, NY 10001"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        Country
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="United States" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="effectiveDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Effective Date
                      </FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="dataTypes"
              render={() => (
                <FormItem>
                  <FormLabel>Types of Personal Data Processed</FormLabel>
                  <div className="grid grid-cols-1 gap-3">
                    {dataTypeOptions.map((dataType) => (
                      <div key={dataType.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={dataType.id}
                          className="h-4 w-4 rounded border-input"
                          onChange={(e) => handleDataTypeChange(dataType.id, e.target.checked)}
                        />
                        <label 
                          htmlFor={dataType.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {dataType.label}
                        </label>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="processingPurpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purpose of Data Processing</FormLabel>
                  <FormControl>
                    <textarea
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Describe the specific business purposes for processing personal data..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {formStatus.type === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <p className="text-sm text-red-800">{formStatus.message}</p>
                </div>
              </div>
            )}

            <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
              <p className="font-medium mb-2">What's included in your DPA:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>GDPR-compliant data processing terms</li>
                <li>Security measures and breach notification procedures</li>
                <li>Data subject rights and deletion procedures</li>
                <li>Subprocessor terms and international transfer safeguards</li>
                <li>Customized for your specific data processing activities</li>
              </ul>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={formStatus.type === 'loading'}
            >
              {formStatus.type === 'loading' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating DPA...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Generate Data Processing Agreement
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              The generated DPA is legally compliant with GDPR Article 28 requirements. Review with your legal team before execution.
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}