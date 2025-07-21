'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Award,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
  Building,
  Mail,
  User,
} from 'lucide-react';

const soc2RequestSchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  contactName: z.string().min(2, 'Contact name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  jobTitle: z.string().min(2, 'Job title must be at least 2 characters'),
  phone: z.string().optional(),
  requestReason: z
    .string()
    .min(10, 'Please provide more details about your request'),
  intendedUse: z.enum(
    ['vendor_assessment', 'compliance_audit', 'security_review', 'other'],
    {
      required_error: 'Please select the intended use',
    },
  ),
});

type SOC2RequestFormData = z.infer<typeof soc2RequestSchema>;

interface FormStatus {
  type: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
}

export function SOC2RequestForm() {
  const [formStatus, setFormStatus] = useState<FormStatus>({ type: 'idle' });

  const form = useForm<SOC2RequestFormData>({
    resolver: zodResolver(soc2RequestSchema),
    defaultValues: {
      companyName: '',
      contactName: '',
      email: '',
      jobTitle: '',
      phone: '',
      requestReason: '',
      intendedUse: undefined,
    },
  });

  const onSubmit = async (data: SOC2RequestFormData) => {
    setFormStatus({ type: 'loading' });

    try {
      // Execute reCAPTCHA v3
      const recaptchaToken = await executeRecaptcha();

      const response = await fetch('/api/trust/soc2-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          recaptchaToken,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit request');
      }

      const result = await response.json();

      setFormStatus({
        type: 'success',
        message:
          'SOC 2 report request submitted successfully. You will receive the report within 24 hours.',
      });

      form.reset();
    } catch (error) {
      console.error('SOC 2 request error:', error);
      setFormStatus({
        type: 'error',
        message:
          'Failed to submit request. Please try again or contact our compliance team directly.',
      });
    }
  };

  const executeRecaptcha = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Load reCAPTCHA v3 if not already loaded
      if (!window.grecaptcha) {
        const script = document.createElement('script');
        script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
        script.onload = () => {
          window.grecaptcha.ready(() => {
            window.grecaptcha
              .execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!, {
                action: 'soc2_request',
              })
              .then(resolve)
              .catch(reject);
          });
        };
        document.head.appendChild(script);
      } else {
        window.grecaptcha.ready(() => {
          window.grecaptcha
            .execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!, {
              action: 'soc2_request',
            })
            .then(resolve)
            .catch(reject);
        });
      }
    });
  };

  if (formStatus.type === 'success') {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <CardTitle>Request Submitted</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">{formStatus.message}</p>
          </div>
          <Button
            variant="outline"
            onClick={() => setFormStatus({ type: 'idle' })}
          >
            Submit Another Request
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          <CardTitle>Request SOC 2 Report</CardTitle>
        </div>
        <CardDescription>
          Request access to our SOC 2 Type II compliance report for vendor
          assessment
        </CardDescription>
        <div className="flex gap-2 mt-2">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            SOC 2 Type II Certified
          </Badge>
          <Badge variant="outline">24h Delivery</Badge>
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
                name="contactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      Contact Name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="John Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john@acme.com"
                        {...field}
                      />
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
                      <Input placeholder="Security Manager" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 (555) 123-4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="intendedUse"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Intended Use</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                    >
                      <option value="">Select intended use</option>
                      <option value="vendor_assessment">
                        Vendor Assessment
                      </option>
                      <option value="compliance_audit">Compliance Audit</option>
                      <option value="security_review">Security Review</option>
                      <option value="other">Other</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="requestReason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Request Details</FormLabel>
                  <FormControl>
                    <textarea
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Please describe why you need the SOC 2 report and any specific requirements..."
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
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 mt-0.5" />
                <div>
                  <p className="font-medium">What you'll receive:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>SOC 2 Type II audit report</li>
                    <li>Detailed security controls documentation</li>
                    <li>Compliance summary and certification details</li>
                    <li>Contact information for follow-up questions</li>
                  </ul>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={formStatus.type === 'loading'}
            >
              {formStatus.type === 'loading' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting Request...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Request SOC 2 Report
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              This form is protected by reCAPTCHA. Reports are typically
              delivered within 24 hours to verified business email addresses.
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

// Extend window object for reCAPTCHA
declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (
        siteKey: string,
        options: { action: string },
      ) => Promise<string>;
    };
  }
}
