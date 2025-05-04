// src/components/disclaimer-step.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { AlertTriangle } from 'lucide-react'; // Icon for warning/disclaimer

interface DisclaimerStepProps {
  onAgree: () => void;
  isReadOnly?: boolean; // Optional prop to match other step components
}

export function DisclaimerStep({ onAgree, isReadOnly = false }: DisclaimerStepProps) {
  const [isChecked, setIsChecked] = useState(false);

  const handleContinue = () => {
    if (isChecked && !isReadOnly) {
      onAgree();
    }
  };

  return (
    <Card className={`shadow-lg rounded-lg bg-card border border-border ${isReadOnly ? 'opacity-75 cursor-not-allowed' : ''}`}>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-6 w-6 text-orange-500" />
          <CardTitle className="text-2xl">Step 3: Important Disclaimer</CardTitle>
        </div>
        <CardDescription>
          Please read and acknowledge the following before proceeding.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="prose prose-sm max-w-none text-muted-foreground p-4 border rounded-md bg-muted/50 max-h-40 overflow-y-auto">
          <p>
            <strong>This service does not provide legal advice.</strong> The documents
            generated are based on common templates and the information you provide.
            They may not be suitable for your specific situation or jurisdiction.
          </p>
          <p>
            Using this service does not create an attorney-client relationship.
            We strongly recommend consulting a qualified attorney for advice
            specific to your needs.
          </p>
          <p>
             By continuing, you acknowledge you understand these limitations. Read the full{' '}
             <Link href="/disclaimer" target="_blank" className="text-primary underline hover:text-primary/80">
                Disclaimer
             </Link> and{' '}
             <Link href="/terms-of-service" target="_blank" className="text-primary underline hover:text-primary/80">
               Terms of Service
             </Link>.
          </p>
        </div>
        <div className="flex items-center space-x-2 pt-2">
          <Checkbox
            id="disclaimer-agree"
            checked={isChecked}
            onCheckedChange={(checked) => setIsChecked(checked === true)}
            disabled={isReadOnly}
            aria-labelledby="disclaimer-agree-label"
          />
          <Label htmlFor="disclaimer-agree" id="disclaimer-agree-label" className={`text-sm ${isReadOnly ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
            I have read and understand the disclaimer.
          </Label>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleContinue}
          disabled={!isChecked || isReadOnly}
          className="w-full"
          aria-label="Agree to disclaimer and continue to document"
        >
          Agree & Continue to Document
        </Button>
      </CardFooter>
    </Card>
  );
}
