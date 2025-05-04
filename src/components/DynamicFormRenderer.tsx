'use client'

import React, { useState, useEffect } from 'react' // Import useEffect
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea' // Import Textarea
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { FormField } from '@/data/formSchemas'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'; // Import Card components
import { Check, Loader2 } from 'lucide-react'; // Import icons
import { useTranslation } from 'react-i18next'; // Import useTranslation


interface Props {
  documentType: string; // Pass the document type name for the title
  schema: FormField[];
  onSubmit: (values: Record<string, any>) => void; // Changed to Record<string, any>
  isReadOnly?: boolean;
}

// Placeholder Icon (consistent with previous Questionnaire)
const QuestionnaireIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
);


export default function DynamicFormRenderer({ documentType, schema, onSubmit, isReadOnly = false }: Props) {
  const [values, setValues] = useState<Record<string, any>>({}); // Allow any value type initially
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const [hasSubmitted, setHasSubmitted] = useState(isReadOnly); // Initialize based on isReadOnly
  const { t } = useTranslation(); // Get translation function
  const [isHydrated, setIsHydrated] = useState(false); // State for hydration

  useEffect(() => {
    setIsHydrated(true); // Set hydrated state on client
  }, []);

  const handleChange = (id: string, value: string | number | boolean | undefined) => {
      if (isReadOnly) return;
      setValues(prev => ({ ...prev, [id]: value }));
  };

  const handleFormSubmit = (e?: React.FormEvent) => {
      e?.preventDefault();
      if (isReadOnly || isLoading || hasSubmitted) return;

      setIsLoading(true);

      // Basic validation: Check if all required fields have values
      const missingRequired = schema.some(field => field.required && (values[field.id] === undefined || values[field.id] === ''));
      if (missingRequired) {
          alert(t('dynamicForm.errorMissingRequired')); // Use translated alert
          setIsLoading(false);
          return;
      }


      // Simulate submission delay
      setTimeout(() => {
          console.log('Collected form values:', values);
          onSubmit(values);
          setHasSubmitted(true); // Mark as submitted
          setIsLoading(false);
      }, 1000);
  };

  // Show placeholder or nothing if not hydrated
  if (!isHydrated) {
    return <div className="h-96 animate-pulse bg-muted rounded-lg shadow-lg border border-border"></div>; // Example placeholder
  }

    if (schema.length === 0) {
        // Handle case where schema is empty (e.g., General Inquiry or no questions needed)
        return (
             <Card className={`shadow-lg rounded-lg bg-card border border-border ${isReadOnly ? 'opacity-75' : ''}`}>
                 <CardHeader>
                     <div className="flex items-center space-x-2">
                         <QuestionnaireIcon />
                         <CardTitle className="text-2xl">{t('dynamicForm.stepTitle', { documentType })}</CardTitle>
                     </div>
                     <CardDescription>
                          {t('dynamicForm.noQuestionsNeeded')} {/* Translate message */}
                     </CardDescription>
                 </CardHeader>
                 <CardContent>
                     <p className="text-muted-foreground italic">{t('dynamicForm.proceedMessage')}</p> {/* Translate message */}
                 </CardContent>
                 <CardFooter>
                    <Button onClick={() => { if (!hasSubmitted) onSubmit({}); setHasSubmitted(true); }} className="w-full" disabled={hasSubmitted || isReadOnly}>
                      {hasSubmitted || isReadOnly ? (
                          <> <Check className="mr-2 h-4 w-4" /> {t('dynamicForm.confirmedButton')} </>
                      ) : (
                          t('dynamicForm.confirmProceedButton')
                      )}
                    </Button>
                 </CardFooter>
             </Card>
        );
   }


  return (
     <Card className={`shadow-lg rounded-lg bg-card border border-border ${isReadOnly ? 'opacity-75' : ''}`}>
       <CardHeader>
         <div className="flex items-center space-x-2">
           <QuestionnaireIcon />
           <CardTitle className="text-2xl">{t('dynamicForm.stepTitle', { documentType })}</CardTitle>
         </div>
         <CardDescription>
           {isReadOnly ? t('dynamicForm.reviewDescription') : t('dynamicForm.answerDescription')} {/* Translate descriptions */}
         </CardDescription>
       </CardHeader>
       <CardContent>
          <form className="space-y-6" onSubmit={handleFormSubmit}>
            {schema.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id}>
                    {field.label} {field.required && <span className="text-destructive">{t('dynamicForm.requiredField')}</span>} {/* Translate required indicator */}
                </Label>
                {field.type === 'select' ? (
                  <Select
                    value={values[field.id] || ''}
                    onValueChange={(val) => handleChange(field.id, val)}
                    disabled={isReadOnly || isLoading}
                    required={field.required}
                    name={field.id}
                   >
                    <SelectTrigger id={field.id} className={`${isReadOnly ? 'bg-muted/50 border-dashed cursor-not-allowed' : 'bg-background'}`}>
                      <SelectValue placeholder={field.placeholder || t('dynamicForm.selectPlaceholder')} /> {/* Translate placeholder */}
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem> // Assuming options have label/value
                      ))}
                    </SelectContent>
                  </Select>
                ) : field.type === 'textarea' ? (
                     <Textarea
                      id={field.id}
                      value={values[field.id] || ''}
                      onChange={(e) => handleChange(field.id, e.target.value)}
                      required={field.required}
                      disabled={isReadOnly || isLoading}
                      placeholder={field.placeholder || ''} // Placeholder from schema is likely specific enough
                      className={`resize-none ${isReadOnly ? 'bg-muted/50 border-dashed cursor-not-allowed' : 'bg-background'}`}
                      rows={3}
                      name={field.id}
                    />
                ) : (
                  <Input
                    id={field.id}
                    value={values[field.id] || ''}
                    placeholder={field.placeholder || ''} // Placeholder from schema
                    required={field.required}
                    type={field.type === 'date' ? 'date' : field.type === 'number' ? 'number' : 'text'}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    disabled={isReadOnly || isLoading}
                    className={`${isReadOnly ? 'bg-muted/50 border-dashed cursor-not-allowed' : 'bg-background'}`}
                    name={field.id}
                  />
                )}
              </div>
            ))}
          </form>
       </CardContent>
        <CardFooter>
             <Button type="button" onClick={() => handleFormSubmit()} disabled={isLoading || isReadOnly || hasSubmitted} className="w-full">
                 {isLoading ? (
                   <>
                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                     {t('dynamicForm.savingButton')} {/* Translate button text */}
                   </>
                 ) : hasSubmitted || isReadOnly ? (
                     <>
                       <Check className="mr-2 h-4 w-4" />
                       {t('dynamicForm.confirmedButton')} {/* Translate button text */}
                     </>
                 ): (
                   t('dynamicForm.confirmAnswersButton') /* Translate button text */
                 )}
               </Button>
        </CardFooter>
     </Card>
  );
}
