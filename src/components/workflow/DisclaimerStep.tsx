// src/components/workflow/DisclaimerStep.tsx
'use client';

import { useState, useEffect } from 'react'; // Import useEffect
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { AlertTriangle } from 'lucide-react'; // Icon for warning/disclaimer
import { useTranslation } from 'react-i18next'; // Import useTranslation

interface DisclaimerStepProps {
  onAgree: () => void;
  isReadOnly?: boolean; // Optional prop to match other step components
}

export function DisclaimerStep({
  onAgree,
  isReadOnly = false,
}: DisclaimerStepProps) {
  const [isChecked, setIsChecked] = useState(false);
  const { t } = useTranslation('common'); // Get translation function
  const [isHydrated, setIsHydrated] = useState(false); // State for hydration

  useEffect(() => {
    setIsHydrated(true); // Set hydrated state on client
  }, []);

  const handleContinue = () => {
    if (isChecked && !isReadOnly) {
      onAgree();
    }
  };

  // Show placeholder or nothing if not hydrated
  if (!isHydrated) {
    return (
      <div className="h-72 animate-pulse bg-muted rounded-lg shadow-lg border border-border"></div>
    ); // Example placeholder
  }

  return (
    <Card
      className={`shadow-lg rounded-lg bg-card border border-border ${isReadOnly ? 'opacity-75 cursor-not-allowed' : ''}`}
    >
      <CardHeader>
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-6 w-6 text-orange-500" />
          <CardTitle className="text-2xl">
            {t('disclaimerStep.stepTitle')}
          </CardTitle>
        </div>
        <CardDescription>{t('disclaimerStep.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="prose prose-sm max-w-none text-muted-foreground p-4 border rounded-md bg-muted/50 max-h-40 overflow-y-auto">
          <p>
            <strong>{t('disclaimerStep.disclaimerText1')}</strong>{' '}
            {t('disclaimerStep.disclaimerText2')}
          </p>
          <p>{t('disclaimerStep.disclaimerText3')}</p>
          <p>
            {t('disclaimerStep.disclaimerText4')}{' '}
            <Link
              href="/disclaimer"
              target="_blank"
              className="text-primary underline hover:text-primary/80"
            >
              {t('disclaimerStep.disclaimerLink')}
            </Link>{' '}
            {t('and')} {/* Assuming 'and' needs translation */}
            <Link
              href="/terms-of-service"
              target="_blank"
              className="text-primary underline hover:text-primary/80"
            >
              {t('disclaimerStep.termsLink')}
            </Link>
            .
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
          <Label
            htmlFor="disclaimer-agree"
            id="disclaimer-agree-label"
            className={`text-sm ${isReadOnly ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {t('disclaimerStep.agreeCheckboxLabel')}
          </Label>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleContinue}
          disabled={!isChecked || isReadOnly}
          className="w-full"
          aria-label={
            t('disclaimerStep.continueButton') ||
            'Agree to disclaimer and continue to document'
          }
        >
          {t('disclaimerStep.continueButton')}
        </Button>
      </CardFooter>
    </Card>
  );
}
