// Waitlist signup form for blocked states
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Mail, 
  MapPin, 
  CheckCircle,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface WaitlistFormProps {
  stateCode: string;
  stateName: string;
  riskLevel: 'red' | 'amber';
  reason: string;
  onSubmitted?: () => void;
}

interface WaitlistData {
  email: string;
  firstName: string;
  lastName: string;
  documentType: string;
  businessType: string;
  message: string;
  stateCode: string;
  stateName: string;
  priority: 'standard' | 'urgent';
}

export default function WaitlistForm({
  stateCode,
  stateName,
  riskLevel,
  reason,
  onSubmitted
}: WaitlistFormProps) {
  const [formData, setFormData] = useState<Partial<WaitlistData>>({
    stateCode,
    stateName,
    priority: 'standard'
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/compliance/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString(),
          reason,
          riskLevel
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to join waitlist');
      }

      setSubmitted(true);
      onSubmitted?.();

    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof WaitlistData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (submitted) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle>You&apos;re on the List!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Thanks for joining our waitlist for {stateName}. We&apos;ll notify you 
            as soon as service becomes available in your state.
          </p>
          <Alert>
            <Mail className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Check your email for a confirmation message with updates on our progress.
            </AlertDescription>
          </Alert>
          <div className="pt-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.location.href = '/'}
            >
              Return to Homepage
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Join the Waitlist</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{stateName}</span>
              <Badge 
                variant="outline" 
                className={riskLevel === 'red' ? 'text-red-600 border-red-200' : 'text-amber-600 border-amber-200'}
              >
                {riskLevel === 'red' ? 'Restricted' : 'Pending'}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-1">
            <Label htmlFor="email" className="text-xs font-medium">
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={formData.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
              className="text-sm"
            />
          </div>

          {/* Name */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="firstName" className="text-xs font-medium">
                First Name *
              </Label>
              <Input
                id="firstName"
                placeholder="John"
                value={formData.firstName || ''}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                required
                className="text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="lastName" className="text-xs font-medium">
                Last Name *
              </Label>
              <Input
                id="lastName"
                placeholder="Doe"
                value={formData.lastName || ''}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                required
                className="text-sm"
              />
            </div>
          </div>

          {/* Document Type */}
          <div className="space-y-1">
            <Label htmlFor="documentType" className="text-xs font-medium">
              What type of document do you need? *
            </Label>
            <Input
              id="documentType"
              placeholder="e.g., LLC Operating Agreement, Lease Agreement"
              value={formData.documentType || ''}
              onChange={(e) => handleInputChange('documentType', e.target.value)}
              required
              className="text-sm"
            />
          </div>

          {/* Business Type */}
          <div className="space-y-1">
            <Label htmlFor="businessType" className="text-xs font-medium">
              Business Type (Optional)
            </Label>
            <Input
              id="businessType"
              placeholder="e.g., Small Business, Freelancer, Individual"
              value={formData.businessType || ''}
              onChange={(e) => handleInputChange('businessType', e.target.value)}
              className="text-sm"
            />
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Timeline</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-xs">
                <input
                  type="radio"
                  name="priority"
                  value="standard"
                  checked={formData.priority === 'standard'}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                  className="text-primary"
                />
                Standard (notify when available)
              </label>
              <label className="flex items-center gap-2 text-xs">
                <input
                  type="radio"
                  name="priority"
                  value="urgent"
                  checked={formData.priority === 'urgent'}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                  className="text-primary"
                />
                Urgent (priority notification)
              </label>
            </div>
          </div>

          {/* Additional Message */}
          <div className="space-y-1">
            <Label htmlFor="message" className="text-xs font-medium">
              Additional Comments (Optional)
            </Label>
            <Textarea
              id="message"
              placeholder="Tell us more about your needs or timeline..."
              value={formData.message || ''}
              onChange={(e) => handleInputChange('message', e.target.value)}
              rows={3}
              className="text-sm resize-none"
            />
          </div>

          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Why We're Not Available */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              <strong>Why we&apos;re not available in {stateName}:</strong><br />
              {reason}
            </AlertDescription>
          </Alert>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading || !formData.email || !formData.firstName || !formData.lastName || !formData.documentType}
          >
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Join Waitlist for {stateName}
          </Button>

          {/* Privacy Notice */}
          <p className="text-xs text-muted-foreground text-center">
            We&apos;ll only use your information to notify you about service availability 
            in {stateName}. We respect your privacy and won&apos;t spam you.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}